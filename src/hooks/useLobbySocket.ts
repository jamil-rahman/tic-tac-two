'use client';

import { useReducer, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { initializeSocket, getSocket } from '@/lib/socket-client';
import { RoomData, Player, LobbyState } from '@/types';

// Define action types for better type safety
type LobbyAction =
  | { type: 'SET_INITIAL_STATE'; payload: { roomId: string; isHost: boolean } }
  | { type: 'ROOM_CREATED'; payload: { roomData: RoomData; player: Player; roomId: string } }
  | { type: 'ROOM_JOINED'; payload: { roomData: RoomData; player: Player } }
  | { type: 'PLAYER_STATUS_UPDATED'; payload: RoomData }
  | { type: 'SET_HOST_SYMBOL'; payload: 'X' | 'O' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'GAME_STARTED' };

// Combined state interface


// Initial state
const initialState: LobbyState = {
  roomId: '',
  isHost: false,
  roomData: null,
  currentPlayer: null,
  hostSymbol: 'X',
  player1Connected: false,
  player2Connected: false,
  isLoading: false,
  error: '',
  canStartGame: false,
};

// Reducer function for predictable state updates
function lobbyReducer(state: LobbyState, action: LobbyAction): LobbyState {
  switch (action.type) {
    case 'SET_INITIAL_STATE':
      return {
        ...state,
        roomId: action.payload.roomId,
        isHost: action.payload.isHost,
      };
    
    case 'ROOM_CREATED':
      return {
        ...state,
        roomData: action.payload.roomData,
        currentPlayer: action.payload.player,
        roomId: action.payload.roomId,
        player1Connected: true,
        canStartGame: false, // Need both players
      };
    
    case 'ROOM_JOINED':
      return {
        ...state,
        roomData: action.payload.roomData,
        currentPlayer: action.payload.player,
        player2Connected: true,
        canStartGame: state.player1Connected && true && state.isHost,
      };
    
    case 'PLAYER_STATUS_UPDATED':
      const host = action.payload.players.find(p => p.isHost);
      const guest = action.payload.players.find(p => !p.isHost);
      const player1Connected = host?.isConnected || false;
      const player2Connected = guest?.isConnected || false;
      
      return {
        ...state,
        roomData: action.payload,
        player1Connected,
        player2Connected,
        canStartGame: player1Connected && player2Connected && state.isHost,
      };
    
    case 'SET_HOST_SYMBOL':
      return {
        ...state,
        hostSymbol: action.payload,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    
    case 'GAME_STARTED':
      return {
        ...state,
        isLoading: false,
      };
    
    default:
      return state;
  }
}

export function useLobbySocket() {
  const [state, dispatch] = useReducer(lobbyReducer, initialState);
  const router = useRouter();

  // Memoized action creators for better performance
  const setInitialState = useCallback((roomId: string, isHost: boolean) => {
    dispatch({ type: 'SET_INITIAL_STATE', payload: { roomId, isHost } });
  }, []);

  const setRoomCreated = useCallback((roomData: RoomData, player: Player, roomId: string) => {
    dispatch({ type: 'ROOM_CREATED', payload: { roomData, player, roomId } });
  }, []);

  const setRoomJoined = useCallback((roomData: RoomData, player: Player) => {
    dispatch({ type: 'ROOM_JOINED', payload: { roomData, player } });
  }, []);

  const updatePlayerStatus = useCallback((roomData: RoomData) => {
    dispatch({ type: 'PLAYER_STATUS_UPDATED', payload: roomData });
  }, []);

  const setHostSymbol = useCallback((symbol: 'X' | 'O') => {
    dispatch({ type: 'SET_HOST_SYMBOL', payload: symbol });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  useEffect(() => {
    // Get room info from sessionStorage
    const storedRoomId = sessionStorage.getItem('roomId');
    const storedIsHost = sessionStorage.getItem('isHost') === 'true';
    
    if (!storedRoomId) {
      router.push('/');
      return;
    }

    setInitialState(storedRoomId, storedIsHost);

    // Initialize Socket.IO
    const socket = initializeSocket();

    // Track if already processed the initial connection
    let hasProcessedInitialConnection = false;

    // Socket event listeners
    const handleConnect = () => {
      console.log('Connected to server');
      
      // Prevent duplicate processing in Strict Mode
      if (hasProcessedInitialConnection) return;
      hasProcessedInitialConnection = true;
      
      if (storedIsHost) {
        // Host creates room
        socket.emit('createRoom', (response: any) => {
          if (response.success) {
            setRoomCreated(response.roomData, response.player, response.roomId);
            // Update sessionStorage with actual room ID
            sessionStorage.setItem('roomId', response.roomId);
          } else {
            setError(response.error);
          }
        });
      } else {
        // Guest joins room
        socket.emit('joinRoom', storedRoomId, (response: any) => {
          if (response.success) {
            setRoomJoined(response.roomData, response.player);
            updatePlayerStatus(response.roomData);
          } else {
            setError(response.error);
            setTimeout(() => router.push('/'), 2000);
          }
        });
      }
    };

    // Listen for player joined events
    const handlePlayerJoined = (data: { roomData: RoomData }) => {
      updatePlayerStatus(data.roomData);
    };

    // Listen for another player disconnecting
    const handlePlayerDisconnected = (data: { roomData: RoomData }) => {
      updatePlayerStatus(data.roomData);
    };

    // Listen for the host starting the game
    const handleGameStarted = () => {
      router.push('/game');
    };

    // Register event listeners
    socket.on('connect', handleConnect);
    socket.on('playerJoined', handlePlayerJoined);
    socket.on('playerDisconnected', handlePlayerDisconnected);
    socket.on('gameStarted', handleGameStarted);

    // If already connected, process immediately
    if (socket.connected) {
      handleConnect();
    }

    // Cleanup on unmount
    return () => {
      socket.off('connect', handleConnect);
      socket.off('playerJoined', handlePlayerJoined);
      socket.off('playerDisconnected', handlePlayerDisconnected);
      socket.off('gameStarted', handleGameStarted);
    };
  }, [router, setInitialState, setRoomCreated, setRoomJoined, updatePlayerStatus, setError]);

  const handleStartGame = useCallback(() => {
    if (!state.canStartGame) return;
    
    setLoading(true);
    sessionStorage.setItem('hostSymbol', state.hostSymbol);
    
    const socket = getSocket();
    if (socket) {
      socket.emit('startGame', (response: any) => {
        if (response.success) {
          dispatch({ type: 'GAME_STARTED' });
          router.push('/game');
        } else {
          setError(response.error);
          setLoading(false);
        }
      });
    }
  }, [state.canStartGame, state.hostSymbol, setLoading, setError, router]);

  const handleCopyRoomCode = useCallback(() => {
    navigator.clipboard.writeText(state.roomId);
  }, [state.roomId]);

  return {
    // Destructure state for cleaner API
    ...state,
    setHostSymbol,
    handleStartGame,
    handleCopyRoomCode,
  };
} 