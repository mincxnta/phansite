import { DataTypes, Sequelize } from "sequelize";
import { User } from "./user.js";
import { Poll } from "./poll.js";
export const Comment = sequelize.define('comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    text: {
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
    pollId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'poll',
            key: 'id'
        },
    },
    anonymous: {
        type: DataTypes.BOOLEAN,
        default: false
    },
}, {
    timestamps: false,
    underscored: true
});

Comment.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE'
});

Comment.belongsTo(Poll, {
    foreignKey: 'pollId',
    as: 'poll',
    onDelete: 'CASCADE'
});