/**
 * Tests for rendering.js module
 */

// Mock the gameState module
jest.mock('../../js/modules/gameState.js', () => ({
  getGameState: jest.fn()
}));

// Import the module to test
import {
  initRendering,
  updatePositions,
  updateScore,
  updateStartButton,
  showGameOverMessage
} from '../../js/modules/rendering.js';

// Import mocked dependencies
import { getGameState } from '../../js/modules/gameState.js';

describe('Rendering Module', () => {
  // Mock DOM elements
  let ballElement;
  let playerPaddleElement;
  let computerPaddleElement;
  let playerScoreElement;
  let computerScoreElement;
  let startButtonElement;
  
  // Mock window.alert
  const originalAlert = window.alert;
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create mock DOM elements
    ballElement = {
      style: {}
    };
    
    playerPaddleElement = {
      style: {}
    };
    
    computerPaddleElement = {
      style: {}
    };
    
    playerScoreElement = {
      textContent: '0'
    };
    
    computerScoreElement = {
      textContent: '0'
    };
    
    startButtonElement = {
      textContent: 'Start Game'
    };
    
    // Default game state
    getGameState.mockReturnValue({
      ballX: 400,
      ballY: 250,
      playerPaddleY: 200,
      computerPaddleY: 200,
      playerScore: 0,
      computerScore: 0
    });
    
    // Mock window.alert
    window.alert = jest.fn();
    
    // Mock setTimeout
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    // Restore window.alert
    window.alert = originalAlert;
    
    // Restore timers
    jest.useRealTimers();
  });

  describe('initRendering', () => {
    test('should initialize DOM elements', () => {
      // Initialize rendering
      initRendering({
        ball: ballElement,
        playerPaddle: playerPaddleElement,
        computerPaddle: computerPaddleElement,
        playerScore: playerScoreElement,
        computerScore: computerScoreElement,
        startButton: startButtonElement
      });
      
      // Update positions to check if elements were initialized
      updatePositions();
      
      // Check if styles were updated
      expect(ballElement.style.left).toBe('400px');
      expect(ballElement.style.top).toBe('250px');
      expect(playerPaddleElement.style.top).toBe('200px');
      expect(computerPaddleElement.style.top).toBe('200px');
    });
  });

  describe('updatePositions', () => {
    test('should update element positions based on game state', () => {
      // Initialize rendering
      initRendering({
        ball: ballElement,
        playerPaddle: playerPaddleElement,
        computerPaddle: computerPaddleElement,
        playerScore: playerScoreElement,
        computerScore: computerScoreElement,
        startButton: startButtonElement
      });
      
      // Update game state
      getGameState.mockReturnValue({
        ballX: 300,
        ballY: 150,
        playerPaddleY: 250,
        computerPaddleY: 300,
        playerScore: 0,
        computerScore: 0
      });
      
      // Update positions
      updatePositions();
      
      // Check if styles were updated
      expect(ballElement.style.left).toBe('300px');
      expect(ballElement.style.top).toBe('150px');
      expect(playerPaddleElement.style.top).toBe('250px');
      expect(computerPaddleElement.style.top).toBe('300px');
    });
  });

  describe('updateScore', () => {
    test('should update score elements based on game state', () => {
      // Initialize rendering
      initRendering({
        ball: ballElement,
        playerPaddle: playerPaddleElement,
        computerPaddle: computerPaddleElement,
        playerScore: playerScoreElement,
        computerScore: computerScoreElement,
        startButton: startButtonElement
      });
      
      // Update game state
      getGameState.mockReturnValue({
        ballX: 400,
        ballY: 250,
        playerPaddleY: 200,
        computerPaddleY: 200,
        playerScore: 3,
        computerScore: 2
      });
      
      // Update score
      updateScore();
      
      // Check if scores were updated
      expect(playerScoreElement.textContent).toBe(3);
      expect(computerScoreElement.textContent).toBe(2);
    });
  });

  describe('updateStartButton', () => {
    test('should update start button text', () => {
      // Initialize rendering
      initRendering({
        ball: ballElement,
        playerPaddle: playerPaddleElement,
        computerPaddle: computerPaddleElement,
        playerScore: playerScoreElement,
        computerScore: computerScoreElement,
        startButton: startButtonElement
      });
      
      // Update button text
      updateStartButton('Restart Game');
      
      // Check if button text was updated
      expect(startButtonElement.textContent).toBe('Restart Game');
    });
  });

  describe('showGameOverMessage', () => {
    test('should show player win message', () => {
      // Initialize rendering
      initRendering({
        ball: ballElement,
        playerPaddle: playerPaddleElement,
        computerPaddle: computerPaddleElement,
        playerScore: playerScoreElement,
        computerScore: computerScoreElement,
        startButton: startButtonElement
      });
      
      // Show game over message for player win
      showGameOverMessage('player');
      
      // Fast-forward timers
      jest.runAllTimers();
      
      // Check if alert was called with correct message
      expect(window.alert).toHaveBeenCalledWith('You win!');
    });
    
    test('should show computer win message', () => {
      // Initialize rendering
      initRendering({
        ball: ballElement,
        playerPaddle: playerPaddleElement,
        computerPaddle: computerPaddleElement,
        playerScore: playerScoreElement,
        computerScore: computerScoreElement,
        startButton: startButtonElement
      });
      
      // Show game over message for computer win
      showGameOverMessage('computer');
      
      // Fast-forward timers
      jest.runAllTimers();
      
      // Check if alert was called with correct message
      expect(window.alert).toHaveBeenCalledWith('Computer wins!');
    });
  });
});
