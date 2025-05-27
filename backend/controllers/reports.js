import { Report } from '../models/report.js'
import { validateReport } from '../schemas/report.js'
import { User } from '../models/user.js'
import { Comment } from '../models/comment.js'
import { Request } from '../models/request.js'
import { sendReportNotificationEmail } from '../utils/email/sendEmail.js'

/**
 * Controlador para la gestión de reportes.
 */
export class ReportController {
  /**
   * Crea un nuevo reporte de un comentario o una petición.
   *
   * @param {string} reportedType - Tipo del contenido reportado ('comment' o 'request').
   * @param {number} postId - ID del comentario o petición reportada.
   *
   * @throws {401} Si el usuario no está autenticado.
   * @throws {400} Si los datos no son válidos.
   * @throws {500} Error interno del servidor.
   */
  static async create (req, res) {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ code: 'unauthenticated' })
    }

    const newReport = validateReport(req.body)

    if (!newReport.success) {
      return res.status(400).json({ code: newReport.error.issues[0].message })
    }

    const { reportedType, postId } = req.body
    if (!['comment', 'request'].includes(reportedType)) {
      return res.status(400).json({ code: 'invalid_reported_type' })
    }

    if (!postId || isNaN(postId)) {
      return res.status(400).json({ code: 'invalid_post_id' })
    }

    try {
      const reportData = {
        ...newReport.data,
        userId: req.user.id,
        commentId: reportedType === 'comment' ? postId : null,
        requestId: reportedType === 'request' ? postId : null
      }
      const report = await Report.create(reportData)

      try {
        const reportDetails = {
          userId: req.user.id,
          username: req.user.username,
          reportedType,
          postId,
          reason: newReport.data.reason,
          createdAt: report.createdAt instanceof Date ? report.createdAt : new Date()
        }
        const acceptLanguage = req.headers['accept-language']
        await sendReportNotificationEmail(reportDetails, acceptLanguage)
      } catch (emailError) {
        console.error('Error sending report notification email:', emailError)
      }

      res.status(201).json(report)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  /**
   * Obtiene todos los reportes filtrados por tipo paginados.
   *
   * @param {string} type - Tipo de reporte ('comment' o 'request').
   * @param {number} page - Número de página.
   * @param {number} limit - Número de reportes por página.
   *
   * @throws {403} Si el usuario no es administrador.
   * @throws {500} Error interno del servidor.
   */
  static async getAllByType (req, res) {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const offset = (page - 1) * limit

    if (req.user.role !== 'admin') {
      return res.status(403).json({ code: 'forbidden' })
    }

    try {
      const { type } = req.query
      const { count, rows } = await Report.findAndCountAll({
        where: { reportedType: type },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['username']
          },
          {
            model: Comment,
            as: 'comment',
            attributes: ['text', 'id', 'userId'],
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['username']
              }
            ]
          },
          {
            model: Request,
            as: 'request',
            attributes: ['title', 'id', 'userId'],
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['username']
              }
            ]
          }
        ],
        order: [['id', 'ASC']],
        limit,
        offset
      })
      res.status(200).json({
        reports: rows,
        totalReports: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      })
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  /**
   * Elimina un reporte por su ID.
   *
   * @param {number} id - ID del reporte a eliminar.
   *
   * @throws {403} Si el usuario no es administrador.
   * @throws {404} Si el reporte no existe.
   * @throws {500} Error interno del servidor.
   */
  static async delete (req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ code: 'forbidden' })
    }
    const { id } = req.params
    try {
      const report = await Report.findByPk(id)

      if (!report) {
        return res.status(404).json({ code: 'report_not_found' })
      }
      await report.destroy()
      res.status(200).json({ success: true })
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }
}
