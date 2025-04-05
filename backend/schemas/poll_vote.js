import z from 'zod'

const pollVoteSchema = z.object({
  vote: z.boolean()
})

export function validatePollVote (pollVote) {
  return pollVoteSchema.safeParse(pollVote)
}
