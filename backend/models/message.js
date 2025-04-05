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
    type: DataTypes.STRING(2000),
    allowNull: false
  },
  user1Id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'user1_id'
  },
  user2Id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'user2_id'
  }
}, {
  tableName: 'messages',
  timestamps: true,
  createdAt: 'date',
  updatedAt: false,
  underscored: true
})

Message.belongsTo(User, {
  foreignKey: 'user1Id',
  as: 'user1',
  onDelete: 'CASCADE'
})

Message.belongsTo(User, {
  foreignKey: 'user2Id',
  as: 'user2',
  onDelete: 'CASCADE'
})

User.hasMany(Message, {
  foreignKey: 'user1Id',
  as: 'sentMessages'
})

User.hasMany(Message, {
  foreignKey: 'user2Id',
  as: 'receivedMessages'
})
