import { Schema, type } from "@colyseus/schema";
import { Position } from "./Position";

export class Piece extends Schema {
  @type(Position) position: Position;

  constructor(row: number, col: number) {
    super();
    this.position = new Position(row, col);
  }
}
