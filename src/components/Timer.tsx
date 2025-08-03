'use client';

import React, { useEffect, useState } from 'react';
import { TimerProps } from '@/types';

export default function Timer({ duration, isActive, onTimeUp, currentPlayer }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, duration, onTimeUp]);

  // Reset timer when duration changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  if (!isActive) {
    return null;
  }

  const isCritical = timeLeft <= 1;

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
      <div className={`
        px-6 py-3 rounded-full backdrop-blur-md border shadow-lg
        ${isCritical 
          ? 'bg-gradient-to-r from-red-500/90 to-red-600/90 border-red-400/50' 
          : 'bg-gradient-to-r from-blue-500/90 to-purple-500/90 border-blue-400/50'
        }
      `}>
        <div className="text-white font-medium text-center">
          You have <span className="font-bold">{timeLeft}</span> second{timeLeft !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
