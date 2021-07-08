import { Room, Client } from "colyseus";
import { Player } from "./schema/Player";
import { TetrisGameState } from "./schema/TetrisGameState";

export class TetrisGame extends Room<TetrisGameState> {
  onCreate(options: any) {
    this.setState(new TetrisGameState());
    this.broadcast("devInfo", this.state);
  }

  onJoin(client: Client, options: any) {
    this.state.players.set(client.sessionId, new Player());
    this.broadcast("devInfo", this.state);
    console.log(client.sessionId, "joined!");
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
    this.broadcast("playerLeft", client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
