import { MapSchema, Schema, type } from "@colyseus/schema";
import { Board } from "./Board";
import { Player } from "./Player";
export class TetrisGameState extends Schema {
  @type(Board)
  board: Board;

  @type({ map: Player })
  players: MapSchema<Player>;

  constructor(rows: number = 20, cols: number = 30) {
    super();
    this.players = new MapSchema<Player>();
    this.board = new Board(rows, cols);
  }
}
