/**
 * Tests for main.js module
 */

// Mock all dependencies
jest.mock('../js/modules/gameState.js', () => ({
  initializeGame: jest.fn(),
  startGame: jest.fn(),
  getWinner: jest.fn()
}));

jest.mock('../js/modules/input.js', () => ({
  initInputHandlers: jest.fn()
}));

jest.mock('../js/modules/rendering.js', () => ({
  initRendering: jest.fn(),
  updateScore: jest.fn(),
  updateStartButton: jest.fn()
}));

jest.mock('../js/modules/gameLoop.js', () => ({
  startGameLoop: jest.fn(),
  stopGameLoop: jest.fn()
}));

// Import mocked dependencies
import { 
  initializeGame, 
  startGame as startGameState,
  getWinner
} from '../js/modules/gameState.js';

import { initInputHandlers } from '../js/modules/input.js';
import { initRendering, updateScore, updateStartButton } from '../js/modules/rendering.js';
import { startGameLoop, stopGameLoop } from '../js/modules/gameLoop.js';

describe('Main Module', () => {
  // Mock DOM elements
  let gameBoard;
  let ball;
  let playerPaddle;
  let computerPaddle;
  let playerScoreElement;
  let computerScoreElement;
  let startButton;
  
  // Mock document.getElementById
  const originalGetElementById = document.getElementById;
  
  // Mock DOMContentLoaded event
  let domContentLoadedCallback;
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create mock DOM elements
    gameBoard = {};
    ball = {};
    playerPaddle = {};
    computerPaddle = {};
    playerScoreElement = {};
    computerScoreElement = {};
    startButton = {};
    
    // Mock document.getElementById
    document.getElementById = jest.fn((id) => {
      switch (id) {
        case 'game-board':
          return gameBoard;
        case 'ball':
          return ball;
        case 'player-paddle':
          return playerPaddle;
        case 'computer-paddle':
          return computerPaddle;
        case 'player-score':
          return playerScoreElement;
        case 'computer-score':
          return computerScoreElement;
        case 'start-button':
          return startButton;
        default:
          return null;
      }
    });
    
    // Mock document.addEventListener for DOMContentLoaded
    document.addEventListener = jest.fn((event, callback) => {
      if (event === 'DOMContentLoaded') {
        domContentLoadedCallback = callback;
      }
    });
    
    // Mock console.log
    console.log = jest.fn();
  });
  
  afterEach(() => {
    // Restore document.getElementById
    document.getElementById = originalGetElementById;
  });

  describe('DOMContentLoaded', () => {
    test('should initialize game when DOM is loaded', () => {
      // Import main.js to trigger DOMContentLoaded event listener
      require('../js/main.js');
      
      // Simulate DOMContentLoaded event
      domContentLoadedCallback();
      
      // Should get DOM elements
      expect(document.getElementById).toHaveBeenCalledWith('game-board');
      expect(document.getElementById).toHaveBeenCalledWith('ball');
      expect(document.getElementById).toHaveBeenCalledWith('player-paddle');
      expect(document.getElementById).toHaveBeenCalledWith('computer-paddle');
      expect(document.getElementById).toHaveBeenCalledWith('player-score');
      expect(document.getElementById).toHaveBeenCalledWith('computer-score');
      expect(document.getElementById).toHaveBeenCalledWith('start-button');
      
      // Should initialize rendering
      expect(initRendering).toHaveBeenCalledWith({
        ball,
        playerPaddle,
        computerPaddle,
        playerScore: playerScoreElement,
        computerScore: computerScoreElement,
        startButton
      });
      
      // Should initialize game state
      expect(initializeGame).toHaveBeenCalled();
      
      // Should update initial score
      expect(updateScore).toHaveBeenCalled();
      
      // Should initialize input handlers
      expect(initInputHandlers).toHaveBeenCalledWith(gameBoard, startButton, expect.any(Function));
      
      // Should log initialization
      expect(console.log).toHaveBeenCalledWith('Pong game initialized and ready to play!');
    });
    
    test('should start game when start function is called', () => {
      // Import main.js to trigger DOMContentLoaded event listener
      require('../js/main.js');
      
      // Simulate DOMContentLoaded event
      domContentLoadedCallback();
      
      // Get start game function from initInputHandlers call
      const startGameFunction = initInputHandlers.mock.calls[0][2];
      
      // Call start game function
      startGameFunction();
      
      // Should update game state
      expect(startGameState).toHaveBeenCalled();
      
      // Should update UI
      expect(updateStartButton).toHaveBeenCalledWith('Restart Game');
      expect(updateScore).toHaveBeenCalledTimes(2); // Once on init, once on start
      
      // Should start game loop
      expect(startGameLoop).toHaveBeenCalled();
    });
  });
});
