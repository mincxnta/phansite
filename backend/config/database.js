/**
 * Configura y exporta la instancia de Sequelize para conectar con la base de datos.
 * Soporta configuración para PostgreSQL y otros dialectos SQL.
 */

import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const dialect = process.env.DB_DIALECT

/**
 * Instancia de Sequelize para interactuar con la base de datos.
 * Se configura dinámicamente en función del dialecto.
 * @type {Sequelize}
 * @property {string} dialect - Dialecto de la base de datos ('postgres', 'mysql', etc.).
 */
export const sequelize = dialect === 'postgres'
  ? new Sequelize(process.env.DB_URI, {
    dialect,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      preferIPv4: true
    }
  })
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect,
    logging: false
  }
  )
