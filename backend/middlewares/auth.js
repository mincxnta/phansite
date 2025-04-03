import jwt from 'jsonwebtoken'
import { User } from '../models/user.js'
export const authenticateToken = async (req, res, next) => {
  const token = req.cookies.access_token

  if (!token) {
    return res.status(401).json({ code: 'unauthenticated' })
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET)
    // const user = await User.findByPk(data.id)

    // if (!user) {
    //   return res.status(404).json({ code: 'user_not_found' })
    // }

    // if (user.banned) {
    //   return res.status(403).json({ code: 'user_banned' })
    // }

    req.user = data
    next()
  } catch (error) {
    res.status(403).json({ error: 'No autorizado' })
  }
}

// TODO Mejorar
export function optionalAuthenticateToken(req, res, next) {
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
