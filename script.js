//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//dino
let dinoWidth = 66;
let dinoHeight = 70.5;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg1;
let dinoImg2;
let dinoImg;

let dino = {
  x: dinoX,
  y: dinoY,
  width: dinoWidth,
  height: dinoHeight,
};

//track
let trackWidth = 750;
let trackHeight = 8;
let trackX = 0;
let trackY = boardHeight - trackHeight;
let trackImg;

let track = {
  x: trackX,
  y: trackY,
  width: trackWidth,
  height: trackHeight,
};

//cactus
let cactusArray = [];
let cactus1Width = 23;
let cactus2Width = 46;
let cactus3Width = 68;
let cactusHeight = 47;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;
let cactus1Img;
let cactus2Img;
let cactus3Img;

//clouds
let cloudsHeight = 101;
let cloudsWidth = 84;
let cloudsX = 700;
let cloudsY = 100;
let cloudsImg;
let cloudsArray = [cloudsX, cloudsY];

//birds
let birdImg1;
let birdImg2;
let birdHeight = 54;
let birdWidth = 65;
let birdX = 700;
let birdY = 300;
let birdArray = [];

//gameover and reset
let gameOverImg;
let gameOverHeight = 20;
let gameOverWidth = 193;
let gameOverX = 300;
let gameOverY = 100;

let resetImg;
let resetHeight = 40;
let resetWidth = 40;
let resetX = 380;
let resetY = 120;

//physics
let velocityX = -8; //cactus moving left speed
let cloudsVelocityX = -4; //clouds moving left speed
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

let dinoLeg = true;

window.onload = function () {
  board = document.getElementById("board");

  board.height = boardHeight;
  board.width = boardWidth;

  context = board.getContext("2d"); //used for drawing on the board

  dinoImg1 = new Image();
  dinoImg1.src = "./img/dino-run1.png";
  dinoImg2 = new Image();
  dinoImg2.src = "./img/dino-run2.png";
  dinoImg1.onload = function () {
    dinoImg = dinoLeg ? dinoImg1 : dinoImg2;
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
  };

  cactus1Img = new Image();
  cactus1Img.src = "./img/cactus1.png";

  cactus2Img = new Image();
  cactus2Img.src = "./img/cactus2.png";

  cactus3Img = new Image();
  cactus3Img.src = "./img/cactus3.png";

  requestAnimationFrame(update);
  setInterval(placeCactus, 1000); //1000 milliseconds = 1 second
  setInterval(updateDinoLegs, 100);
  setInterval(placeBirds, 8400);
  document.addEventListener("keydown", moveDino);
};

function updateDinoLegs() {
  dinoLeg = !dinoLeg;
}

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);
  //clouds
  cloudsImg = new Image();
  cloudsImg.src = "./img/cloud.png";
  for (let i = 0; i < cloudsArray.length; i++) {
    let cloud = cloudsArray[i];
    cloud.x += cloudsVelocityX;
    context.drawImage(cloudsImg, cloud.x, cloud.y, cloudsWidth, cloudsHeight);
  }

  //dino
  velocityY += gravity;
  dino.y = Math.min(dino.y + velocityY, dinoY); //apply gravity to current dino.y, making sure it doesn't exceed the ground
  dinoImg = dinoLeg ? dinoImg1 : dinoImg2;
  context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
  trackImg = new Image();
  trackImg.src = "./img/track1.png";
  context.drawImage(trackImg, track.x, track.y, track.width, track.height);

  //cactus
  for (let i = 0; i < cactusArray.length; i++) {
    let cactus = cactusArray[i];
    cactus.x += velocityX;
    context.drawImage(
      cactus.img,
      cactus.x,
      cactus.y,
      cactus.width,
      cactus.height
    );

    if (detectCollision(dino, cactus)) {
      wasted();
    }
  }

  //birds
  birdImg1 = new Image();
  birdImg1.src = "./img/bird1.png";

  birdImg2 = new Image();
  birdImg2.src = "./img/bird2.png";

  for (let i = 0; i < birdArray.length; i++) {
    let bird = birdArray[i];
    bird.x += velocityX;
    bird.img = dinoLeg ? birdImg1 : birdImg2;
    context.drawImage(bird.img, bird.x, bird.y, birdWidth, birdHeight);

    if (detectCollision(dino, bird)) {
      wasted();
    }
  }

  //score
  context.fillStyle = "black";
  context.font = "20px courier";
  score++;

  context.fillText(score, 5, 20);
}

