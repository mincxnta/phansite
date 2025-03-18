import { DataTypes, Sequelize } from "sequelize";
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
  },
}, {
  timestamps: true,
  createdAt: 'submitDate',
  updatedAt: false,
  underscored: true
});
