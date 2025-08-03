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

// Socket.IO Response Types
export interface SocketResponse<T = unknown> {
    success: boolean;
    error?: string;
    data?: T;
}

export interface CreateRoomResponse extends SocketResponse {
    roomId: string;
    roomData: RoomData;
    player: Player;
}

export interface JoinRoomResponse extends SocketResponse {
    roomData: RoomData;
    player: Player;
}

export interface GetGameStateResponse extends SocketResponse {
    gameState: GameState;
    roomData: RoomData;
}

export interface MakeMoveResponse extends SocketResponse {
    gameState: GameState;
}

export interface ForceMoveResponse extends SocketResponse {
    gameState: GameState;
}

export interface StartGameResponse extends SocketResponse {
    gameState: GameState;
}

export interface PlayerJoinedData {
    roomData: RoomData;
}

export interface PlayerDisconnectedData {
    playerId: string;
    roomData: RoomData;
}

export interface MoveMadeData {
    gameState: GameState;
}

// Component Props
export interface GameBoardSectionProps {
    board: (string | null)[];
    currentPlayer: string;
    isGameActive: boolean;
    isMyTurn: boolean;
    timerActive: boolean;
    onCellClick: (index: number) => void;
    onTimeUp: () => void;
}

export interface ErrorDisplayProps {
    error: string;
}

export interface GameOverModalProps {
    winner: string | null;
}

export interface HostGameButtonProps {
    isLoading: boolean;
    onHostGame: () => void;
}

export interface JoinGameSectionProps {
    showJoinInput: boolean;
    gameCode: string;
    joinError: string;
    isLoading: boolean;
    onShowJoinInput: () => void;
    onJoinGame: () => void;
    onJoinInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCancelJoin: () => void;
}

// Hook State Types
export interface GameSocketState {
    // Game state
    board: (string | null)[];
    currentPlayer: string;
    isGameActive: boolean;
    isMyTurn: boolean;
    winner: string | null;
    isGameOver: boolean;
    timerActive: boolean;

    // Player state
    currentPlayerData: Player | null;

    // Error state
    error: string;
}

export interface LobbyState {
    // Room state
    roomId: string;
    isHost: boolean;
    roomData: RoomData | null;
    
    // Player state
    currentPlayer: Player | null;
    hostSymbol: 'X' | 'O';
    
    // Connection state
    player1Connected: boolean;
    player2Connected: boolean;
    
    // UI state
    isLoading: boolean;
    error: string;
    
    // Derived state
    canStartGame: boolean;
}