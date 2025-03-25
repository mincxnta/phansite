import express from 'express'
import { serverConfig } from './config/server.js'
import { authRouter, usersRouter, requestsRouter, adminRouter } from './routes/index.js'
import { authenticateToken } from './middlewares/auth.js'
import { sequelize } from './config/database.js'
import dotenv from 'dotenv'
import './models/index.js'

// Configuración del servidor
const app = express()
app.use(express.json())
dotenv.config()
serverConfig(app)

// Rutas de la API
app.use('/auth', authRouter)
app.use('/users', authenticateToken, usersRouter)
app.use('/admin', authenticateToken, adminRouter)
app.use('/requests', authenticateToken, requestsRouter)

// Sincronizar modelos con la base de datos
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Conexión establecida con la base de datos')
  })
  .catch(error => {
    console.log('Error en la conexión con la base de datos:', error)
  })

// Inicializar servidor
app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`)
})
