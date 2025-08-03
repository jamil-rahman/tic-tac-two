// All my Types goes here

// Timer Component Types
export interface TimerProps {
  duration: number; // in seconds
  isActive: boolean;
  onTimeUp: () => void;
  currentPlayer: string;
}

// Game Board Types
export interface GameBoardProps {
  board: (string | null)[];
  onCellClick: (index: number) => void;
  currentPlayer?: string;
  isGameActive?: boolean;
}

// Player Types
export interface Player {
  id: string;
  name: string;
  symbol: 'X' | 'O';
  isHost: boolean;
  isConnected: boolean;
}

// Game State Types
export interface GameState {
  board: (string | null)[];
  currentPlayer: string;
  winner: string | null;
  isGameActive: boolean;
  isGameOver: boolean;
}

// Room Types
export interface RoomData {
  id: string;
  players: Player[];
  gameState: GameState;
  hostSymbol: 'X' | 'O';
  createdAt: Date;
}

