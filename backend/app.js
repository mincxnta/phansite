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

app.use(express.json())
dotenv.config()
serverConfig(app)

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/admin', authenticateToken, adminRouter)
app.use('/api/requests', requestsRouter)
app.use('/api/polls', pollsRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/reports', authenticateToken, reportsRouter)
app.use('/api/messages', authenticateToken, messagesRouter)

app.use('/api/uploads', express.static(path.join(process.cwd(), 'uploads')))

// Sincronizar modelos con la base de datos
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Conexión establecida con la base de datos')
  })
  .catch(error => {
    console.log('Error en la conexión con la base de datos:', error)
  })

sequelize.authenticate()
  .then(() => {
    console.log('Conexión establecida con la base de datos')
  })
  .catch(error => {
    console.log('Error en la conexión con la base de datos:', error)
  })

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
  })
}

server.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`)
})
