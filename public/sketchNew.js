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

// let xpos = xposInitial;
// let ypos = yposInitial;
// let x1pos = x1posInitial;
// let y1pos = y1posInitial;

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
  socket = io("http://localhost:3000");
  socket.on("connectServer", (arg) => {
    console.log("connected");
    console.log(arg);
  });
  socket.emit("Howdy", "Hello from client");

  socket.on("bullet", (data) => {
    // console.log(data);
    // alert("bullet");
    // bullets.push(data);
    newBullet = data;
    // console.log(bullets);
  });

  createCanvas(screenX, screenY);
  // timeLine = setInterval(timeFun, 1000);
  // socket.on("bullet",(arg)=>{
  //   console.log(arg);
  //   bullets.push(arg);
  //   console.log(bullets);
  // });

  // socket.on("winner",(arg)=>{
  //   result = arg;
  //   console.log(result);
  //   alert(" TIME OVER!!! ," + result, + "to restart press Enter key");
  // })
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
  // fill(255);
  // stroke(100, 255, 60);
  // strokeWeight(2);
  textAlign(CENTER);
  textSize(45);
  text("Waiting for Someone to Join...", width / 2, height / 2);
  console.log("waiting");

  socket.on("allLocations", (data) => {
    console.log(data);
    // let button = createButton("Lets go!");
    // button.position(width / 2 - 50, height / 2 + 30);
    // button.size(100, 20);
    // button.style("cursor: pointer");
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

    displayShip();
    // button.mousePressed(displayShip);
  });
}

function updatePos(x, y) {
  var data = {
    socketId: socket.id,
    room: spaceShips[arrNo].room,
    name: yourName.value(),
    x: x,
    y: y,
  };
  console.log(data);
  socket.emit("updateLocation", data);
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

  triggerPoint = 1;
}

// let bulletInterval = setInterval(displayBullet, 1000);

function displayBullet() {
  console.log("displayBullet");
  
  if (newBullet) {
    console.log(newBullet);
    console.log(bullets);
    bullets.push(newBullet);
  }
  let bulSpeed = 1;
  for (i = 0; i < bullets.length; i++) {
    console.log("in for loop");
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
      console.log("collision");
      continue;
    }
  }
}

function draw() {
  background(200);

  if (triggerPoint) {
    removeElements();
    displayShip();
    displayBullet();

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
// push(); // line for timeline
// stroke(0);
// strokeWeight(4);
// line(xLineStart, yLineStart, xLineEnd, yLineEnd);
// pop();

// push();
// imageMode(CENTER);
// image(bimg, spaceShips[arrNo].x, spaceShips[arrNo].y, 50, 50);
// pop();

// push();
// imageMode(CENTER);
// image(gimg, x1pos, y1pos, 50, 50);
// pop();

// if (yLineStart > 599) {
//   bullets.splice(0, bullets.length);
//   xpos = xposInitial;
//   x1pos = x1posInitial;
//   y1pos = y1posInitial;
//   ypos = yposInitial;
// }

// if (keyIsDown(13)) {
//   yLineStart = 0;
//   score1 = 0;
//   score2 = 0;
// }

// if (xpos > screenX / 2 - 50) {
//   xpos = screenX / 2 - 50;
// }
// if (xpos < 50) {
//   xpos = 50;
// }

// if (x1pos > screenX - 50) {
//   x1pos = screenX - 50;
// }
// if (x1pos < screenX / 2 + 50) {
//   x1pos = screenX / 2 + 50;
// }

// if (ypos >= screenY - 50) {
//   ypos = screenY - 50;
// }
// if (y1pos >= screenY - 50) {
//   y1pos = screenY - 50;
// }

// if (ypos <= screenY - screenY) {
//   ypos = screenY - 50;
//   while (yLineStart < 599) {
//     score1 = score1 + 1;
//     break;
//   }
// }
// if (y1pos <= screenY - screenY) {
//   y1pos = screenY - 50;
//   while (yLineStart < 599) {
//     score2 = score2 + 1;
//     break;
//   }
// }

// removeElements();
// let div1 = createDiv("");
// let div2 = createDiv("");
// div1.html(score1);
// div1.position(200, 10);
// div1.style("font-size", "40px");
// div1.style("color", "black");
// div2.html(score2);
// div2.position(screenX+250, 10);
// div2.style("font-size", "40px");
// div2.style("color", "black");

// let s = 4,
//   bulSpeed = 4;

// if (keyIsDown(65)) {
//   xpos -= s;
// }

// if (keyIsDown(68)) {
//   xpos += s;
// }
// if (keyIsDown(87)) {
//   ypos -= s;
// }
// if (keyIsDown(83)) {
//   ypos += s;
// }

// for (let i = 0; i < bullets.length; i++) {
//   circle(bullets[i].bulX, bullets[i].bulY, 10);
//   bullets[i].bulX = bullets[i].bulX + bulSpeed;

//   circle(bullets[i].bulXl, bullets[i].bulYl, 10);
//   if (bullets[i].bulX > x) {
//     //removes the bullet from the array when it reaches the end of the canvas
//     bullets.splice(i, 1); //removes the bullet from the array using splice
//     continue;
//   }
//   bullets[i].bulXl = bullets[i].bulXl - bulSpeed;
//   if (
//     dist(bullets[i].bulX, bullets[i].bulY, xpos, ypos) < 21 ||
//     dist(bullets[i].bulXl, bullets[i].bulYl, xpos, ypos) < 21
//   ) {
//     //checks if the distance between the bullet and the plane1 is less than 21
//     bullets.splice(i, 1);
//     xpos = xposInitial;
//     ypos = yposInitial;
//     console.log("collision");
//     continue;
//   }
//   if (
//     dist(bullets[i].bulX, bullets[i].bulY, x1pos, y1pos) < 21 ||
//     dist(bullets[i].bulXl, bullets[i].bulYl, x1pos, y1pos) < 21
//   ) {
//     //checks if the distance between the bullet and the plane2 is less than 21
//     bullets.splice(i, 1);
//     x1pos = x1posInitial;
//     y1pos = y1posInitial;
//     console.log("collision");
//     continue;
//   }
//   if (bullets[i].bulXl < 0) {
//     //removes the bullet from the array when it reaches the end of the canvas
//     bullets.splice(i, 1);
//     continue;
//   }
// }
// }

function timeFun() {
  // decrease the line by 1 pixel for each second
  yLineStart = yLineStart + 20;
  // console.log(yLineStart);
  if (yLineStart > 599) {
    clearInterval(timeLine);
    // clearInterval(bullets);
    var obj = { player1: score1, player2: score2 };
    console.log(obj);
    socket.emit("score", obj);

    // if (score1 > score2) {
    //   result = "winner is : blue";
    // } else if (score1 < score2) {
    //   result = "winner is :  green";
    // } else {
    //   result = " draw match ";
    // }
    // alert(" TIME OVER!!! ," + result, + "to restart press Enter key");
    // location.reload();
  }
  console.log(yLineStart);
}
