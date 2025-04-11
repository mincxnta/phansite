import { DataTypes } from 'sequelize'
import { User } from './user.js'
import { sequelize } from '../config/database.js'

export const Message = sequelize.define('message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  message: {
    type: DataTypes.STRING(2000)
  },
  image: {
    type: DataTypes.STRING(255)
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'sender_id'
  },
  receiverId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'receiver_id'
  }
}, {
  tableName: 'messages',
  timestamps: true,
  createdAt: 'date',
  updatedAt: false,
  underscored: true
})

Message.belongsTo(User, {
  foreignKey: 'senderId',
  as: 'sender',
  onDelete: 'CASCADE'
})

Message.belongsTo(User, {
  foreignKey: 'receiverId',
  as: 'receiver',
  onDelete: 'CASCADE'
})

User.hasMany(Message, {
  foreignKey: 'senderId',
  as: 'sentMessages'
})

User.hasMany(Message, {
  foreignKey: 'receiverId',
  as: 'receivedMessages'
})
