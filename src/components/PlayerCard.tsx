'use client';

import React from 'react';
import { Player } from '@/types';

interface PlayerCardProps {
  player: Player;
  isWinner?: boolean;
}

export default function PlayerCard({
  player,
  isWinner = false
}: PlayerCardProps) {
  const playerType = player.isHost ? 'Host' : 'Guest';
  const playerColor = player.symbol === 'X' ? 'red' : 'blue';

  return (
    <div className={`
      relative p-6 rounded-2xl backdrop-blur-md border-2 shadow-xl transition-all duration-300
      ${isWinner 
        ? 'bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border-yellow-400/50 shadow-2xl scale-105' 
        : 'bg-gradient-to-br from-white/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-700/80 border-gray-200/50 dark:border-gray-600/50'
      }
    `}>
      {/* Winner Badge */}
      {isWinner && (
        <div className="absolute -top-3 -right-3">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            🏆 WINNER
          </div>
        </div>
      )}

      {/* Player Content */}
      <div className="text-center">

        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {playerType}
        </h3>
      </div>

      {/* Background Glow Effect */}
      {isWinner && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/10 to-orange-500/10 pointer-events-none" />
      )}
    </div>
  );
}
