'use client';

interface SymbolSelectionSectionProps {
  hostSymbol: 'X' | 'O';
  onSymbolChange: (symbol: 'X' | 'O') => void;
}

export default function SymbolSelectionSection({ hostSymbol, onSymbolChange }: SymbolSelectionSectionProps) {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
        Choose Your Symbol
      </h3>
      <div className="flex space-x-4">
        <button
          onClick={() => onSymbolChange('X')}
          className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${
            hostSymbol === 'X'
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
              : 'border-gray-200 dark:border-gray-600 hover:border-red-300'
          }`}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500 mb-2">X</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">You</div>
          </div>
        </button>
        <button
          onClick={() => onSymbolChange('O')}
          className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${
            hostSymbol === 'O'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
          }`}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">O</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">You</div>
          </div>
        </button>
      </div>
    </div>
  );
} 