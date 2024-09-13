export default function setupEventHandlers(io) {
    io.on('connection', (socket) => {
        // ... existing handlers

        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            socket.to(roomId).emit('userJoined', socket.id);
        });

        socket.on('leaveRoom', (roomId) => {
            socket.leave(roomId);
            io.to(roomId).emit('userLeft', socket.id);
        });

        socket.on('sendOffer', ({ to, offer }) => {
            socket.to(to).emit('receiveOffer', { from: socket.id, offer });
        });

        socket.on('sendAnswer', ({ to, answer }) => {
            socket.to(to).emit('receiveAnswer', { from: socket.id, answer });
        });

        socket.on('sendIceCandidate', ({ to, candidate }) => {
            socket.to(to).emit('receiveIceCandidate', { from: socket.id, candidate });
        });
    });
}