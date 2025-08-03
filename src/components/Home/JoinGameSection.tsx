'use client';
import { JoinGameSectionProps } from '@/types';

export default function JoinGameSection({
  showJoinInput,
  gameCode,
  joinError,
  isLoading,
  onShowJoinInput,
  onJoinGame,
  onJoinInputChange,
  onCancelJoin,
}: JoinGameSectionProps) {
  return (
    <div className="space-y-3">
      {!showJoinInput ? (
        <button
          onClick={onShowJoinInput}
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
              onChange={onJoinInputChange}
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
              onClick={onJoinGame}
              disabled={isLoading || !gameCode.trim()}
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Join
            </button>
            <button
              onClick={onCancelJoin}
              className="px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 