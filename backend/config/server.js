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
