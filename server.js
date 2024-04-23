import express from "express";
import http from "http";
import createGame from "./public/game.js";
import socketio from "socket.io";

const app = express();
const server = http.createServer(app);
const sockets = socketio(server);
const port = 3000;

app.use(express.static("public"));

const game = createGame();
game.start()

//console.log(game.state);

game.subscribe((command) => {
  console.log(`> Emitting ${command.type}`);
  sockets.emit(command.type, command);
});

sockets.on("connection", (socket) => {
  const playerId = socket.id;
  console.log(`New player connected! id=${playerId}`);
  game.addPlayer({ playerId: playerId });

  socket.emit("setup", game.state);

  socket.on("disconnect", () => {
    game.removePlayer({ playerId: playerId });
    console.log(`Player disconnected! id=${playerId}`);
  });
  socket.on("move-player", (command) => {
    command.playerId = playerId;
    command.type = "move-player";
    game.moverPlayer(command);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
