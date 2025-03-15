/**
 * Tests for collision.js module
 */

// Mock the gameState module
jest.mock('../../js/modules/gameState.js', () => ({
  BOARD_WIDTH: 800,
  BOARD_HEIGHT: 500,
  PADDLE_HEIGHT: 100,
  PADDLE_WIDTH: 15,
  BALL_SIZE: 20,
  getGameState: jest.fn(),
  reverseBallX: jest.fn(),
  reverseBallY: jest.fn(),
  adjustBallAngle: jest.fn(),
  increaseBallSpeed: jest.fn(),
  increasePlayerScore: jest.fn(),
  increaseComputerScore: jest.fn()
}));

// Import the module to test
import {
  checkCollisions,
  keepBallInBounds
} from '../../js/modules/collision.js';

// Import mocked dependencies
import {
  BOARD_HEIGHT,
  BALL_SIZE,
  getGameState,
  reverseBallX,
  reverseBallY,
  adjustBallAngle,
  increaseBallSpeed,
  increasePlayerScore,
  increaseComputerScore
} from '../../js/modules/gameState.js';

describe('Collision Module', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Default game state
    getGameState.mockReturnValue({
      ballX: 400,
      ballY: 250,
      ballSpeedX: 5,
      ballSpeedY: 5,
      playerPaddleY: 200,
      computerPaddleY: 200
    });
  });

  describe('checkCollisions', () => {
    test('should detect top wall collision', () => {
      // Ball at top edge
      getGameState.mockReturnValue({
        ballX: 400,
        ballY: -5, // Ball touching top wall
        ballSpeedX: 5,
        ballSpeedY: -5, // Moving upward
        playerPaddleY: 200,
        computerPaddleY: 200
      });

      checkCollisions();
      
      // Should reverse Y direction
      expect(reverseBallY).toHaveBeenCalled();
    });

    test('should detect bottom wall collision', () => {
      // Ball at bottom edge
      getGameState.mockReturnValue({
        ballX: 400,
        ballY: BOARD_HEIGHT - BALL_SIZE + 5, // Ball touching bottom wall
        ballSpeedX: 5,
        ballSpeedY: 5, // Moving downward
        playerPaddleY: 200,
        computerPaddleY: 200
      });

      checkCollisions();
      
      // Should reverse Y direction
      expect(reverseBallY).toHaveBeenCalled();
    });

    test('should detect player paddle collision', () => {
      // Ball hitting player paddle
      getGameState.mockReturnValue({
        ballX: 35, // Just at player paddle X position
        ballY: 210, // Within paddle Y range
        ballSpeedX: -5, // Moving toward player paddle
        ballSpeedY: 0,
        playerPaddleY: 200,
        computerPaddleY: 200
      });

      checkCollisions();
      
      // Should reverse X direction and adjust angle
      expect(reverseBallX).toHaveBeenCalled();
      expect(adjustBallAngle).toHaveBeenCalledWith(200); // playerPaddleY
      expect(increaseBallSpeed).toHaveBeenCalled();
    });

    test('should detect computer paddle collision', () => {
      // Ball hitting computer paddle
      getGameState.mockReturnValue({
        ballX: 765, // Just at computer paddle X position
        ballY: 210, // Within paddle Y range
        ballSpeedX: 5, // Moving toward computer paddle
        ballSpeedY: 0,
        playerPaddleY: 200,
        computerPaddleY: 200
      });

      checkCollisions();
      
      // Should reverse X direction and adjust angle
      expect(reverseBallX).toHaveBeenCalled();
      expect(adjustBallAngle).toHaveBeenCalledWith(200); // computerPaddleY
      expect(increaseBallSpeed).toHaveBeenCalled();
    });

    test('should detect player scoring (ball past right edge)', () => {
      // Ball past right edge
      getGameState.mockReturnValue({
        ballX: 810, // Past right edge
        ballY: 250,
        ballSpeedX: 5,
        ballSpeedY: 0,
        playerPaddleY: 200,
        computerPaddleY: 200
      });

      checkCollisions();
      
      // Should increase player score
      expect(increasePlayerScore).toHaveBeenCalled();
    });

    test('should detect computer scoring (ball past left edge)', () => {
      // Ball past left edge
      getGameState.mockReturnValue({
        ballX: -30, // Past left edge
        ballY: 250,
        ballSpeedX: -5,
        ballSpeedY: 0,
        playerPaddleY: 200,
        computerPaddleY: 200
      });

      checkCollisions();
      
      // Should increase computer score
      expect(increaseComputerScore).toHaveBeenCalled();
    });
  });

  describe('keepBallInBounds', () => {
    test('should return 0 when ball is above top boundary', () => {
      getGameState.mockReturnValue({
        ballY: -10 // Ball above top boundary
      });
      
      const result = keepBallInBounds();
      expect(result).toBe(0);
    });

    test('should return max Y when ball is below bottom boundary', () => {
      getGameState.mockReturnValue({
        ballY: BOARD_HEIGHT + 10 // Ball below bottom boundary
      });
      
      const result = keepBallInBounds();
      expect(result).toBe(BOARD_HEIGHT - BALL_SIZE);
    });

    test('should return current Y when ball is within boundaries', () => {
      const currentY = 250;
      getGameState.mockReturnValue({
        ballY: currentY // Ball within boundaries
      });
      
      const result = keepBallInBounds();
      expect(result).toBe(currentY);
    });
  });
});
