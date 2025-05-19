import { validatePoll } from '../schemas/poll.js'
import { validatePollVote } from '../schemas/poll_vote.js'
import { Poll } from '../models/poll.js'
import { PollVotes } from '../models/poll_votes.js'
import { io } from '../config/socket.js'

/**
 * Controlador para la gestión de encuestas.
 *
 * Usa WebSockets para emitir eventos en tiempo real cuando un usuario vota,
 * de modo que los clientes conectados puedan actualizar la información inmediatamente.
 */
export class PollController {
  /**
   * Obtiene una lista paginada de encuestas inactivas con sus resultados.
   *
   * @param {number} page - Número de página.
   * @param {number} limit - Cantidad de encuestas por página.
   *
   * @throws {500} Error interno del servidor.
   */
  static async getAll (req, res) {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const offset = (page - 1) * limit

    try {
      const { count, rows } = await Poll.findAndCountAll({
        where: { isActive: false },
        order: [['date', 'DESC']],
        limit,
        offset
      })

      const pollsWithResults = await Promise.all(
        rows.map(async (poll) => {
          const [yesVotes, noVotes] = await Promise.all([
            PollVotes.count({ where: { pollId: poll.id, vote: true } }),
            PollVotes.count({ where: { pollId: poll.id, vote: false } })
          ])

          const totalVotes = yesVotes + noVotes
          const yesPercentage = totalVotes > 0 ? ((yesVotes / totalVotes) * 100).toFixed(1) : 0

          return {
            ...poll.toJSON(),
            results: {
              yes: yesVotes,
              no: noVotes,
              total: totalVotes,
              yesPercentage: parseFloat(yesPercentage)
            }
          }
        })
      )

      res.status(200).json({
        polls: pollsWithResults,
        totalPolls: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      })
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  /**
   * Obtiene la encuesta activa actual.
   *
   * @throws {404} Si no hay encuesta activa.
   * @throws {500} Error interno del servidor.
   */
  static async getActivePoll (req, res) {
    try {
      const poll = await Poll.findOne({ where: { isActive: true } })
      if (!poll) {
        return res.status(404).json({ code: 'poll_not_found' })
      }
      res.status(200).json(poll)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  /**
   * Crea una nueva encuesta y desactiva las encuestas activas existentes.
   *
   * @throws {403} Si el usuario no es administrador.
   * @throws {400} Si la encuesta no es válida.
   * @throws {500} Error interno del servidor.
   */
  static async create (req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ code: 'forbidden' })
    }

    const newPoll = validatePoll(req.body)

    if (!newPoll.success) {
      return res.status(400).json({ code: newPoll.error.issues[0].message })
    }

    try {
      await Poll.update({ isActive: false }, { where: { isActive: true } })

      const poll = await Poll.create(newPoll.data)
      res.status(201).json(poll)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  /**
   * Permite votar en una encuesta activa.
   * Emite evento vía WebSocket para notificar el nuevo voto en tiempo real.
   *
   * @param {number} id - ID de la encuesta.
   *
   * @throws {401} Si el usuario no está autenticado.
   * @throws {403} Si el usuario tiene rol prohibido o encuesta inactiva.
   * @throws {404} Si la encuesta no existe.
   * @throws {400} Si ya ha votado o los datos no son válidos.
   * @throws {500} Error interno del servidor.
   */
  static async vote (req, res) {
    const { id } = req.params

    if (!req.user || !req.user.id) {
      return res.status(401).json({ code: 'unauthenticated' })
    }

    if (req.user.role === 'phantom_thief' || req.user.role === 'admin') {
      return res.status(403).json({ code: 'forbidden' })
    }

    const poll = await Poll.findByPk(id)
    if (!poll) {
      return res.status(404).json({ code: 'poll_not_found' })
    }

    if (!poll.isActive) {
      return res.status(403).json({ code: 'poll_inactive' })
    }

    const newPollVote = validatePollVote(req.body)

    if (!newPollVote.success) {
      return res.status(400).json({ code: newPollVote.error.issues[0].message })
    }

    try {
      const existingVote = await PollVotes.findOne({ where: { pollId: id, userId: req.user.id } })
      if (existingVote) {
        return res.status(400).json({ code: 'already_voted' })
      }

      const pollVote = await PollVotes.create({ ...newPollVote.data, pollId: id, userId: req.user.id })

      io.emit('pollVoted', { pollId: id })
      res.status(201).json(pollVote)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  /**
   * Obtiene los resultados totales de una encuesta específica.
   *
   * @param {number} id - ID de la encuesta.
   *
   * @throws {404} Si la encuesta no existe.
   * @throws {500} Error interno del servidor.
   */
  static async getPollResults (req, res) {
    const { id } = req.params

    try {
      const poll = await Poll.findByPk(id)
      if (!poll) {
        return res.status(404).json({ code: 'poll_not_found' })
      }

      const [yesVotes, noVotes] = await Promise.all([
        PollVotes.count({ where: { pollId: id, vote: true } }),
        PollVotes.count({ where: { pollId: id, vote: false } })
      ])

      const totalVotes = yesVotes + noVotes

      const results = {
        questionEs: poll.questionEs,
        questionEn: poll.questionEn,
        yes: yesVotes,
        no: noVotes,
        total: totalVotes
      }

      res.status(200).json(results)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  /**
   * Obtiene el voto del usuario autenticado en una encuesta específica.
   * Retorna null si no ha votado aún.
   *
   * @param {number} id - ID de la encuesta.
   *
   * @throws {401} Si el usuario no está autenticado.
   * @throws {404} Si la encuesta no existe.
   * @throws {500} Error interno del servidor.
   */
  static async getUserVote (req, res) {
    const { id } = req.params
    if (!req.user || !req.user.id) {
      return res.status(401).json({ code: 'unauthenticated' })
    }

    try {
      const poll = await Poll.findByPk(id)
      if (!poll) {
        return res.status(404).json({ code: 'poll_not_found' })
      }

      const userVote = await PollVotes.findOne({
        where: { pollId: id, userId: req.user.id }
      })

      if (!userVote) {
        return res.status(200).json({ vote: null })
      }

      res.status(200).json({ vote: userVote.vote })
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }
}
