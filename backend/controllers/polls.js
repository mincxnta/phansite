import { validatePoll, validateUpdatedPoll } from '../schemas/polls.js'
import { validatePollVote } from '../schemas/pollvote.js'
import { Poll } from '../models/poll.js'
import { PollVotes } from '../models/poll_votes.js'
import { sequelize } from '../config/database.js'

export class PollController {
  static async getAll (req, res) {
    try {
      const polls = await Poll.findAll({
        order: ['date', 'DESC']
      })
      res.status(200).json(polls)
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  }

  static async getActivePoll (req, res) {
    try {
      const poll = await Poll.findOne({ where: { isActive: true } })

      if (!poll) {
        return res.status(404).send({ message: 'Encuesta no encontrada' })
      }
      res.status(200).json(poll)
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  }

  static async create (req, res) {
    const newPoll = validatePoll(req.body)

    if (!newPoll.success) {
      return res.status(400).send({ message: JSON.parse(newPoll.error.message) })
    }

    try {
      const poll = await sequelize.transaction(async (t) => {
      // Antes de crear la nueva, desactivamos todas las demás
        await Poll.update(
          { isActive: false },
          { where: { isActive: true }, transaction: t }
        )

        const createdPoll = await Poll.create(newPoll.data, { transaction: t })
        return createdPoll
      })
      res.status(201).json(poll)
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  }

  // Dejamos editar?
  static async update (req, res) {
    const { id } = req.params

    const poll = await Poll.findByPk(id)
    if (!poll) {
      return res.status(404).send({ message: 'Encuesta no encontrada' })
    }

    if (req.user.role !== 'admin') {
      return res.status(403).send({ message: 'No autorizado' })
    }

    const updatedPoll = validateUpdatedPoll(req.body)

    if (!updatedPoll.success) {
      return res.status(400).send({ message: JSON.parse(updatedPoll.error.message) })
    }

    try {
      await poll.update(updatedPoll.data)
      res.status(200).json(poll)
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  }

  static async vote (req, res) {
    const { id } = req.params

    if (!req.user || !req.user.id) {
      return res.status(401).send({ message: 'Usuario no autenticado' })
    }

    const poll = await Poll.findByPk(id)
    if (!poll) {
      return res.status(404).send({ message: 'Encuesta no encontrada' })
    }

    if (!poll.isActive) {
      return res.status(403).send({ message: 'No se puede votar en una encuesta inactiva' })
    }

    const newPollVote = validatePollVote(req.body)

    if (!newPollVote.success) {
      return res.status(400).send({ message: JSON.parse(newPollVote.error.message) })
    }

    try {
      // Validar que el usuario ya ha votado en la encuesta
      const existingVote = await PollVotes.findOne({ where: { pollId: id, userId: req.user.id } })
      if (existingVote) {
        return res.status(400).send({ message: 'Ya has votado en esta encuesta' })
      }

      const pollVote = await PollVotes.create({ ...newPollVote.data, pollId: id, userId: req.user.id })
      res.status(201).json(pollVote)
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  }

  static async getPollResults (req, res) {
    const { id } = req.params

    try {
      const poll = await Poll.findByPk(id)
      if (!poll) {
        return res.status(404).send({ message: 'Encuesta no encontrada' })
      }

      // const yesVotes = await PollVotes.count({ where: { pollId: id, vote: true } })
      // const noVotes = await PollVotes.count({ where: { pollId: id, vote: false } })

      const [yesVotes, noVotes] = await Promise.all([
        PollVotes.count({ where: { pollId: id, vote: true } }),
        PollVotes.count({ where: { pollId: id, vote: false } })
      ])

      const results = {
        question: poll.question,
        yes: yesVotes,
        no: noVotes,
        total: yesVotes + noVotes
      }

      res.status(200).json(results)
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  }
}
