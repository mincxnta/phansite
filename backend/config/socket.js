/**
 * Configura el servidor de WebSocket con Socket.IO.
 * Permite identificar usuarios conectados y notificar cambios de estado.
 */

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

/**
 * Mapa de usuarios conectados con su ID de socket correspondiente.
 * @type {Object.<string, string>}
 */
const userSocketMap = {}

/**
 * Maneja la conexión de un nuevo cliente WebSocket.
 * @event connection
 * @param {Socket} socket - Instancia del socket del cliente conectado.
 * @fires getOnlineUsers - Emite la lista de usuarios conectados como un array de IDs.
 */
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId
  if (userId) {
    userSocketMap[userId] = socket.id
  }
  io.emit('getOnlineUsers', Object.keys(userSocketMap))

  /**
   * Maneja la desconexión de un cliente WebSocket.
   * @event disconnect
   * @fires getOnlineUsers - Emite la lista actualizada de usuarios conectados.
   */
  socket.on('disconnect', () => {
    if (userId) {
      delete userSocketMap[userId]
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap))
  })
})

/**
 * Devuelve el socket ID asociado a un usuario.
 * @param {string} userId - ID del usuario.
 * @returns {string|undefined} Socket ID del usuario o undefined si no está conectado.
 */
export function getReceiverSocketId (userId) {
  return userSocketMap[userId]
}

export { io, app, server }
