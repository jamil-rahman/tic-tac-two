import React from 'react'

export default function GameOptions({
  handleHostGame,
  handleJoinGame,
  isLoading,
}: {
  handleHostGame: () => void;
  handleJoinGame: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-4">
          <button
            onClick={handleHostGame}
            disabled={isLoading}
            className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-0.5 transition-all duration-300 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="relative rounded-[10px] bg-white dark:bg-gray-900 px-6 py-4 transition-all duration-300 group-hover:bg-transparent">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
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

          <button
            onClick={handleJoinGame}
            disabled={isLoading}
            className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 p-0.5 transition-all duration-300 hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>
  )
}
