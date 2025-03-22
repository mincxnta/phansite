import express from 'express'
import { configureServer } from './config/server.js'
import { authRouter, usersRouter, requestsRouter } from './routes'
import { authenticateToken } from './middlewares/auth.js'
import { sequelize } from './config/database.js'
import { PORT } from './constants/constants.js'
import './models/index.js'

// Configuración del servidor
const app = express()
app.use(express.json())
configureServer(app)

// Rutas de la API
app.use('/auth', authRouter)
app.use('/users', authenticateToken, usersRouter)
app.use('/requests', authenticateToken, requestsRouter)

// Sincronizar modelos con la base de datos
sequelize.sync({ force: false })
  .then(() => {
    console.log('Conexión establecida con la base de datos')
  })
  .catch(error => {
    console.log('Error en la conexión con la base de datos:', error)
  })

// Inicializar servidor
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
