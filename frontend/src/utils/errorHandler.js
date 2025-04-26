const errorMessages = {
  'already_voted': 'already.voted',
  'invalid_user_data': 'invalid.user.data',
  'unauthorized': 'unauthorized',
  'forbidden': 'forbidden',
  'poll_not_found': 'not.found.poll',
  'invalid_poll_data': 'invalid.poll.data',
  'poll_inactive': 'inactive.poll',
  'invalid_reported_type': 'invalid.reported.type',
  'invalid_post_id': 'invalid.post.id',
  'request_not_found': 'not.found.request',
  'user_not_found': 'not.found.user',
  'user_banned': 'banned.user',
  'email_banned': 'banned.email',
  'email_already_registered': 'already.registered',
  'username_already_exists': 'already.exists',
  'missing_refresh_token': 'missing.refresh.token',
  'unauthenticated': 'unauthenticated',
  'empty_comment': "empty.comment",
  'empty_username': "empty.username",
  'empty_confirm_password': "empty.confirm.password",
  'empty_email': "empty.email",
  'empty_title': "empty.title",
  'empty_description': "empty.description",
  'empty_target': "empty.target",
  'empty_question': "empty.question",
  'empty_reason': "empty.reason",
  'comment_too_long': "too.long.comment",
  'username_too_long': "too.long.username",
  'password_too_long': "too.long.password",
  'password_too_short': "password.too.short",
  'password_missing_uppercase': "password.missing.uppercase",
  'password_missing_number': "password.missing.number",
  'passwords_do_not_match': "password.not.match",
  'email_too_long': "too.long.email",
  'title_too_long': "too.long.title",
  'description_too_long': "too.long.description",
  'target_too_long': "too.long.target",
  'question_too_long': "too.long.question",
  'reason_too_long': "too.long.reason",
  'about_me_too_long': "too.long.reason",
  'invalid_email': "invalid.email",
  'invalid_status_change': "invalid.status.change",
  'internal_server_error': 'internal.server'
};

let message = 'internal.server';

export const errorHandler = (error) => {
  if (error.code) {
    message = `error.${errorMessages[error.code]}`;
  }
  return message;
};
