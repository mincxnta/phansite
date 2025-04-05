import z from 'zod'

const requestVoteSchema = z.object({
  vote: z.boolean()
})

export function validateRequestVote (requestVote) {
  return requestVoteSchema.safeParse(requestVote)
}
