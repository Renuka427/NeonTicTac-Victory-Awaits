let currentPage = 'welcome'; 
let currentPlayer = 'X';
let playerSymbol = 'X'; 
let aiPlayer = 'O'; 
let gridSize = 3;
let gameBoard = [];
let gameOver = false;
let mode = '';
let aiMoveInProgress = false;

let backgroundMusic = new Audio('path_to_music.mp3');  
backgroundMusic.loop = true;  
backgroundMusic.volume = 0.3;  
backgroundMusic.play();

function navigateTo(page) {
  currentPage = page;
  switch (page) {
    case 'welcome': showWelcomePage(); break;
    case 'grid-size': showGridSizePage(); break;
    case 'mode-selection': showModeSelectionPage(); break;
    case 'symbol-selection': showSymbolSelectionPage(); break;
    case 'game': createGameBoard(); break;
    case 'achievement': showAchievementPage(); break;
  }
}

function showWelcomePage() {
  document.getElementById('content').innerHTML = `
    <div id="welcome-page" class="animate__animated animate__fadeIn">
      <h1>Tic Tac Toe</h1>
      <h3>Welcome to Tic Tac Toe! Choose your grid size, game mode, and enjoy the game!</h3>
      <h2>Game Rules:</h2>
      <h3>
        Player 1 and Player 2 alternate turns.<br><br>
        Choose a grid size (3x3, 4x4, or 5x5).<br><br>
        In AI mode, you will play against the computer.<br><br>
        Choose your symbol (X or O) and try to win!<br><br>
      </h3>
      <button id="enter" class="enter-button">Enter</button>
    </div>
  `;
  document.getElementById('enter').addEventListener('click', () => navigateTo('grid-size'));
}

function showGridSizePage() {
  document.getElementById('content').innerHTML = `
    <div id="grid-size-page" class="animate__animated animate__fadeInUp">
      <h1>Select Grid Size</h1>
      <button class="grid-option" onclick="selectGridSize(3)">3x3</button><br>
      <button class="grid-option" onclick="selectGridSize(4)">4x4</button><br>
      <button class="grid-option" onclick="selectGridSize(5)">5x5</button><br>
      <button onclick="navigateTo('welcome')">Back</button>
    </div>
  `;
}

function selectGridSize(size) {
  gridSize = size;
  navigateTo('mode-selection');
}

function showModeSelectionPage() {
  document.getElementById('content').innerHTML = `
    <div id="mode-selection-page" class="animate__animated animate__fadeInUp">
      <h1>Select Game Mode</h1>
      <button onclick="selectMode('two-player')" class="pulse">Two Player</button><br>
      <button onclick="selectMode('ai')" class="pulse">AI vs Player</button><br>
      <button onclick="navigateTo('grid-size')">Back</button>
    </div>
  `;
}

function selectMode(selectedMode) {
  mode = selectedMode;
  navigateTo('symbol-selection');
}

function showSymbolSelectionPage() {
  document.getElementById('content').innerHTML = `
    <div id="symbol-selection-page" class="animate__animated animate__fadeIn">
      <h1>Select Your Symbol</h1>
      <button class="symbol-option" onclick="selectPlayerSymbol('X')">X</button><br>
      <button class="symbol-option" onclick="selectPlayerSymbol('O')">O</button><br>
      <button onclick="navigateTo('mode-selection')">Back</button>
    </div>
  `;
}

function selectPlayerSymbol(symbol) {
  playerSymbol = symbol;
  aiPlayer = (symbol === 'X') ? 'O' : 'X';
  navigateTo('game');
}

function createGameBoard() {
  gameBoard = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
  let gridHTML = '';
  for (let row = 0; row < gridSize; row++) {
    gridHTML += '<div class="row">';
    for (let col = 0; col < gridSize; col++) {
      gridHTML += `
        <button class="cell" data-row="${row}" data-col="${col}"></button>
      `;
    }
    gridHTML += '</div>';
  }

  let gridClass = `game-board-${gridSize}x${gridSize}`;

  document.getElementById('content').innerHTML = `
  <h1>Game Board</h1>
  <div id="game-board-page" class="${gridClass}">
    ${gridHTML}
  </div>
  <div class="game-buttons">
    <button onclick="navigateTo('mode-selection')">Back</button>
    <button id="reset-button" onclick="resetGame()">Reset Game</button>
    <button id="Next-button" onclick="showAchievementPage()">Next</button>
  </div>
  <div id="status"></div>
`;

  document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', handleCellClick);
  });

  gameOver = false;
  currentPlayer = playerSymbol;

  if (mode === 'ai' && currentPlayer === 'X') aiMove();
}

