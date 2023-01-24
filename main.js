// The call order of functions in this script:
// myGameBoard() is called first to make the board. It is styled in CSS to not have exterior
// borders in a 3x3grd.
//

// Immediately Invoked Function Expression (IIFE)
const myGameBoard = (function () {
  function makeBoard() {
    const boardDisplay = document.getElementById("brd");
    for (let i = 0; i < 9; i += 1) {
      const newTile = document.createElement("div"); // new tile element
      if (i < 3) { newTile.classList.add("top-rectangle"); } // for css styling the top border
      if (i % 3 === 0) { newTile.classList.add("left-rectangle"); } // for css styling the left border
      newTile.classList.add("rectangle"); // give it the class rectangle to be styled in css
      newTile.id = `tile${i}`; // "tile0", "tile1", et cetera.
      //   newTile.addEventListener("click", () => {

      //   }); // get id of tile when clicked
      boardDisplay.append(newTile); // append each tile to the board
    }
  }

  return {
    make: makeBoard,
  };
}());

myGameBoard.make(); // calls the gameboard IIFE

// Displays the player name and the score when the form submit is first clicked.
// Disables the form used to get player name and information.
function displayScore(playOne, playTwo) {
  const playerForm = document.getElementById("player-form");
  playerForm.style.display = "none";
  const displayOne = document.getElementById("one-name");
  const displayTwo = document.getElementById("two-name");
  const displayThree = document.getElementById("winner-name");

  displayOne.innerText = `${playOne.getName()}: ${playOne.getScore()}`;
  displayTwo.innerText = `${playTwo.getName()}: ${playTwo.getScore()}`;
  displayThree.innerText = "Last winner: ";
}

// Factory function to generate players instead of using a Constructor.
function createPlayer(name, score, start) {
  let privateName = name;
  let privateScore = score;
  let privateStart = start;
  return {
    getName() {
      return privateName;
    },
    setName(newName) {
      privateName = newName;
    },
    getScore() {
      return privateScore;
    },
    setScore(newScore) {
      privateScore = newScore;
    },
    incrementScore() {
      privateScore += 1;
    },
    decrementScore() {
      privateScore -= 1;
    },
    setStart(newStart) {
      privateStart = newStart;
    },
    getStart() {
      return privateStart;
    },
  };
}

function checkWinner() {
  const boardDisplay = document.getElementById("brd");
  const tiles = boardDisplay.children;

  const checkRow = (startIndex, endIndex) => {
    const row = [];
    // play with i to check the correct tiles
    for (let i = startIndex; i <= endIndex; i += 1) {
      row.push(tiles[i].innerText);
    }
    // If all the objects in a Set are the same, the size will be 1.
    // Check to make sure final element isn't empty/falsey.
    if (new Set(row).size === 1 && row[2] !== "") { return true; } // return to checkRow() call statement
    return false;
  };

  if (checkRow(0, 2) === true) return true; // check rows
  if (checkRow(3, 5) === true) return true;
  if (checkRow(6, 8) === true) return true;

  const checkColumn = (startIndex, endIndex) => {
    const column = [];
    for (let i = startIndex; i <= endIndex; i += 3) {
      column.push(tiles[i].innerText);
    }
    if (new Set(column).size === 1 && column[2] !== "") return true;
    return false;
  };

  if (checkColumn(0, 6) === true) return true; // check columns
  if (checkColumn(1, 7) === true) return true;
  if (checkColumn(2, 8) === true) return true;

  const checkDiagLtoR = (startIndex, endIndex) => {
    const diag = [];
    for (let i = startIndex; i <= endIndex; i += 4) {
      diag.push(tiles[i].innerText);
    }
    if (new Set(diag).size === 1 && diag[2] !== "") return true;
    return false;
  };

  if (checkDiagLtoR(0, 8) === true) return true; // check diagonal left to right

  const checkDiagRtoL = (startIndex, endIndex) => {
    const diag = [];
    for (let i = startIndex; i <= endIndex; i += 2) {
      diag.push(tiles[i].innerText);
    }
    if (new Set(diag).size === 1 && diag[2] !== "") return true;
    return false;
  };

  if (checkDiagRtoL(2, 6) === true) return true; // check diagonal right to left

  return false;
}

