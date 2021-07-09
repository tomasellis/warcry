import { MapSchema, Schema, type } from "@colyseus/schema";
import { TetrisPlayer } from "./Tetris/TetrisPlayer";
import { TetrisBoard } from "./Tetris/TetrisBoard";
import { getRandomBlock, TetrisBlock } from "./Tetris/TetrisBlock";
import { Position } from "./Position";

export class TetrisGameState extends Schema {
  @type(TetrisBoard)
  board: TetrisBoard;

  @type(TetrisBlock)
  currentBlock: TetrisBlock;

  @type(Position)
  currentPosition: Position;

  @type(TetrisBlock)
  nextBlock: TetrisBlock;

  @type("number")
  clearedLines: number;

  @type("number")
  level: number;

  @type("number")
  totalPoints: number;

  constructor(rows: number = 20, cols: number = 10, initialLevel = 0) {
    super();
    this.board = new TetrisBoard(rows, cols);
    this.currentBlock = getRandomBlock();
    this.currentPosition = new Position(0, 5);
    this.nextBlock = getRandomBlock();
    this.level = initialLevel;
    this.clearedLines = 0;
    this.totalPoints = 0;
  }
}
