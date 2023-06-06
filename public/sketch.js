let gimg;
let bimg;
let x = 1066;
let y = 600;
let bullets = [];
let interval, timeLine;
let xStart=x/2, yStart=0, xEnd=x/2, yEnd=600; //co-ordinates for line (x1,y1 and x2,y2) starting and ending points
function preload() {
  bimg = loadImage("./assets/fighter-jet.png"); //bluee
  gimg = loadImage("./assets/aircraft.png"); //green
}
function setup() {
  createCanvas(x, y);
  interval = setInterval(generateno, random(0, 1000));
  timeLine = setInterval(timeFun, 1000);
}
let mx = x / 2;
let xposInitial=x/4, yposInitial=y-50, x1posInitial=(3 * x) / 4, y1posInitial=y-50;
let xpos = xposInitial;
let ypos = yposInitial;
let x1pos = x1posInitial;
let y1pos = y1posInitial;

function draw() {
  background(200);

  push();// line for timeline
  stroke(0);
  strokeWeight(4);
  line(xStart, yStart, xEnd, yEnd);
  pop();

  push();
  imageMode(CENTER);
  image(bimg, xpos, ypos, 50, 50);
  pop();

  push();
  imageMode(CENTER);
  image(gimg, x1pos, y1pos, 50, 50);
  pop();


  if (xpos > x / 2 - 50) {
    xpos = x / 2 - 50;
  }
  if (xpos < 50) {
    xpos = 50;
  }

  if (x1pos > x - 50) {
    x1pos = x - 50;
  }
  if (x1pos < x / 2 + 50) {
    x1pos = x / 2 + 50;
  }

  if (ypos >= y - 50) {
    ypos = y - 50;
  }
  if (y1pos >= y - 50) {
    y1pos = y - 50;
  }

  if (ypos <= y - y) {
    ypos = y - 50;
  }
  if (y1pos <= y - y) {
    y1pos = y - 50;
  }

  let s = 4,
    bulSpeed = 4;

  if (keyIsDown(LEFT_ARROW)) {
    xpos -= s;
  }

  if (keyIsDown(RIGHT_ARROW)) {
    xpos += s;
  }
  if (keyIsDown(UP_ARROW)) {
    ypos -= s;
  }
  if (keyIsDown(DOWN_ARROW)) {
    ypos += s;
  }

  if (keyIsDown(65)) {
    x1pos -= s;
  }
  if (keyIsDown(68)) {
    x1pos += s;
  }
  if (keyIsDown(87)) {
    y1pos -= s;
  }
  if (keyIsDown(83)) {
    y1pos += s;
  }

  console.log("hello");
  for (let i = 0; i < bullets.length; i++) {
    circle(bullets[i].bulX, bullets[i].bulY, 10);
    bullets[i].bulX = bullets[i].bulX + bulSpeed;
    circle(bullets[i].bulXl, bullets[i].bulYl, 10);
    if (bullets[i].bulX > x - 50) { //removes the bullet from the array when it reaches the end of the canvas
      //   bullets.pop(bullets[i]);  pop is used to remove the last element of the array so can't be used here
      bullets.splice(i, 1); //removes the bullet from the array using splice
      continue;
    }
    bullets[i].bulXl = bullets[i].bulXl - bulSpeed;
    if (dist(bullets[i].bulX, bullets[i].bulY, xpos, ypos)<21||dist(bullets[i].bulXl, bullets[i].bulYl, xpos, ypos) < 21) { //checks if the distance between the bullet and the plane1 is less than 21
      bullets.splice(i, 1);
      xpos = xposInitial;
      ypos = yposInitial;
      console.log("collision");
      continue;
    }
    if (dist(bullets[i].bulX, bullets[i].bulY, x1pos, y1pos)<21||dist(bullets[i].bulXl, bullets[i].bulYl, x1pos, y1pos) < 21) { //checks if the distance between the bullet and the plane2 is less than 21
      bullets.splice(i, 1);
      x1pos = x1posInitial;
      y1pos = y1posInitial;
      console.log("collision");
      continue;
    }
    if (bullets[i].bulXl < 50) { //removes the bullet from the array when it reaches the end of the canvas
      bullets.splice(i, 1);
      continue;
    }
  }
}

function generateno() {
  let bullet = {
    bulX: 0,
    bulY: random(0, y - 150),
    bulXl: 1066,
    bulYl: random(0, y - 150),
  };

  // console.log(bullet.bulXl, bullet.bulYl);
  console.log("function called");
  bullets.push(bullet);
}

function mousePressed() {
  //mousePressed function removes the interval
  console.log("mouse clicked");
  clearInterval(interval);
}

function timeFun() {
  // decrease the line by 1 pixel for each second
  yStart=yStart+20;
  if(yStart>599){
    clearInterval(timeLine);
  }
  console.log(yStart);
}
