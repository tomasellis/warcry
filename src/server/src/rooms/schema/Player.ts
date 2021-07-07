import { MapSchema, Schema, type } from "@colyseus/schema";
import { Piece } from "./Piece";

export class Player extends Schema {
  @type({ map: Piece }) pieces: MapSchema<Piece>;

  constructor() {
    super();
    this.pieces = new MapSchema<Piece>();
    for (let i = 0; i < 4; i++) {
      this.pieces.set(
        `${
          Math.floor(Math.random() * 100) +
          ["a", "b", "c"][Math.floor(Math.random() * 2)]
        }`,
        new Piece(50, 55)
      );
    }
  }
}
