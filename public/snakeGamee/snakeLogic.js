//board which holds all game elements
const gameBoard = document.getElementById("game-board");
const instructions = document.getElementById("instructions");
const logo = document.getElementById("logo");
const highScore = document.getElementById("highScore");
const score = document.getElementById("score");

//game elements
let gridSize = 20;
let snake = [{x: 10, y: 10}]
let food = {};
let direction = 'down';
let previousDirection = direction;
let gameInterval;
let gameSpeed = 200;
let gameStart = false;
let currentScore = 0;
let currentHighScore = 0;

//draw map, and game elements
function draw(){
    gameBoard.innerHTML = "";
    drawSnake();
    drawFood();
}

//used to create the snake segments, and placed
function drawSnake(){
    if(gameStart){
        snake.forEach((segment)=>{
            const snakeElement = createGameElement('div', 
            'snake');
            setPosition(snakeElement, segment);
            gameBoard.appendChild(snakeElement);
        })
    }
}

//create each game element container to later to placed in html
function createGameElement(tag, className){
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

//set position of the game elements
function setPosition(element, pos){
    element.style.gridColumn = pos.x;
    element.style.gridRow = pos.y;
}
//to create food elements, and place them on the board
function drawFood(){
    if(gameStart){
        const foodElement = createGameElement('div', 
            'food');
            setPosition(foodElement, food);
            gameBoard.appendChild(foodElement);
    }
}

//create food, if it overlaps the snake element, change positions
//clear food if there is any to avoid html bloat
function setFoodPosition(){
    do {
        const existingFood = document.getElementsByClassName("food");
        if(existingFood.length > 0){
            existingFood[0].remove();
        }
        food.x = Math.floor(Math.random() * gridSize) + 1
        food.y = Math.floor(Math.random() * gridSize) + 1
    } while (snake.some((segment)=>{
        return segment.x === food.x && segment.y === food.y
    }));
}

//snake movement
function movement(){
    const head = {...snake[0]};

    if (direction === 'right' && 
    !(snake.length > 1 && direction === 'left')) {
        head.x++;
    } else if (direction === 'left' && 
    !(snake.length > 1 && direction === 'right')) {
        head.x--;
    } else if (direction === 'down' && 
    !(snake.length > 1 && direction === 'up')) {
        head.y++;
    } else if (direction === 'up' && 
    !(snake.length > 1 && direction === 'down')) {
        head.y--;
    }
    //add new position to snake array
    snake.unshift(head);
    //if the snake gets the food, increase the size, and get new food position
    if(head.x === food.x && head.y === food.y){
        currentScore++;
        score.textContent = currentScore.toString().padStart(3,'0');
        clearInterval(gameInterval);
        increaseSpeed();
        setFoodPosition();
        gameInterval = setInterval(()=>{
            movement();
            checkCollision();
            draw();
        }, gameSpeed)
    }
    else{
        snake.pop();
    }
}

//start game through pressing spacebar
function startGame(){
    gameStart = true;
    instructions.style.display= "none";
    logo.style.display="none";
    setFoodPosition();
    gameInterval = setInterval(()=>{
        movement();
        checkCollision();
        draw();
    }, gameSpeed)
}

//handle when valid keys are pressed
function handleKeyPress(event){
    if((!gameStart && event.code === "Space") ||
    !gameStart && event.key === " "){
        startGame();
    }
    else{
        switch (event.key){
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
}
//increase how fast the snake goes eat food eaten
function increaseSpeed(){
    if(gameSpeed>100){
        gameSpeed-=10;
    }
    else{
        gameSpeed-=15;
    }
}
//if snake goes into its own body, or borders the game resets
function checkCollision(){
    const head = snake[0];
    if(head.x <1 || head.x > gridSize || head.y <1 || head.y > gridSize){
        resetGame();
    }

    for(let i =1; i<snake.length; i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            resetGame();
        }
    }
}
//start the game over from the beginning, show highscore
function resetGame(){
    clearInterval(gameInterval);
    gameStart = false;
    snake = [{x: 10, y: 10}]
    gameSpeed = 200;
    highScore.style.display = "block"
    instructions.style.display = "block"
    logo.style.display = "block"
    if(currentScore > currentHighScore){
       currentHighScore = currentScore;
       highScore.textContent = currentHighScore.toString().padStart(3,'0');
    }
    currentScore = 0;
    score.textContent = currentScore.toString().padStart(3,'0');
}

//watch for valid key presses
document.addEventListener('keydown', handleKeyPress);