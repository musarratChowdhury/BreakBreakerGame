// Global Area////////
let ctx;
let paddle;
let ball;
var bricks = [];
let hitbrick = [];
let score = 0;
let scoreText;
let level = 1;
let canvas_H = 500;
let canvas_W = 700;
let stage;
let deltaX;
let lives = 3;
let levelchange = false;
let round = 0;

let showingHoldScreen = true;
let showEndScreen = false;

let hitOnBrick = false;
const BALL_MAX_SPEED = 10;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const BRICKS_WIDTH = 60;
const BRICKS_HEIGHT = 30;

function GameAreaStart() {
  myObj.start();
  paddle = new rectDrawTool(
    canvas_W / 2 - 50,
    canvas_H - 50,
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    "./svg/paddle.jpg"
  );
  ball = new ballpainter(paddle.x, paddle.y, 10, "Tomato");

  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 3; j++) {
      if (j == 0) {
        bricks.push(
          new boxBuilder(
            10 + i * (BRICKS_WIDTH + 20),
            100 + j * (10 + BRICKS_HEIGHT),
            BRICKS_WIDTH,
            BRICKS_HEIGHT,
            "./svg/box2.svg"
          )
        );
      }
    }
  }
} //gameareastart//

let myObj = {
  canvas: document.getElementById("gg"),
  start: function () {
    this.canvas.width = canvas_W;
    this.canvas.height = canvas_H;
    this.context = this.canvas.getContext("2d");
    this.canvas.style.border = "2px solid"; //............adding some borders around the canvas!!
    // this.canvas.style.backgroundImage = "url(https://i.imgur.com/FO97ERO.jpg)";

    this.interval = setInterval(function () {
      updateGameArea();
    }, 1000 / 50);

    this.canvas.addEventListener("mousemove", function (evt) {
      //............Using the calculated mouse position
      var mousePos = calculateMousePos(evt);
      paddle.x = mousePos.x - 50;
    });
    this.canvas.addEventListener("click", function (evt) {
      showingHoldScreen = false;
    });
  },

  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function () {
    clearInterval(this.interval);
  },
};

function updateGameArea() {
  scoreText = new textBuilder(
    canvas_W / 2 - 50,
    40,
    "DarkBlue",
    "Score : " + score
  );
  levelBanner = new textBuilder(
    canvas_W - 130,
    40,
    "DarkBlue",
    "Level : " + level
  );
  if (showingHoldScreen) {
    //Holdin the ball on the paddle untill a mouse click is triggered!!
    if (lives < 1) {
      myObj.clear();
      endmsg = new textBuilder(
        canvas_W / 2 - 150,
        canvas_H / 2 - 20,
        "DarkBlue",
        "GameOver! Your Score : " + score
      );
      endmsg.draw();
      myObj.stop();
      return;
    }
    ball.xSpeed = 6;
    ball.ySpeed = 6;
    myObj.clear();
    scoreText.draw();
    levelBanner.draw();
    ball.draw();
    ball.livesDraw();
    ball.moveWithPaddle();
    paddle.draw();
    for (let i = 0; i < bricks.length; i++) {
      bricks[i].draw();
    }
    return;
  }

  if (levelchange) {
    round++;
    showingHoldScreen = true;
    if (round == 1) {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 3; j++) {
          if (i == j) {
            bricks.push(
              new boxBuilder(
                10 + i * (BRICKS_WIDTH + 20),
                100 + j * (10 + BRICKS_HEIGHT),
                BRICKS_WIDTH,
                BRICKS_HEIGHT,
                "./svg/box2.svg"
              )
            );
          }
        }
      }
      for (let i = 7; i > 0; i--) {
        for (let j = 0; j < 3; j++) {
          if (i == 4 || i == 6) {
            bricks.push(
              new boxBuilder(
                10 + i * (BRICKS_WIDTH + 20),
                100 + j * (10 + BRICKS_HEIGHT),
                BRICKS_WIDTH,
                BRICKS_HEIGHT,
                "./svg/box2.svg"
              )
            );
          }
        }
      }
    }

    if (round == 2) {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 3; j++) {
          if (i == 1 || i == 3 || i == 5) {
            bricks.push(
              new boxBuilder(
                10 + i * (BRICKS_WIDTH + 20),
                100 + j * (10 + BRICKS_HEIGHT),
                BRICKS_WIDTH,
                BRICKS_HEIGHT,
                "./svg/box2.svg"
              )
            );
          }
        }
      }
    }
    if (round == 3) {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if (i === j) {
            bricks.push(
              new boxBuilder(
                10 + i * (BRICKS_WIDTH + 20),
                100 + j * (10 + BRICKS_HEIGHT),
                BRICKS_WIDTH,
                BRICKS_HEIGHT,
                "./svg/box2.svg"
              )
            );
          }
          if (i === 7 - 1 - j) {
            bricks.push(
              new boxBuilder(
                10 + i * (BRICKS_WIDTH + 20),
                100 + j * (10 + BRICKS_HEIGHT),
                BRICKS_WIDTH,
                BRICKS_HEIGHT,
                "./svg/box2.svg"
              )
            );
          }
        }
      }
    }
    if (round == 4) {
      for (let i = 1; i < 7; i++) {
        for (let j = 6 - 1 - i; j <= 5; j++) {
          bricks.push(
            new boxBuilder(
              10 + i * (BRICKS_WIDTH + 20),
              100 + j * (10 + BRICKS_HEIGHT),
              BRICKS_WIDTH,
              BRICKS_HEIGHT,
              "./svg/box2.svg"
            )
          );
        }
      }
    }
    levelchange = false; //~Drawn the bricks///////////////////
  }

  myObj.clear();
  scoreText.draw();
  levelBanner.draw();
  ball.livesDraw();
  ball.draw();
  paddle.draw();
  ball.move();
  ball.chkCollsionWithWalls();
  ball.chkCollsionWithPaddle();

  //ReDrawing the bricks Every update game//

  for (let i = 0; i < bricks.length; i++) {
    bricks[i].draw();
  }
  //~Drawn the bricks///////////////////

  for (let i = 0; i < bricks.length; i++) {
    //////////////////checking collision with the bricks////////////////////

    if (ball.crashWith(bricks[i])) {
      bricks[i].image.src = "./svg/diamond.svg";
      bricks[i].flag++;
      if (bricks[i].flag > 1) {
        bricks.splice(i, 1);
        score += 100;
        i--;
        console.log(bricks.length);

        if (bricks.length < 1) {
          //checking if the length of the bricks array gets reduced to 0;///
          levelchange = true;
          level++;
        }
        // },10)
      }
      if (ball.up) {
        ball.up = false;
      } else {
        ball.up = true;
      }
    }
  }
  //Checking if the bricks have a collsion with the balll///
}

