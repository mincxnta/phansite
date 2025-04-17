import express from 'express'
import { serverConfig } from './config/server.js'
import { authRouter, usersRouter, requestsRouter, adminRouter, pollsRouter, commentsRouter, reportsRouter, messagesRouter } from './routes/index.js'
import { authenticateToken } from './middlewares/auth.js'
import { sequelize } from './config/database.js'
import dotenv from 'dotenv'
import './models/index.js'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'url'

import { app, server } from './config/socket.js'

// Configuración del servidor
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
app.use('/messages', authenticateToken, messagesRouter)

// Ruta para servir archivos estáticos
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

// Sincronizar modelos con la base de datos
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Conexión establecida con la base de datos')
  })
  .catch(error => {
    console.log('Error en la conexión con la base de datos:', error)
  })

// Servir el frontend en producción
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
  })
}

// Inicializar servidor
server.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`)
})
