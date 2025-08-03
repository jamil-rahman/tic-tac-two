'use client';

interface PlayerStatusSectionProps {
  player1Connected: boolean;
  player2Connected: boolean;
}

export default function PlayerStatusSection({ player1Connected, player2Connected }: PlayerStatusSectionProps) {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
        Players
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${player1Connected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="font-medium text-gray-900 dark:text-white">Host</span>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {player1Connected ? 'Connected' : 'Waiting...'}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${player2Connected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="font-medium text-gray-900 dark:text-white">Guest</span>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {player2Connected ? 'Connected' : 'Waiting...'}
          </span>
        </div>
      </div>
    </div>
  );
} 