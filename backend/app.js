import express from 'express'
import cors from 'cors'
import { usersRouter } from './routes/users.js'
import { sequelize } from './config/db.js'
import './models/index.js';
const app = express()

app.disable('x-powered-by') // Desactivar header innecesario
app.use(cors()) // Evitar problemas de CORS
app.use(express.json()) // Middleware para parsear JSON a objetos

// Rutas de la API de usuarios
app.use('/users', usersRouter)

// Sincronizar modelos con la base de datos
sequelize.sync({ force: false })
  .then(() => {
    console.log('Conexión establecida con la base de datos')
  })
  .catch(error => {
    console.log('Error en la conexión con la base de datos:', error)
  })

// Inicializar servidor
const PORT = process.env.PORT ?? 3001

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
