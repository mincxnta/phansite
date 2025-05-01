import { validatePoll } from '../schemas/poll.js'
import { validatePollVote } from '../schemas/poll_vote.js'
import { Poll } from '../models/poll.js'
import { PollVotes } from '../models/poll_votes.js'
import { io } from '../config/socket.js'

export class PollController {
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

  // static async update (req, res) {
  //   const { id } = req.params

  //   const poll = await Poll.findByPk(id)
  //   if (!poll) {
  //     return res.status(404).json({ code: 'poll_not_found' })
  //   }

  //   if (req.user.role !== 'admin') {
  //     return res.status(403).json({ code: 'forbidden' })
  //   }

  //   const updatedPoll = validateUpdatedPoll(req.body)

  //   if (!updatedPoll.success) {
  //     return res.status(400).json({ code: 'invalid_poll_data' })
  //   }

  //   try {
  //     await poll.update(updatedPoll.data)
  //     res.status(200).json(poll)
  //   } catch (error) {
  //     res.status(500).json({ code: 'internal_server_error' })
  //   }
  // }

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
