'use client'
import GameBoard from '@/components/GameBoard'
// import PlayerCard from '@/components/PlayerCard'
import Timer from '@/components/Timer'
import React from 'react'

export default function page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* <PlayerCard player={{id: '1', name: 'John Doe', symbol: 'X', isHost: true, isConnected: true}} isWinner={false} />   */}
        <Timer duration={2} isActive={true} onTimeUp={() => {}} currentPlayer="X" />
        <GameBoard board={Array(9).fill(null)} onCellClick={() => {}} currentPlayer="X" isGameActive={true} />
      </div>
    </div>  
  )
}