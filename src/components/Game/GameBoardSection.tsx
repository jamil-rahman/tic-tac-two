'use client';

import GameBoard from '@/components/GameBoard';
import Timer from '@/components/Timer';
import { GameBoardSectionProps } from '@/types';

export default function GameBoardSection({
  board,
  currentPlayer,
  isGameActive,
  isMyTurn,
  timerActive,
  onCellClick,
  onTimeUp,
}: GameBoardSectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Timer */}
        {isGameActive && timerActive && (
          <Timer 
            duration={2} 
            isActive={timerActive && isMyTurn} 
            onTimeUp={onTimeUp} 
            currentPlayer={currentPlayer} 
          />
        )}

        {/* Game Board */}
        <GameBoard 
          board={board} 
          onCellClick={onCellClick} 
          currentPlayer={currentPlayer}
          isGameActive={isGameActive && isMyTurn}
        />
      </div>
    </div>
  );
} 