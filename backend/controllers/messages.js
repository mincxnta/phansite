import { getReceiverSocketId, io } from '../config/socket.js'
import { Message } from '../models/message.js'
import { User } from '../models/user.js'
import { Op } from 'sequelize'
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js'
import { validateMessage } from '../schemas/message.js'

export class MessageController {
  static async getUsers (req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ code: 'unauthorized' })
      }

      const sentMessages = await Message.findAll({
        where: {
          senderId: req.user.id
        },
        attributes: [[Message.sequelize.fn('DISTINCT', Message.sequelize.col('receiver_id')), 'contactId']]
      })

      const receivedMessages = await Message.findAll({
        where: {
          receiverId: req.user.id
        },
        attributes: [[Message.sequelize.fn('DISTINCT', Message.sequelize.col('sender_id')), 'contactId']]
      })

      const contactIds = new Set([
        ...sentMessages.map(msg => msg.getDataValue('contactId')),
        ...receivedMessages.map(msg => msg.getDataValue('contactId'))
      ])

      if (contactIds.size === 0) {
        return res.status(200).json([])
      }

      const contacts = await User.findAll({
        where: {
          id: {
            [Op.in]: Array.from(contactIds)
          }
        },
        attributes: { exclude: ['password'] }

      })

      const contactsWithLastMessage = await Promise.all(
        contacts.map(async (contact) => {
          const lastMessage = await Message.findOne({
            where: {
              [Op.or]: [
                { senderId: req.user.id, receiverId: contact.id },
                { senderId: contact.id, receiverId: req.user.id }
              ]
            },
            order: [['date', 'DESC']],
            include: [
              { model: User, as: 'sender', attributes: ['id', 'username', 'profilePicture', 'banned'] },
              { model: User, as: 'receiver', attributes: ['id', 'username', 'profilePicture', 'banned'] }
            ]
          })

          return {
            ...contact.toJSON(),
            lastMessage: lastMessage ? lastMessage.toJSON() : null
          }
        })
      )

      res.status(200).json(contactsWithLastMessage)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  static async getMessages (req, res) {
    const { id } = req.params

    if (!req.user || !req.user.id) {
      return res.status(401).json({ code: 'unauthorized' })
    }

    if (!id) {
      return res.status(400).json({ code: 'missing_user_id' })
    }

    const targetUser = await User.findByPk(id)
    if (!targetUser) {
      return res.status(404).json({ code: 'user_not_found' })
    }

    try {
      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { senderId: req.user.id, receiverId: id },
            { senderId: id, receiverId: req.user.id }
          ]
        },
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['id', 'username', 'profilePicture', 'banned']
          },
          {
            model: User,
            as: 'receiver',
            attributes: ['id', 'username', 'profilePicture', 'banned']
          }
        ],
        order: [['date', 'ASC']]
      })

      res.status(200).json(messages)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  static async sendMessage (req, res) {
    const { message } = req.body
    const { id } = req.params

    if (!req.user || !req.user.id) {
      return res.status(401).json({ code: 'unauthorized' })
    }

    if (!id) {
      return res.status(400).json({ code: 'missing_user_id' })
    }

    const targetUser = await User.findByPk(id)
    if (!targetUser) {
      return res.status(404).json({ code: 'user_not_found' })
    }

    const newMessage = validateMessage({ message })
    if (!newMessage.success) {
      return res.status(400).json({ code: newMessage.error.issues[0].message })
    }

    if (!message && !req.file) {
      return res.status(400).json({ code: 'message_or_image_required' })
    }
    try {
      let imageUrl = null
      if (req.file) {
        imageUrl = await uploadToCloudinary(req.file, 'messages')
      }

      const newMessage = await Message.create({
        message: message || null,
        image: imageUrl,
        senderId: req.user.id,
        receiverId: id
      })

      const messageWithAssociations = await Message.findByPk(newMessage.id, {
        include: [
          { model: User, as: 'sender', attributes: ['id', 'username', 'profilePicture', 'banned'] },
          { model: User, as: 'receiver', attributes: ['id', 'username', 'profilePicture', 'banned'] }
        ]
      })

      const receiverSocketId = getReceiverSocketId(id)
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('newMessage', messageWithAssociations)
      }

      res.status(201).json(messageWithAssociations)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }
}
