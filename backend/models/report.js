import { DataTypes, Sequelize } from "sequelize";
import { REPORT_TYPE } from "../constants/constants.js";
import { User } from "./user.js";
import { Comment } from "./comment.js"
import { Request } from "./request.js";

export const Report = sequelize.define('report', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    userId: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        },
    },
    commentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'comment',
            key: 'id'
        },
    },
    requestId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'request',
            key: 'id'
        },
    },
    reportedType: {
        type: DataTypes.ENUM(REPORT_TYPE),
        allowNull: false,
    },
}, {
    timestamps: false,
    underscored: true
});

Report.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE'
});

Report.belongsTo(Comment, {
    foreignKey: 'commentId',
    as: 'comment',
    onDelete: 'CASCADE'
});

Report.belongsTo(Request, {
    foreignKey: 'requestId',
    as: 'request',
    onDelete: 'CASCADE'
});