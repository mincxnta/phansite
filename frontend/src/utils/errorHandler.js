const errorMessages = {
  'already_voted': 'already.voted',
  'invalid_user_data': 'invalid.user.data',
  'unauthorized': 'unauthorized',
  'forbidden': 'forbidden',
  'poll_not_found': 'not.found.poll',
  'invalid_comment_data': 'invalid.comment.data',
  'invalid_poll_data': 'invalid.poll.data',
  'poll_inactive': 'inactive.poll',
  'invalid_vote_data': 'invalid.vote.data',
  'invalid_report_data': 'invalid.report.data',
  'invalid_reported_type': 'invalid.reported.type',
  'invalid_post_id': 'invalid.post.id',
  'request_not_found': 'not.found.request',
  'invalid_request_data': 'invalid.request.data',
  'user_not_found': 'not.found.user',
  'user_banned': 'banned.user',
  'email_banned': 'banned.email',
  'email_already_registered': 'already.registered',
  'username_already_exists': 'already.exists',
  'missing_refresh_token': 'missing.refresh.token',
  'unauthenticated': 'unauthenticated',
};

export const errorHandler = (error) => {
  const message = errorMessages[error.code] || 'internal.server';
  return message;
};
