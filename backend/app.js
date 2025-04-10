import express from 'express'
import { serverConfig } from './config/server.js'
import { authRouter, usersRouter, requestsRouter, adminRouter, pollsRouter, commentsRouter, reportsRouter } from './routes/index.js'
import { authenticateToken } from './middlewares/auth.js'
// import { sequelize } from './config/database.js'
import dotenv from 'dotenv'
import './models/index.js'
import path from 'node:path'

// Configuración del servidor
const app = express()
app.use(express.json())
dotenv.config()
serverConfig(app)

// Rutas de la API
app.use('/auth', authRouter)
app.use('/users', authenticateToken, usersRouter)
app.use('/admin', authenticateToken, adminRouter)
app.use('/requests', requestsRouter)
app.use('/polls', pollsRouter)
app.use('/comments', commentsRouter)
app.use('/reports', authenticateToken, reportsRouter)

// Ruta para servir archivos estáticos
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

// Sincronizar modelos con la base de datos
// sequelize.sync({ alter: true })
//   .then(() => {
//     console.log('Conexión establecida con la base de datos')
//   })
//   .catch(error => {
//     console.log('Error en la conexión con la base de datos:', error)
//   })

// Inicializar servidor
app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`)
})
