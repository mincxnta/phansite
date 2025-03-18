import { DataTypes, Sequelize } from "sequelize";
import { STATUS } from "../constants/constants.js";
import { User } from "./user.js";
export const Request = sequelize.define('request', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  userId: {
    type: DataTypes.UUIDV4,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id'
    }
  },
  image: {
    type: DataTypes.STRING(255),
    //allowNull: false,
    //defaultValue: 1
  },
  status: {
    type: DataTypes.ENUM(STATUS),
    defaultValue: STATUS[0],
    allowNull: false,
  },
  thiefComment: {
    type: DataTypes.STRING(500),
    defaultValue: false,
    allowNull: true,
  },
}, {
  timestamps: true,
  createdAt: 'submitDate',
  updatedAt: 'updateDate',
  underscored: true
});

Request.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});