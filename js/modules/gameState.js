/**
 * gameState.js
 * This module maintains the current state of the game including scores,
 * positions, and game status.
 */

// Game constants
const BOARD_WIDTH = 800;
const BOARD_HEIGHT = 500;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 15;
const BALL_SIZE = 20;
const WINNING_SCORE = 5;
const PADDLE_SPEED = 8;
const COMPUTER_DIFFICULTY = 0.85; // Higher = more difficult (0-1)

// Game state
let gameRunning = false;
let gameEnded = false;
let playerScore = 0;
let computerScore = 0;
let ballX = 390;
let ballY = 240;
let ballSpeedX = 5;
let ballSpeedY = 5;
let playerPaddleY = 200;
let computerPaddleY = 200;
let lastTime = 0;

/**
 * Initialize or reset the game state
 * @param {boolean} newGame - Whether this is a new game (reset scores) or just a round reset
 */
function initializeGame(newGame = true) {
    // Reset positions
    ballX = BOARD_WIDTH / 2 - BALL_SIZE / 2;
    ballY = BOARD_HEIGHT / 2 - BALL_SIZE / 2;
    playerPaddleY = BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    computerPaddleY = BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    
    // Reset scores if starting a new game
    if (newGame) {
        playerScore = 0;
        computerScore = 0;
    }
    
    // Reset ball direction with random Y component
    ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = (Math.random() * 4 - 2) + (Math.random() > 0.5 ? 2 : -2);
}

/**
 * Start or restart the game
 */
function startGame() {
    if (playerScore >= WINNING_SCORE || computerScore >= WINNING_SCORE) {
        playerScore = 0;
        computerScore = 0;
    }
    
    gameRunning = true;
    gameEnded = false;
    initializeGame();
}

/**
 * Reset the ball after scoring
 */
function resetBall() {
    if (!gameRunning || gameEnded) return;
    
    ballX = BOARD_WIDTH / 2 - BALL_SIZE / 2;
    ballY = BOARD_HEIGHT / 2 - BALL_SIZE / 2;
    
    // Reset ball speed and direction
    ballSpeedX = 5 * (computerScore > playerScore ? -1 : 1);
    ballSpeedY = (Math.random() * 4 - 2);
    
    // Check if game has ended
    if (playerScore >= WINNING_SCORE || computerScore >= WINNING_SCORE) {
        gameEnded = true;
        gameRunning = false;
        return true;
    }
    
    return false;
}

/**
 * Increase player score
 */
function increasePlayerScore() {
    playerScore++;
    return resetBall();
}

/**
 * Increase computer score
 */
function increaseComputerScore() {
    computerScore++;
    return resetBall();
}

/**
 * Check if the game is over
 * @returns {boolean} Whether the game is over
 */
function isGameOver() {
    return playerScore >= WINNING_SCORE || computerScore >= WINNING_SCORE;
}

/**
 * Get the winner of the game
 * @returns {string} The winner of the game ('player', 'computer', or null if game is not over)
 */
function getWinner() {
    if (playerScore >= WINNING_SCORE) return 'player';
    if (computerScore >= WINNING_SCORE) return 'computer';
    return null;
}

/**
 * Update the ball position based on delta time
 * @param {number} deltaTime - Time since last frame in milliseconds
 */
function updateBallPosition(deltaTime) {
    // Scale movement by delta time for consistent speed
    const timeScale = deltaTime ? deltaTime / 16.67 : 1; // 60fps as baseline
    
    ballX += ballSpeedX * timeScale;
    ballY += ballSpeedY * timeScale;
}

/**
 * Adjust ball angle based on where it hits the paddle
 * @param {number} paddleY - Y position of the paddle
 */
function adjustBallAngle(paddleY) {
    const impact = (ballY + BALL_SIZE/2) - (paddleY + PADDLE_HEIGHT/2);
    const ratio = impact / (PADDLE_HEIGHT/2);
    ballSpeedY = ratio * 7; // Max speed of 7 in Y direction
}

