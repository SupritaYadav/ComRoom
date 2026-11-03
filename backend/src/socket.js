const { Server } = require('socket.io');
const { CLIENT_URL, ALLOWED_ROOMS } = require('./config');

const roomUsers = new Map();

function getRoomUsers(room) {
  return Array.from(roomUsers.get(room)?.values() || []);
}

function emitRoomUsers(io, room) {
  io.to(room).emit('room_users', { room, users: getRoomUsers(room) });
}

function attachSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: CLIENT_URL,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join_room', ({ username, room } = {}) => {
      const cleanName = typeof username === 'string' ? username.trim().slice(0, 24) : '';
      if (!cleanName || !ALLOWED_ROOMS.includes(room)) {
        socket.emit('chat_error', { message: 'Enter a name and choose a valid room.' });
        return;
      }

      const previousRoom = socket.data.room;
      if (previousRoom) {
        socket.leave(previousRoom);
        roomUsers.get(previousRoom)?.delete(socket.id);
        emitRoomUsers(io, previousRoom);
      }

      socket.data.username = cleanName;
      socket.data.room = room;
      socket.join(room);

      if (!roomUsers.has(room)) roomUsers.set(room, new Map());
      roomUsers.get(room).set(socket.id, { id: socket.id, username: cleanName });
      emitRoomUsers(io, room);

      console.log(`${cleanName} joined ${room}`);
    });

    socket.on('chat_message', ({ text } = {}) => {
      const room = socket.data.room;
      const cleanText = typeof text === 'string' ? text.trim().slice(0, 1000) : '';
      if (!room || !cleanText) return;

      const message = {
        id: `${Date.now()}-${socket.id}`,
        username: socket.data.username,
        text: cleanText,
        room,
        createdAt: new Date().toISOString()
      };

      socket.to(room).emit('room_message', message);
    });

    socket.on('typing', ({ isTyping } = {}) => {
      const room = socket.data.room;
      if (!room || typeof isTyping !== 'boolean') return;

      socket.to(room).emit('user_typing', {
        username: socket.data.username,
        isTyping
      });
    });

    socket.on('disconnect', () => {
      const room = socket.data.room;
      if (room) {
        roomUsers.get(room)?.delete(socket.id);
        emitRoomUsers(io, room);
      }
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

module.exports = { attachSocketServer };
