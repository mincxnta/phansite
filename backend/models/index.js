import { User } from './user.js'
import { Request } from './request.js'
import { RequestVotes } from './request_votes.js'
import { Report } from './report.js'
import { Poll } from './poll.js'
import { PollVotes } from './poll_votes.js'
import { Comment } from './comment.js'
import { Message } from './message.js'

const models = { User, Request, RequestVotes, Report, Poll, PollVotes, Comment, Message }

Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models)
  }
})

export default models
