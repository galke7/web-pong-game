/**
 * Tests for gameLoop.js module
 */

// Mock dependencies
jest.mock('../../js/modules/gameState.js', () => ({
  getGameState: jest.fn(),
  setLastTime: jest.fn(),
  updateBallPosition: jest.fn(),
  updateComputerPaddle: jest.fn(),
  movePlayerPaddleUp: jest.fn(),
  movePlayerPaddleDown: jest.fn(),
  isGameOver: jest.fn(),
  getWinner: jest.fn(),
  endGame: jest.fn()
}));

jest.mock('../../js/modules/input.js', () => ({
  processKeyboardInput: jest.fn()
}));

jest.mock('../../js/modules/collision.js', () => ({
  checkCollisions: jest.fn()
}));

jest.mock('../../js/modules/rendering.js', () => ({
  updatePositions: jest.fn(),
  updateScore: jest.fn(),
  updateStartButton: jest.fn(),
  showGameOverMessage: jest.fn()
}));

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = jest.fn(callback => {
  return setTimeout(() => callback(Date.now()), 0);
});

global.cancelAnimationFrame = jest.fn(id => {
  clearTimeout(id);
});

// Import the module to test
import {
  startGameLoop,
  stopGameLoop,
  pauseGame
} from '../../js/modules/gameLoop.js';

// Import mocked dependencies
import { getGameState, setLastTime, updateBallPosition, updateComputerPaddle, 
  isGameOver, getWinner, endGame } from '../../js/modules/gameState.js';
import { processKeyboardInput } from '../../js/modules/input.js';
import { checkCollisions } from '../../js/modules/collision.js';
import { updatePositions, updateScore, updateStartButton, 
  showGameOverMessage } from '../../js/modules/rendering.js';

describe('Game Loop Module', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Default game state
    getGameState.mockReturnValue({
      gameRunning: true,
      gameEnded: false,
      lastTime: Date.now() - 16 // Simulate ~60fps
    });
    
    isGameOver.mockReturnValue(false);
    checkCollisions.mockReturnValue(false);
  });

  describe('startGameLoop', () => {
    test('should start the game loop', () => {
      startGameLoop();
      
      // Should request animation frame
      expect(requestAnimationFrame).toHaveBeenCalled();
    });

    test('should cancel existing animation frame if one exists', () => {
      // Start game loop
      startGameLoop();
      
      // Reset mock to clear call count
      cancelAnimationFrame.mockClear();
      
      // Start game loop again
      startGameLoop();
      
      // Should cancel animation frame once
      expect(cancelAnimationFrame).toHaveBeenCalledTimes(1);
    });
  });

  describe('stopGameLoop', () => {
    test('should stop the game loop if animation frame exists', () => {
      // Start and then stop
      startGameLoop();
      stopGameLoop();
      
      // Should cancel animation frame
      expect(cancelAnimationFrame).toHaveBeenCalled();
    });

    test('should do nothing if no animation frame exists', () => {
      // Just stop without starting
      stopGameLoop();
      
      // Should not cancel animation frame
      expect(cancelAnimationFrame).not.toHaveBeenCalled();
    });
  });

  describe('game loop execution', () => {
    test('should update game state and render', async () => {
      // Start game loop
      startGameLoop();
      
      // Wait for next tick to allow requestAnimationFrame callback to execute
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Should process input
      expect(processKeyboardInput).toHaveBeenCalled();
      
      // Should update game state
      expect(updateComputerPaddle).toHaveBeenCalled();
      expect(updateBallPosition).toHaveBeenCalled();
      expect(checkCollisions).toHaveBeenCalled();
      
      // Should update rendering
      expect(updatePositions).toHaveBeenCalled();
      expect(updateScore).toHaveBeenCalled();
      
      // Should continue the loop by calling requestAnimationFrame
      expect(requestAnimationFrame).toHaveBeenCalled();
    });

    test('should end game if collision causes game end', async () => {
      // Set up collision to end game
      checkCollisions.mockReturnValue(true);
      getWinner.mockReturnValue('player');
      
      // Start game loop
      startGameLoop();
      
      // Wait for next tick
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Should end game
      expect(endGame).toHaveBeenCalled();
      expect(updateStartButton).toHaveBeenCalledWith('New Game');
      expect(showGameOverMessage).toHaveBeenCalledWith('player');
      
      // Should not continue the loop
      expect(requestAnimationFrame).toHaveBeenCalledTimes(1); // Only initial call
    });

    test('should end game if game is over', async () => {
      // Set up game over condition
      isGameOver.mockReturnValue(true);
      getWinner.mockReturnValue('computer');
      
      // Start game loop
      startGameLoop();
      
      // Wait for next tick
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Should end game
      expect(endGame).toHaveBeenCalled();
      expect(updateStartButton).toHaveBeenCalledWith('New Game');
      expect(showGameOverMessage).toHaveBeenCalledWith('computer');
      
      // Should not continue the loop
      expect(requestAnimationFrame).toHaveBeenCalledTimes(1); // Only initial call
    });

    test('should not run if game is not running', async () => {
      // Set game as not running
      getGameState.mockReturnValue({
        gameRunning: false,
        gameEnded: false,
        lastTime: Date.now() - 16
      });
      
      // Start game loop
      startGameLoop();
      
      // Wait for next tick
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Should not update game state
      expect(updateComputerPaddle).not.toHaveBeenCalled();
      expect(updateBallPosition).not.toHaveBeenCalled();
      
      // Should not continue the loop
      expect(requestAnimationFrame).toHaveBeenCalledTimes(1); // Only initial call
    });
  });

  describe('pauseGame', () => {
    test('should stop the game loop and return a promise', async () => {
      const promise = pauseGame(50);
      
      // Should stop the game loop
      expect(cancelAnimationFrame).toHaveBeenCalled();
      
      // Should be a promise
      expect(promise).toBeInstanceOf(Promise);
      
      // Wait for promise to resolve
      await promise;
    });
  });
});
