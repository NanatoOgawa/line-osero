'use client';

import { useEffect, useState } from 'react';
import { GameState, Player } from '@/lib/game/types';

export default function GamePage({ params }: { params: { gameId: string } }) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [mode, setMode] = useState<'cpu' | 'vs'>('cpu');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameMode = urlParams.get('mode') as 'cpu' | 'vs';
    setMode(gameMode);
  }, []);

  const handleCellClick = async (row: number, col: number) => {
    if (!gameState || gameState.isGameOver) return;

    const response = await fetch(`/api/game/${params.gameId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode,
        difficulty: selectedDifficulty,
        row,
        col,
      }),
    });

    const updatedGameState = await response.json();
    setGameState(updatedGameState);
  };

  const renderCell = (cell: Player | null, row: number, col: number) => {
    const isBlack = cell === 'black';
    const isWhite = cell === 'white';
    const isValidMove = gameState && !gameState.isGameOver && 
      gameState.currentPlayer === 'black' && 
      gameState.board[row][col] === null;

    return (
      <div
        key={`${row}-${col}`}
        className={`w-12 h-12 border border-gray-300 flex items-center justify-center cursor-pointer
          ${isValidMove ? 'hover:bg-gray-100' : ''}
          ${isBlack ? 'bg-black' : ''}
          ${isWhite ? 'bg-white' : ''}`}
        onClick={() => handleCellClick(row, col)}
      >
        {isBlack && <div className="w-10 h-10 rounded-full bg-black" />}
        {isWhite && <div className="w-10 h-10 rounded-full bg-white border border-gray-300" />}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">オセロゲーム</h1>
          
          {mode === 'cpu' && !gameState && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">難易度を選択</h2>
              <div className="flex gap-2">
                <button
                  className={`px-4 py-2 rounded ${
                    selectedDifficulty === 'easy' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                  }`}
                  onClick={() => setSelectedDifficulty('easy')}
                >
                  易しい
                </button>
                <button
                  className={`px-4 py-2 rounded ${
                    selectedDifficulty === 'normal' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                  }`}
                  onClick={() => setSelectedDifficulty('normal')}
                >
                  普通
                </button>
                <button
                  className={`px-4 py-2 rounded ${
                    selectedDifficulty === 'hard' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                  }`}
                  onClick={() => setSelectedDifficulty('hard')}
                >
                  難しい
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-8 gap-0 bg-green-800 p-4 rounded-lg">
            {gameState?.board.map((row, rowIndex) =>
              row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))
            )}
          </div>

          {gameState && (
            <div className="mt-4">
              <p className="text-lg">
                現在の手番: {gameState.currentPlayer === 'black' ? '黒' : '白'}
              </p>
              {gameState.isGameOver && (
                <p className="text-xl font-bold mt-2">
                  {gameState.winner
                    ? `勝者: ${gameState.winner === 'black' ? '黒' : '白'}`
                    : '引き分け'}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 