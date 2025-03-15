/**
 * input.js
 * This module handles keyboard and mouse input for the game.
 */

import { setPlayerPaddleY, BOARD_HEIGHT, PADDLE_HEIGHT } from './gameState.js';

// Key states for smooth movement
const keys = {
    ArrowUp: false,
    ArrowDown: false
};

/**
 * Initialize input handlers
 * @param {HTMLElement} gameBoard - The game board element
 * @param {HTMLElement} startButton - The start button element
 * @param {Function} startGameCallback - Callback function to start the game
 */
function initInputHandlers(gameBoard, startButton, startGameCallback) {
    // Event listeners
    startButton.addEventListener('click', startGameCallback);
    document.addEventListener('keydown', (e) => handleKeyDown(e, startGameCallback));
    document.addEventListener('keyup', handleKeyUp);
    gameBoard.addEventListener('mousemove', (e) => handleMouseMove(e, gameBoard));
}

/**
 * Handle keyboard input (key down)
 * @param {KeyboardEvent} e - The keyboard event
 * @param {Function} startGameCallback - Callback function to start the game
 */
function handleKeyDown(e, startGameCallback) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        keys[e.key] = true;
    }
    
    // Start game with spacebar
    if (e.key === ' ') {
        startGameCallback();
    }
}

/**
 * Handle keyboard input (key up)
 * @param {KeyboardEvent} e - The keyboard event
 */
function handleKeyUp(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        keys[e.key] = false;
    }
}

/**
 * Handle mouse movement for paddle control
 * @param {MouseEvent} e - The mouse event
 * @param {HTMLElement} gameBoard - The game board element
 */
function handleMouseMove(e, gameBoard) {
    const relativeY = e.clientY - gameBoard.getBoundingClientRect().top;
    if (relativeY > 0 && relativeY < BOARD_HEIGHT) {
        const newPaddleY = Math.min(
            BOARD_HEIGHT - PADDLE_HEIGHT,
            Math.max(0, relativeY - PADDLE_HEIGHT / 2)
        );
        setPlayerPaddleY(newPaddleY);
    }
}

/**
 * Process keyboard input for paddle movement
 * @param {Object} paddleActions - Object containing paddle movement functions
 */
function processKeyboardInput(paddleActions) {
    if (keys.ArrowUp) {
        paddleActions.moveUp();
    }
    if (keys.ArrowDown) {
        paddleActions.moveDown();
    }
}

// Export functions
export {
    initInputHandlers,
    processKeyboardInput,
    handleKeyDown,
    handleKeyUp,
    handleMouseMove
};
