'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Lobby() {
    const [roomId, setRoomId] = useState<string>('');
    const [isHost, setIsHost] = useState<boolean>(false);
    const [hostSymbol, setHostSymbol] = useState<'X' | 'O'>('X');
    const [player1Connected, setPlayer1Connected] = useState<boolean>(false);
    const [player2Connected, setPlayer2Connected] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        // Get room info from sessionStorage
        const storedRoomId = sessionStorage.getItem('roomId');
        const storedIsHost = sessionStorage.getItem('isHost') === 'true';

        if (!storedRoomId) {
            router.push('/');
            return;
        }

        setRoomId(storedRoomId);
        setIsHost(storedIsHost);

        // Simulate player connection (will be replaced with Socket.IO)
        if (storedIsHost) {
            setPlayer1Connected(true);
            // Simulate second player joining after 2 seconds
            setTimeout(() => {
                setPlayer2Connected(true);
            }, 2000);
        } else {
            setPlayer2Connected(true);
        }
    }, [router]);

    const handleStartGame = () => {
        if (!player1Connected || !player2Connected) return;

        setIsLoading(true);
        sessionStorage.setItem('hostSymbol', hostSymbol);

        // Simulate game start delay
        setTimeout(() => {
            router.push('/game');
        }, 1000);
    };

    const handleCopyRoomCode = () => {
        navigator.clipboard.writeText(roomId);
    };

    const canStartGame = player1Connected && player2Connected;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Game Lobby
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Waiting for players to join...
                    </p>
                </div>

                {/* Room Code Section */}
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
                                onClick={handleCopyRoomCode}
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

                {/* Player Status */}
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

                {/* Symbol Selection (Host Only) */}
                {isHost && (
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                            Choose Your Symbol
                        </h3>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setHostSymbol('X')}
                                className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${hostSymbol === 'X'
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
                                onClick={() => setHostSymbol('O')}
                                className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${hostSymbol === 'O'
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
                )}

                {/* Start Game Button */}
                {canStartGame && (
                    <button
                        onClick={handleStartGame}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                    >
                        {isLoading ? 'Starting Game...' : 'Start Game'}
                    </button>
                )}

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
            </div>
        </div>
    );
}
