import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const dialect = process.env.DB_DIALECT

// export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
//   host: process.env.DB_HOST,
//   dialect: process.env.DB_DIALECT,
//   port: process.env.DB_PORT,
//   logging: false
// })

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
