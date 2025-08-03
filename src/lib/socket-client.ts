import { io, Socket } from 'socket.io-client';
import { 
  CreateRoomResponse,
  JoinRoomResponse,
  StartGameResponse,
  MakeMoveResponse,
  ForceMoveResponse,
  PlayerJoinedData,
  MoveMadeData,
  PlayerDisconnectedData,
  GetGameStateResponse
} from '@/types';

// Socket.IO client instance
let socket: Socket | null = null;

// Initialize Socket.IO client
export const initializeSocket = (): Socket => {
  if (!socket) {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://tic-tac-two2.vercel.app';
    socket = io(serverUrl, {
      path: '/api/socket',
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
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
  createRoom: (callback: (response: CreateRoomResponse) => void) => void;
  joinRoom: (roomId: string, callback: (response: JoinRoomResponse) => void) => void;
  startGame: (callback: (response: StartGameResponse) => void) => void;
  makeMove: (index: number, callback: (response: MakeMoveResponse) => void) => void;
  forceMove: (callback: (response: ForceMoveResponse) => void) => void;
  getGameState: (callback: (response: GetGameStateResponse) => void) => void;

  // Server to Client
  playerJoined: (data: PlayerJoinedData) => void;
  gameStarted: () => void;
  moveMade: (data: MoveMadeData) => void;
  playerDisconnected: (data: PlayerDisconnectedData) => void;
}
