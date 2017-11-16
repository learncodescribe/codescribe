var canvas = document.getElementById("drawingCanvas");
var ctx = canvas.getContext("2d");

//
var ballRadius = 10;
var ballX = canvas.width / 2; //Setting initial point to center
var ballY = canvas.height - 30; //Setting Initial point to just above the paddle
var ballMoveX = 2;
var ballMoveY = -2;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;

var brickRowCount = 7;
var brickColumnCount = 3;
var brickWidth = 75;
var brickHeight = 20;

var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;
var lives = 3;
var bricks = [];
var playerWon = false;


document.addEventListener("mousemove", mouseMoveHandler, false);    //Adding a Listener for Mouse Movements
document.addEventListener("click", mouseClickHandler, false);       //Adding a Listener for Mouse Clicks

function setup() {
    //Reset some global game variables
    score = 0;
    lives = 3;
    ballX = canvas.width / 2; //Setting initial point to center
    ballY = canvas.height - 30; //Setting Initial point to just above the paddle
    ballMoveX = 3;
    ballMoveY = -3;
    playerWon = false;

    //Arrange and initialize the bricks
    for (column = 0; column < brickColumnCount; column++) {
        bricks[column] = [];
        for (row = 0; row < brickRowCount; row++) {
            bricks[column][row] = {x: 0, y: 0, alive: 1};
        }
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function mouseClickHandler(e){
    setup();
}

function collisionDetection() {
    for (column = 0; column < brickColumnCount; column++) {
        for (row = 0; row < brickRowCount; row++) {
            var brickToCheck = bricks[column][row];
            if (brickToCheck.alive == 1) {
                if (ballX > brickToCheck.x &&
                    ballX < brickToCheck.x + brickWidth &&
                    ballY > brickToCheck.y &&
                    ballY < brickToCheck.y + brickHeight) {
                    ballMoveY = -ballMoveY;
                    brickToCheck.alive = 0;
                    score++;
                    checkForWin();
                }
            }
        }
    }
}

function checkForWin(){
    if (score >= brickRowCount * brickColumnCount) {
        playerWon = true;
        drawYouWin();
    }
}

function drawBackground(){
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#3DCB9A";
    ctx.fill();
    ctx.closePath();
}
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#FFAC26";
    ctx.fill();
    ctx.closePath();
}
function drawBricks() {
    for (column = 0; column < brickColumnCount; column++) {
        for (row = 0; row < brickRowCount; row++) {
            if (bricks[column][row].alive == 1) {
                var brickX = (row * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (column * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[column][row].x = brickX;
                bricks[column][row].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
function drawScore() {
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#CC3333";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawYouLose(){
    var loseText = "GAME OVER :,(";
    ctx.font = "32px sans-serif";
    ctx.fillStyle = "#FF0000";
    var loseTextWidth = ctx.measureText(loseText).width;
    ctx.fillText(loseText, (canvas.width/2)-(loseTextWidth/2), canvas.height/2);


    var subtitleText = "Click to Restart";
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#FF0000";
    var subtitleWidth = ctx.measureText(subtitleText).width;
    ctx.fillText(subtitleText, (canvas.width/2)-(subtitleWidth/2), canvas.height/2+40);
}

function drawYouWin(){
    var winText = "YOU WIN!"
    ctx.font = "32px sans-serif";
    ctx.fillStyle = "#00FFFF";
    var winTextWidth = ctx.measureText(winText).width;
    ctx.fillText(winText, (canvas.width/2) - (winTextWidth/2), canvas.height/2);

    var subtitleText = "Click to Restart";
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#00FFFF";
    var subtitleWidth = ctx.measureText(subtitleText).width;
    ctx.fillText(subtitleText, (canvas.width/2)-(subtitleWidth/2), canvas.height/2+40);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();

    if(lives > 0){ // Don't bother with any of this unless we have some lives left
        if(playerWon == false) { //Don't bother with any of this if the player has already won
            collisionDetection();
            if (ballX + ballMoveX > canvas.width - ballRadius || ballX + ballMoveX < ballRadius) {
                ballMoveX = -ballMoveX;
            }
            if (ballY + ballMoveY < ballRadius) {
                ballMoveY = -ballMoveY;
            }
            else if (ballY + ballMoveY > canvas.height - ballRadius) {
                if (ballX > paddleX && ballX < paddleX + paddleWidth) {
                    ballMoveY = -ballMoveY;
                }
                else {
                    lives--;
                    if (lives > 0) { //reset if we have some lives left
                        ballX = canvas.width / 2;
                        ballY = canvas.height - 30;
                        ballMoveX = 3;
                        ballMoveY = -3;
                        paddleX = (canvas.width - paddleWidth) / 2;
                    }
                }
            }

            ballX += ballMoveX;
            ballY += ballMoveY;
        }
    }
    else{
            drawYouLose();
    }
    checkForWin();
    requestAnimationFrame(draw);
}

setup();

draw();