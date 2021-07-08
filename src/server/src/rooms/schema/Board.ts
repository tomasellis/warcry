import { ArraySchema, Schema, type } from "@colyseus/schema";

export class Board extends Schema {
  @type("number")
  rows: number;

  @type("number")
  cols: number;

  @type(["string"])
  colors: string[];

  constructor(rows: number, cols: number) {
    super();
    this.rows = rows;
    this.cols = cols;
    this.colors = new ArraySchema<string>(
      ...new Array<string>(rows * cols).fill("#fafafa")
    );
  }
}
