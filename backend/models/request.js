import { DataTypes } from 'sequelize'
import { STATUS } from '../constants/constants.js'
import { User } from './user.js'
import { sequelize } from '../config/database.js'

export const Request = sequelize.define('request', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'empty_request_title'
      }
    }
  },
  target: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'empty_request_target'
      }
    }
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'empty_request_description'
      }
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  image: {
    type: DataTypes.STRING(255)
    // allowNull: false,
    // defaultValue: 1
  },
  status: {
    type: DataTypes.ENUM(...STATUS),
    defaultValue: STATUS[0],
    allowNull: false
  },
  thiefComment: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  tableName: 'requests',
  timestamps: true,
  createdAt: 'submitDate',
  updatedAt: 'updateDate',
  underscored: true
})

Request.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
})

User.hasMany(Request, {
  foreignKey: 'userId',
  as: 'requests'
})
