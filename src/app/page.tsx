'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GameOptions from '@/components/Home/GameOptions';
import LoadingModal from '@/components/LoadingModal';
import GameRules from '@/components/Home/GameRules';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [gameCode, setGameCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const router = useRouter();

  const handleHostGame = () => {
    setIsLoading(true);
    // Generate a random room ID (6 characters)
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    // Store room info in sessionStorage
    sessionStorage.setItem('roomId', roomId);
    sessionStorage.setItem('isHost', 'true');
    router.push('/lobby');
  };

  const handleJoinGame = () => {
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
  };

  const handleJoinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameCode(e.target.value.toUpperCase());
    if (joinError) setJoinError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-white">X/O</span>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Tic-Tac-Two
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Real-time multiplayer Tic-Tac-Toe
          </p>
        </div>

        {/* Game Options */}
        <div className="space-y-4">
          {/* Host Game Button */}
          <button
            onClick={handleHostGame}
            disabled={isLoading}
            className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-0.5 transition-all duration-300 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="relative rounded-[10px] bg-white dark:bg-gray-900 px-6 py-4 transition-all duration-300 group-hover:bg-transparent">
              <div className="flex items-center justify-center space-x-3 hover:cursor-pointer">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center ">
                  <span className="text-blue-600 dark:text-blue-400 text-lg">🏠</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-white group-hover:text-white transition-colors">
                    Host Game
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-100 transition-colors">
                    Create a new room
                  </div>
                </div>
              </div>
            </div>
          </button>

          {/* Join Game Section */}
          <div className="space-y-3">
            {!showJoinInput ? (
              <button
                onClick={() => setShowJoinInput(true)}
                disabled={isLoading}
                className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 p-0.5 transition-all duration-300 hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
              >
                <div className="relative rounded-[10px] bg-white dark:bg-gray-900 px-6 py-4 transition-all duration-300 group-hover:bg-transparent">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 dark:text-purple-400 text-lg">🔗</span>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 dark:text-white group-hover:text-white transition-colors">
                        Join Game
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-purple-100 transition-colors">
                        Enter room code
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={gameCode}
                    onChange={handleJoinInputChange}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors text-center text-lg font-mono tracking-widest"
                  />
                  {joinError && (
                    <div className="absolute -bottom-6 left-0 text-red-500 text-sm">
                      {joinError}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleJoinGame}
                    disabled={isLoading || !gameCode.trim()}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Join
                  </button>
                  <button
                    onClick={() => {
                      setShowJoinInput(false);
                      setGameCode('');
                      setJoinError('');
                    }}
                    className="px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <GameRules />

        {/* Loading Overlay */}
        {isLoading && (
          <LoadingModal message="Setting up game..." />
        )}
      </div>
    </div>
  );
}
