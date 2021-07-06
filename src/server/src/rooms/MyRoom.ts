import { Room, Client } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState";

interface Player {
  x: number;
  y: number;
  color: string;
}

export class MyRoom extends Room<MyRoomState> {
  players = new Map<string, Player>();
  colors = ["red", "blue", "yellow", "black", "green"];

  onCreate(options: any) {
    this.setState(new MyRoomState());
    this.onMessage("playerInput", (client, message) => {
      this.broadcast("playerInput", message, { except: client });
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    this.broadcast("newPlayer", {
      [client.sessionId]: {
        x: Math.floor(Math.random() * 10),
        y: Math.floor(Math.random() * 10),
        color: this.colors[Math.floor(Math.random() * 4)],
      },
    });
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.players.delete(client.sessionId);
    this.broadcast("playerLeft", client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
