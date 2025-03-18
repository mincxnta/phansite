/*export class UserModel {
  static async getAll () {
    return 'All users'
  }

  static async getById ({ id }) {
    return `User ${id}`
  }

  static async create ({ user }) {
    return `User ${user} created`
  }

  static async delete ({ id }) {
    return `User ${id} deleted`
  }

  static async update ({ id, user }) {
    return `User ${id} updated`
  }
}
*/
import { DataTypes, Sequelize } from "sequelize";
import { ROLES } from "../constants/constants";
import { Request } from "./request.js";
export const User = sequelize.define('user', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    //defaultValue: sql.UUID,
    defaultValue: Sequelize.UUIDV4,
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
    type: DataTypes.STRING(255),
    //allowNull: false,
    //defaultValue: 1
  },
  role: {
    type: DataTypes.ENUM(ROLES),
    defaultValue: ROLES[2],
    allowNull: false,
  },
  banned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
}, {
  timestamps: true,
  createdAt: 'registrationDate',
  updatedAt: false,
  underscored: true
});

User.hasMany(Request, {
  foreignKey: 'userId',  // Clave foránea en Request
  as: 'requests',  // Alias para la relación
});