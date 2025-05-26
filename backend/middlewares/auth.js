import jwt from 'jsonwebtoken'
import { User } from '../models/user.js'

/**
 * Middleware que autentica la solicitud verificando el token JWT en cookies.
 * - Si no hay token, responde 401 (no autenticado).
 * - Si el token es inválido o el usuario no existe o está baneado, responde con el código correspondiente.
 * - En caso exitoso, añade `req.user` con los datos decodificados del token.
 */
export const authenticateToken = async (req, res, next) => {
  const token = req.cookies.access_token

  if (!token) {
    return res.status(401).json({ code: 'unauthenticated' })
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(data.id)

    if (!user) {
      return res.status(404).json({ code: 'user_not_found' })
    }

    if (user.banned) {
      return res.status(403).json({ code: 'user_banned' })
    }

    req.user = data
    next()
  } catch (error) {
    res.status(403).json({ error: 'Unauthorized' })
  }
}

/**
 * Middleware que intenta cargar al usuario desde el token JWT en cookies.
 * - Si no hay token o es inválido, establece `req.user` como null.
 * - Si el usuario está baneado o no existe, establece `req.user` como null.
 * - En caso exitoso, establece `req.user` con los datos decodificados.
 */
export const loadUserFromToken = async (req, res, next) => {
  const token = req.cookies.access_token

  if (!token) {
    req.user = null
    return next()
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(data.id)

    if (!user || user.banned) {
      req.user = null
    } else {
      req.user = data
    }
  } catch (error) {
    req.user = null
  }

  next()
}
