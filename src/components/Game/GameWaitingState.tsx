'use client';

export default function GameWaitingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Waiting for host to start the game...
          </p>
        </div>
      </div>
    </div>
  );
} 