import { ArraySchema, Schema, type } from "@colyseus/schema";

export class TetrisBoard extends Schema {
  @type("number")
  rows: number;

  @type("number")
  cols: number;

  @type(["number"])
  values: number[];

  constructor(rows: number = 10, cols: number = 10) {
    super();
    this.rows = rows;
    this.cols = cols;
    this.values = new ArraySchema<number>(
      ...new Array<number>(rows * cols).fill(0)
    );
  }
}
