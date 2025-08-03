import React from 'react';

export default function GameRules() {
  return (
    <div className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-800/60 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-gray-700/30 shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl mb-3 shadow-lg">
          <span className="text-2xl">📋</span>
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
          Game Rules
        </h3>
      </div>
      
      <div className="space-y-4">
        <div className="group flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 hover:from-red-100 hover:to-red-200 dark:hover:from-red-900/30 dark:hover:to-red-800/30 transition-all duration-200">
          <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
            <span className="text-white font-bold text-lg">X</span>
          </div>
          <div className="flex-1">
            <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
              Classic Tic-Tac-Toe gameplay with a modern twist
            </p>
          </div>
        </div>

        <div className="group flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 transition-all duration-200">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
            <span className="text-white font-bold text-lg">O</span>
          </div>
          <div className="flex-1">
            <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
              Players take turns placing their marks (X or O) in a 3×3 grid
            </p>
          </div>
        </div>

        <div className="group flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:from-green-100 hover:to-green-200 dark:hover:from-green-900/30 dark:hover:to-green-800/30 transition-all duration-200">
          <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
            <span className="text-white text-lg">🏆</span>
          </div>
          <div className="flex-1">
            <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
              First player to get 3 marks in a row, column, or diagonal wins
            </p>
          </div>
        </div>

        <div className="group flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-900/30 dark:hover:to-purple-800/30 transition-all duration-200">
          <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
            <span className="text-white text-lg">⏱️</span>
          </div>
          <div className="flex-1">
            <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
              You have <span className="font-bold text-purple-600 dark:text-purple-400">2 seconds</span> to make your move! Think fast!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
