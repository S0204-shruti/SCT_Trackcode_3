let cells;
let currentPlayer;
let gameActive;
let gameMode;

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
  [0, 4, 8], [2, 4, 6]              // Diagonals
];

function startGame(mode) {
  gameMode = mode;
  document.querySelector('.mode-select').classList.add('hide');
  document.querySelector('.game-container').classList.remove('hide');
  currentPlayer = (gameMode === 'vs-computer') ? 'X' : 'X';
  resetGame();
}

function resetGame() {
  currentPlayer = 'X';
  gameActive = true;
  cells = document.querySelectorAll('[data-cell]');

  cells.forEach(cell => {
    cell.innerText = '';
    cell.disabled = false;
    cell.style.background = '#2196F3';
    cell.removeEventListener('click', handleClick); // Prevent duplicate listeners
    cell.addEventListener('click', handleClick);
  });

  document.getElementById('status').textContent = `${currentPlayer}'s turn`;

  if (gameMode === 'vs-computer' && currentPlayer === 'O') {
    setTimeout(computerMove, 500);
  }
}

function handleClick(e) {
  const cell = e.target;
  if (!gameActive || cell.innerText !== '') return;

  cell.innerText = currentPlayer;
  cell.disabled = true;

  if (checkWin()) {
    gameActive = false;
    document.getElementById('status').textContent = `${currentPlayer} Wins!`;
    highlightWinningCombination();
    return;
  }

  if (checkDraw()) {
    gameActive = false;
    document.getElementById('status').textContent = "Draw!";
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  document.getElementById('status').textContent = `${currentPlayer}'s turn`;

  if (gameMode === 'vs-computer' && currentPlayer === 'O' && gameActive) {
    setTimeout(computerMove, 500);
  }
}

function computerMove() {
  if (!gameActive) return;

  const emptyCells = [...cells].filter(cell => cell.innerText === '');
  if (emptyCells.length === 0) return;

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const cell = emptyCells[randomIndex];
  cell.innerText = currentPlayer;
  cell.disabled = true;

  if (checkWin()) {
    gameActive = false;
    document.getElementById('status').textContent = `${currentPlayer} Wins!`;
    highlightWinningCombination();
    return;
  }

  if (checkDraw()) {
    gameActive = false;
    document.getElementById('status').textContent = "Draw!";
    return;
  }

  currentPlayer = 'X';
  document.getElementById('status').textContent = `${currentPlayer}'s turn`;
}

function checkWin() {
  return winningCombinations.some(combination => {
    return combination.every(index => {
      return cells[index].innerText === currentPlayer;
    });
  });
}

function checkDraw() {
  return [...cells].every(cell => cell.innerText !== '');
}

function highlightWinningCombination() {
  winningCombinations.forEach(combination => {
    if (combination.every(index => cells[index].innerText === currentPlayer)) {
      combination.forEach(index => {
        cells[index].style.background = '#4CAF50';
      });
    }
  });
}
