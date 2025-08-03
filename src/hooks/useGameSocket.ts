'use client';

import { useReducer, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getSocket } from '@/lib/socket-client';
import { GameState, Player, GameSocketState } from '@/types';

// Define action types for better type safety
type GameAction =
  | { type: 'UPDATE_GAME_STATE'; payload: GameState }
  | { type: 'SET_PLAYER_DATA'; payload: Player }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'RESET_GAME' };


// Initial state
const initialState: GameSocketState = {
  board: Array(9).fill(null),
  currentPlayer: 'X',
  isGameActive: false,
  isMyTurn: false,
  winner: null,
  isGameOver: false,
  timerActive: false,
  currentPlayerData: null,
  error: '',
};

// Reducer function for predictable state updates
function gameSocketReducer(state: GameSocketState, action: GameAction): GameSocketState {
  switch (action.type) {
    case 'UPDATE_GAME_STATE':
      return {
        ...state,
        board: action.payload.board,
        currentPlayer: action.payload.currentPlayer,
        isGameActive: action.payload.isGameActive,
        isGameOver: action.payload.isGameOver,
        winner: action.payload.winner,
        // Derived state - calculated based on other state
        isMyTurn: action.payload.currentPlayer === state.currentPlayerData?.symbol,
        timerActive: action.payload.isGameActive && !action.payload.isGameOver,
      };
    
    case 'SET_PLAYER_DATA':
      return {
        ...state,
        currentPlayerData: action.payload,
        // Recalculate derived state when player data changes
        isMyTurn: state.currentPlayer === action.payload.symbol,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    
    case 'RESET_GAME':
      return initialState;
    
    default:
      return state;
  }
}

export function useGameSocket() {
  const [state, dispatch] = useReducer(gameSocketReducer, initialState);
  const router = useRouter();

  // Memoized action creators for better performance
  const updateGameState = useCallback((gameState: GameState) => {
    dispatch({ type: 'UPDATE_GAME_STATE', payload: gameState });
  }, []);

  const setPlayerData = useCallback((player: Player) => {
    dispatch({ type: 'SET_PLAYER_DATA', payload: player });
  }, []);

  const setError = useCallback((error: string) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  useEffect(() => {
    // Get player info from sessionStorage
    const roomId = sessionStorage.getItem('roomId');
    const isHost = sessionStorage.getItem('isHost') === 'true';
    const hostSymbol = sessionStorage.getItem('hostSymbol') || 'X';

    if (!roomId) {
      router.push('/');
      return;
    }

    // Set current player data
    const playerData: Player = {
      id: 'temp-id', // Will be updated by socket
      name: isHost ? 'Host' : 'Guest',
      symbol: isHost ? (hostSymbol as 'X' | 'O') : (hostSymbol === 'X' ? 'O' : 'X'),
      isHost,
      isConnected: true,
    };
    setPlayerData(playerData);

    const socket = getSocket();
    if (!socket) {
      setError('Not connected to server');
      return;
    }

    // Track if already requested initial state
    let hasRequestedInitialState = false;

    const requestInitialState = () => {
      if (hasRequestedInitialState) return;
      hasRequestedInitialState = true;

      // Request initial game state when component mounts
      socket.emit('getGameState', (response: any) => {
        if (response.success) {
          updateGameState(response.gameState);
          // Ensure player ID is correctly set from server
          const serverPlayer = response.roomData.players.find((p: Player) => p.id === socket.id);
          if (serverPlayer) {
            setPlayerData(serverPlayer);
          }
        } else {
          setError(response.error);
        }
      });
    };

    // Listen for subsequent move updates
    const handleMoveMade = (data: { gameState: GameState }) => {
      updateGameState(data.gameState);
    };

    const handlePlayerDisconnected = (data: { playerId: string; roomData: any }) => {
      setError('Other player disconnected');
      setTimeout(() => router.push('/'), 3000);
    };

    // Register event listeners
    socket.on('moveMade', handleMoveMade);
    socket.on('playerDisconnected', handlePlayerDisconnected);

    // Request initial state
    requestInitialState();

    // Cleanup on unmount
    return () => {
      socket.off('moveMade', handleMoveMade);
      socket.off('playerDisconnected', handlePlayerDisconnected);
    };
  }, [router, updateGameState, setPlayerData, setError]);

  const handleCellClick = useCallback((index: number) => {
    if (!state.isGameActive || !state.isMyTurn || state.board[index] !== null || state.winner) {
      return;
    }

    const socket = getSocket();
    if (!socket) {
      setError('Not connected to server');
      return;
    }

    socket.emit('makeMove', index, (response: any) => {
      if (response.success) {
        updateGameState(response.gameState);
      } else {
        setError(response.error);
      }
    });
  }, [state.isGameActive, state.isMyTurn, state.board, state.winner, updateGameState, setError]);

  const handleTimeUp = useCallback(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit('forceMove', (response: any) => {
      if (response.success) {
        updateGameState(response.gameState);
      }
    });
  }, [updateGameState]);

  return {
    // Destructure state for cleaner API
    ...state,
    handleCellClick,
    handleTimeUp,
  };
} 