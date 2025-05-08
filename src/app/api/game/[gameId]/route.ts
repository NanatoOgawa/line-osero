import { NextRequest, NextResponse } from 'next/server';
import { OseroBoard } from '@/lib/game/board';
import { CPUPlayer } from '@/lib/game/cpu';
import { GameState, GameMode, Difficulty } from '@/lib/game/types';

// メモリ内でゲーム状態を管理（本番環境ではデータベースを使用することを推奨）
const gameStates = new Map<string, GameState>();

export async function GET(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  const gameId = params.gameId;
  const gameState = gameStates.get(gameId);

  if (!gameState) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }

  return NextResponse.json(gameState);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  const gameId = params.gameId;
  const { mode, difficulty, row, col } = await request.json();

  let gameState = gameStates.get(gameId);

  if (!gameState) {
    // 新しいゲームを開始
    const board = new OseroBoard();
    gameState = {
      id: gameId,
      board: board.getBoard(),
      currentPlayer: 'black',
      mode: mode as GameMode,
      difficulty: difficulty as Difficulty,
      isGameOver: false,
      winner: null
    };
    gameStates.set(gameId, gameState);
  }

  // プレイヤーの手を処理
  const board = new OseroBoard();
  board.makeMove(row, col, gameState.currentPlayer);

  // CPUの手番の場合
  if (gameState.mode === 'cpu' && !board.isGameOver()) {
    const cpu = new CPUPlayer(gameState.difficulty);
    const cpuMove = cpu.makeMove(board, 'white');
    if (cpuMove) {
      board.makeMove(cpuMove.row, cpuMove.col, 'white');
    }
  }

  // ゲーム状態を更新
  gameState.board = board.getBoard();
  gameState.isGameOver = board.isGameOver();
  gameState.winner = board.getWinner();
  gameState.currentPlayer = gameState.currentPlayer === 'black' ? 'white' : 'black';

  return NextResponse.json(gameState);
} 