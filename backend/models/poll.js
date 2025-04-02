import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const Poll = sequelize.define('poll', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  question: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'empty_poll_question'
      }
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'polls',
  timestamps: true,
  createdAt: 'date',
  updatedAt: false,
  underscored: true
})
