var playArea = document.getElementById("drawingCanvas");
var display = playArea.getContext("2d");

//
var ballRadius = 10;
var ballX = playArea.width / 2; //Setting initial horizontal ball location to center of the play area
var ballY = playArea.height - 30; //Setting initial vertical ball location to just above the paddle
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (playArea.width - paddleWidth) / 2;

var brickRowTotal = 7;
var brickColumnTotal = 3;
var brickWidth = 75;
var brickHeight = 20;

var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

//We'll set these in setup
var ballMoveX;
var ballMoveY;
var score;
var lives;
var bricks = []; //array that holds all the bricks
var playerWon = false;


document.addEventListener("mousemove", mouseMoveHandler, false);    //Adding a Listener for Mouse Movements
document.addEventListener("click", mouseClickHandler, false);       //Adding a Listener for Mouse Clicks

function setup() {
    //Reset some global game variables
    score = 0;
    lives = 1;
    ballX = playArea.width / 2; //Setting initial horizontal ball location to center of the play area
    ballY = playArea.height - 30; //Setting initial vertical ball location to just above the paddle
    ballMoveX = 3;
    ballMoveY = -3;
    playerWon = false;

    //Arrange and initialize the bricks
    for (currentColumn = 0; currentColumn < brickColumnTotal; currentColumn++) {
        bricks[currentColumn] = [];
        for (currentRow = 0; currentRow < brickRowTotal; currentRow++) {
            bricks[currentColumn][currentRow] = {x: 0, y: 0, alive: 1};
        }
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - playArea.offsetLeft;
    if (relativeX > 0 && relativeX < playArea.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function mouseClickHandler(e){
    setup();
}

function collisionDetection() {
    for (currentColumn = 0; currentColumn < brickColumnTotal; currentColumn++) {
        for (currentRow = 0; currentRow < brickRowTotal; currentRow++) {
            var brickToCheck = bricks[currentColumn][currentRow];
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
    if (score >= brickRowTotal * brickColumnTotal) {
        playerWon = true;
        drawYouWin();
    }
}

function drawBackground(){
    display.fillStyle = "#000000";
    display.fillRect(0, 0, playArea.width, playArea.height);

}

function drawBall() {
    display.beginPath();
    display.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    display.fillStyle = "#3DCB9A";
    display.fill();
    display.closePath();
}
function drawPaddle() {
    display.beginPath();
    display.rect(paddleX, playArea.height - paddleHeight, paddleWidth, paddleHeight);
    display.fillStyle = "#FFAC26";
    display.fill();
    display.closePath();
}
function drawBricks() {
    for (currentColumn = 0; currentColumn < brickColumnTotal; currentColumn++) {
        for (currentRow = 0; currentRow < brickRowTotal; currentRow++) {
            if (bricks[currentColumn][currentRow].alive == 1) {
                var brickX = (currentRow * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (currentColumn * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[currentColumn][currentRow].x = brickX;
                bricks[currentColumn][currentRow].y = brickY;
                display.beginPath();
                display.rect(brickX, brickY, brickWidth, brickHeight);
                display.fillStyle = "#0095DD";
                display.fill();
                display.closePath();
            }
        }
    }
}
function drawScore() {
    display.font = "16px sans-serif";
    display.fillStyle = "#FFFFFF";
    display.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    display.font = "16px sans-serif";
    display.fillStyle = "#CC3333";
    display.fillText("Lives: " + lives, playArea.width - 65, 20);
}

function drawYouLose(){
    var loseText = "GAME OVER :,(";
    display.font = "32px sans-serif";
    display.fillStyle = "#FF0000";
    var loseTextWidth = display.measureText(loseText).width;
    display.fillText(loseText, (playArea.width/2)-(loseTextWidth/2), playArea.height/2);


    var subtitleText = "Click to Restart";
    display.font = "16px sans-serif";
    display.fillStyle = "#FF0000";
    var subtitleWidth = display.measureText(subtitleText).width;
    display.fillText(subtitleText, (playArea.width/2)-(subtitleWidth/2), playArea.height/2+40);
}

function drawYouWin(){
    var winText = "YOU WIN!"
    display.font = "32px sans-serif";
    display.fillStyle = "#00FFFF";
    var winTextWidth = display.measureText(winText).width;
    display.fillText(winText, (playArea.width/2) - (winTextWidth/2), playArea.height/2);

    var subtitleText = "Click to Restart";
    display.font = "16px sans-serif";
    display.fillStyle = "#00FFFF";
    var subtitleWidth = display.measureText(subtitleText).width;
    display.fillText(subtitleText, (playArea.width/2)-(subtitleWidth/2), playArea.height/2+40);
}

function draw() {
    display.clearRect(0, 0, playArea.width, playArea.height);
    drawBackground();
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();

    if(lives > 0){ // Don't bother with any of this unless we have some lives left
        if(playerWon == false) { //Don't bother with any of this if the player has already won
            collisionDetection();
            if (ballX + ballMoveX > playArea.width - ballRadius || ballX + ballMoveX < ballRadius) {
                ballMoveX = -ballMoveX;
            }
            if (ballY + ballMoveY < ballRadius) {
                ballMoveY = -ballMoveY;
            }
            else if (ballY + ballMoveY > playArea.height - ballRadius) {
                if (ballX > paddleX && ballX < paddleX + paddleWidth) {
                    ballMoveY = -ballMoveY;
                }
                else {
                    lives--;
                    if (lives > 0) { //reset if we have some lives left
                        ballX = playArea.width / 2;
                        ballY = playArea.height - 30;
                        ballMoveX = 3;
                        ballMoveY = -3;
                        paddleX = (playArea.width - paddleWidth) / 2;
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