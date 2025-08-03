'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function useHomeNavigation() {
  const [isLoading, setIsLoading] = useState(false);
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [gameCode, setGameCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const router = useRouter();

  // Memoize handlers to prevent unnecessary re-renders
  const handleHostGame = useCallback(() => {
    setIsLoading(true);
    // Generate a random room ID (6 characters)
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    // Store room info in sessionStorage
    sessionStorage.setItem('roomId', roomId);
    sessionStorage.setItem('isHost', 'true');
    router.push('/lobby');
  }, [router]);

  const handleJoinGame = useCallback(() => {
    if (!gameCode.trim()) {
      setJoinError('Please enter a game code');
      return;
    }

    if (gameCode.trim().length !== 6) {
      setJoinError('Game code must be 6 characters');
      return;
    }

    setIsLoading(true);
    setJoinError('');
    sessionStorage.setItem('roomId', gameCode.trim().toUpperCase());
    sessionStorage.setItem('isHost', 'false');
    router.push('/lobby');
  }, [gameCode, router]);

  const handleJoinInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setGameCode(e.target.value.toUpperCase());
    if (joinError) setJoinError('');
  }, [joinError]);

  const handleShowJoinInput = useCallback(() => {
    setShowJoinInput(true);
  }, []);

  const handleCancelJoin = useCallback(() => {
    setShowJoinInput(false);
    setGameCode('');
    setJoinError('');
  }, []);

  return {
    isLoading,
    showJoinInput,
    gameCode,
    joinError,
    handleHostGame,
    handleJoinGame,
    handleJoinInputChange,
    handleShowJoinInput,
    handleCancelJoin,
  };
} 