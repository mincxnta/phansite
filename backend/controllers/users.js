import { validateUpdatedUser } from '../schemas/user.js'
import { User } from '../models/user.js'
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js'
import bcrypt from 'bcrypt'

/**
 * Controlador para la gestión de usuarios.
 */
export class UserController {
  /**
   * Obtiene una lista paginada de todos los usuarios (solo admin).
   *
   * @param {number} page Número de página.
   * @param {number} limit Cantidad por página.
   *
   * @throws {403} Si el usuario no es admin.
   * @throws {500} Error interno del servidor.
   */
  static async getAll (req, res) {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const offset = (page - 1) * limit

    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ code: 'forbidden' })
    }

    try {
      const { count, rows } = await User.findAndCountAll({
        attributes: { exclude: ['password'] },
        limit,
        offset
      })

      res.status(200).json({
        users: rows,
        totalUsers: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      })
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  /**
 * Obtiene una lista de todos los usuarios activos (no baneados), accesible para roles distintos a 'fan'.
 *
 * @throws {403} Si el usuario tiene el rol 'fan'.
 * @throws {500} Error interno del servidor.
 */
  static async getActiveUsers (req, res) {
    if (!req.user || req.user.role === 'fan') {
      return res.status(403).json({ code: 'forbidden' })
    }

    try {
      const users = await User.findAll({
        where: {
          banned: false
        },
        attributes: { exclude: ['password'] }

      })

      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  /**
 * Obtiene una lista de usuarios con rol 'fan'.
 *
 * @throws {401} Si el usuario no está autenticado.
 * @throws {500} Error interno del servidor.
 */
  static async getFans (req, res) {
    if (!req.user) {
      return res.status(401).json({ code: 'unauthorized' })
    }

    try {
      const users = await User.findAll({
        where: { role: 'fan' },
        attributes: ['username', 'profilePicture', 'id']
      })

      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  /**
   * Obtiene un usuario por su nombre de usuario.
   *
   * @param {string} username Nombre de usuario a buscar.
   *
   * @throws {404} Si no se encuentra el usuario.
   * @throws {500} Error interno del servidor.
   */
  static async getByUsername (req, res) {
    try {
      const { username } = req.params
      const user = await User.findOne({ where: { username }, attributes: { exclude: ['password'] } })

      if (!user) {
        return res.status(404).json({ code: 'user_not_found' })
      }
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  /**
   * Actualiza los datos del usuario autenticado.
   *
   * @throws {401} Si el usuario no está autenticado.
   * @throws {404} Si no se encuentra el usuario.
   * @throws {400} Si los datos actualizados no son válidos.
   * @throws {500} Error interno del servidor.
   */
  static async update (req, res) {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ code: 'unauthorized' })
    }

    const user = await User.findByPk(req.user.id)
    if (!user) {
      return res.status(404).json({ code: 'user_not_found' })
    }

    const updatedUser = validateUpdatedUser(req.body)

    if (!updatedUser.success) {
      return res.status(400).json({ code: updatedUser.error.issues[0].message })
    }

    try {
      if (updatedUser.data.password) {
        updatedUser.data.password = await bcrypt.hash(updatedUser.data.password, 10)
      }

      await user.update(updatedUser.data)

      if (req.file) {
        if (user.profilePicture) {
          await deleteFromCloudinary(user.profilePicture)
        }
        const imageUrl = await uploadToCloudinary(req.file, 'profile_pictures')
        user.profilePicture = imageUrl
        await user.save()
      }

      const userData = user.toJSON()
      delete userData.password

      res.status(200).json(userData)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  /**
   * Banea a un usuario por ID.
   *
   * @param {number} id ID del usuario a banear.
   *
   * @throws {403} Si el usuario no es administrador.
   * @throws {404} Si no se encuentra el usuario.
   * @throws {500} Error interno del servidor.
   */
  static async ban (req, res) {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ code: 'forbidden' })
    }

    const { id } = req.params

    try {
      const user = await User.findByPk(id)
      if (!user) {
        return res.status(404).json({ code: 'user_not_found' })
      }

      await user.update({ banned: true })
      res.status(200).json({ success: true })
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }
}
