import express from "express";
import { Server } from "socket.io";
// import cors from "cors";
const app = express();
app.use(express.static("public"));
// app.use(cors());

// const port = process.env.PORT || 3000;
// const server = app.listen(port);
// console.log(`Starting server at http://localhost:${port}`);
// const io = new Server(server);

const port = process.env.PORT || 3000;
// const ipAddress = '127.0.0.1'; // Replace with the desired IP address
const server = app.listen(port);
// console.log(`Starting server at http://localhost:${port}`);
const io = new Server(server);

let spaceShips = [];
let xposInitial = 1066 / 4;
let yposInitial = 600 - 50;
let x1posInitial = (3 * 1066) / 4;
let y1posInitial = 600 - 50;
let score1 = 0,
  score2 = 0;
let genId;
class ships {
  constructor(id, room, name, x, y, score) {
    this.id = id;
    this.room = room;
    this.name = name;
    this.x = x;
    this.y = y;
    this.score = score;
  }
}

function generateno() {
  let bullet = {
    bulX: 0,
    bulY: Math.random() * 450,
    bulXl: 1066,
    bulYl: Math.random() * 450,
  };
  console.log(bullet);
  io.sockets.emit("bullet", bullet);
}

var room = 1;
var capacity = 0;

io.on("connection", (socket) => {
  socket.emit("connectServer", "Hello from server");

  console.log("a user connected" + socket.id);
  socket.on("Howdy", (arg) => {
    console.log(arg);
  });

  socket.on("selfLocation", (arg) => {
    // socket.join(room);
    // io.sockets
    // .in(room)
    // .emit("connectedRoom", "You are connected to room: " + room);
    // capacity++;
    // if (capacity == 2) {
    //   room++;
    //   capacity = 0;
    // }

    // check if there is any space ship in the array
    if (spaceShips.length == 0) {
      console.log("in if");
      // create a new space ship
      let spaceShip = new ships(
        socket.id,
        room,
        arg.name,
        xposInitial,
        yposInitial,
        score1
      );
      // add the space ship to the array
      spaceShips.push(spaceShip);
      socket.emit("initialPos", {
        id: spaceShip.id,
        x: spaceShip.x,
        y: spaceShip.y,
      });
    }
    // check if there is any space ship in the array
    else if (spaceShips.length == 1) {
      console.log("in else if");
      let spaceShip = new ships(
        socket.id,
        room,
        arg.name,
        x1posInitial,
        y1posInitial,
        score2
        );
        spaceShips.push(spaceShip);
        socket.emit("initialPos", {
          id: spaceShip.id,
          x: spaceShip.x,
          y: spaceShip.y,
        });
    }

    console.log(arg);
    console.log(spaceShips);
    if (spaceShips.length == 2) {
      console.log("2 players connected");
      io.emit("allLocations", spaceShips);
      genId= setInterval(generateno, 1000);
    }
  });

  socket.on("updateLocation", (arg) => {
    console.log(arg);
    for (let i = 0; i < spaceShips.length; i++) {
      if (spaceShips[i].id == socket.id) {
        spaceShips[i].x = arg.x;
        spaceShips[i].y = arg.y;
      }
    }
    socket.broadcast.emit("updatedLocation", spaceShips);
  });

  socket.on("finalScore", (arg) => {
    console.log(arg);
    clearInterval(genId);
    console.log(spaceShips);
    console.log(spaceShips[0]);
    var serverScore1 = spaceShips[0].score;
    var serverScore2 = spaceShips[1].score;
    for (let i = 0; i < spaceShips.length; i++) {
      if (spaceShips[i].id == socket.id) {
        spaceShips.splice(i, 1);
      }
    }
    if (serverScore1 > serverScore2) {
      io.emit(
        "winner",
        "Winner is: Blue..... BlueScore: " +
          serverScore1 +
          " GreenScore: " +
          serverScore2
      );
    } else if (serverScore1 < serverScore2) {
      io.emit(
        "winner",
        "Winner is: Green..... BlueScore: " +
          serverScore1 +
          " GreenScore: " +
          serverScore2
      );
    } else {
      io.emit(
        "winner",
        "Draw..... BlueScore: " + serverScore1 + " GreenScore: " + serverScore2
      );
    }
  });

  socket.on("updateScore", (arg) => {
    console.log("update score");
    console.log(arg);
    for (let i = 0; i < spaceShips.length; i++) {
      if (spaceShips[i].id == socket.id) {
        spaceShips[i].score = arg.score;
      }
    }
    io.emit("updatedScore", spaceShips);
    console.log(spaceShips);
  });

  socket.on("disconnect", function () {
    console.log("Disconnected: " + socket.id);
    for (var i = 0; i < spaceShips.length; i++) {
      if (socket.id == spaceShips[i].id) {
        spaceShips.splice(i, 1);
        break;
      }
    }
    socket.emit("playerLeft", "You have been disconnected");
  });

});
