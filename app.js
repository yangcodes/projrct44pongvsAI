const canvasEl = document.querySelector("canvas");
const canvasContext = canvasEl.getContext("2d");

canvasEl.width = 1500;
canvasEl.height = 720;
// --------------------------------------------------------------------
let RIScore = new Audio();
let AIScore = new Audio();
let hit = new Audio();
let wall = new Audio();

hit.src = "sounds/hit.mp3";
wall.src = "sounds/wall.mp3";
AIScore = "sounds/AIScore.mp3";
RIScore = "sounds/RIScore.mp3";

//the RI player paddle
const playerPaddleRI = {
  xP: 0,
  yP: canvasEl.height / 2 - 100 / 2,
  height: 100,
  width: 10,
  color: "#d2e603",
  score: 0,
};

//the AI player paddle
const playerPaddleAI = {
  xP: canvasEl.width - 10,
  yP: canvasEl.height / 2 - 100 / 2,
  height: 100,
  width: 10,
  color: "orange",
  score: 0,
};

//creating the ball
const ball = {
  xP: canvasEl.width / 2,
  yP: canvasEl.height / 2,
  radius: 10,
  speed: 7,
  xV: 5,
  yV: 5,
  color: "white",
};

//creating the net
const net = {
  xP: canvasEl.width / 2 - 1,
  yP: 0,
  width: 2,
  height: 10,
  color: "white",
};

//drawing the canvas
function drawRect(xP, yP, width, height, color) {
  (canvasContext.fillStyle = color),
    canvasContext.fillRect(xP, yP, width, height);
}

//drawing the ball
function drawCircle(xP, yP, radius, color) {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(xP, yP, radius, 0, Math.PI * 2);
  canvasContext.fill();
}

//drawing the text
function drawText(content, xP, yP, color) {
  canvasContext.fillStyle = color;
  canvasContext.font = "35px sans-serif";
  canvasContext.fillText(content, xP, yP);
}

//drawing the net
function drawNet() {
  for (let i = 0; i < canvasEl.height; i += 15) {
    drawRect(net.xP, net.yP + i, net.width, net.height, net.color);
  }
}

//runGame function AKA the game loop
function runGame() {
  //clearing the canvas
  drawRect(0, 0, canvasEl.width, canvasEl.height, "#4683a0");

  //draw net function
  drawNet();

  //draw score function
  drawText(
    playerPaddleRI.score,
    (1 * canvasEl.width) / 4,
    (1 * canvasEl.height) / 10,
    "white"
  );

  drawText(
    playerPaddleAI.score,
    (3 * canvasEl.width) / 4,
    (1 * canvasEl.height) / 10,
    "white"
  );
  //drawing the paddles for RI and AI
  drawRect(
    playerPaddleRI.xP,
    playerPaddleRI.yP,
    playerPaddleRI.width,
    playerPaddleRI.height,
    playerPaddleRI.color
  );

  drawRect(
    playerPaddleAI.xP,
    playerPaddleAI.yP,
    playerPaddleAI.width,
    playerPaddleAI.height,
    playerPaddleAI.color
  );

  //draw the ball
  drawCircle(ball.xP, ball.yP, ball.radius, ball.color);
}

//the RI event listener
canvasEl.addEventListener("mousemove", movePaddle);
function movePaddle(e) {
  let canvasRect = canvasEl.getBoundingClientRect();
  playerPaddleRI.yP = e.clientY - canvasRect.top - playerPaddleRI.height / 2;
}

//the collision detection of paddles function
function paddleColliDete(ball, paddle) {
  ball.top = ball.yP - ball.radius;
  ball.bottom = ball.yP + ball.radius;
  ball.left = ball.xP - ball.radius;
  ball.right = ball.xP + ball.radius;

  paddle.top = paddle.yP;
  paddle.bottom = paddle.yp + paddle.height;
  paddle.left = paddle.xP;
  paddle.right = paddle.xP + paddle.width;

  return (
    ball.right > paddle.left &&
    ball.bottom > paddle.top &&
    ball.left < paddle.right &&
    ball.top < paddle.bottom
  );
}

//the everything manager function
function everythingManager() {
  //moving the ball by the amount of acceleration
  ball.xP += ball.xV;
  ball.yP += ball.yV;

  //creating the AI
  let intelligenceLevel = 0.1;
  playerPaddleAI.yP +=
    (ball.yP - (playerPaddleAI.yP + playerPaddleAI.height / 2)) *
    intelligenceLevel;
  //bouncing off the top and bottom walls
  if (ball.yP + ball.radius > canvasEl.height || ball.yP - ball.radius < 0) {
    ball.yV = -ball.yV;
    wall.play();
  }

  let player = ball.xP < canvasEl.width / 2 ? playerPaddleRI : playerPaddleAI;

  if (paddleColliDete(ball, player)) {
    hit.play();

    //when the ball hits the paddle of any player
    let collisionPoint = ball.yP - (player.yP + player.height / 2);

    //normalization -> converting -50&50 -> -1&1&0
    collisionPoint = collisionPoint / (player.height / 2);

    //calculating the angle at which the ball bounces back
    let bounceAngle = (collisionPoint * Math.PI) / 4;

    //calculating the dirtection of the ball when it bounces back
    let direction = ball.xP < canvasEl.width / 2 ? 1 : -1;

    //updating the velocity when the ball hits any paddle
    ball.xV = direction * ball.speed * Math.cos(bounceAngle);
    ball.yV = direction * ball.speed * Math.sin(bounceAngle);

    //after each bounce back, the speed of thr ball should be increased
    ball.speed += 0.1;
  }
}

//the game initialization function
function gameInit() {
  everythingManager();
  runGame();
}

//looping the game to keep it running
const FPS = 60;
setInterval(gameInit, 1000 / FPS);
