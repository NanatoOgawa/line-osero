export type Player = 'black' | 'white';
export type Cell = Player | null;
export type Board = Cell[][];
export type GameMode = 'cpu' | 'vs';
export type Difficulty = 'easy' | 'normal' | 'hard';

export interface GameState {
  id: string;
  board: Board;
  currentPlayer: Player;
  mode: GameMode;
  difficulty?: Difficulty;
  isGameOver: boolean;
  winner: Player | null;
  lastMove?: {
    row: number;
    col: number;
  };
}

export interface Move {
  row: number;
  col: number;
} 