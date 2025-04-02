import { DataTypes } from 'sequelize'
import { REPORT_TYPE } from '../constants/constants.js'
import { User } from './user.js'
import { Comment } from './comment.js'
import { Request } from './request.js'
import { sequelize } from '../config/database.js'

export const Report = sequelize.define('report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reason: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'empty_report_reason'
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
  commentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'comments',
      key: 'id'
    }
  },
  requestId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'requests',
      key: 'id'
    }
  },
  reportedType: {
    type: DataTypes.ENUM(...REPORT_TYPE),
    allowNull: false
  }
}, {
  tableName: 'reports',
  timestamps: false,
  underscored: true,
  validate: {
    hasCommentOrRequest () {
      if (!this.commentId && !this.requestId) {
        throw new Error('missing_reported_entity')
      }
      if (this.commentId && this.requestId) {
        throw new Error('multiple_reported_entities')
      }
    }
  }
})

Report.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onDelete: 'CASCADE'
})

Report.belongsTo(Comment, {
  foreignKey: 'commentId',
  as: 'comment',
  onDelete: 'CASCADE'
})

Report.belongsTo(Request, {
  foreignKey: 'requestId',
  as: 'request',
  onDelete: 'CASCADE'
})

User.hasMany(Report, {
  foreignKey: 'userId',
  as: 'reports'
})
