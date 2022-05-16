const X_CLASS = "x";
const CIRCLE_CLASS = "circle";
const PLAYER_X = "X";
const PLAYER_O = "O";
const DRAW = "draw";

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const cellElements = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");

const restartButton = document.getElementById("restartButton");
const resetButton = document.getElementById("resetButton");

const winningMessageElement = document.getElementById("winningMessage");
const winningMessageTextElement = document.querySelector(
  "[data-winning-message-text]"
);

const player_x_element = document.querySelector("[player-x]");
const player_x_name = document.querySelector("[player-x-name]");
const player_x_score = document.querySelector("[player-X-score]");

const player_o_element = document.querySelector("[player-o]");
const player_o_name = document.querySelector("[player-o-name]");
const player_o_score = document.querySelector("[player-O-score]");

const drawScore = document.querySelector("[draw-score]");

const changePlayerNameElement = document.getElementById("changePlayerName");
const savePlayerNameButton = document.getElementById("saveChanges");
const PlayerNameInput = document.getElementById("newPlayerName");

const playerTurn = document.querySelector("[player-turn]");

let circleTurn;
let starterPlayerCircle = true;

startGame();
setScoreBoadr();
setPlayerName();

restartButton.addEventListener("click", startGame);

function startGame() {
  circleTurn = false;
  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  setBoardHoverClass();

  playerTurn.textContent = starterPlayerCircle ? "X" : "O";
  winningMessageElement.classList.remove("show");
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  placeMark(cell, currentClass);
  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
  }
}

function setScoreBoadr() {
  drawScore.innerText = getScore("draw");

  player_x_score.innerText = getScore("X-score");

  player_o_score.innerText = getScore("O-score");
}

function getScore(item) {
  return localStorage.getItem(item) ? localStorage.getItem(item) : 0;
}

function setPlayerName() {
  player_x_name.innerText = localStorage.getItem("X-name")
    ? localStorage.getItem("X-name")
    : "Palyer One";

  player_o_name.innerText = localStorage.getItem("O-name")
    ? localStorage.getItem("O-name")
    : "Player Two";
}

function getPlayerName() {
  if (circleTurn) {
    return localStorage.getItem("O-name")
      ? localStorage.getItem("O-name")
      : "O";
  } else {
    return localStorage.getItem("X-name")
      ? localStorage.getItem("X-name")
      : "X";
  }
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = "Draw!";
    updateScoreBoard(DRAW);
  } else {
    winningMessageTextElement.innerText = `${getPlayerName()} win!`;
    updateScoreBoard(`${circleTurn ? PLAYER_O : PLAYER_X}`);
  }
  winningMessageElement.classList.add("show");
}

function isDraw() {
  return [...cellElements].every((cell) => {
    return (
      cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    );
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function swapTurns() {
  circleTurn = !circleTurn;
  playerTurn.textContent = circleTurn ? "O" : "X";
  //  localStorage.getItem("O-name") ? localStorage.getItem("O-name") : "O";
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(CIRCLE_CLASS);
  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

function updateScoreBoard(result) {
  if (result == DRAW) {
    drawScore.innerText = +drawScore.innerText + 1;
    localStorage.setItem("draw", +drawScore.innerText);
  } else if (result == PLAYER_X) {
    player_x_score.innerText = +player_x_score.innerText + 1;
    localStorage.setItem("X-score", +player_x_score.innerText);
  } else {
    player_o_score.innerText = +player_o_score.innerText + 1;
    localStorage.setItem("O-score", +player_o_score.innerText);
  }
}

resetButton.addEventListener("click", reSetGame);

function reSetGame() {
  localStorage.setItem("draw", 0);
  localStorage.setItem("X-score", 0);
  localStorage.setItem("O-score", 0);
  localStorage.setItem("X-name", "Player One");
  localStorage.setItem("O-name", "Player Two");
  startGame();
  setScoreBoadr();
  setPlayerName();
}

player_x_element.addEventListener("click", function () {
  OpenchangePlayerNameModal(PLAYER_X, "X-name");
});

player_o_element.addEventListener("click", function () {
  OpenchangePlayerNameModal(PLAYER_O, "O-name");
});

var whichPlayer;
function OpenchangePlayerNameModal(player, playerName) {
  changePlayerNameElement.classList.add("show");

  var oldPlayerName = localStorage.getItem(playerName)
    ? localStorage.getItem(playerName)
    : "Player Name";

  PlayerNameInput.value = oldPlayerName;

  whichPlayer = player;
}

savePlayerNameButton.addEventListener("click", function () {
  changePlayerName(whichPlayer);
});

function changePlayerName(player) {
  var newName = PlayerNameInput.value;
  if (player == PLAYER_X) {
    player_x_name.innerText = newName;
    localStorage.setItem("X-name", newName);
  } else {
    player_o_name.innerText = newName;
    localStorage.setItem("O-name", newName);
  }
  changePlayerNameElement.classList.remove("show");
}
