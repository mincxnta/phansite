import jwt from 'jsonwebtoken'

export const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' })
}

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
}

export const verifyRefreshToken = (refreshToken) => {
  return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
}
