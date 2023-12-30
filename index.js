const highScoreElement = document.querySelector(".high-score");
const scoreElement = document.querySelector(".score");
const infoWindow = document.querySelector(".info-window")
const infoText = document.querySelector(".info-text");
const infoButton = document.querySelector(".info-button");
const gameBoard = document.querySelector(".game-board");

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
    newDiv.className = element.className;
    newDiv.style.display = "block";
    newDiv.style.gridColumn = position.x;
    newDiv.style.gridRow = position.y;
    parent.appendChild(newDiv);
}

function Snake(){
    this.snakeElement = document.querySelector(".snake-element");
    this.snakeBody = [{x: 25, y: 25}];
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
            score += 1;
            food.generateFood();
        }
    }
    this.render = () => {
        this.snakeBody.forEach((location) => {
            createGameObject(this.snakeElement, gameBoard, location);
        });
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
    hideInfoWindow();
    showGameBoard();
    boardStyles = window.getComputedStyle(gameBoard);
    nColumns = boardStyles.gridTemplateColumns.split(' ').filter(value => value !== '0px').length;
    nRows = boardStyles.gridTemplateRows.split(' ').filter(value => value !== '0px').length;
    state = "play";
    Game();
});

document.addEventListener("keydown", (event) => {
    if (state === "play") {
        switch(event.key){
            case "ArrowUp":
                direction = "up";
                break;
            case "ArrowDown":
                direction = "down";
                break;
            case "ArrowLeft":
                direction = "left";
                break;
            case "ArrowRight":
                direction = "right";
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
            if (score > highScore){
                highScore = score;
            }
            scoreElement.textContent = score;
            highScoreElement.textContent = highScore;
            if (snake.collided()){
                state = "stop";
                hideGameBoard();
                showInfoWindow("Game Over!", "Retry");
                clearInterval(gameLoop);
            }
        }
    }, gameDelay);
}