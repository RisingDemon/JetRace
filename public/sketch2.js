// import io from "socket.io-client";

let gimg;
let bimg;
let screenX = 1066;
let screenY = 600;
let bullets = [];
let spaceShips = [];
let interval, timeLine;
let result;
let socket;
const score = document.querySelector("#score1");

let yourName;

let xLineStart = screenX / 2,
  yLineStart = 0,
  xLineEnd = screenX / 2,
  yLineEnd = 600; //co-ordinates for line (x1,y1 and x2,y2) starting and ending points

let mx = screenX / 2;
let xposInitial, yposInitial;

let score1 = 0;
let score2 = 0;
let i,
  arrNo,
  shipNo2,
  check,
  triggerPoint = 0,
  newBullet;

function preload() {
  bimg = loadImage("./assets/fighter-jet.png"); //bluee
  gimg = loadImage("./assets/aircraft.png"); //green
}

function setup() {
  socket = io("https://jetrace.onrender.com");
  socket.on("connectServer", (arg) => {
    console.log("connected");
    console.log(arg);
  });
  socket.emit("Howdy", "Hello from client");

  frameRate(24);

  socket.on("bullet", (data) => {
    newBullet = data;
    // console.log(newBullet);
    if (newBullet) {
      // console.log(newBullet);
      console.log(bullets);
      console.log("newBullet pushed");
      bullets.push(newBullet);
    }
  });

  createCanvas(screenX, screenY);

  socket.on("allLocations", (data) => {
    spaceShips = data;
    console.log(spaceShips);
    if (spaceShips[0].name == yourName.value()) {
      arrNo = 0;
      shipNo2 = 1;
    } else {
      arrNo = 1;
      shipNo2 = 0;
    }
    xposInitial = spaceShips[arrNo].x;
    yposInitial = spaceShips[arrNo].y;

    timeLine = setInterval(timeFun, 1000);
    displayShip();
    // button.mousePressed(displayShip);
  });


  socket.on("updatedScore", (data) => {

    console.log(data);
    // spaceShips = data.spaceShips;
    score1 = data[0].score;
    score2 = data[1].score;
  });
  socket.on("winner", (arg) => {
    result = arg;
    console.log(result);
    alert(" TIME OVER!!! ," + result, +"to restart press Enter key");
    location.reload();
  });

  socket.on("playerLeft", (arg) => {
    alert("Player Left");
    // location.reload();
    waitForPeople();
  });

  startScreen();
}

function startScreen() {
  background(60);
  yourName = createInput("Your Name!").attribute("maxlength", 10);
  yourName.position(width / 2 - 75, height / 2 - 60);
  yourName.size(150, 20);

  let button = createButton("Submit");
  button.position(width / 2 - 50, height / 2 - 10);
  button.size(100, 20);
  button.style("cursor: pointer");
  // button.mousePressed(waitForPeople);
  button.mousePressed(joinGame);
}

function joinGame() {
  var data = {
    name: yourName.value(),
  };
  socket.emit("selfLocation", data);
  waitForPeople();
}

function waitForPeople() {
  removeElements();
  background(60);
  let divWaiting = createDiv("");
  divWaiting.html("Waiting for Someone to Join...");
  divWaiting.position(screenX / 2, screenY / 2);
  divWaiting.style("font-size", "36px");
  divWaiting.style("color", "black");
  console.log("waiting");

}

function updatePos(x, y) {
  var data = {
    socketId: socket.id,
    room: spaceShips[arrNo].room,
    name: yourName.value(),
    x: x,
    y: y,
  };
  // console.log(data);
  socket.emit("updateLocation", data);
}

function updateScore(score) {
  var data = {
    socketId: socket.id,
    room: spaceShips[arrNo].room,
    name: yourName.value(),
    score: score,
  };
  console.log(data);
  socket.emit("updateScore", data);
}

function displayShip() {
  // removeElements();
  background(200);
  push();
  imageMode(CENTER);
  image(bimg, spaceShips[0].x, spaceShips[0].y, 50, 50);
  pop();

  push();
  imageMode(CENTER);
  image(gimg, spaceShips[1].x, spaceShips[1].y, 50, 50);
  pop();

  let div1 = createDiv("");
  let div2 = createDiv("");
  div1.position(200, 10);
  div1.style("font-size", "40px");
  div1.style("color", "black");
  div1.html(score1);
  div2.position(screenX + 250, 10);
  div2.style("font-size", "40px");
  div2.style("color", "black");
  div2.html(score2);

  triggerPoint = 1;
}

// let bulletInterval = setInterval(displayBullet, 1000);

let bulSpeed = 4;

