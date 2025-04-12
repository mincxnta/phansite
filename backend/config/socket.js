import { Server } from 'socket.io'
import http from 'http'
import express from 'express'
import dotenv from 'dotenv'

const app = express()
const server = http.createServer(app)
dotenv.config()

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
})

const userSocketMap = {}

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId
  if (userId) {
    userSocketMap[userId] = socket.id
  }
  io.emit('getOnlineUsers', Object.keys(userSocketMap))

  socket.on('disconnect', () => {
    if (userId) {
      delete userSocketMap[userId]
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap))
  })
})

export function getReceiverSocketId (userId) {
  return userSocketMap[userId]
}

export { io, app, server }
