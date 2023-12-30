const highScoreElement = document.querySelector(".high-score");
const scoreElement = document.querySelector(".score");
const infoWindow = document.querySelector(".info-window")
const infoText = document.querySelector(".info-text");
const infoButton = document.querySelector(".info-button");
const gameBoard = document.querySelector(".game-board");
const menu = document.querySelector(".menubutton-container")
const pauseButton = document.querySelector(".pause");
const restartButton = document.querySelector(".restart");
const shareButton = document.querySelector(".share");



var score = 0;
var highScore = 0;
var state = "start";
var direction = "right";
var boardStyles = undefined;
var nColumns = undefined;
var nRows = undefined;
const gameDelay = 60;


function createGameObject(element, parent, position){
    var newDiv = document.createElement("div");
    newDiv.classList = element.classList;
    newDiv.style.display = "block";
    newDiv.style.gridColumn = position.x;
    newDiv.style.gridRow = position.y;
    parent.appendChild(newDiv);
}

function Snake(){
    this.snakeElement = document.querySelector(".snake-element");
    this.snakeBody = [{x: 25, y: 25},{x: 24, y: 25}];
    this.move = (direction, food) => {
        let newHeadLocation = JSON.parse(JSON.stringify(this.snakeBody))[0];
        switch(direction)
        {
            case "up":
                newHeadLocation.y -= 1;
                break;
            case "down":
                newHeadLocation.y += 1
                break;
            case "left":
                newHeadLocation.x -= 1;
                break;
            case "right":
                newHeadLocation.x += 1;
                break;
        }
        this.snakeBody.unshift(newHeadLocation);
        if (food.position.x != this.snakeBody[0].x || 
            food.position.y != this.snakeBody[0].y){
            this.snakeBody.pop();
        }
        else{
            let eatSound = new Audio("assets/sounds/eat-sound v2.wav")
            eatSound.play();
            score += 1;
            food.generateFood();
        }
    }
    this.render = () => {

        for (let i = 0; i < this.snakeBody.length; i++) {
            let snakePart = "snake-body";
            if (i === 0){
                snakePart = "snake-head";
            }
            else if(i === this.snakeBody.length - 1){
                snakePart = "snake-tail";
            }

            this.snakeElement.classList.add(snakePart);
            this.snakeElement.classList.add(direction);
            createGameObject(this.snakeElement, gameBoard, this.snakeBody[i]);
            this.snakeElement.classList.remove(snakePart);
            this.snakeElement.classList.remove(direction);
        }
    }
    this.collided = () => {
        if (this.snakeBody[0].x < 1 || 
            this.snakeBody[0].x > nColumns ||
            this.snakeBody[0].y < 1 ||
            this.snakeBody[0].y > nRows) {
                return true;
        }
        for (let i = 1; i < this.snakeBody.length; i++) {
            if (this.snakeBody[i].x === this.snakeBody[0].x &&
                this.snakeBody[i].y === this.snakeBody[0].y){
                return true;
            }
        }
        return false;
    }
};

function Food() {
    this.foodElement = document.querySelector(".food-element");
    this.position = {
        x : undefined, 
        y: undefined
    };
    this.render = () => {
        createGameObject(this.foodElement, gameBoard, this.position);
    }
    this.generateFood = () => {
        this.position.x = Math.floor(Math.random() * nColumns)  + 1;
        this.position.y = Math.floor(Math.random() * nRows)  + 1;
        
    }
}

function hideInfoWindow(){
    infoWindow.style.display = "none";
}

function showInfoWindow(infoTitle, infoButtonText){
    infoWindow.style.display = "flex";
    infoText.textContent = infoTitle;
    infoButton.textContent = infoButtonText;
}

function showGameBoard(){
    gameBoard.style.display = "grid";
}

function hideGameBoard(){
    gameBoard.style.display = "none";
}

infoButton.addEventListener("click", ()=>{
    let buttonPressSound = new Audio("assets/sounds/button-press.mp3");
    buttonPressSound.play();
    hideInfoWindow();
    showGameBoard();
    boardStyles = window.getComputedStyle(gameBoard);
    nColumns = boardStyles.gridTemplateColumns.split(' ').filter(value => value !== '0px').length;
    nRows = boardStyles.gridTemplateRows.split(' ').filter(value => value !== '0px').length;
    state = "play";
    Game();
});

function pauseGame(toggle=true) {
    if (state === "play")
    {
        state = "pause";
        pauseButton.innerHTML = '<svg class = "menu-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play" viewBox="0 0 16 16"><path d="M10.804 8 5 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696z"/></svg>';
    }
    else if (state === "pause" && toggle)
    {
        state = "play";
        pauseButton.innerHTML = '<svg class = "menu-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause" viewBox="0 0 16 16"><path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5"/></svg>';
    }
}

pauseButton.addEventListener("click", () => {
    let buttonPressSound = new Audio("assets/sounds/button-press.mp3");
    buttonPressSound.play();
    pauseGame(); 
});

shareButton.addEventListener("click",() => {
    let buttonPressSound = new Audio("assets/sounds/button-press.mp3");
    buttonPressSound.play();
    pauseGame(toggle=false);
    if (navigator.share) {
          navigator.share({
            title: document.title,
            url: window.location.href
          })
          .then(function() {
            console.log('Sharing successful');
          })
          .catch(function(error) {
            console.error('Error sharing:', error);
          });
      } else {
        console.warn('Web Share API is not supported in this browser');
      }
});

restartButton.addEventListener("click",() => {
    let buttonPressSound = new Audio("assets/sounds/button-press.mp3");
    buttonPressSound.play();
    state = "restart";
    score = 0;
    scoreElement.textContent = score;
    hideInfoWindow();
    showInfoWindow("Snake", "Play");
});

document.addEventListener("keydown", (event) => {
    if (state === "play") {
        switch(event.key){
            case "ArrowUp":
                if (direction != "down"){
                    direction = "up";
                }
                break;
            case "ArrowDown":
                if (direction != "up"){
                    direction = "down";
                }
                break;
            case "ArrowLeft":
                if (direction != "right"){
                    direction = "left";
                }
                break;
            case "ArrowRight":
                if (direction != "left"){
                    direction = "right";
                }
                break;
        }
    }
});

function Game(){
    score = 0;
    const snake = new Snake();
    const food = new Food();
    food.generateFood();
    var gameLoop = setInterval(() => {
        if(state === "play"){
            gameBoard.innerHTML = "";
            snake.move(direction, food);
            food.render();
            snake.render();
            scoreElement.textContent = score;
            highScoreElement.textContent = highScore;
            if (score > highScore){
                highScore = score;
            }
            if (snake.collided()){
                state = "stop";
                hideGameBoard();
                let gameOverSound = new Audio("assets/sounds/game-over.wav");
                gameOverSound.play();
                showInfoWindow("Game Over!", "Retry");
                clearInterval(gameLoop);
            }
        }
        else if(state === "restart") {
            hideGameBoard();
            clearInterval(gameLoop);
        }
    }, gameDelay);
}