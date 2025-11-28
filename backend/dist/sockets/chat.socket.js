"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_model_1 = require("../models/chat.model");
const setupChatSocket = (io) => {
    io.on('connection', (socket) => {
        // On connect
        console.log(`User connected: ${socket.id}`);
        // // Fetch all messages
        // socket.on('getMessages', async () => {
        //   const messages = await Chat.find().sort({ createdAt: 1 })
        //   socket.emit('loadMessages', messages)
        // })
        // Join a room
        socket.on('joinRoom', ({ room, username }) => {
            socket.join(room);
            socket.emit('systemMessage', `${username} joined room: ${room}`);
        });
        // Leave a room
        socket.on('leaveRoom', ({ room, username }) => {
            socket.leave(room);
            socket.to(room).emit('systemMessage', `${username} left room: ${room}`);
        });
        // Fetch messages for a room
        socket.on('getRoomMessages', (_a) => __awaiter(void 0, [_a], void 0, function* ({ room }) {
            const messages = yield chat_model_1.Chat.find({ room: room }).sort({ createdAt: 1 });
            socket.emit('loadRoomMessages', messages);
        }));
        // Listen to 'sendMessage' event
        socket.on('sendMessage', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { username, message, room } = data;
            try {
                // Save message to MongoDB
                const chat = new chat_model_1.Chat({ username, message, room });
                yield chat.save();
                io.to(room).emit('newMessage', chat);
                // For room-based broadcast
                // io.to(data.room).emit('newMessage', chat)
            }
            catch (error) {
                console.error('Error saving chat:', error);
            }
        }));
        // On disconnect
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
exports.default = setupChatSocket;
