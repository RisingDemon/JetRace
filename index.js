
import express from "express";
import { Server } from "socket.io";
const app = express();
app.use(express.static("public"));

const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Starting server at http://localhost:${port}`);
const io = new Server(server);

let spaceShips = [];
let xposInitial = 1066 / 4;
let yposInitial = 600 - 50;
let x1posInitial = (3 * 1066) / 4;
let y1posInitial = 600 - 50;
class ships {
  constructor(id, name, x, y) {
    this.id = id;
    this.name = name;
    this.x = x;
    this.y = y;
  }
}

setInterval(generateno, 10000);
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

io.on("connection", (socket) => {
  socket.emit("connectServer", "Hello from server");

  console.log("a user connected" + socket.id);
  socket.on("Howdy", (arg) => {
    console.log(arg);
  });

  socket.on("selfLocation", (arg) => {
    // check if there is any space ship in the array
    if (spaceShips.length == 0) {
      // create a new space ship
      let spaceShip = new ships(
        socket.id,
        arg.name,
        xposInitial,
        yposInitial
      );
      // add the space ship to the array
      spaceShips.push(spaceShip);
    }
    // check if there is any space ship in the array
    else if (spaceShips.length == 1) {
      let spaceShip = new ships(
        socket.id,
        arg.name,
        x1posInitial,
        y1posInitial
      );
      spaceShips.push(spaceShip);
    }

    console.log(arg);
    console.log(spaceShips);
    socket.emit("allLocations", spaceShips);
  });

  socket.on("score", (arg) => {
    console.log(arg);
    clearInterval(generateno);
    var serverScore1 = arg.player1;
    var serverScore2 = arg.player2;
    if (serverScore1 > serverScore2) {
      socket.emit("winner", "winner is: blue");
    } else if (serverScore1 < serverScore2) {
      socket.emit("winner", "winner is: green");
    } else {
      socket.emit("winner", "draw");
    }
  });
});
