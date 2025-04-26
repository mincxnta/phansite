import { DataTypes } from 'sequelize'
import { ROLES } from '../constants/constants.js'
import { sequelize } from '../config/database.js'

export const User = sequelize.define('user', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  profilePicture: {
    type: DataTypes.STRING(255)
  },
  role: {
    type: DataTypes.ENUM(...ROLES),
    defaultValue: ROLES[2],
    allowNull: false
  },
  banned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verificationToken: {
    type: DataTypes.STRING(6),
    allowNull: true
  },
  verificationTokenExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  resetToken: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  resetTokenExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  aboutMe: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: 'I am thou, thou art I...'
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'registrationDate',
  updatedAt: false,
  underscored: true
})
