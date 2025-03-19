import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'

export const Poll = sequelize.define('poll', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  question: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    default: true
  }
}, {
  tableName: 'polls',
  timestamps: true,
  createdAt: 'date',
  updatedAt: false,
  underscored: true
})
