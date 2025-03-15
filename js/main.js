/**
 * main.js
 * This is the main entry point for the Pong game.
 * It imports and initializes all the game modules.
 */

import { 
    initializeGame, 
    startGame as startGameState,
    getWinner
} from './modules/gameState.js';

import { initInputHandlers } from './modules/input.js';
import { initRendering, updateScore, updateStartButton } from './modules/rendering.js';
import { startGameLoop, stopGameLoop } from './modules/gameLoop.js';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get game elements
    const gameBoard = document.getElementById('game-board');
    const ball = document.getElementById('ball');
    const playerPaddle = document.getElementById('player-paddle');
    const computerPaddle = document.getElementById('computer-paddle');
    const playerScoreElement = document.getElementById('player-score');
    const computerScoreElement = document.getElementById('computer-score');
    const startButton = document.getElementById('start-button');
    
    // Initialize rendering module
    initRendering({
        ball,
        playerPaddle,
        computerPaddle,
        playerScore: playerScoreElement,
        computerScore: computerScoreElement,
        startButton
    });
    
    // Initialize game state
    initializeGame();
    
    // Update initial score display
    updateScore();
    
    // Define start game function
    function startGame() {
        // Update game state
        startGameState();
        
        // Update UI
        updateStartButton('Restart Game');
        updateScore();
        
        // Start game loop
        startGameLoop();
    }
    
    // Initialize input handlers
    initInputHandlers(gameBoard, startButton, startGame);
    
    // Log initialization
    console.log('Pong game initialized and ready to play!');
});