function moveDino(e) {
  if (gameOver) {
    return;
  }

  if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
    //jump
    velocityY = -10;
  } else if (e.code == "ArrowDown" && dino.y == dinoY) {
    //duck
  }
}

function wasted(e) {
  gameOver = true;
  dinoImg.src = "./img/dino-dead.png";
  dinoImg.onload = function () {
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
  };
  gameOverImg = new Image();
  gameOverImg.src = "./img/game-over.png";
  gameOverImg.onload = function () {
    context.drawImage(
      gameOverImg,
      gameOverX,
      gameOverY,
      gameOverWidth,
      gameOverHeight
    );
  };
  resetImg = new Image();
  resetImg.src = "./img/reset.png";
  resetImg.onload = function () {
    context.drawImage(resetImg, resetX, resetY, resetWidth, resetHeight);
  };
  document.addEventListener("keydown", gameReset);
}

function gameReset(e) {

  gameOver = false;
  score = 0;
  dino.x = dinoX;
  dino.y = dinoY;
  velocityY = 0;
  cactusArray = [];
  birdArray = [];
  context.clearRect(0, 0, board.width, board.height);
  gameOverImg = null;
  resetImg = null;
  dinoImg.src = "./img/dino-run1.png";
  dinoImg.onload = function () {
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
  };
  dinoLeg=false;
  document.removeEventListener("keydown", gameReset);
  document.addEventListener("keydown", moveDino);
}

function placeCactus() {
  if (gameOver) {
    return;
  }

  //place cactus
  let cactus = {
    img: null,
    x: cactusX,
    y: cactusY,
    width: null,
    height: cactusHeight,
  };

  let placeCactusChance = Math.random(); //0 - 0.9999...

  if (placeCactusChance > 0.9) {
    //10% you get cactus3
    cactus.img = cactus3Img;
    cactus.width = cactus3Width;
    cactusArray.push(cactus);
  } else if (placeCactusChance > 0.7) {
    //30% you get cactus2
    cactus.img = cactus2Img;
    cactus.width = cactus2Width;
    cactusArray.push(cactus);
  } else if (placeCactusChance > 0.5) {
    //50% you get cactus1
    cactus.img = cactus1Img;
    cactus.width = cactus1Width;
    cactusArray.push(cactus);
  }

  cloudsArray.push({ x: cloudsX, y: parseInt(cloudsY * Math.random()) });

  if (cactusArray.length > 10) {
    cactusArray.shift(); //remove the first element from the array so that the array doesn't constantly grow
  }
}

function placeBirds() {
  if (gameOver) {
    return;
  }
  let bird = {
    img: null,
    x: birdX,
    y: Math.random() * (boardHeight - birdHeight),
    width: birdWidth,
    height: birdHeight,
  };

  birdArray.push(bird);

  if (birdArray.length > 10) {
    birdArray.shift(); //remove the first element from the array so that the array doesn't constantly grow
  }
}

function detectCollision(dino, obstacle) {
  return (
    dino.x < obstacle.x + obstacle.width && //dino's top left corner doesn't reach obstacle's top right corner
    dino.x + dino.width > obstacle.x && //dino's top right corner passes obstacle's top left corner
    dino.y < obstacle.y + obstacle.height && //dino's top left corner doesn't reach obstacle's bottom left corner
    dino.y + dino.height > obstacle.y
  ); //dino's bottom left corner passes obstacle's top left corner
}
