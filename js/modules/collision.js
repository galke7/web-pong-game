/**
 * collision.js
 * This module handles collision detection between game objects.
 */

import {
    BOARD_WIDTH,
    BOARD_HEIGHT,
    PADDLE_HEIGHT,
    PADDLE_WIDTH,
    BALL_SIZE,
    getGameState,
    reverseBallX,
    reverseBallY,
    adjustBallAngle,
    increaseBallSpeed,
    increasePlayerScore,
    increaseComputerScore
} from './gameState.js';

/**
 * Check for collisions between the ball and game boundaries/paddles
 * @returns {boolean} Whether the game has ended due to a score
 */
function checkCollisions() {
    const { ballX, ballY, ballSpeedX, ballSpeedY, playerPaddleY, computerPaddleY } = getGameState();
    let gameEnded = false;
    
    // Top and bottom walls
    if (ballY <= 0 || ballY + BALL_SIZE >= BOARD_HEIGHT) {
        reverseBallY();
        // Keep ball in bounds
        // This is handled in the gameState module by the setters
    }
    
    // Paddle collisions
    // Player paddle
    if (
        ballX <= PADDLE_WIDTH + 20 && 
        ballX + BALL_SIZE >= 20 && 
        ballY + BALL_SIZE >= playerPaddleY && 
        ballY <= playerPaddleY + PADDLE_HEIGHT &&
        ballSpeedX < 0
    ) {
        reverseBallX();
        // Adjust Y speed based on where ball hits paddle
        adjustBallAngle(playerPaddleY);
        increaseBallSpeed();
    }
    
    // Computer paddle
    if (
        ballX + BALL_SIZE >= BOARD_WIDTH - PADDLE_WIDTH - 20 && 
        ballX <= BOARD_WIDTH - 20 && 
        ballY + BALL_SIZE >= computerPaddleY && 
        ballY <= computerPaddleY + PADDLE_HEIGHT &&
        ballSpeedX > 0
    ) {
        reverseBallX();
        // Adjust Y speed based on where ball hits paddle
        adjustBallAngle(computerPaddleY);
        increaseBallSpeed();
    }
    
    // Left and right walls (scoring)
    if (ballX + BALL_SIZE < 0) {
        // Computer scores
        gameEnded = increaseComputerScore();
    } else if (ballX > BOARD_WIDTH) {
        // Player scores
        gameEnded = increasePlayerScore();
    }
    
    return gameEnded;
}

/**
 * Check if the ball is out of bounds and adjust its position
 */
function keepBallInBounds() {
    const { ballY } = getGameState();
    
    // Keep ball within vertical bounds
    if (ballY <= 0) {
        return 0;
    } else if (ballY + BALL_SIZE >= BOARD_HEIGHT) {
        return BOARD_HEIGHT - BALL_SIZE;
    }
    
    return ballY;
}

// Export functions
export {
    checkCollisions,
    keepBallInBounds
};
