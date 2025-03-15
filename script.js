// Game elements
const gameBoard = document.getElementById('game-board');
const ball = document.getElementById('ball');
const playerPaddle = document.getElementById('player-paddle');
const computerPaddle = document.getElementById('computer-paddle');
const playerScoreElement = document.getElementById('player-score');
const computerScoreElement = document.getElementById('computer-score');
const startButton = document.getElementById('start-button');

// Game state
let gameRunning = false;
let playerScore = 0;
let computerScore = 0;
let ballX = 390;
let ballY = 240;
let ballSpeedX = 5;
let ballSpeedY = 5;
let playerPaddleY = 200;
let computerPaddleY = 200;
let lastTime = 0;
const paddleSpeed = 8;
const computerDifficulty = 0.85; // Higher = more difficult (0-1)

// Game constants
const boardWidth = 800;
const boardHeight = 500;
const paddleHeight = 100;
const paddleWidth = 15;
const ballSize = 20;
const winningScore = 5;

// Event listeners
startButton.addEventListener('click', startGame);
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
gameBoard.addEventListener('mousemove', handleMouseMove);

// Key states for smooth movement
const keys = {
    ArrowUp: false,
    ArrowDown: false
};

// Initialize game
function init() {
    // Reset positions
    ballX = boardWidth / 2 - ballSize / 2;
    ballY = boardHeight / 2 - ballSize / 2;
    playerPaddleY = boardHeight / 2 - paddleHeight / 2;
    computerPaddleY = boardHeight / 2 - paddleHeight / 2;
    
    // Reset scores if starting a new game
    if (!gameRunning) {
        playerScore = 0;
        computerScore = 0;
        updateScore();
    }
    
    // Reset ball direction with random Y component
    ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = (Math.random() * 4 - 2) + (Math.random() > 0.5 ? 2 : -2);
    
    // Update positions
    updatePositions();
}

// Start or restart the game
function startGame() {
    if (playerScore >= winningScore || computerScore >= winningScore) {
        playerScore = 0;
        computerScore = 0;
        updateScore();
    }
    
    gameRunning = true;
    startButton.textContent = 'Restart Game';
    init();
    requestAnimationFrame(gameLoop);
}

// Main game loop
function gameLoop(timestamp) {
    if (!gameRunning) return;
    
    // Calculate delta time for smooth animation
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    // Update game state
    updatePaddlePositions();
    updateBallPosition(deltaTime);
    checkCollisions();
    updatePositions();
    
    // Check for win condition
    if (playerScore >= winningScore || computerScore >= winningScore) {
        gameRunning = false;
        startButton.textContent = 'New Game';
        const winner = playerScore >= winningScore ? 'You win!' : 'Computer wins!';
        alert(winner);
        return;
    }
    
    requestAnimationFrame(gameLoop);
}

// Update paddle positions based on input
function updatePaddlePositions() {
    // Player paddle keyboard control
    if (keys.ArrowUp) {
        playerPaddleY = Math.max(0, playerPaddleY - paddleSpeed);
    }
    if (keys.ArrowDown) {
        playerPaddleY = Math.min(boardHeight - paddleHeight, playerPaddleY + paddleSpeed);
    }
    
    // Computer AI
    const paddleCenter = computerPaddleY + paddleHeight / 2;
    const ballCenter = ballY + ballSize / 2;
    
    // Only move if the ball is moving toward the computer
    if (ballSpeedX > 0) {
        // Add some "thinking" delay and imperfection
        if (Math.random() < computerDifficulty) {
            if (paddleCenter < ballCenter - 10) {
                computerPaddleY += paddleSpeed * 0.7;
            } else if (paddleCenter > ballCenter + 10) {
                computerPaddleY -= paddleSpeed * 0.7;
            }
        }
    } else {
        // When ball is moving away, return slowly to center
        const boardCenter = boardHeight / 2 - paddleHeight / 2;
        if (Math.abs(computerPaddleY - boardCenter) > 50) {
            computerPaddleY += (computerPaddleY > boardCenter) ? -2 : 2;
        }
    }
    
    // Keep computer paddle within bounds
    computerPaddleY = Math.max(0, Math.min(boardHeight - paddleHeight, computerPaddleY));
}