// The gameOver function ends the game, increments the player score, recalls the game state.
// param one: the player object of the winner
// param two: the winning player number (one or two)
// param three: the player object of the loser
function gameOver(winner, playerNum, loser) {
  winner.incrementScore();
  if (playerNum === "one") {
    const showScore = document.getElementById("one-name");
    showScore.innerText = `${winner.getName()}: ${winner.getScore()}`;
  } else {
    const showScore = document.getElementById("two-name");
    showScore.innerText = `${winner.getName()}: ${winner.getScore()}`;
  }
  const showWinner = document.getElementById("winner-name");
  showWinner.innerText = `Winner: ${winner.getName()}`;

  setTimeout(() => {
    const boardDisplay = document.getElementById("brd");
    const tiles = boardDisplay.children; // get tiles to be filled in
    for (let i = 0; i < tiles.length; i += 1) {
      tiles[i].innerText = ""; // remove text
      tiles[i].onclick = () => {}; // remove event listeners
    }
  }, 2000); // Delays the board wipe by 2 seconds, prevents an extra X/O from spawning.

  playGame(winner, loser);
}

// This function allows a tile's inner text to be filled with an X or an O when clicked.
// Each time a tile is clicked. The checkWinner function is called. If it returns true,
// the gameOver function is called.
// param one: the first player
// param two: the second player
function playGame(one, two) {
  const boardDisplay = document.getElementById("brd");
  const tiles = boardDisplay.children; // get tiles to be filled in
  for (let i = 0; i < tiles.length; i += 1) {
    tiles[i].addEventListener("click", () => generateXO(tiles[i]));
  }
  let turnCopy = 0; // set the turn number

  function generateXO(tile) {
    if (tile.innerText === "") {
      if (turnCopy === 0 || turnCopy % 2 === 0) {
        tile.innerText = "X";
        console.log("chose X");
        // If "X" wins.
        if (checkWinner() === true) {
          if (one.getStart() === true) {
            gameOver(one, "one", two); // if one started, one wins
            console.log("game over called");
          } else { gameOver(two, "two", one); }
        } else {
          turnCopy += 1;
        }
      } else {
        tile.innerText = "O";
        // If "O" wins
        if (checkWinner() === true) {
          if (one.getStart() !== true) {
            gameOver(one, "one", two); // if one didn't start, one wins
          } else { gameOver(two, "two", one); }
        } else {
          turnCopy += 1;
        }
      }
    } else; // If tile is filled nothing happens.
  }
}
// Gets the player inputs from a form object when it is submitted.
// Creates two players with names, scores, and start variables.
function getPlayerInput() {
  const playerOneInput = form.elements[0].value; // player one name
  const playerTwoInput = form.elements[1].value; // player two name
  const startChoice = form.elements.first.value; // the potential values: "one" or "two"
  const playerOne = createPlayer(playerOneInput, 0); // create player one
  const playerTwo = createPlayer("Computer", 0); // create player two

  if (playerTwoInput !== "") { playerTwo.setName(playerTwoInput); } // If player two name received input.

  // Set who starts the game.
  if (startChoice === "one") {
    playerOne.setStart(true);
    playerTwo.setStart(false);
  } else {
    playerOne.setStart(false);
    playerTwo.setStart(true);
  }

  displayScore(playerOne, playerTwo); // Initial score display.
  playGame(playerOne, playerTwo); // Controls the game state.
}

// Form contains the following options: to name the first and second player,
// to decide who starts, and to start the game.
const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  getPlayerInput();
});

function resetGame() {

}

const resetButton = document.querySelector("#reset");
resetButton.addEventListener("click", resetGame());
