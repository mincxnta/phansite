import { DataTypes, Sequelize } from "sequelize";
import { User } from "./user.js";
export const Message = sequelize.define('message', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    user1Id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        },
        field: 'user1_id'
    },
    user2Id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        },
        field: 'user2_id'
    },
}, {
    timestamps: true,
    createdAt: 'submitDate',
    updatedAt: false,
    underscored: true
});

Message.belongsTo(User, {
    foreignKey: 'user1_id',
    as: 'user1',
    onDelete: 'CASCADE'
});

Message.belongsTo(User, {
    foreignKey: 'user2_id',
    as: 'user2',
    onDelete: 'CASCADE'
});