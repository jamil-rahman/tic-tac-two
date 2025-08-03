'use client';

interface LobbyErrorDisplayProps {
  error: string;
}

export default function LobbyErrorDisplay({ error }: LobbyErrorDisplayProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl">
        <p className="font-medium">Error: {error}</p>
        <p className="text-sm mt-2">Redirecting to home...</p>
      </div>
    </div>
  );
} 