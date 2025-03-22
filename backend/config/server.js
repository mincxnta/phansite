import cors from 'cors'
import cookieParser from 'cookie-parser'

const corsOptions = {
  origin: 'http://localhost:5173', // Fer CONST
  credentials: true
}

export const serverConfig = (app) => {
  app.disable('x-powered-by')
  app.use(cors(corsOptions))
  app.use(cookieParser())
}
