import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'
import { User } from './user.js'
import { Poll } from './poll.js'

export const PollVotes = sequelize.define('pollVotes', {
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  pollId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'polls',
      key: 'id'
    }
  },
  vote: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  tableName: 'poll_votes',
  timestamps: false,
  underscored: true
})

User.belongsToMany(Poll, { through: PollVotes, foreignKey: 'userId', otherKey: 'pollId', as: 'votedPolls' })
Poll.belongsToMany(User, { through: PollVotes, foreignKey: 'pollId', otherKey: 'userId', as: 'voters' })
