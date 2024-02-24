import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { PORT, URI } from "./config/index.js";
import App from "./routes/index.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import http from 'http'; // Import http module

// Import Socket.IO
import { Server as SocketIOServer } from 'socket.io';

const server = express();
server.use(cors());
server.disable("x-powered-by");
server.use(cookieParser());
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicPath = path.join(__dirname, '..', 'public');
// Serve the static files from the public directory
server.use(express.static(publicPath));

mongoose.promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose
    .connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(console.log("Connected to database"))
    .catch((err) => console.log(err));

server.use(App);

// Create HTTP server using Express app
const httpServer = http.createServer(server);

// Initialize Socket.IO
const io = new SocketIOServer(httpServer, {
    path: 'ancientgamers/socket.io'
});
let roomCounter = 1; // Initialize room counter

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // Determine room ID for the user
    const roomId = Math.ceil(roomCounter / 2); // Assign two users to each room

    // Determine player color based on the parity of the room ID
    let playerColor = '';
    if (roomCounter % 2 === 1) {
        playerColor = 'blue';
    } else {
        playerColor = 'yellow';
    }

    // Increment the room counter only after assigning the player color
    roomCounter++;

    // Join the room and emit the room number and player color to the client
    socket.join(`room-${roomId}`);
    socket.emit('Room Number:', roomId);
    socket.emit('Player Color:', playerColor);

    // Notify if two players are in the room
    const playersInRoom = io.sockets.adapter.rooms.get(`room-${roomId}`);
    if (playersInRoom && playersInRoom.size === 2) {
        io.to(`room-${roomId}`).emit('Two Players:', true);
    } else {
        io.to(`room-${roomId}`).emit('Two Players:', false);
    }

    // Handle move events from clients
    socket.on('move', ({ pieceId, newX, newY }) => {
        // Broadcast the move to all clients in the same room
        io.to(`room-${roomId}`).emit('move', { pieceId, newX, newY });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

httpServer.listen(PORT, () =>
    console.log(`Server running on port:${PORT}`)
);