function displayBullet() {
  // console.log("displayBullet");

  for (i = 0; i < bullets.length; i++) {
    // console.log("in for loop");
    circle(bullets[i].bulX, bullets[i].bulY, 10);
    bullets[i].bulX = bullets[i].bulX + bulSpeed;
    circle(bullets[i].bulXl, bullets[i].bulYl, 10);
    bullets[i].bulXl = bullets[i].bulXl - bulSpeed;
    if (bullets[i].bulX > screenX || bullets[i].bulXl < 0) {
      bullets.splice(i, 1);
      continue;
    }
    if (
      dist(
        bullets[i].bulX,
        bullets[i].bulY,
        spaceShips[arrNo].x,
        spaceShips[arrNo].y
      ) < 21 ||
      dist(
        bullets[i].bulXl,
        bullets[i].bulYl,
        spaceShips[arrNo].x,
        spaceShips[arrNo].y
      ) < 21
    ) {
      //checks if the distance between the bullet and the plane1 is less than 21
      bullets.splice(i, 1);
      spaceShips[arrNo].x = xposInitial;
      spaceShips[arrNo].y = yposInitial;
      // console.log("collision");
      continue;
    }
  }
}

// function displayScore() {

// }

function draw() {
  background(200);

  if (triggerPoint) {
    removeElements();
    displayShip();
    displayBullet();
    // displayScore();
    push(); // line for timeline
    stroke(0);
    strokeWeight(4);
    line(xLineStart, yLineStart, xLineEnd, yLineEnd);
    pop();

    if (arrNo == 0) {
      // alert when space bar is pressed
      if (keyIsDown(32)) {
        alert("pause");
      }

      if (keyIsDown(65)) {
        if (spaceShips[arrNo].x < 50) {
          spaceShips[arrNo].x = 50;
        } else {
          spaceShips[arrNo].x -= 4;
        }
        updatePos(spaceShips[arrNo].x, spaceShips[arrNo].y);
      }

      if (keyIsDown(68)) {
        if (spaceShips[arrNo].x > screenX / 2 - 50) {
          spaceShips[arrNo].x = screenX / 2 - 50;
        } else {
          spaceShips[arrNo].x += 4;
        }
        updatePos(spaceShips[arrNo].x, spaceShips[arrNo].y);
      }
      if (keyIsDown(87)) {
        if (spaceShips[arrNo].y <= 0) {
          spaceShips[arrNo].y = screenY - 50;
          score1++;
          updateScore(score1);
        } else {
          spaceShips[arrNo].y -= 4;
        }
        updatePos(spaceShips[arrNo].x, spaceShips[arrNo].y);
      }
      if (keyIsDown(83)) {
        if (spaceShips[arrNo].y >= screenY - 50) {
          spaceShips[arrNo].y = screenY - 50;
        } else {
          spaceShips[arrNo].y += 4;
        }
        updatePos(spaceShips[arrNo].x, spaceShips[arrNo].y);
      }
    }
    if (arrNo == 1) {
      if (keyIsDown(32)) {
        alert("pause");
      }
      if (keyIsDown(65)) {
        if (spaceShips[arrNo].x < screenX / 2 + 50) {
          spaceShips[arrNo].x = screenX / 2 + 50;
        } else {
          spaceShips[arrNo].x -= 4;
        }
        updatePos(spaceShips[arrNo].x, spaceShips[arrNo].y);
      }

      if (keyIsDown(68)) {
        if (spaceShips[arrNo].x > screenX - 50) {
          spaceShips[arrNo].x = screenX - 50;
        } else {
          spaceShips[arrNo].x += 4;
        }
        updatePos(spaceShips[arrNo].x, spaceShips[arrNo].y);
      }
      if (keyIsDown(87)) {
        if (spaceShips[arrNo].y <= 0) {
          spaceShips[arrNo].y = screenY - 50;
          score2++;
          updateScore(score2);
        } else {
          spaceShips[arrNo].y -= 4;
        }
        updatePos(spaceShips[arrNo].x, spaceShips[arrNo].y);
      }
      if (keyIsDown(83)) {
        if (spaceShips[arrNo].y >= screenY - 50) {
          spaceShips[arrNo].y = screenY - 50;
        } else {
          spaceShips[arrNo].y += 4;
        }
        updatePos(spaceShips[arrNo].x, spaceShips[arrNo].y);
      }
    }

    socket.on("updatedLocation", (data) => {
      spaceShips = data;
    });
  }
}

function timeFun() {
  // decrease the line by 1 pixel for each second
  yLineStart = yLineStart + 20;
  if (yLineStart > 599) {
    bullets.splice(0, bullets.length);
    clearInterval(timeLine);
    let obj = "Game Over";
    socket.emit("finalScore", obj);
  }
  // console.log(yLineStart);
}
