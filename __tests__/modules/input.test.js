/**
 * Tests for input.js module
 */

// Mock the gameState module
jest.mock('../../js/modules/gameState.js', () => ({
  setPlayerPaddleY: jest.fn(),
  BOARD_HEIGHT: 500,
  PADDLE_HEIGHT: 100
}));

// Import the module to test
import {
  initInputHandlers,
  processKeyboardInput,
  handleKeyDown,
  handleKeyUp,
  handleMouseMove
} from '../../js/modules/input.js';

// Import mocked dependencies
import { setPlayerPaddleY, BOARD_HEIGHT, PADDLE_HEIGHT } from '../../js/modules/gameState.js';

describe('Input Module', () => {
  // Mock DOM elements
  let gameBoard;
  let startButton;
  let startGameCallback;
  
  // Mock event objects
  const createKeyEvent = (key) => ({ key, preventDefault: jest.fn() });
  const createMouseEvent = (clientY) => ({ 
    clientY,
    preventDefault: jest.fn()
  });
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create mock DOM elements
    gameBoard = {
      addEventListener: jest.fn(),
      getBoundingClientRect: jest.fn(() => ({ top: 100 }))
    };
    
    startButton = {
      addEventListener: jest.fn()
    };
    
    startGameCallback = jest.fn();
    
    // Reset document event listeners
    document.addEventListener = jest.fn();
    document.removeEventListener = jest.fn();
  });

  describe('initInputHandlers', () => {
    test('should set up event listeners', () => {
      initInputHandlers(gameBoard, startButton, startGameCallback);
      
      // Should add click listener to start button
      expect(startButton.addEventListener).toHaveBeenCalledWith('click', startGameCallback);
      
      // Should add keydown and keyup listeners to document
      expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
      expect(document.addEventListener).toHaveBeenCalledWith('keyup', expect.any(Function));
      
      // Should add mousemove listener to game board
      expect(gameBoard.addEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
    });
  });

  describe('handleKeyDown', () => {
    test('should set key state to true for arrow keys', () => {
      // Test ArrowUp key
      handleKeyDown(createKeyEvent('ArrowUp'), startGameCallback);
      
      // Create new mocks for each test to avoid state issues
      const moveUpMock1 = jest.fn();
      const moveDownMock1 = jest.fn();
      
      processKeyboardInput({
        moveUp: moveUpMock1,
        moveDown: moveDownMock1
      });
      
      // Should call moveUp but not moveDown
      expect(moveUpMock1).toHaveBeenCalled();
      expect(moveDownMock1).not.toHaveBeenCalled();
      
      // Reset key state
      handleKeyUp(createKeyEvent('ArrowUp'));
      
      // Test ArrowDown key
      handleKeyDown(createKeyEvent('ArrowDown'), startGameCallback);
      
      // Create new mocks for the second test
      const moveUpMock2 = jest.fn();
      const moveDownMock2 = jest.fn();
      
      processKeyboardInput({
        moveUp: moveUpMock2,
        moveDown: moveDownMock2
      });
      
      // Should call moveDown but not moveUp
      expect(moveUpMock2).not.toHaveBeenCalled();
      expect(moveDownMock2).toHaveBeenCalled();
    });
    
    test('should call startGameCallback when spacebar is pressed', () => {
      handleKeyDown(createKeyEvent(' '), startGameCallback);
      
      expect(startGameCallback).toHaveBeenCalled();
    });
    
    test('should not call startGameCallback for other keys', () => {
      handleKeyDown(createKeyEvent('a'), startGameCallback);
      
      expect(startGameCallback).not.toHaveBeenCalled();
    });
  });

  describe('handleKeyUp', () => {
    test('should set key state to false for arrow keys', () => {
      // Set key state to true first
      handleKeyDown(createKeyEvent('ArrowUp'), startGameCallback);
      handleKeyDown(createKeyEvent('ArrowDown'), startGameCallback);
      
      // Reset mocks
      jest.clearAllMocks();
      
      // Call handleKeyUp with arrow up key
      handleKeyUp(createKeyEvent('ArrowUp'));
      
      // Call processKeyboardInput to check if key state was updated
      const moveUpMock = jest.fn();
      const moveDownMock = jest.fn();
      
      processKeyboardInput({
        moveUp: moveUpMock,
        moveDown: moveDownMock
      });
      
      // Should call moveDown but not moveUp
      expect(moveUpMock).not.toHaveBeenCalled();
      expect(moveDownMock).toHaveBeenCalled();
      
      // Reset mocks
      jest.clearAllMocks();
      
      // Call handleKeyUp with arrow down key
      handleKeyUp(createKeyEvent('ArrowDown'));
      
      // Call processKeyboardInput again
      processKeyboardInput({
        moveUp: moveUpMock,
        moveDown: moveDownMock
      });
      
      // Should not call either (both keys are now up)
      expect(moveUpMock).not.toHaveBeenCalled();
      expect(moveDownMock).not.toHaveBeenCalled();
    });
  });

  describe('handleMouseMove', () => {
    test('should update paddle position based on mouse Y position', () => {
      // Mouse in the middle of the board
      const mouseY = 300; // clientY
      const boardTop = 100; // from getBoundingClientRect().top
      const relativeY = mouseY - boardTop; // 200
      
      handleMouseMove(createMouseEvent(mouseY), gameBoard);
      
      // Should set paddle Y to center paddle on mouse Y
      expect(setPlayerPaddleY).toHaveBeenCalledWith(relativeY - PADDLE_HEIGHT / 2);
    });
    
    test('should not update paddle position if mouse is outside board', () => {
      // Mouse above the board
      handleMouseMove(createMouseEvent(50), gameBoard);
      
      // Should not call setPlayerPaddleY
      expect(setPlayerPaddleY).not.toHaveBeenCalled();
      
      // Mouse below the board
      handleMouseMove(createMouseEvent(650), gameBoard);
      
      // Should not call setPlayerPaddleY
      expect(setPlayerPaddleY).not.toHaveBeenCalled();
    });
  });

  describe('processKeyboardInput', () => {
    test('should call moveUp when ArrowUp key is down', () => {
      // Set ArrowUp key state to true
      handleKeyDown(createKeyEvent('ArrowUp'), startGameCallback);
      
      const moveUpMock = jest.fn();
      const moveDownMock = jest.fn();
      
      processKeyboardInput({
        moveUp: moveUpMock,
        moveDown: moveDownMock
      });
      
      // Should call moveUp
      expect(moveUpMock).toHaveBeenCalled();
      expect(moveDownMock).not.toHaveBeenCalled();
    });
    
    test('should call moveDown when ArrowDown key is down', () => {
      // Reset all key states
      handleKeyUp(createKeyEvent('ArrowUp'));
      handleKeyUp(createKeyEvent('ArrowDown'));
      
      // Set ArrowDown key state to true
      handleKeyDown(createKeyEvent('ArrowDown'), startGameCallback);
      
      const moveUpMock = jest.fn();
      const moveDownMock = jest.fn();
      
      processKeyboardInput({
        moveUp: moveUpMock,
        moveDown: moveDownMock
      });
      
      // Should call moveDown
      expect(moveDownMock).toHaveBeenCalled();
    });
    
    test('should call both moveUp and moveDown when both keys are down', () => {
      // Set both key states to true
      handleKeyDown(createKeyEvent('ArrowUp'), startGameCallback);
      handleKeyDown(createKeyEvent('ArrowDown'), startGameCallback);
      
      const moveUpMock = jest.fn();
      const moveDownMock = jest.fn();
      
      processKeyboardInput({
        moveUp: moveUpMock,
        moveDown: moveDownMock
      });
      
      // Should call both
      expect(moveUpMock).toHaveBeenCalled();
      expect(moveDownMock).toHaveBeenCalled();
    });
    
    test('should not call any methods when no keys are down', () => {
      // Reset all key states
      handleKeyUp(createKeyEvent('ArrowUp'));
      handleKeyUp(createKeyEvent('ArrowDown'));
      
      // Clear any previous calls
      jest.clearAllMocks();
      
      const moveUpMock = jest.fn();
      const moveDownMock = jest.fn();
      
      processKeyboardInput({
        moveUp: moveUpMock,
        moveDown: moveDownMock
      });
      
      // Should not call either
      expect(moveUpMock).not.toHaveBeenCalled();
      expect(moveDownMock).not.toHaveBeenCalled();
    });
  });
});