// Update ball position
function updateBallPosition(deltaTime) {
    // Scale movement by delta time for consistent speed
    const timeScale = deltaTime ? deltaTime / 16.67 : 1; // 60fps as baseline
    
    ballX += ballSpeedX * timeScale;
    ballY += ballSpeedY * timeScale;
}

// Check for collisions
function checkCollisions() {
    // Top and bottom walls
    if (ballY <= 0 || ballY + ballSize >= boardHeight) {
        ballSpeedY = -ballSpeedY;
        // Keep ball in bounds
        ballY = ballY <= 0 ? 0 : boardHeight - ballSize;
    }
    
    // Paddle collisions
    // Player paddle
    if (
        ballX <= paddleWidth + 20 && 
        ballX + ballSize >= 20 && 
        ballY + ballSize >= playerPaddleY && 
        ballY <= playerPaddleY + paddleHeight &&
        ballSpeedX < 0
    ) {
        ballSpeedX = -ballSpeedX;
        // Adjust Y speed based on where ball hits paddle
        adjustBallAngle(playerPaddleY);
        increaseBallSpeed();
    }
    
    // Computer paddle
    if (
        ballX + ballSize >= boardWidth - paddleWidth - 20 && 
        ballX <= boardWidth - 20 && 
        ballY + ballSize >= computerPaddleY && 
        ballY <= computerPaddleY + paddleHeight &&
        ballSpeedX > 0
    ) {
        ballSpeedX = -ballSpeedX;
        // Adjust Y speed based on where ball hits paddle
        adjustBallAngle(computerPaddleY);
        increaseBallSpeed();
    }
    
    // Left and right walls (scoring)
    if (ballX + ballSize < 0) {
        // Computer scores
        computerScore++;
        updateScore();
        resetBall();
    } else if (ballX > boardWidth) {
        // Player scores
        playerScore++;
        updateScore();
        resetBall();
    }
}

// Adjust ball angle based on where it hits the paddle
function adjustBallAngle(paddleY) {
    const impact = (ballY + ballSize/2) - (paddleY + paddleHeight/2);
    const ratio = impact / (paddleHeight/2);
    ballSpeedY = ratio * 7; // Max speed of 7 in Y direction
}

// Increase ball speed slightly after each paddle hit
function increaseBallSpeed() {
    // Cap the maximum speed
    const maxSpeed = 15;
    if (Math.abs(ballSpeedX) < maxSpeed) {
        ballSpeedX *= 1.05;
    }
}

// Reset ball after scoring
function resetBall() {
    if (!gameRunning) return;
    
    ballX = boardWidth / 2 - ballSize / 2;
    ballY = boardHeight / 2 - ballSize / 2;
    
    // Reset ball speed and direction
    ballSpeedX = 5 * (computerScore > playerScore ? -1 : 1);
    ballSpeedY = (Math.random() * 4 - 2);
    
    // Pause briefly
    gameRunning = false;
    setTimeout(() => {
        gameRunning = true;
        requestAnimationFrame(gameLoop);
    }, 1000);
}

// Update score display
function updateScore() {
    playerScoreElement.textContent = playerScore;
    computerScoreElement.textContent = computerScore;
}

// Update visual positions of elements
function updatePositions() {
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
    playerPaddle.style.top = `${playerPaddleY}px`;
    computerPaddle.style.top = `${computerPaddleY}px`;
}

// Handle keyboard input
function handleKeyDown(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        keys[e.key] = true;
    }
    
    // Start game with spacebar
    if (e.key === ' ' && !gameRunning) {
        startGame();
    }
}

function handleKeyUp(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        keys[e.key] = false;
    }
}

// Handle mouse movement for paddle control
function handleMouseMove(e) {
    const relativeY = e.clientY - gameBoard.getBoundingClientRect().top;
    if (relativeY > 0 && relativeY < boardHeight) {
        playerPaddleY = Math.min(
            boardHeight - paddleHeight,
            Math.max(0, relativeY - paddleHeight / 2)
        );
    }
}

// Initialize the game
init();
