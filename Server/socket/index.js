import { Server } from "socket.io";
import roomHandlers from './roomHandlers.js';
import teamHandlers from './teamHandlers.js';
import userHandlers from './userHandlers.js';

export function initializeSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });

    io.use((socket, next) => {
        const clientId = socket.handshake.auth.clientId;
        if (!clientId) {
            return next(new Error("Invalid client ID"));
        }
        socket.id = clientId;
        next();
    });

    io.on('connection', (socket) => {
        console.log(`User connected with ID: ${socket.id}`);

        roomHandlers(io, socket);
        teamHandlers(io, socket);
        userHandlers(io, socket);

        // Global disconnection logic
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io;
}