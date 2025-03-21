import express from 'express'
import cors from 'cors'
import { usersRouter } from './routes/users.js'
import { authRouter } from './routes/auth.js'
import { requestsRouter } from './routes/requests.js'
import { sequelize } from './config/db.js'
import cookieParser from 'cookie-parser'
import { authenticateToken } from './middlewares/auth.js'
import './models/index.js'
const app = express()

app.disable('x-powered-by') // Desactivar header innecesario

const corsOptions = {
  origin: 'http://localhost:5173', // Només aquest origen
  credentials: true // Permet credencials
}

app.use(cors(corsOptions)) // Evitar problemas de CORS
app.use(express.json()) // Middleware para parsear JSON a objetos
app.use(cookieParser())

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
const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
