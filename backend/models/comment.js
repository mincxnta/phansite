import { DataTypes } from 'sequelize'
import { User } from './user.js'
import { Poll } from './poll.js'
import { sequelize } from '../config/database.js'

export const Comment = sequelize.define('comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  pollId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'polls',
      key: 'id'
    }
  },
  anonymous: {
    type: DataTypes.BOOLEAN,
    default: false
  }
}, {
  tableName: 'comments',
  timestamps: false,
  underscored: true
})

Comment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onDelete: 'CASCADE'
})

Comment.belongsTo(Poll, {
  foreignKey: 'pollId',
  as: 'poll',
  onDelete: 'CASCADE'
})

User.hasMany(Comment, {
  foreignKey: 'userId',
  as: 'comments'
})
