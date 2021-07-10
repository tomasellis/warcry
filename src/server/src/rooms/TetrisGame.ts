import { Room, Client } from "colyseus";
import { TetrisBoard } from "./schema/Tetris/TetrisBoard";
import { TetrisPlayer } from "./schema/Tetris/TetrisPlayer";
import { TetrisGameState } from "./schema/TetrisGameState";

type JoinMessage = {
  board: TetrisBoard;
  client: string;
};

export class TetrisGame extends Room<TetrisGameState> {
  onCreate(options: any) {
    this.setState(new TetrisGameState(20, 10));
    this.broadcast("devInfo", this.state);
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    const joinMessage: JoinMessage = {
      board: this.state.board,
      client: client.sessionId,
    };
    this.broadcast("join", joinMessage);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    //this.state.players.delete(client.sessionId);
    this.broadcast("playerLeft", client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
