// Immediately Invoked Function Expression (IIFE), so I can have private variables
(function () {
  let privateTurn = 0; // global variable in a private scope
  let privateFlag = false; // prevent inputs during game over

  // The game board is also an IIFE.
  const myGameBoard = (function () {
    function makeBoard() {
      const boardDisplay = document.getElementById("brd");
      for (let i = 0; i < 9; i += 1) {
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

  myGameBoard.make(); // calls the gameboard IIFE

  // Displays the player name and the score when the form submit is first clicked.
  // Disables the form used to get player name and information.
  // Enables the score display container.
  function displayScore(playOne, playTwo) {
    const playerForm = document.getElementById("player-form");
    playerForm.style.display = "none";
    const displayScreen = document.getElementById("post-name");
    displayScreen.style.display = "block";
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

  // The checkWinner function generates the tiles and puts each winning combination into an array.
  // Then the array is added to a set and if the size is 1, the winner has been found.
  // The checkWinner function then colors the innerText of the winning combination gold
  // and returns true.

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
      if (new Set(row).size === 1 && row[2] !== "") {
        for (let i = startIndex; i <= endIndex; i += 1) {
          tiles[i].setAttribute("id", "gameset");
        }
        return true;
      } // return to checkRow() call statement
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
      if (new Set(column).size === 1 && column[2] !== "") {
        for (let i = startIndex; i <= endIndex; i += 3) {
          tiles[i].setAttribute("id", "gameset");
        } return true;
      }
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
      if (new Set(diag).size === 1 && diag[2] !== "") {
        for (let i = startIndex; i <= endIndex; i += 4) {
          tiles[i].setAttribute("id", "gameset");
        } return true;
      }
      return false;
    };

    if (checkDiagLtoR(0, 8) === true) return true; // check diagonal left to right

    const checkDiagRtoL = (startIndex, endIndex) => {
      const diag = [];
      for (let i = startIndex; i <= endIndex; i += 2) {
        diag.push(tiles[i].innerText);
      }
      if (new Set(diag).size === 1 && diag[2] !== "") {
        for (let i = startIndex; i <= endIndex; i += 2) {
          tiles[i].setAttribute("id", "gameset");
        } return true;
      }
      return false;
    };

    if (checkDiagRtoL(2, 6) === true) return true; // check diagonal right to left

    return false;
  }

  // The gameOver function ends the game, increments the player score, recalls the game state.
  // param one: the player object of the winner
  // param two: the winning player number (one or two)
  // param three: the player object of the loser
  function gameOver(winner, playerNum) {
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
        tiles[i].removeAttribute("id");
        tiles[i].onclick = () => {}; // remove event listeners
        tiles[i].innerText = ""; // remove text
      }

      // Needs to be in here, since this timeout happens last.
      // Do not remove this flag.
      privateFlag = false;
    }, 1000); // Delays the board wipe by 1 second, prevents an extra X/O from spawning.

    privateTurn = 0;
  }

  function checkDraw() {
    const boardDisplay = document.getElementById("brd");
    const tiles = boardDisplay.children; // get tiles
    let drawFlag = true;
    for (let i = 0; i < tiles.length; i += 1) {
      if (tiles[i].innerText === "") drawFlag = false; // If there is any empty tile, a draw is not called.
    }

    if (drawFlag === true) {
      return true; // there is a draw
    }
    return false; // there is no draw
  }

  function drawGame() {
    const showWinner = document.getElementById("winner-name");
    showWinner.innerText = "The last game ended in a draw.";

    setTimeout(() => {
      const boardDisplay = document.getElementById("brd");
      const tiles = boardDisplay.children; // get tiles to be filled in
      for (let i = 0; i < tiles.length; i += 1) {
        tiles[i].onclick = () => {}; // remove event listeners
        tiles[i].innerText = ""; // remove text
      }

      // Needs to be in here, since this timeout happens last.
      // Do not remove this flag.
      privateFlag = false;
    }, 1000); // Delays the board wipe by 1 second, prevents an extra X/O from spawning.

    privateTurn = 0;
  }

  // The gameStateCheck function takes the turn number (even or odd for Xs and Os),
  // player one object, and player two object.
  // It checks to see if someone won and was even/odd.
  // Then it checks which player was the starting player.
  // It then sets the privateFlag to true (game over flag).
  // Then it calls the gameOver function. If it is a draw, it calls the drawGame function.
  // If nothing happens, the privateTurn variable increments.

  function gameStateCheck(evenOdd, one, two) {
    // Check if someone won and if they were X.
    if (checkWinner() === true && evenOdd === "even") {
      // Check if player one started/played Xs.
      if (one.getStart() === true) {
        privateFlag = true;
        gameOver(one, "one"); // if one started, one wins
      } else { privateFlag = true; gameOver(two, "two"); }
    } else if (checkWinner() === true && evenOdd === "odd") {
      if (one.getStart() !== true) {
        privateFlag = true;
        gameOver(one, "one"); // if one didn't start, one wins
      } else if (one.getStart() === true) { privateFlag = true; gameOver(two, "two"); }
    } else if (checkDraw() === true) {
      privateFlag = true;
      drawGame();
    } else {
      privateTurn += 1;
    }
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
      tiles[i].addEventListener("click", () => {
        generateXO(tiles[i]);
      });
    }
    function generateXO(tile) {
      // If tile is empty and the game is not over.
      if (tile.innerText === "" && privateFlag !== true) {
        if (privateTurn === 0 || privateTurn % 2 === 0) {
          tile.innerText = "X";
          // If "X" wins.
          gameStateCheck("even", one, two);
        } else {
          tile.innerText = "O";
          // If "O" wins
          gameStateCheck("odd", one, two);
        }
      }
    }
  }

  function aiGame(one, two) {
    const boardDisplay = document.getElementById("brd");
    const tiles = boardDisplay.children; // get tiles to be filled in
    for (let i = 0; i < tiles.length; i += 1) {
      tiles[i].addEventListener("click", () => {

      });
    }
  }

  // Gets the player inputs from a form object when it is submitted.
  // Creates two players with names, scores, and start variables.
  function getPlayerInput() {
    const playerOneInput = form.elements.nameOne.value; // player one name
    const playerTwoInput = form.elements.nameTwo.value; // player two name
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
    if (playerTwo.getName() === "Computer") { aiGame(playerOne, playerTwo); } else { playGame(playerOne, playerTwo); } // Controls the game state.
  }

  // Form contains the following options: to name the first and second player,
  // to decide who starts, and to start the game.
  const form = document.querySelector("form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    getPlayerInput();
  });
}());
