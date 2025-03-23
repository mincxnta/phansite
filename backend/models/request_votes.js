import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'
import { User } from './user.js'
import { Request } from './request.js'

export const RequestVotes = sequelize.define('requestVotes', {
  userId: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  requestId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'requests',
      key: 'id'
    }
  },
  vote: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  tableName: 'request_votes',
  timestamps: false,
  underscored: true
})

User.belongsToMany(Request, { through: RequestVotes, foreignKey: 'userId', otherKey: 'requestId', as: 'votedRequests' })
Request.belongsToMany(User, { through: RequestVotes, foreignKey: 'requestId', otherKey: 'userId', as: 'voters' })
