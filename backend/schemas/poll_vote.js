import z from 'zod'

const pollVoteSchema = z.object({
  vote: z.boolean({ required_error: 'vote_required' })
})

export function validatePollVote (pollVote) {
  return pollVoteSchema.safeParse(pollVote)
}