class rectDrawTool {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    let imge = new Image();
    this.image = imge;
    this.image.src = color;
  }
  draw() {
    ctx = myObj.context;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
  move() {
    this.x += 100;
  }
}

class ballpainter {
  constructor(x, y, rad, color) {
    this.x = x;
    this.y = y;
    this.rad = rad;
    this.color = color;
    this.up = true;
    this.right = true;
    this.xSpeed = 0;
    this.ySpeed = 0;
  }
  draw() {
    ctx = myObj.context;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI, true);
    ctx.fill();
  }
  move() {
    ///............normal movement of the ball.....................///
    if (ball.up) {
      ball.y -= ball.ySpeed;
    } else {
      ball.y += ball.ySpeed;
    }
    if (ball.right) {
      ball.x += ball.xSpeed;
    } else {
      ball.x -= ball.xSpeed;
    }
  }
  moveWithPaddle() {
    ball.x = paddle.x + PADDLE_WIDTH / 2;
    ball.y = paddle.y - ball.rad;
  }
  chkCollsionWithWalls() {
    //......................CHK COLLISON WITH THE WALLS....///
    if (ball.x + ball.rad >= myObj.canvas.width) {
      ball.x = myObj.canvas.width - ball.rad;
      ball.right = false;
    }
    if (ball.x - ball.rad <= 0) {
      ball.x = ball.rad;
      ball.right = true;
    }
    if (ball.y - ball.rad <= 0) {
      ball.y = ball.rad;
      ball.up = false;
    }
    if (ball.y + ball.rad >= myObj.canvas.height) {
      ///neeed to lose life here,,,,,,,,,,,,,,,,!!!!!!!
      // ball.y=myObj.canvas.height-ball.rad;
      // ball.up=true;
      ball.reset();
    }
  }
  chkCollsionWithPaddle() {
    ///...........................HIT THE PADDLE<<<<<<<<<<<<<<<<<<<<

    if (
      ball.y + ball.rad > paddle.y &&
      ball.y + ball.rad < paddle.y + PADDLE_HEIGHT
    ) {
      if (
        ball.x + ball.rad > paddle.x &&
        ball.x - ball.rad < paddle.x + PADDLE_WIDTH
      ) {
        let midPoint = paddle.x + PADDLE_WIDTH / 2;
        let startPoint = paddle.x;
        let endPoint = paddle.x + PADDLE_WIDTH;

        if (ball.x < midPoint) {
          ball.up = true;
          ball.right = false;

          console.log(ball.xSpeed);
          ball.xSpeed =
            BALL_MAX_SPEED -
            ((ball.x - startPoint) / (midPoint - startPoint)) * BALL_MAX_SPEED;
        }
        if (ball.x > midPoint) {
          ball.up = true;
          ball.right = true;

          console.log(ball.xSpeed);
          ball.xSpeed =
            BALL_MAX_SPEED -
            ((endPoint - ball.x) / (endPoint - midPoint)) * BALL_MAX_SPEED;
        }

        console.log("paddleHIT");
      }
    }
  }
  crashWith(otherobj) {
    var myleft = this.x - this.rad;
    var myright = this.x + this.rad;
    var mytop = this.y - this.rad;
    var mybottom = this.y + this.rad;
    var otherleft = otherobj.x;
    var otherright = otherobj.x + otherobj.width;
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + otherobj.height;
    var crash = true;
    if (
      mybottom < othertop ||
      mytop > otherbottom ||
      myright < otherleft ||
      myleft > otherright
    ) {
      crash = false;
    }
    return crash;
  }
  reset() {
    lives--;
    if (lives < 1) {
      showEndScreen = true;
    }
    ball.moveWithPaddle();
    showingHoldScreen = true;
  }
  livesDraw() {
    let ctx = myObj.context;
    ctx.font = "20px Arial";
    ctx.fillStyle = "DarkBlue";
    ctx.fillText("Lives : " + lives, 29, 39);
  }
}

class boxBuilder {
  constructor(x, y, width, height, filen) {
    let imag = new Image();
    this.image = imag;
    this.image.src = filen;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.flag = 0;
  }
  draw() {
    ctx = myObj.context;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
class textBuilder {
  constructor(x, y, color, text) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.text = text;
  }
  draw() {
    ctx = myObj.context;
    ctx.font = "20px Comic Sans MS";
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x, this.y);
  }
}

function calculateMousePos(evt) {
  //............................Calculating mouse position.................................
  var rect = myObj.canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
}
