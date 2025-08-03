'use client';

import React, { useState } from 'react';
import { GameBoardProps } from '@/types';

export default function GameBoard({ 
  board, 
  onCellClick, 
  currentPlayer = 'X',
  isGameActive = true 
}: GameBoardProps) {
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);

  const renderCell = (value: string | null, index: number) => {
    const isHovered = hoveredCell === index;
    const isEmpty = value === null;
    const isClickable = isEmpty && isGameActive;

    return (
      <div
        key={index}
        className={`
          relative w-full h-full aspect-square rounded-2xl
          ${isClickable 
            ? 'cursor-pointer transform transition-all duration-200 hover:scale-105' 
            : 'cursor-default'
          }
          ${isEmpty 
            ? 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800' 
            : 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-600 dark:to-gray-700'
          }
          shadow-lg hover:shadow-xl
          ${isHovered && isClickable 
            ? 'shadow-2xl ring-2 ring-blue-400/50 dark:ring-blue-300/50' 
            : ''
          }
          border border-gray-200/50 dark:border-gray-600/50
        `}
        onClick={() => isClickable && onCellClick(index)}
        onMouseEnter={() => setHoveredCell(index)}
        onMouseLeave={() => setHoveredCell(null)}
      >
        {/* 3D Effect Layers */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tl from-black/5 to-transparent pointer-events-none" />
        
        {/* Cell Content */}
        <div className="relative w-full h-full flex items-center justify-center">
          {value ? (
            <div className={`
              text-6xl md:text-7xl font-bold select-none
              ${value === 'X' 
                ? 'text-red-500 drop-shadow-lg' 
                : 'text-blue-500 drop-shadow-lg'
              }
              transform transition-all duration-300
              ${isHovered ? 'scale-110' : 'scale-100'}
            `}>
              {value}
            </div>
          ) : (
            isClickable && isHovered && (
              <div className={`
                text-4xl md:text-5xl font-bold opacity-30
                ${currentPlayer === 'X' ? 'text-red-400' : 'text-blue-400'}
                transform transition-all duration-200
              `}>
                {currentPlayer}
              </div>
            )
          )}
        </div>

        {/* Hover Glow Effect */}
        {isHovered && isClickable && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/10 to-purple-400/10 animate-pulse pointer-events-none" />
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      {/* Board Container with 3D Effect */}
      <div className="relative">
        {/* Background Shadow */}
        <div className="absolute inset-4 bg-gradient-to-br from-gray-400/20 to-gray-600/20 dark:from-gray-600/20 dark:to-gray-800/20 rounded-3xl blur-xl" />
        
        {/* Main Board */}
        <div className="relative bg-gradient-to-br from-gray-200/80 to-gray-300/80 dark:from-gray-700/80 dark:to-gray-800/80 backdrop-blur-sm rounded-3xl p-4 shadow-2xl border border-white/20 dark:border-gray-600/20">
          
          {/* Grid Container */}
          <div className="grid grid-cols-3 gap-3 w-full aspect-square">
            {board.map((cell, index) => renderCell(cell, index))}
          </div>
          
          {/* Board Border Glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none" />
        </div>
      </div>

      {/* Current Player Indicator */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-3 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-600/20 shadow-lg">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Current Player:
          </span>
          <div className={`
            w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg
            ${currentPlayer === 'X' 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-blue-500 text-white shadow-lg'
            }
          `}>
            {currentPlayer}
          </div>
        </div>
      </div>
    </div>
  );
}
