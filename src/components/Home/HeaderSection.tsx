'use client';

export default function HeaderSection() {
  return (
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
  );
} 