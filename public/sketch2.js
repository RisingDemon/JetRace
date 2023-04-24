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
let xposInitial = screenX / 4,
yposInitial = screenY - 50,
x1posInitial = (3 * screenX) / 4,
  y1posInitial = screenY - 50;
  
let xpos = xposInitial;
let ypos = yposInitial;
let x1pos = x1posInitial;
let y1pos = y1posInitial;

let score1 = 0;
let score2 = 0;

function preload() {
  bimg = loadImage("./assets/fighter-jet.png"); //bluee
  gimg = loadImage("./assets/aircraft.png"); //green
}

function setup() {
  socket= io('http://localhost:3000');
  socket.on("connectServer",(arg)=>{
      console.log("connected");
      console.log(arg);
  });
  socket.emit('Howdy',"Hello from client");

  createCanvas(screenX, screenY);
  timeLine = setInterval(timeFun, 1000);
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

function startScreen(){
  background(60);
  yourName = createInput('Your Name!').attribute('maxlength', 10);
	yourName.position(width/2 - 75, height/2 - 60);
	yourName.size(150, 20);

	let button = createButton('Submit');
	button.position(width/2 - 50, height/2 - 10);
	button.size(100, 20);
	button.style('cursor: pointer');
	button.mousePressed(waitForPeople);
}

function waitForPeople(){
  // var data = {
  //   name: yourName.value(),
  // }
  // socket.emit('selfLocation', data);
  background(60);
  fill(255);
  textAlign(CENTER);
  textSize(30);
  text('Waiting for other players...', width/2, height/2);

  let button = createButton("Lets go!");
	button.position(width/2 - 50, height/2 + 30);
	button.size(100, 20);
	button.style('cursor: pointer');
	button.mousePressed(gameStart);
}

function gameStart(){
  var data = {
    name: yourName.value(),
  }
  socket.emit('selfLocation', data);
  removeElements();
  background(60);
  socket.on('allLocations', (data)=>{
    console.log(data);
    spaceShips = data;
    console.log(spaceShips);
  });
}




// function draw() {
  // background(200);
  
  // push(); // line for timeline
  // stroke(0);
  // strokeWeight(4);
  // line(xLineStart, yLineStart, xLineEnd, yLineEnd);
  // pop();
  
  // push();
  // imageMode(CENTER);
  // image(bimg, xpos, ypos, 50, 50);
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

function mousePressed() {
  //mousePressed function removes the interval
  console.log("mouse clicked");
  // clearInterval(interval);
}

function timeFun() {
  // decrease the line by 1 pixel for each second
  yLineStart = yLineStart + 20;
  console.log(yLineStart);
  if (yLineStart > 599) {
    clearInterval(timeLine);
    clearInterval(bullets);
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
