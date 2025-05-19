/**
 * Configura middlewares esenciales del servidor Express.
 * - CORS para permitir orígenes autorizados.
 * - Cookies HTTP.
 * @param {Express} app - Instancia de la aplicación Express.
 */

import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

dotenv.config()

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true
}

export const serverConfig = (app) => {
  app.disable('x-powered-by')
  app.use(cors(corsOptions))
  app.use(cookieParser())
}
