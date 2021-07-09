import { MapSchema, Schema, type } from "@colyseus/schema";
import { TetrisPlayer } from "./Tetris/TetrisPlayer";
import { TetrisBoard } from "./Tetris/TetrisBoard";

export class TetrisGameState extends Schema {
  @type(TetrisBoard)
  board: TetrisBoard;

  @type({ map: TetrisPlayer })
  players: MapSchema<TetrisPlayer>;

  constructor(rows: number = 20, cols: number = 8) {
    super();
    this.players = new MapSchema<TetrisPlayer>();
    this.board = new TetrisBoard(rows, cols);
  }
}
