// Immediately Invoked Function Expression (IIFE)
const myGameBoard = (function () {
  function makeBoard() {
    const boardDisplay = document.getElementById("brd");
    for (let i = 0; i < 9; i++) {
      const newTile = document.createElement("div"); // new tile element
      if (i < 3) { newTile.classList.add("top-rectangle"); } // for css styling the top border
      if (i % 3 === 0) { newTile.classList.add("left-rectangle"); } // for css styling the left border
      newTile.classList.add("rectangle"); // give it the class rectangle to be styled in css
      boardDisplay.append(newTile); // append each tile to the board
    }
  }

  return {
    make: makeBoard,
  };
}());

myGameBoard.make(); // calls the gameboard

function displayScore(playOne, playTwo) {
  const displayOne = document.getElementById("one-name");
  const displayTwo = document.getElementById("two-name");

  displayOne.innerText = `${playOne.getName()}: ${playOne.getScore()}`;
  displayTwo.innerText = `${playTwo.getName()}: ${playTwo.getScore()}`;
}

// Factory function to generate players instead of using a Constructor.
// Create new objects like this to prevent direct modification of player data:
// const player = createPlayer("John Doe", 0);
// console.log(player.getScore()); // Output: 0
// player.privateScore = -100; // direct modification should not be possible
// console.log(player.getScore()); // Output: 0

function createPlayer(name, score) {
  let privateName = name;
  let privateScore = score;
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
  };
}

function getPlayerInput() {
  const playerOneInput = form.elements[0].value;
  const playerTwoInput = form.elements[1].value;

  const playerOne = createPlayer(playerOneInput, 0);
  let playerTwo = createPlayer("Computer", 0);
  if (playerTwoInput !== "") { playerTwo = createPlayer(playerTwoInput, 0); }

  displayScore(playerOne, playerTwo);
}

const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  getPlayerInput();
});
