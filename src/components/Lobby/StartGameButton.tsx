'use client';

interface StartGameButtonProps {
  canStartGame: boolean;
  isLoading: boolean;
  onStartGame: () => void;
}

export default function StartGameButton({ canStartGame, isLoading, onStartGame }: StartGameButtonProps) {
  if (!canStartGame) return null;

  return (
    <>
      <button
        onClick={onStartGame}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
      >
        {isLoading ? 'Starting Game...' : 'Start Game'}
      </button>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700 dark:text-gray-300">Starting game...</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 