'use client';

import { useRouter } from 'next/navigation';
import { GameOverModalProps } from '@/types';


export default function GameOverModal({ winner }: GameOverModalProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Game Over!
        </h1>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <p className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
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