function resetGame() {
  gameOver = false;
  gameBoard = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
  document.getElementById('status').textContent = '';
  navigateTo('game');
}

function handleCellClick(e) {
  if (gameOver || e.target.textContent !== '') return;

  const row = e.target.dataset.row;
  const col = e.target.dataset.col;
  gameBoard[row][col] = currentPlayer;
  e.target.textContent = currentPlayer;

  const result = checkWinner();
  if (result === 'win') {
    gameOver = true;
    showWinner(`${currentPlayer} wins!`);
  } else if (result === 'draw') {
    gameOver = true;
    showWinner('It\'s a draw!');
  } else {
    currentPlayer = (currentPlayer === playerSymbol) ? aiPlayer : playerSymbol;
    if (mode === 'ai' && currentPlayer === aiPlayer) {
      aiMove();
    }
  }
}

function checkWinner() {
  for (let i = 0; i < gridSize; i++) {
    if (gameBoard[i].every(cell => cell === currentPlayer) ||
        gameBoard.map(row => row[i]).every(cell => cell === currentPlayer)) {
      return 'win';
    }
  }
  if (gameBoard.every((row, idx) => row[idx] === currentPlayer) ||
      gameBoard.every((row, idx) => row[gridSize - idx - 1] === currentPlayer)) {
    return 'win';
  }
  if (gameBoard.flat().every(cell => cell !== '')) {
    return 'draw';
  }
  return null;
}

function showWinner(message) {
  document.getElementById('status').textContent = message;
  document.querySelector('.game-board').classList.add('achievement');
  showConfetti();

  setTimeout(() => {
    navigateTo('achievement');
  }, 3000);  
}

function showConfetti() {
  const numConfetti = 150;
  const confettiContainer = document.createElement('div');
  confettiContainer.classList.add('confetti-container');
  
  const colors = ['#ff5733', '#33ff57', '#5733ff', '#ff33cc', '#33ccff'];

  for (let i = 0; i < numConfetti; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.width = `${Math.random() * 10 + 10}px`;
    confetti.style.height = `${Math.random() * 10 + 10}px`;
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.animationDuration = `${Math.random() * 2 + 4}s`;
    confetti.style.animationDelay = `${Math.random() * 1}s`;
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.zIndex = 9999;  
    confetti.style.opacity = Math.random() * 0.5 + 0.5;

    confetti.style.animationName = 'fallAndDrift';
    confettiContainer.appendChild(confetti);
  }

  document.body.appendChild(confettiContainer);

  setTimeout(() => {
    document.body.removeChild(confettiContainer);
  }, 5000);  
}

function aiMove() {
  if (gameOver) return;
  aiMoveInProgress = true;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (gameBoard[row][col] === '') {
        gameBoard[row][col] = aiPlayer;
        document.querySelector(`[data-row="${row}"][data-col="${col}"]`).textContent = aiPlayer;
        const result = checkWinner();
        if (result === 'win') {
          gameOver = true;
          showWinner(`${aiPlayer} wins!`);
        } else if (result === 'draw') {
          gameOver = true;
          showWinner('It\'s a draw!');
        } else {
          currentPlayer = playerSymbol;
        }
        return;
      }
    }
  }
}

function showAchievementPage() {
  document.getElementById('content').innerHTML = `
    <div id="achievement-page" class="animate__animated animate__fadeIn">
      <h1 class="animate__animated animate__bounceIn">Congratulations!</h1>
      <p class="animate__animated animate__fadeInUp">You won the game!</p>
      <div class="animate__animated animate__zoomIn">
        <button onclick="navigateTo('welcome')">Play Again</button>
        <button onclick="navigateTo('grid-size')">Change Grid Size</button>
        <button onclick="navigateTo('mode-selection')">Change Mode</button>
      </div>
      <div class="confetti-container"></div>
    </div>
  `;
  showConfetti();
}

navigateTo('welcome');
