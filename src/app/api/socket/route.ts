import { NextRequest } from 'next/server';
import { Server as SocketIOServer } from 'socket.io';
import { Player, RoomData } from '@/types';

// In-memory storage for rooms (will be reset on serverless function cold starts)
const rooms = new Map<string, RoomData>();

// Socket.IO server instance
let io: SocketIOServer | null = null;

// Initialize Socket.IO server
function getIO() {
  if (!io) {
    io = new SocketIOServer({
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_SERVER_URL || 'https://tic-tac-two2.vercel.app',
        methods: ['GET', 'POST'],
      },
    });

    // Socket.IO event handlers
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Create room
      socket.on('createRoom', (callback) => {
        try {
          const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
          const player: Player = {
            id: socket.id,
            name: 'Host',
            symbol: 'X',
            isHost: true,
            isConnected: true,
          };

          const roomData: RoomData = {
            id: roomId,
            players: [player],
            gameState: {
              board: Array(9).fill(null),
              currentPlayer: 'X',
              winner: null,
              isGameActive: false,
              isGameOver: false,
            },
            hostSymbol: 'X',
            createdAt: new Date(),
          };

          rooms.set(roomId, roomData);
          socket.join(roomId);
          socket.data.roomId = roomId;

          callback({
            success: true,
            roomId,
            roomData,
            player,
          });
        } catch (error) {
          console.error('Error creating room:', error);
          callback({ success: false, error: 'Failed to create room' });
        }
      });

      // Join room
      socket.on('joinRoom', (roomId, callback) => {
        try {
          const room = rooms.get(roomId);
          if (!room) {
            callback({ success: false, error: 'Room not found' });
            return;
          }

          if (room.players.length >= 2) {
            callback({ success: false, error: 'Room is full' });
            return;
          }

          const player: Player = {
            id: socket.id,
            name: 'Guest',
            symbol: room.hostSymbol === 'X' ? 'O' : 'X',
            isHost: false,
            isConnected: true,
          };

          room.players.push(player);
          socket.join(roomId);
          socket.data.roomId = roomId;

          // Notify other players
          socket.to(roomId).emit('playerJoined', { roomData: room });

          callback({
            success: true,
            roomData: room,
            player,
          });
        } catch (error) {
          console.error('Error joining room:', error);
          callback({ success: false, error: 'Failed to join room' });
        }
      });

      // Start game
      socket.on('startGame', (callback) => {
        try {
          const roomId = socket.data.roomId;
          const room = rooms.get(roomId);
          if (!room) {
            callback({ success: false, error: 'Room not found' });
            return;
          }

          room.gameState.isGameActive = true;
          io?.to(roomId).emit('gameStarted');

          callback({ success: true, gameState: room.gameState });
        } catch (error) {
          console.error('Error starting game:', error);
          callback({ success: false, error: 'Failed to start game' });
        }
      });

      // Make move
      socket.on('makeMove', (index, callback) => {
        try {
          const roomId = socket.data.roomId;
          const room = rooms.get(roomId);
          if (!room) {
            callback({ success: false, error: 'Room not found' });
            return;
          }

          const { gameState } = room;
          if (!gameState.isGameActive || gameState.board[index] !== null) {
            callback({ success: false, error: 'Invalid move' });
            return;
          }

          // Make the move
          gameState.board[index] = gameState.currentPlayer;
          
          // Check for win
          const winner = checkWinner(gameState.board);
          if (winner) {
            gameState.winner = winner;
            gameState.isGameOver = true;
            gameState.isGameActive = false;
          } else if (gameState.board.every((cell: string | null) => cell !== null)) {
            // Draw
            gameState.isGameOver = true;
            gameState.isGameActive = false;
          } else {
            // Switch player
            gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
          }

          // Notify all players
          io?.to(roomId).emit('moveMade', { gameState });

          callback({ success: true, gameState });
        } catch (error) {
          console.error('Error making move:', error);
          callback({ success: false, error: 'Failed to make move' });
        }
      });

      // Get game state
      socket.on('getGameState', (callback) => {
        try {
          const roomId = socket.data.roomId;
          const room = rooms.get(roomId);
          if (!room) {
            callback({ success: false, error: 'Room not found' });
            return;
          }
          callback({ success: true, gameState: room.gameState, roomData: room });
        } catch (error) {
          console.error('Error getting game state:', error);
          callback({ success: false, error: 'Failed to get game state' });
        }
      });

      // Disconnect
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        const roomId = socket.data.roomId;
        if (roomId) {
          const room = rooms.get(roomId);
          if (room) {
            room.players = room.players.filter((p: Player) => p.id !== socket.id);
            if (room.players.length === 0) {
              rooms.delete(roomId);
            } else {
              io?.to(roomId).emit('playerDisconnected', { playerId: socket.id, roomData: room });
            }
          }
        }
      });
    });
  }
  return io;
}

// Check for winner
function checkWinner(board: (string | null)[]): string | null {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

// API route handler
export async function GET(req: NextRequest) {
  // Handle Socket.IO upgrade
  if (req.headers.get('upgrade') === 'websocket') {
    // This will be handled by Socket.IO
    return new Response(null, { status: 101 });
  }

  return new Response('Socket.IO endpoint', { status: 200 });
}

export async function POST() {
  return new Response('Socket.IO endpoint', { status: 200 });
} 