import TileMap from "./TileMap.js";

const tileSize = 30;
const velocity = 2;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileMap = new TileMap(tileSize);

let pacman = tileMap.getPacman(velocity);
let enemies = tileMap.getEnemies(velocity);


let lvl=1;
let maxlvl=2;
let gameOver = false;
let gameWin = false;
let ateDots = false;
let addKey = false;
let ateKey = false;

let clickPauseButton = false;
const gameOverSound = new Audio("sounds/gameOver.wav");
// const gameAteDots = new Audio("XXX");
const gameWinSound = new Audio("sounds/gameWin.wav");

// document.getElementById("restartButton").addEventListener("click", pauseButton);
document.getElementById("stopButton").addEventListener("click", pauseButton);
document.getElementById("close-modal").addEventListener("click", resumeButton);

function gameLoop() {
  
  tileMap.draw(ctx,lvl);
  drawGameEnd();
  pacman.draw(ctx, pause(), enemies);
  enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));
  checkGameOver();
  checkEatDotS();
  showKey();
  checkEatKey();
  checkGameWin();
  checkGoNewLvl();
}

function resumeButton(){
  const modal = document.querySelector('#modal');
  const modalVisible = modal.style.display === 'flex';

  if (modalVisible) {
    modal.style.display = 'none';
  }
  if(clickPauseButton){
    clickPauseButton=false;
  } 
}

function pauseButton(){
  const modal = document.querySelector('#modal');
  const modalVisible = modal.style.display === 'flex';

  if (modalVisible) {
    modal.style.display = 'none';
  } else {
    modal.style.display = 'flex';
  }
  if(clickPauseButton){
    clickPauseButton=false;
  } else {
    clickPauseButton=true;
  }

}

function checkEatDotS(){
  if (!ateDots) {
    ateDots = tileMap.checkAteDots();
  }
}
function showKey(){
  if(ateDots && !addKey)
  {
    tileMap.showKey();
    addKey=true;
  }
}


function checkEatKey(){
  if(addKey && tileMap.ateKey()){
   ateDots=false;
   addKey=false;
   ateKey=true;
  }
}

function checkGameWin() {
  if(!gameWin){
    if(lvl==maxlvl && ateKey){
    gameWin=true;
    }
  }

  if(gameWin){
    gameWinSound.play();
  }
}

function checkGoNewLvl(){
  if(!gameWin && ateKey){
    lvl++;
    tileMap.changeMap(lvl);
    pacman = tileMap.getPacman(velocity);
    enemies = tileMap.getEnemies(velocity);
    tileMap.setCanvasSize(canvas);

    document.getElementById("lvl").innerHTML="Level "+lvl;
    ateKey=false;
  }
}


function checkGameOver() {
  if (!gameOver) {
    gameOver = isGameOver();
    if (gameOver) {
      gameOverSound.play();
    }
  }
}


function isGameOver() {
  return enemies.some(
    (enemy) => !pacman.powerDotActive && enemy.collideWith(pacman)
  );
}

function pause() {
  return !pacman.madeFirstMove || gameOver || gameWin || clickPauseButton;
}

function drawGameEnd() {
  if (gameOver || gameWin) {
    let text = " You Win!";
    if (gameOver) {
      text = "Game Over";
    }

    const x = canvas.width / 2;
    const y = canvas.height / 2;
    const fontSize = canvas.width < 600 ? 30 : 60;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#0ff";
    ctx.strokeText(text, x, y);
    
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "#0ff");
    gradient.addColorStop("0.5", "#0ff");
    gradient.addColorStop("0.5", "#fff");
    gradient.addColorStop("1.0", "#fff");
    
    ctx.fillStyle = gradient;
    ctx.fillText(text, x, y);
  }
}
function setMaxLvl(){
  maxlvl=tileMap.MaxLvl();
}

setMaxLvl();
tileMap.setCanvasSize(canvas);
setInterval(gameLoop, 1000 / 65);
