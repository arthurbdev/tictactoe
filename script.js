const Gameboard = (() => {
  let board = Array(9).fill("");

  const getBoard = () => board;

  const setCell = (index, mark) => {
    getBoard()[index] = mark;
  }

  const resetBoard = () => {
    board = Array(9).fill("");
  }

  return {
    getBoard,
    setCell,
    resetBoard,
  }

})();

const GameController = ((playerOneName = "player 1", playerTwoName = "player 2") => {
  const board = Gameboard;

  const players = [
    {
      name: playerOneName,
      mark: "x"
    },
    {
      name: playerTwoName,
      mark: "o"
    }
  ]

  let currentPlayer = players[0];
  let winner = null;

  const flipPlayer = () => {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0]
  }

  const getCurrentPlayer = () => currentPlayer;

  const resetGame = () => {
    board.resetBoard();
    currentPlayer = players[0];
  }

  const checkWin = cell => {
    const b = board.getBoard();
    const winConditions = [
      [0 , 1, 2],
      [3 , 4, 5],
      [6, 7, 8],
      [0, 4, 8],
      [2, 4, 6],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8]
    ]

    return winConditions
    .filter(combo => combo.includes(cell))
    .some(possibleCombo => possibleCombo.every(index => b[index] === getCurrentPlayer().mark));
  }

  const playRound = cell => {
    if(board.getBoard()[cell]) return;

    board.setCell(cell, getCurrentPlayer().mark);
    if(checkWin(cell)) {
      return getCurrentPlayer();
    }

    flipPlayer();
  }

  const checkDraw = () => {
    const b = board.getBoard();
    return b.every(item => item)
  }

  return {
    playRound,
    getBoard: board.getBoard,
    getCurrentPlayer,
    resetGame,
    checkDraw
  }

})();
 
const DisplayController = (() => {
  const game = GameController;

  const turnDisplayElement = document.getElementById('turnDisplay');
  const gameBoardElement = document.getElementById('gameBoardContainer');
  const btn = document.createElement("button");
  btn.classList.add('playAgain');

  const displayBoard = () => {
    gameBoardElement.textContent = '';

    const board = game.getBoard();
    console.log(board)
    const currentPlayer = game.getCurrentPlayer();

    turnDisplayElement.classList = ''
    turnDisplayElement.classList.add(currentPlayer.mark)
    turnDisplayElement.textContent = `${currentPlayer.name.toUpperCase()} turn`


    board.forEach((el, i) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.index = i;
      cell.innerHTML = el;
      if(el) {
        cell.classList.add(el)
      }
      gameBoardElement.appendChild(cell)

    })
  }

  const playAgainClickHandler = e => {
    game.resetGame();
    console.log(game)
    document.body.removeChild(btn);
    gameBoardElement.addEventListener("click", boardclickHandler);
    displayBoard();
  }


  const displayPlayAgainButton = () => {
      btn.textContent = "Play Again?";
      turnDisplayElement.insertAdjacentElement('afterend', btn);
      btn.addEventListener('click', playAgainClickHandler);
      gameBoardElement.removeEventListener("click", boardclickHandler);
  }

  const boardclickHandler = (e) => {
    const selected = e.target.dataset.index;
    if (!selected) return;
    e.target.classList.add(`${game.getCurrentPlayer().mark}`)

    let winner = game.playRound(parseInt(selected));
    displayBoard();
    if(winner) {
      turnDisplayElement.textContent = `${winner.name.toUpperCase()} won.`;
      displayPlayAgainButton();
      return
    }
    if(game.checkDraw()) {
      turnDisplayElement.textContent = `DRAW!!`
      displayPlayAgainButton();
    }
  }
  gameBoardElement.addEventListener("click", boardclickHandler);

  displayBoard();
})();
