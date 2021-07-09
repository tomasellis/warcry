import { ArraySchema, type } from "@colyseus/schema";
import { TetrisBoard } from "./TetrisBoard";

export abstract class TetrisBlock extends TetrisBoard {
  @type("number")
  color: number;

  protected currentOrientation: number;
  abstract orientations: number[][];
  abstract rotate<Block extends TetrisBlock>(): Block;

  constructor() {
    super();
    this.currentOrientation = 0;
    this.color = 0xcccc00;
  }

  _rotate(orientation: number): void {
    this.currentOrientation = orientation;
    this.values = new ArraySchema<number>(
      ...this.orientations[this.currentOrientation]
    );
  }
}

const BLOCKS = [
  class O extends TetrisBlock {
    orientations = <number[][]>[[1, 1, 1, 1]];

    constructor() {
      super();
      this.rows = 2;
      this.cols = 2;
      this.values = new ArraySchema<number>(
        ...this.orientations[this.currentOrientation]
      );
      this.color = 0xcccc00;
    }

    rotate<Block extends TetrisBlock>(): Block {
      const newBlock = new O();
      const nextOrientation =
        (this.currentOrientation + 1) % this.orientations.length;
      newBlock._rotate(nextOrientation);
      return newBlock as Block;
    }
  },
];

export const getRandomBlock = () => {
  const _getRandomBlock = <T extends TetrisBlock>(type: { new (): T }): T => {
    return new type();
  };
  const nextBlock = BLOCKS[Math.floor(Math.random() * BLOCKS.length)];
  return _getRandomBlock(nextBlock);
};
