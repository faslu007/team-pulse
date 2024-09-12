import { Game } from '../models/Game.js';

export default function roomHandlers(io, socket) {
    socket.on('joinRoom', async (roomData) => {
        const { roomId, userId } = roomData;

        try {
            // Validate if the room exists in the database
            const game = await Game.findOne({ roomId: roomId });
            if (!game) {
                socket.emit('joinRoomError', 'Room not found');
                return;
            }

            // Join the room
            socket.join(roomId);
            console.log(`User ${userId} joined room ${roomId}`);

            // Emit to the user that they've successfully joined
            socket.emit('joinRoomSuccess', { roomId, userId });

            // Broadcast to other users in the room that a new user has joined
            socket.to(roomId).emit('userJoined', { userId, roomId });

            // You can add additional logic here, such as updating user's status in the database
        } catch (error) {
            console.error('Error joining room:', error);
            socket.emit('joinRoomError', 'Failed to join room');
        }
    });

    // Handle leaving a room
    socket.on('leaveRoom', (roomId, userId) => {
        socket.leave(roomId);
        console.log(`User ${userId} left room ${roomId}`);
        io.to(roomId).emit('userLeft', { userId, roomId });
    });

    // Add other room-related event handlers here
}