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
