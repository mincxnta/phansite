import z from 'zod'

const requestVoteSchema = z.object({
  vote: z.boolean({ required_error: 'vote_required' })
})

export function validateRequestVote (requestVote) {
  return requestVoteSchema.safeParse(requestVote)
}
