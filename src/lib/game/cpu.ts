import { OseroBoard } from './board';
import { Move, Player, Difficulty } from './types';

export class CPUPlayer {
  private difficulty: Difficulty;

  constructor(difficulty: Difficulty = 'normal') {
    this.difficulty = difficulty;
  }

  public makeMove(board: OseroBoard, player: Player): Move | null {
    const validMoves = board.getValidMoves(player);
    if (validMoves.length === 0) return null;

    switch (this.difficulty) {
      case 'easy':
        return this.makeEasyMove(validMoves);
      case 'normal':
        return this.makeNormalMove(board, validMoves, player);
      case 'hard':
        return this.makeHardMove(board, validMoves, player);
      default:
        return this.makeNormalMove(board, validMoves, player);
    }
  }

  private makeEasyMove(validMoves: Move[]): Move {
    // ランダムな手を選択
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }

  private makeNormalMove(board: OseroBoard, validMoves: Move[], player: Player): Move {
    // 評価関数を使用して最適な手を選択
    let bestScore = -Infinity;
    let bestMove = validMoves[0];

    for (const move of validMoves) {
      const score = this.evaluateMove(board, move, player);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  private makeHardMove(board: OseroBoard, validMoves: Move[], player: Player): Move {
    // ミニマックスアルゴリズムを使用して最適な手を選択
    let bestScore = -Infinity;
    let bestMove = validMoves[0];
    const depth = 4; // 探索の深さ

    for (const move of validMoves) {
      const score = this.minimax(board, move, depth, false, player);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  private evaluateMove(board: OseroBoard, move: Move, player: Player): number {
    const opponent = player === 'black' ? 'white' : 'black';
    let score = 0;

    // 角を優先
    if ((move.row === 0 || move.row === 7) && (move.col === 0 || move.col === 7)) {
      score += 100;
    }

    // 端を優先
    if (move.row === 0 || move.row === 7 || move.col === 0 || move.col === 7) {
      score += 10;
    }

    // 相手の有効手を減らす
    const tempBoard = new OseroBoard();
    tempBoard.makeMove(move.row, move.col, player);
    const opponentMoves = tempBoard.getValidMoves(opponent);
    score -= opponentMoves.length * 5;

    return score;
  }

  private minimax(board: OseroBoard, move: Move, depth: number, isMaximizing: boolean, player: Player): number {
    if (depth === 0) {
      return this.evaluateMove(board, move, player);
    }

    const opponent = player === 'black' ? 'white' : 'black';
    const currentPlayer = isMaximizing ? player : opponent;

    if (isMaximizing) {
      let maxScore = -Infinity;
      const validMoves = board.getValidMoves(currentPlayer);
      
      for (const nextMove of validMoves) {
        const score = this.minimax(board, nextMove, depth - 1, false, player);
        maxScore = Math.max(maxScore, score);
      }
      
      return maxScore;
    } else {
      let minScore = Infinity;
      const validMoves = board.getValidMoves(currentPlayer);
      
      for (const nextMove of validMoves) {
        const score = this.minimax(board, nextMove, depth - 1, true, player);
        minScore = Math.min(minScore, score);
      }
      
      return minScore;
    }
  }
} 