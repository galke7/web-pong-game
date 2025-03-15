/**
 * rendering.js
 * This module handles rendering the game elements on the screen.
 */

import { getGameState } from './gameState.js';

// DOM elements
let ballElement;
let playerPaddleElement;
let computerPaddleElement;
let playerScoreElement;
let computerScoreElement;
let startButtonElement;

/**
 * Initialize the rendering module with DOM elements
 * @param {Object} elements - Object containing DOM elements
 */
function initRendering(elements) {
    ballElement = elements.ball;
    playerPaddleElement = elements.playerPaddle;
    computerPaddleElement = elements.computerPaddle;
    playerScoreElement = elements.playerScore;
    computerScoreElement = elements.computerScore;
    startButtonElement = elements.startButton;
}

/**
 * Update the visual positions of game elements
 */
function updatePositions() {
    const { ballX, ballY, playerPaddleY, computerPaddleY } = getGameState();
    
    ballElement.style.left = `${ballX}px`;
    ballElement.style.top = `${ballY}px`;
    playerPaddleElement.style.top = `${playerPaddleY}px`;
    computerPaddleElement.style.top = `${computerPaddleY}px`;
}

/**
 * Update the score display
 */
function updateScore() {
    const { playerScore, computerScore } = getGameState();
    
    playerScoreElement.textContent = playerScore;
    computerScoreElement.textContent = computerScore;
}

/**
 * Update the start button text
 * @param {string} text - The text to display on the button
 */
function updateStartButton(text) {
    startButtonElement.textContent = text;
}

/**
 * Show a game over message
 * @param {string} winner - The winner of the game ('player' or 'computer')
 */
function showGameOverMessage(winner) {
    const message = winner === 'player' ? 'You win!' : 'Computer wins!';
    setTimeout(() => {
        alert(message);
    }, 100);
}

// Export functions
export {
    initRendering,
    updatePositions,
    updateScore,
    updateStartButton,
    showGameOverMessage
};
