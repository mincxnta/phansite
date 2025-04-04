import { validateRequest } from '../schemas/requests.js'
import { Request } from '../models/request.js'
import { RequestVotes } from '../models/request_votes.js'
import { validateRequestVote } from '../schemas/requestvote.js'

export class RequestController {
  static async getAll(req, res) {
    try {
      const requests = await Request.findAll({
        order: [['submitDate', 'DESC']]
      })
      res.status(200).json(requests)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  static async getAllByUser(req, res) {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ code: 'unauthorized' })
    }

    try {
      const requests = await Request.findAll({
        where: { userId: req.user.id },
        order: [['submitDate', 'DESC']]
      })
      res.status(200).json(requests)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params
      const request = await Request.findByPk(id)

      if (!request) {
        return res.status(404).json({ code: 'request_not_found' })
      }

      res.status(200).json(request)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  static async create(req, res) {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ code: 'unauthorized' })
    }

    const newRequest = validateRequest(req.body)

    if (!newRequest.success) {
      return res.status(400).json({ code: 'invalid_request_data' })
    }

    try {
      const requestData = {
        ...newRequest.data,
        userId: req.user.id
      }
      const request = await Request.create(requestData)
      res.status(201).json(request)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  // static async update (req, res) {
  //   if (!req.user || !req.user.id) {
  //     return res.status(401).json({ code: 'unauthorized' })
  //   }

  //   const { id } = req.params

  //   const request = await Request.findByPk(id)
  //   if (!request) {
  //     return res.status(404).json({ code: 'request_not_found' })
  //   }

  //   if (request.userId !== req.user.id) {
  //     return res.status(403).json({ code: 'forbidden' })
  //   }

  //   const updatedRequest = validateUpdatedRequest(req.body)

  //   if (!updatedRequest.success) {
  //     return res.status(400).json({ code: 'invalid_request_data' })
  //   }

  //   try {
  //     await request.update(updatedRequest.data)
  //     res.status(200).json(request)
  //   } catch (error) {
  //     res.status(500).json({ code: 'internal_server_error' })
  //   }
  // }

  static async delete(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ code: 'forbidden' })
    }
    try {
      const { id } = req.params
      const request = await Request.findByPk(id)
      if (!request) {
        return res.status(404).json({ code: 'request_not_found' })
      }
      await request.destroy()
      res.status(200).json({ success: true })
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  static async vote(req, res) {
    const { id } = req.params

    if (!req.user || !req.user.id) {
      return res.status(401).json({ code: 'unauthenticated' })
    }

    const request = await Request.findByPk(id)
    if (!request) {
      return res.status(404).json({ code: 'request_not_found' })
    }

    const newRequestVote = validateRequestVote(req.body)

    if (!newRequestVote.success) {
      return res.status(400).json({ code: 'invalid_vote_data' })
    }

    try {
      let requestVote = await RequestVotes.findOne({ where: { requestId: id, userId: req.user.id } })
      if (requestVote) {
        if (requestVote.vote === newRequestVote.data.vote) {
          return res.status(400).json({ code: 'user_already_voted' })
        }

        await requestVote.update(newRequestVote.data)
      } else {
        requestVote = await RequestVotes.create({ ...newRequestVote.data, requestId: id, userId: req.user.id })
      }

      await request.update({ totalVotes: request.totalVotes + (newRequestVote.data.vote ? 1 : -1) })

      res.status(201).json(requestVote)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  static async getRequestsVotes(req, res) {
    try {
      const requests = await Request.findAll({ attributes: ['id'] });
      if (!requests || requests.length === 0) {
        return res.status(404).json({ code: 'no_requests_found' });
      }

      const results = await Promise.all(
        requests.map(async (request) => {
          const [upvotes, downvotes] = await Promise.all([
            RequestVotes.count({ where: { requestId: request.id, vote: true } }),
            RequestVotes.count({ where: { requestId: request.id, vote: false } }),
          ]);

          const totalVotes = upvotes - downvotes;

          return {
            requestId: request.id,
            upvotes,
            downvotes,
            totalVotes,
          };
        })
      );

      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' });
    }
  }


  static async getUserRequestsVotes(req, res) {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ code: 'unauthorized' })
    }

    try {
      const requestsVotes = await RequestVotes.findAll({
        attributes: ['requestId', 'vote', 'userId'],
        where: { userId: req.user.id }
      })

      res.status(200).json(requestsVotes)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }
}
