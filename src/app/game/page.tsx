'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GameBoard from '@/components/GameBoard';
import Timer from '@/components/Timer';
import { getSocket } from '@/lib/socket-client';
import { GameState, Player } from '@/types';

export default function Game() {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<string>('X');
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [isMyTurn, setIsMyTurn] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [currentPlayerData, setCurrentPlayerData] = useState<Player | null>(null);
  const router = useRouter();

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
    setCurrentPlayerData(playerData);

    const socket = getSocket();
    if (!socket) {
      setError('Not connected to server');
      return;
    }

    // Function to update game state
    const updateGameState = (gameState: GameState) => {
      setBoard(gameState.board);
      setCurrentPlayer(gameState.currentPlayer);
      setIsGameActive(gameState.isGameActive);
      setIsGameOver(gameState.isGameOver);
      setWinner(gameState.winner);
      setIsMyTurn(gameState.currentPlayer === playerData.symbol);
      setTimerActive(gameState.isGameActive && !gameState.isGameOver);
    };

    // Request initial game state when component mounts
    socket.emit('getGameState', (response: any) => {
      if (response.success) {
        updateGameState(response.gameState);
        // Ensure player ID is correctly set from server
        const serverPlayer = response.roomData.players.find((p: Player) => p.id === socket.id);
        if (serverPlayer) {
          setCurrentPlayerData(serverPlayer);
        }
      } else {
        setError(response.error);
      }
    });

    // Listen for subsequent move updates
    socket.on('moveMade', (data: { gameState: GameState }) => {
      updateGameState(data.gameState);
    });

    socket.on('playerDisconnected', (data: { playerId: string; roomData: any }) => {
      setError('Other player disconnected');
      setTimeout(() => router.push('/'), 3000);
    });

    // Cleanup on unmount
    return () => {
      socket.off('gameStarted');
      socket.off('moveMade');
      socket.off('playerDisconnected');
    };
  }, [router]);

  const handleCellClick = (index: number) => {
    if (!isGameActive || !isMyTurn || board[index] !== null || winner) {
      return;
    }

    const socket = getSocket();
    if (!socket) {
      setError('Not connected to server');
      return;
    }

    socket.emit('makeMove', index, (response: any) => {
      if (response.success) {
        setBoard(response.gameState.board);
        setCurrentPlayer(response.gameState.currentPlayer);
        setIsGameActive(response.gameState.isGameActive);
        setIsGameOver(response.gameState.isGameOver);
        setWinner(response.gameState.winner);
        setIsMyTurn(false);
        setTimerActive(false);
      } else {
        setError(response.error);
      }
    });
  };

  const handleTimeUp = () => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit('forceMove', (response: any) => {
      if (response.success) {
        setBoard(response.gameState.board);
        setCurrentPlayer(response.gameState.currentPlayer);
        setIsGameActive(response.gameState.isGameActive);
        setIsGameOver(response.gameState.isGameOver);
        setWinner(response.gameState.winner);
        setIsMyTurn(response.gameState.currentPlayer === currentPlayerData?.symbol);
        setTimerActive(true);
      }
    });
  };

  // Show error if any
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl">
          <p className="font-medium">Error: {error}</p>
          <p className="text-sm mt-2">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  // Show game over screen
  if (isGameOver && winner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Game Over!
          </h1>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <p className="text-2xl font-semibold text-red-900 dark:text-white mb-4">
              {winner === 'draw' ? "It's a Draw!" : `${winner} Wins! 🏆`}
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Timer */}
        {isGameActive && timerActive && (
          <Timer 
            duration={5} 
            isActive={timerActive && isMyTurn} 
            onTimeUp={handleTimeUp} 
            currentPlayer={currentPlayer} 
          />
        )}

        {/* Game Board */}
        <GameBoard 
          board={board} 
          onCellClick={handleCellClick} 
          currentPlayer={currentPlayer}
          isGameActive={isGameActive && isMyTurn}
        />

        {/* Game Status */}
        {!isGameActive && (
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Waiting for host to start the game...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}