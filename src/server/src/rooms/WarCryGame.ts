import { Room, Client } from "colyseus";
import { Player } from "./schema/Player";
import { WarCryGameState } from "./schema/WarCryGameState";

export class WarCryGame extends Room<WarCryGameState> {
  onCreate(options: any) {
    this.setState(new WarCryGameState(5, 5));
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
