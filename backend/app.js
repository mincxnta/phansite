import express from 'express'
import cors from 'cors'
import { usersRouter } from './routes/users.js'

const app = express()

app.disable('x-powered-by') // Desactivar header innecesario
app.use(cors()) // Evitar problemas de CORS
app.use(express.json()) // Middleware para parsear JSON a objetos

// Rutas de la API de usuarios
app.use('/users', usersRouter)

// Inicializar servidor
const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
