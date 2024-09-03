import express from "express";
const app = express();
import dotenv from 'dotenv';
dotenv.config();

import { createServer } from "http";
import { Server } from "socket.io";

import bodyParser from "body-parser";

const port = process.env.NODE_ENV === 'production' ? process.env.PORT_PROD : process.env.PORT_LOCAL_AND_DEVELOPMENT;
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./utils/db.js";
import { responseMiddleware } from "./middlewares/responseMiddleware.js"
import errorHandler from "./middlewares/errorHandler.js";
import userRoutes from './Routes/userRoutes.js';
import roomRoutes from "./Routes/roomRoutes.js";
import gameRoutes from "./Routes/gameRoutes.js";


// Db connection
connectDB();

// for parsing application/json
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// Structure the json response for uniformity
app.use(responseMiddleware);


const allowedOrigins = [
    'http://localhost:5173',
];
// Cors config
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/games', gameRoutes);

// error handler middleware - return structured error message - this should be always placed beneath the routes to work
app.use(errorHandler);


// Create HTTP server and bind it with Socket.IO
const httpServer = createServer();
const io = new Server(httpServer, { /* options */ });

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join room
    socket.on('joinRoom', (roomId, userId) => {
        socket.join(roomId);
        activeUsers.set(socket.id, { userId, roomId });
        console.log(`User ${userId} joined room ${roomId}`);
        io.to(roomId).emit('userJoined', userId);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        const user = activeUsers.get(socket.id);
        if (user) {
            const { userId, roomId } = user;
            activeUsers.delete(socket.id);
            console.log(`User ${userId} disconnected from room ${roomId}`);
            io.to(roomId).emit('userDisconnected', userId);
        }
    });
});

httpServer.listen(4001);

app.listen(port, () => console.log(`Server started on ${port}`));




