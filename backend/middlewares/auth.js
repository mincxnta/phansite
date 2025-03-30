import jwt from 'jsonwebtoken'

export function authenticateToken (req, res, next) {
  const token = req.cookies.access_token

  if (!token) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET)
    req.user = data
    next()
  } catch (error) {
    res.status(403).json({ error: 'No autorizado' })
  }
}

export function optionalAuthenticateToken (req, res, next) {
  const token = req.cookies.access_token

  if (!token) {
    req.user = null
    return next()
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET)
    req.user = data
  } catch (error) {
    req.user = null
  }

  next()
}
