import TileMap from "./TileMap.js";

const tileSize = 30;
const velocity = 2;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileMap = new TileMap(tileSize);
const pacman = tileMap.getPacman(velocity);
const enemies = tileMap.getEnemies(velocity);

let gameOver = false;
let gameWin = false;
let ateDots = false;
let addKey = false;
let lvl=1;
let clickPauseButton = false;
const gameOverSound = new Audio("sounds/gameOver.wav");
// const gameAteDots = new Audio("XXX");
const gameWinSound = new Audio("sounds/gameWin.wav");

// document.getElementById("restartButton").addEventListener("click", pauseButton);
document.getElementById("stopButton").addEventListener("click", pauseButton);

function gameLoop() {
  tileMap.draw(ctx, lvl);
  drawGameEnd();
  pacman.draw(ctx, pause(), enemies);
  enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));
  checkGameOver();
  checkEatDotS();
  showKey();
  checkEatKey();
  checkGameWin();
}

function pauseButton(){
  if(clickPauseButton){
    clickPauseButton=false;
    document.getElementById("stopButton").textContent="STOP";
  } else {
    clickPauseButton=true;
    document.getElementById("stopButton").textContent="START";
  }

}

function checkGameWin() {
  if (!gameWin) {
    gameWin = tileMap.didWin();
    if (gameWin) {
      gameWinSound.play();
    }
  }
}

function checkEatDotS(){
  if (!ateDots) {
    ateDots = tileMap.ateDots();
    // console.log(ateDots);
    // if (ateDots) {
    //   gameAteDots.play();
    // }
  }
}
function showKey(){
  if(ateDots && !addKey)
  {
    addKey=true;
    tileMap.showKey();
  }
}


function checkEatKey(){
  // console.log(tileMap.eatKey==true);
  if(addKey && tileMap.ateKey()){
   lvl++;
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
  return enemies.some( //sprawdza czy jakiś element z tablicy przechodzi warunek
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


tileMap.setCanvasSize(canvas);
setInterval(gameLoop, 1000 / 65);
