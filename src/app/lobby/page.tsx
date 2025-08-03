'use client';

import { useLobbySocket } from '@/hooks/useLobbySocket';
import {
  RoomCodeSection,
  PlayerStatusSection,
  SymbolSelectionSection,
  StartGameButton,
  LobbyErrorDisplay,
} from '@/components/Lobby';

export default function Lobby() {
  const {
    roomId,
    isHost,
    hostSymbol,
    setHostSymbol,
    player1Connected,
    player2Connected,
    isLoading,
    error,
    canStartGame,
    handleStartGame,
    handleCopyRoomCode,
  } = useLobbySocket();

  // Show error if any
  if (error) {
    return <LobbyErrorDisplay error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Game Lobby
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {isHost ? 'Waiting for player to join...' : 'Connected to room'}
          </p>
        </div>

        {/* Room Code Section */}
        <RoomCodeSection roomId={roomId} onCopyRoomCode={handleCopyRoomCode} />

        {/* Player Status */}
        <PlayerStatusSection 
          player1Connected={player1Connected} 
          player2Connected={player2Connected} 
        />

        {/* Symbol Selection (Host Only) */}
        {isHost && (
          <SymbolSelectionSection 
            hostSymbol={hostSymbol} 
            onSymbolChange={setHostSymbol} 
          />
        )}

        {/* Start Game Button */}
        <StartGameButton 
          canStartGame={canStartGame}
          isLoading={isLoading}
          onStartGame={handleStartGame}
        />
      </div>
    </div>
  );
}
