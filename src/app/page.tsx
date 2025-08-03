'use client';

import { useHomeNavigation } from '@/hooks/useHomeNavigation';
import { HeaderSection, HostGameButton, JoinGameSection, GameRules } from '@/components/Home';
import LoadingModal from '@/components/LoadingModal';

export default function Home() {
  const {
    isLoading,
    showJoinInput,
    gameCode,
    joinError,
    handleHostGame,
    handleJoinGame,
    handleJoinInputChange,
    handleShowJoinInput,
    handleCancelJoin,
  } = useHomeNavigation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <HeaderSection />

        {/* Game Options */}
        <div className="space-y-4">
          {/* Host Game Button */}
          <HostGameButton isLoading={isLoading} onHostGame={handleHostGame} />

          {/* Join Game Section */}
          <JoinGameSection
            showJoinInput={showJoinInput}
            gameCode={gameCode}
            joinError={joinError}
            isLoading={isLoading}
            onShowJoinInput={handleShowJoinInput}
            onJoinGame={handleJoinGame}
            onJoinInputChange={handleJoinInputChange}
            onCancelJoin={handleCancelJoin}
          />
        </div>

        {/* Features */}
        <GameRules />

        {/* Loading Overlay */}
        {isLoading && <LoadingModal message="Setting up game..." />}
      </div>
    </div>
  );
}
