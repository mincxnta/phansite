import jwt from 'jsonwebtoken'

/**
 * Genera un token JWT de acceso para un usuario.
 *
 * @param {Object} user - Usuario para quien se genera el token.
 * @param {string} user.id - ID único del usuario.
 * @param {string} user.username - Nombre de usuario.
 * @param {string} user.role - Rol del usuario.
 *
 * @returns {string} Token JWT firmado, válido por 1 hora.
 */
export const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' })
}
