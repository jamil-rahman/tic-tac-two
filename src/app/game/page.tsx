'use client';

import { useGameSocket } from '@/hooks/useGameSocket';
import { ErrorDisplay, GameOverModal, GameWaitingState, GameBoardSection } from '@/components/Game';

export default function Game() {
  const {
    board,
    currentPlayer,
    isGameActive,
    isMyTurn,
    winner,
    isGameOver,
    timerActive,
    error,
    handleCellClick,
    handleTimeUp,
  } = useGameSocket();

  // Show error if any
  if (error) {
    return <ErrorDisplay error={error} />;
  }

  // Show game over screen
  if (isGameOver && winner) {
    return <GameOverModal winner={winner} />;
  }

  // Show waiting state
  if (!isGameActive) {
    return <GameWaitingState />;
  }

  // Show active game
  return (
    <GameBoardSection
      board={board}
      currentPlayer={currentPlayer}
      isGameActive={isGameActive}
      isMyTurn={isMyTurn}
      timerActive={timerActive}
      onCellClick={handleCellClick}
      onTimeUp={handleTimeUp}
    />
  );
}