/**
 * Increase ball speed slightly after each paddle hit
 */
function increaseBallSpeed() {
    // Cap the maximum speed
    const maxSpeed = 15;
    if (Math.abs(ballSpeedX) < maxSpeed) {
        ballSpeedX *= 1.05;
    }
}

/**
 * Reverse the ball's X direction
 */
function reverseBallX() {
    ballSpeedX = -ballSpeedX;
}

/**
 * Reverse the ball's Y direction
 */
function reverseBallY() {
    ballSpeedY = -ballSpeedY;
}

/**
 * Set the player paddle Y position
 * @param {number} y - New Y position
 */
function setPlayerPaddleY(y) {
    playerPaddleY = Math.max(0, Math.min(BOARD_HEIGHT - PADDLE_HEIGHT, y));
}

/**
 * Move the player paddle up
 */
function movePlayerPaddleUp() {
    setPlayerPaddleY(playerPaddleY - PADDLE_SPEED);
}

/**
 * Move the player paddle down
 */
function movePlayerPaddleDown() {
    setPlayerPaddleY(playerPaddleY + PADDLE_SPEED);
}

/**
 * Update the computer paddle position based on ball position
 */
function updateComputerPaddle() {
    const paddleCenter = computerPaddleY + PADDLE_HEIGHT / 2;
    const ballCenter = ballY + BALL_SIZE / 2;
    
    // Calculate a random offset between -20 and 20 pixels
    const errorOffset = Math.random() * 40 - 20;
    
    // Only move if the ball is moving toward the computer
    if (ballSpeedX > 0) {
        // Add some "thinking" delay and imperfection
        if (Math.random() < COMPUTER_DIFFICULTY) {
            // Apply the error offset to the ball center to create a mistake factor
            const targetY = ballCenter + errorOffset;
            
            if (paddleCenter < targetY - 10) {
                computerPaddleY += PADDLE_SPEED * 0.7;
            } else if (paddleCenter > targetY + 10) {
                computerPaddleY -= PADDLE_SPEED * 0.7;
            }
        }
    } else {
        // When ball is moving away, return slowly to center
        const boardCenter = BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2;
        if (Math.abs(computerPaddleY - boardCenter) > 50) {
            computerPaddleY += (computerPaddleY > boardCenter) ? -2 : 2;
        }
    }
    
    // Keep computer paddle within bounds
    computerPaddleY = Math.max(0, Math.min(BOARD_HEIGHT - PADDLE_HEIGHT, computerPaddleY));
}

/**
 * Get the current game state
 * @returns {Object} The current game state
 */
function getGameState() {
    return {
        gameRunning,
        gameEnded,
        playerScore,
        computerScore,
        ballX,
        ballY,
        ballSpeedX,
        ballSpeedY,
        playerPaddleY,
        computerPaddleY,
        lastTime
    };
}

/**
 * Set the last time for delta time calculation
 * @param {number} time - Current timestamp
 */
function setLastTime(time) {
    lastTime = time;
}

/**
 * End the game
 */
function endGame() {
    gameRunning = false;
    gameEnded = true;
}

// Export all functions and constants
export {
    // Constants
    BOARD_WIDTH,
    BOARD_HEIGHT,
    PADDLE_HEIGHT,
    PADDLE_WIDTH,
    BALL_SIZE,
    WINNING_SCORE,
    PADDLE_SPEED,
    
    // Game state getters
    getGameState,
    isGameOver,
    getWinner,
    
    // Game state setters
    initializeGame,
    startGame,
    endGame,
    setLastTime,
    
    // Ball methods
    updateBallPosition,
    adjustBallAngle,
    increaseBallSpeed,
    reverseBallX,
    reverseBallY,
    resetBall,
    
    // Score methods
    increasePlayerScore,
    increaseComputerScore,
    
    // Paddle methods
    setPlayerPaddleY,
    movePlayerPaddleUp,
    movePlayerPaddleDown,
    updateComputerPaddle
};
