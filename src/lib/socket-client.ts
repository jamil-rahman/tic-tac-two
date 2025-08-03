import { io, Socket } from 'socket.io-client';

// Socket.IO client instance
let socket: Socket | null = null;

// Initialize Socket.IO client
export const initializeSocket = (): Socket => {
  if (!socket) {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
    socket = io(serverUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Connection event handlers
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });
  }

  return socket;
};

// Get current socket instance
export const getSocket = (): Socket | null => {
  return socket;
};

// Disconnect socket
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Socket event types for better type safety
export interface SocketEvents {
  // Client to Server
  createRoom: (callback: (response: any) => void) => void;
  joinRoom: (roomId: string, callback: (response: any) => void) => void;
  startGame: (callback: (response: any) => void) => void;
  makeMove: (index: number, callback: (response: any) => void) => void;
  forceMove: (callback: (response: any) => void) => void;

  // Server to Client
  playerJoined: (data: { player: any; roomData: any }) => void;
  gameStarted: (data: { gameState: any; roomData: any }) => void;
  moveMade: (data: { index: number; symbol: string; gameState: any; roomData: any; isCPUMove?: boolean }) => void;
  playerDisconnected: (data: { playerId: string; roomData: any }) => void;
}
