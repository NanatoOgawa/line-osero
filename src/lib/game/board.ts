import { Board, Cell, Player, Move } from './types';

export class OseroBoard {
  private board: Board;
  private readonly size: number = 8;

  constructor() {
    this.board = this.initializeBoard();
  }

  private initializeBoard(): Board {
    const board: Board = Array(this.size).fill(null).map(() => Array(this.size).fill(null));
    // 初期配置
    board[3][3] = 'white';
    board[3][4] = 'black';
    board[4][3] = 'black';
    board[4][4] = 'white';
    return board;
  }

  public getBoard(): Board {
    return this.board;
  }

  public isValidMove(row: number, col: number, player: Player): boolean {
    if (row < 0 || row >= this.size || col < 0 || col >= this.size || this.board[row][col] !== null) {
      return false;
    }

    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    return directions.some(([dx, dy]) => this.wouldFlip(row, col, dx, dy, player));
  }

  private wouldFlip(row: number, col: number, dx: number, dy: number, player: Player): boolean {
    let x = row + dx;
    let y = col + dy;
    let hasOpponent = false;

    while (x >= 0 && x < this.size && y >= 0 && y < this.size) {
      if (this.board[x][y] === null) return false;
      if (this.board[x][y] === player) return hasOpponent;
      hasOpponent = true;
      x += dx;
      y += dy;
    }

    return false;
  }

  public makeMove(row: number, col: number, player: Player): boolean {
    if (!this.isValidMove(row, col, player)) {
      return false;
    }

    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    this.board[row][col] = player;
    directions.forEach(([dx, dy]) => {
      if (this.wouldFlip(row, col, dx, dy, player)) {
        this.flipStones(row, col, dx, dy, player);
      }
    });

    return true;
  }

  private flipStones(row: number, col: number, dx: number, dy: number, player: Player): void {
    let x = row + dx;
    let y = col + dy;

    while (this.board[x][y] !== player) {
      this.board[x][y] = player;
      x += dx;
      y += dy;
    }
  }

  public getValidMoves(player: Player): Move[] {
    const moves: Move[] = [];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.isValidMove(i, j, player)) {
          moves.push({ row: i, col: j });
        }
      }
    }
    return moves;
  }

  public getScore(): { black: number; white: number } {
    let black = 0;
    let white = 0;

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 'black') black++;
        if (this.board[i][j] === 'white') white++;
      }
    }

    return { black, white };
  }

  public isGameOver(): boolean {
    return this.getValidMoves('black').length === 0 && this.getValidMoves('white').length === 0;
  }

  public getWinner(): Player | null {
    if (!this.isGameOver()) return null;
    const { black, white } = this.getScore();
    if (black > white) return 'black';
    if (white > black) return 'white';
    return null;
  }
} 