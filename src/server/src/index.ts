import { Server } from "colyseus";
import { monitor } from "@colyseus/monitor";
import { MyRoom } from "./rooms/MyRoom";
/* Fix this imports */
const cors = require("cors");
const http = require("http");
const express = require("express");

const port = Number(process.env.PORT || 2567);
const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const gameServer = new Server({
  server,
});

// register your room handlers
gameServer.define("MyRoom", MyRoom);

// register colyseus monitor AFTER registering your room handlers
app.use("/colyseus", monitor());

gameServer.listen(port);
console.log(`⚔ Listening on ws://localhost:${port}`);
