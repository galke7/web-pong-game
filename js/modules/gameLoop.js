/**
 * gameLoop.js
 * This module manages the game loop and animation cycle.
 */

import { 
    getGameState, 
    setLastTime, 
    updateBallPosition, 
    updateComputerPaddle,
    movePlayerPaddleUp,
    movePlayerPaddleDown,
    isGameOver,
    getWinner,
    endGame
} from './gameState.js';

import { processKeyboardInput } from './input.js';
import { checkCollisions } from './collision.js';
import { 
    updatePositions, 
    updateScore, 
    updateStartButton,
    showGameOverMessage
} from './rendering.js';

let animationFrameId = null;

/**
 * Start the game loop
 */
function startGameLoop() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    // Start the loop
    animationFrameId = requestAnimationFrame(gameLoop);
}

/**
 * Stop the game loop
 */
function stopGameLoop() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

/**
 * Main game loop
 * @param {number} timestamp - Current timestamp from requestAnimationFrame
 */
function gameLoop(timestamp) {
    const { gameRunning, gameEnded, lastTime } = getGameState();
    
    if (!gameRunning) return;
    
    // Calculate delta time for smooth animation
    const deltaTime = timestamp - lastTime;
    setLastTime(timestamp);
    
    // Process input
    processKeyboardInput({
        moveUp: movePlayerPaddleUp,
        moveDown: movePlayerPaddleDown
    });
    
    // Update game state
    updateComputerPaddle();
    updateBallPosition(deltaTime);
    
    // Check for collisions
    const gameEndedFromCollision = checkCollisions();
    
    // Update visual elements
    updatePositions();
    updateScore();
    
    // Check for win condition
    if (gameEndedFromCollision || isGameOver()) {
        if (!gameEnded) {
            endGame();
            updateStartButton('New Game');
            const winner = getWinner();
            showGameOverMessage(winner);
        }
        return;
    }
    
    // Continue the loop
    animationFrameId = requestAnimationFrame(gameLoop);
}

/**
 * Pause the game for a specified duration
 * @param {number} duration - Pause duration in milliseconds
 * @returns {Promise} A promise that resolves after the duration
 */
function pauseGame(duration) {
    stopGameLoop();
    
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
}

// Export functions
export {
    startGameLoop,
    stopGameLoop,
    pauseGame
};
