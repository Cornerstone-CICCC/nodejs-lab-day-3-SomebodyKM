"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Create server
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '', // Your frontend url here
        methods: ["GET", "POST"]
    }
});
// Socket.io
io.on('connection', (socket) => {
    // On connect
    console.log(`A new user has joined with id: ${socket.id}`);
    // On disconnect
    socket.on('disconnect', () => {
        console.log(`${socket.id} has disconnected`);
    });
});
// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server started on port ${PORT}...`);
});
