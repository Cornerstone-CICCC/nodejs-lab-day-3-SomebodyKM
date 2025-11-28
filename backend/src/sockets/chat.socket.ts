import { Server, Socket } from 'socket.io';
import { Chat } from '../models/chat.model';

const setupChatSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    // On connect
    console.log(`User connected: ${socket.id}`);

    // // Fetch all messages
    // socket.on('getMessages', async () => {
    //   const messages = await Chat.find().sort({ createdAt: 1 })
    //   socket.emit('loadMessages', messages)
    // })

    // Join a room
    socket.on('joinRoom', ({ room, username }) => {
      socket.join(room)
      socket.emit('systemMessage', `${username} joined room: ${room}`)
    })

    // Leave a room
    socket.on('leaveRoom', ({ room, username }) => {
      socket.leave(room)

      socket.to(room).emit('systemMessage', `${username} left room: ${room}`)
    })

    // Fetch messages for a room
    socket.on('getRoomMessages', async ({ room }) => {
      const messages = await Chat.find({ room: room }).sort({ createdAt: 1 })
      socket.emit('loadRoomMessages', messages)
    })

    // Listen to 'sendMessage' event
    socket.on('sendMessage', async (data) => {
      const { username, message, room } = data;

      try {
        // Save message to MongoDB
        const chat = new Chat({ username, message, room });
        await chat.save();

        io.to(room).emit('newMessage', chat)

        // For room-based broadcast
        // io.to(data.room).emit('newMessage', chat)
      } catch (error) {
        console.error('Error saving chat:', error);
      }
    });

    // On disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export default setupChatSocket;