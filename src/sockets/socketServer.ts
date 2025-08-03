import { Server as SocketIOServer } from 'socket.io';
import { RoomData, Player, GameState } from '@/types';

// In-memory storage for rooms (no database)
const rooms = new Map<string, RoomData>();

// Generate a random room ID
const generateRoomId = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Create initial game state
const createInitialGameState = (): GameState => ({
  board: Array(9).fill(null),
  currentPlayer: 'X',
  winner: null,
  isGameActive: false,
  isGameOver: false,
});

// Create a new player
const createPlayer = (socketId: string, isHost: boolean, symbol: 'X' | 'O'): Player => ({
  id: socketId,
  name: isHost ? 'Host' : 'Guest',
  symbol,
  isHost,
  isConnected: true,
});

// Get random move for CPU
const getRandomMove = (board: (string | null)[]): number => {
  const emptyCells = board
    .map((cell, index) => cell === null ? index : -1)
    .filter(index => index !== -1);

  if (emptyCells.length === 0) return -1;

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomIndex];
};

// Check for win condition
const checkWinCondition = (board: (string | null)[]): string | null => {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  // Check for draw
  if (board.every(cell => cell !== null)) {
    return 'draw';
  }

  return null;
};

export const initializeSocketServer = (io: SocketIOServer) => {
  io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);

    // Create Room
    socket.on('createRoom', (callback) => {
      try {
        // Generate unique room ID
        let roomId: string;
        do {
          roomId = generateRoomId();
        } while (rooms.has(roomId));

        // Create host player
        const hostPlayer = createPlayer(socket.id, true, 'X');

        // Create room data
        const roomData: RoomData = {
          id: roomId,
          players: [hostPlayer],
          gameState: createInitialGameState(),
          hostSymbol: 'X',
          createdAt: new Date(),
        };

        // Store room in memory
        rooms.set(roomId, roomData);

        // Join socket room
        socket.join(roomId);

        // Store room info in socket
        socket.data.roomId = roomId;
        socket.data.isHost = true;

        console.log(`Room created: ${roomId} by ${socket.id}`);

        // Send room info back to client
        callback({
          success: true,
          roomId,
          player: hostPlayer,
          roomData,
        });
      } catch (error) {
        console.error('Error creating room:', error);
        callback({
          success: false,
          error: 'Failed to create room',
        });
      }
    });

    // Join Room
    socket.on('joinRoom', (roomId: string, callback) => {
      try {
        const room = rooms.get(roomId);

        if (!room) {
          callback({
            success: false,
            error: 'Room not found',
          });
          return;
        }

        if (room.players.length >= 2) {
          callback({
            success: false,
            error: 'Room is full',
          });
          return;
        }

        // Create guest player
        const guestSymbol = room.hostSymbol === 'X' ? 'O' : 'X';
        const guestPlayer = createPlayer(socket.id, false, guestSymbol);

        // Add player to room
        room.players.push(guestPlayer);

        // Join socket room
        socket.join(roomId);

        // Store room info in socket
        socket.data.roomId = roomId;
        socket.data.isHost = false;

        console.log(`Player ${socket.id} joined room ${roomId}`);

        // Notify all players in room
        io.to(roomId).emit('playerJoined', {
          player: guestPlayer,
          roomData: room,
        });

        // Send room info back to joining client
        callback({
          success: true,
          roomId,
          player: guestPlayer,
          roomData: room,
        });
      } catch (error) {
        console.error('Error joining room:', error);
        callback({
          success: false,
          error: 'Failed to join room',
        });
      }
    });

    // Start Game
    socket.on('startGame', (callback) => {
      try {
        const roomId = socket.data.roomId;
        const room = rooms.get(roomId);

        if (!room) {
          callback({ success: false, error: 'Room not found' });
          return;
        }

        if (!socket.data.isHost) {
          callback({ success: false, error: 'Only host can start game' });
          return;
        }

        if (room.players.length < 2) {
          callback({ success: false, error: 'Need 2 players to start' });
          return;
        }

        // Activate game
        room.gameState.isGameActive = true;
        room.gameState.currentPlayer = room.hostSymbol;

        console.log(`Game started in room ${roomId}`);

        // Notify all players
        io.to(roomId).emit('gameStarted', {
          gameState: room.gameState,
          roomData: room,
        });

        callback({ success: true, gameState: room.gameState });
      } catch (error) {
        console.error('Error starting game:', error);
        callback({ success: false, error: 'Failed to start game' });
      }
    });

    // Make Move
    socket.on('makeMove', (index: number, callback) => {
      try {
        const roomId = socket.data.roomId;
        const room = rooms.get(roomId);

        if (!room) {
          callback({ success: false, error: 'Room not found' });
          return;
        }

        if (!room.gameState.isGameActive) {
          callback({ success: false, error: 'Game not active' });
          return;
        }

        const player = room.players.find(p => p.id === socket.id);
        if (!player) {
          callback({ success: false, error: 'Player not found' });
          return;
        }

        // Check if it's player's turn
        if (room.gameState.currentPlayer !== player.symbol) {
          callback({ success: false, error: 'Not your turn' });
          return;
        }

        // Check if cell is empty
        if (room.gameState.board[index] !== null) {
          callback({ success: false, error: 'Cell already taken' });
          return;
        }

        // Make move
        room.gameState.board[index] = player.symbol;

        // Check for win
        const winner = checkWinCondition(room.gameState.board);
        if (winner) {
          room.gameState.isGameOver = true;
          room.gameState.isGameActive = false;
          room.gameState.winner = winner === 'draw' ? 'draw' : winner;
        } else {
          // Switch turns
          room.gameState.currentPlayer = room.gameState.currentPlayer === 'X' ? 'O' : 'X';
        }

        console.log(`Move made in room ${roomId}: ${player.symbol} at index ${index}`);

        // Notify all players
        io.to(roomId).emit('moveMade', {
          index,
          symbol: player.symbol,
          gameState: room.gameState,
          roomData: room,
        });

        callback({ success: true, gameState: room.gameState });
      } catch (error) {
        console.error('Error making move:', error);
        callback({ success: false, error: 'Failed to make move' });
      }
    });

    // Force Move (CPU move when time runs out)
    socket.on('forceMove', (callback) => {
      try {
        const roomId = socket.data.roomId;
        const room = rooms.get(roomId);

        if (!room || !room.gameState.isGameActive) {
          callback({ success: false, error: 'Game not active' });
          return;
        }

        const randomIndex = getRandomMove(room.gameState.board);
        if (randomIndex === -1) {
          callback({ success: false, error: 'No valid moves available' });
          return;
        }

        // Make CPU move
        room.gameState.board[randomIndex] = room.gameState.currentPlayer;

        // Check for win
        const winner = checkWinCondition(room.gameState.board);
        if (winner) {
          room.gameState.isGameOver = true;
          room.gameState.isGameActive = false;
          room.gameState.winner = winner === 'draw' ? 'draw' : winner;
        } else {
          // Switch turns
          room.gameState.currentPlayer = room.gameState.currentPlayer === 'X' ? 'O' : 'X';
        }

        console.log(`CPU move in room ${roomId}: ${room.gameState.board[randomIndex]} at index ${randomIndex}`);

        // Notify all players
        io.to(roomId).emit('moveMade', {
          index: randomIndex,
          symbol: room.gameState.board[randomIndex],
          gameState: room.gameState,
          roomData: room,
          isCPUMove: true,
        });

        callback({ success: true, gameState: room.gameState });
      } catch (error) {
        console.error('Error making CPU move:', error);
        callback({ success: false, error: 'Failed to make CPU move' });
      }
    });

    // Get Game State
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
      console.log(`Player disconnected: ${socket.id}`);

      const roomId = socket.data.roomId;
      if (roomId) {
        const room = rooms.get(roomId);
        if (room) {
          // Mark player as disconnected
          const player = room.players.find(p => p.id === socket.id);
          if (player) {
            player.isConnected = false;
          }

          // Notify other players
          socket.to(roomId).emit('playerDisconnected', {
            playerId: socket.id,
            roomData: room,
          });

          // Clean up room if all players disconnected
          const allDisconnected = room.players.every(p => !p.isConnected);
          if (allDisconnected) {
            rooms.delete(roomId);
            console.log(`Room ${roomId} deleted (all players disconnected)`);
          }
        }
      }
    });
  });

  return io;
};
