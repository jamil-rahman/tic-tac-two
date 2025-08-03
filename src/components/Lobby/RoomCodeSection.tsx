'use client';

interface RoomCodeSectionProps {
  roomId: string;
  onCopyRoomCode: () => void;
}

export default function RoomCodeSection({ roomId, onCopyRoomCode }: RoomCodeSectionProps) {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Room Code
        </h3>
        <div className="flex items-center justify-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-mono text-2xl font-bold px-6 py-3 rounded-xl tracking-widest">
            {roomId}
          </div>
          <button
            onClick={onCopyRoomCode}
            className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Copy room code"
          >
            📋
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Share this code with your friend to join the game
        </p>
      </div>
    </div>
  );
} 