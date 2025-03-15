# Web Pong Game

A classic Pong game implemented as a web application using HTML, CSS, and JavaScript.

## Features

- Player vs Computer gameplay
- Keyboard (arrow keys) and mouse control options
- Increasing difficulty as the game progresses
- Score tracking
- First to 5 points wins

## How to Play

1. Open `index.html` in your web browser
2. Click the "Start Game" button or press the spacebar
3. Control your paddle (left side) using:
   - Mouse movement (hover over the game board)
   - Up and down arrow keys
4. Try to hit the ball with your paddle and score points when the computer misses
5. First player to reach 5 points wins the game

## Game Controls

- **Mouse**: Move your cursor up and down over the game board
- **Keyboard**: Use the up and down arrow keys
- **Start/Restart**: Click the "Start Game" button or press spacebar

## Technical Implementation

The game is built using:
- HTML5 for structure
- CSS3 for styling
- Vanilla JavaScript for game logic and animations

Key technical features:
- Modular ES6 architecture with separate modules for different game components
- Collision detection
- Computer AI with adjustable difficulty
- Smooth animations using requestAnimationFrame
- Responsive paddle controls
- Dynamic ball speed and angle calculations

## Development

### Project Structure

The game is organized into modular components:
- `main.js` - Entry point of the application
- `collision.js` - Handles collision detection logic
- `gameLoop.js` - Manages the game loop and updates
- `gameState.js` - Manages the state of the game (scores, game over conditions)
- `input.js` - Processes keyboard and mouse inputs
- `rendering.js` - Updates the DOM to reflect game state

### Testing

The project includes a comprehensive test suite using Jest:

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage report
npm run test:coverage
```

Tests cover all game modules with unit tests for:
- Collision detection
- Game loop functionality
- Game state management
- Input handling
- Rendering

### Continuous Integration

This project uses GitHub Actions for continuous integration. The CI pipeline:
- Runs on every push and pull request to main/master branches
- Installs dependencies
- Runs linting checks
- Executes the test suite
- Uploads test coverage reports
- Creates an issue if tests fail

You can view the CI configuration in `.github/workflows/ci.yml`.

## License

MIT
