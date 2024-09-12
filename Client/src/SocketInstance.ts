import { io, Socket } from 'socket.io-client';

class SocketInstance {
    private static instance: SocketInstance;
    private socket: Socket | null = null;
    private clientId: string | null = null;

    private constructor() { }

    public static getInstance(): SocketInstance {
        if (!SocketInstance.instance) {
            SocketInstance.instance = new SocketInstance();
        }
        return SocketInstance.instance;
    }

    public connect(url: string, clientId: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.clientId = clientId;
            this.socket = io(url, {
                transports: ['websocket'],
                autoConnect: true,
                auth: { clientId: this.clientId }
            });

            this.socket.on('connect', () => {
                console.log(`Connected to socket server with ID: ${this.clientId}`);
                resolve(true);
            });

            this.socket.on('connect_error', (error) => {
                console.error('Connection error:', error);
                reject(error);
            });

            this.socket.on('disconnect', () => {
                console.log(`Disconnected from socket server (ID: ${this.clientId})`);
            });
        });
    }

    public getSocketId(): string | null {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.socket ? (this.socket as any).id : null;
    }

    public emit(event: string, data: Record<string, unknown>): void {
        if (this.socket) {
            this.socket.emit(event, { ...data, clientId: this.clientId });
        } else {
            console.error('Socket is not connected');
        }
    }

    public joinRoom(roomId: string, userId: string): void {
        if (this.socket) {
            this.socket.emit('joinRoom', { roomId, userId });
            console.log(`User ${userId} joined room ${roomId}`);
        } else {
            console.error('Socket is not connected');
        }
    }

    public leaveRoom(roomId: string, userId: string): void {
        if (this.socket) {
            this.socket.emit('leaveRoom', { roomId, userId });
            console.log(`User ${userId} left room ${roomId}`);
        } else {
            console.error('Socket is not connected');
        }
    }

    public on(event: string, callback: (data: unknown) => void): void {
        if (this.socket) {
            this.socket.on(event, callback);
        } else {
            console.error('Socket is not connected');
        }
    }

    public off(event: string, callback?: (data: unknown) => void): void {
        if (this.socket) {
            this.socket.off(event, callback);
        } else {
            console.error('Socket is not connected');
        }
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    public getClientId(): string | null {
        return this.clientId;
    }
}

export const socketInstance = SocketInstance.getInstance();
