// Immediately Invoked Function Expression (IIFE), so I can have private variables
(function () {
  let privateTurn = 0; // marks the current turn during the game
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

  // The gameStateCheck function fins out if the turn is even or odd, takes the
  // player one object and player two object.
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
        gameOver(one, "one"); // if one started, and even/X wins, then one wins
      } else { privateFlag = true; gameOver(two, "two"); }
    } else if (checkWinner() === true && evenOdd === "odd") {
      if (one.getStart() !== true) {
        privateFlag = true;
        gameOver(one, "one"); // if one didn't start, and odd/O wins, then one wins
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

  // // Find out if it's the computer's turn. Returns true if it is, false if not.
  // function aiTurn(two) {
  //   // if starts and turn is even
  //   if (two.getStart() === true && privateTurn % 2 === 0) { return true; }
  //   // if second and turn is odd
  //   if (two.getStart() !== true && privateTurn % 2 !== 0) { return true; }
  //   return false;
  // }

  // Handles the computer's first move.
  function aiStarts(two, tiles) {
    // If computer can start and it's turn 0, fill the middle tile.
    if (two.getStart() === true && privateTurn === 0) {
      tiles[4].innerText = "X";
      privateTurn += 1;
    }
  }

  // Checks to see if the AI has two in a row with a spot waiting to be filled.
  function aiSelfWin(two) {
    const boardDisplay = document.getElementById("brd");
    const tiles = boardDisplay.children;
    let opponent; // player one is either X or O
    let self; // computer is either X or O
    if (two.getStart() === true) { opponent = "O"; self = "X"; } else { opponent = "X"; self = "O"; }

    const checkRow = (startIndex, endIndex) => {
      let enemyCount = 0; // counter for number of tiles an enemy player has on a given row
      let selfCount = 0; // counter for number of tiles the computer has on a given row
      let tileFill; // missing tile to fill

      for (let i = startIndex; i <= endIndex; i += 1) {
        if (tiles[i].innerText === opponent) { enemyCount += 1; }
        if (tiles[i].innerText === self) { selfCount += 1; }
        if (tiles[i].innerText === "") { tileFill = tiles[i]; }
      }

      // If the selfCount is two on a row and the enemy count is 0, then fill the last tile.
      if (selfCount === 2 && enemyCount === 0) { tileFill.innerText = self; return true; }
      return false;
    };

    if (checkRow(0, 2) === true) return true; // check rows
    if (checkRow(3, 5) === true) return true;
    if (checkRow(6, 8) === true) return true;

    const checkColumn = (startIndex, endIndex) => {
      let enemyCount = 0; // counter for number of tiles an enemy player has on a given row
      let selfCount = 0; // counter for number of tiles the computer has on a given row
      let tileFill; // missing tile to fill

      for (let i = startIndex; i <= endIndex; i += 3) {
        if (tiles[i].innerText === opponent) { enemyCount += 1; }
        if (tiles[i].innerText === self) { selfCount += 1; }
        if (tiles[i].innerText === "") { tileFill = tiles[i]; }
      }

      if (selfCount === 2 && enemyCount === 0) { tileFill.innerText = self; return true; }
      return false;
    };

    if (checkColumn(0, 6) === true) return true; // check columns
    if (checkColumn(1, 7) === true) return true;
    if (checkColumn(2, 8) === true) return true;

    const checkDiagLtoR = (startIndex, endIndex) => {
      let enemyCount = 0; // counter for number of tiles an enemy player has on a given row
      let selfCount = 0; // counter for number of tiles the computer has on a given row
      let tileFill; // missing tile to fill

      for (let i = startIndex; i <= endIndex; i += 4) {
        if (tiles[i].innerText === opponent) { enemyCount += 1; }
        if (tiles[i].innerText === self) { selfCount += 1; }
        if (tiles[i].innerText === "") { tileFill = tiles[i]; }
      }

      if (selfCount === 2 && enemyCount === 0) { tileFill.innerText = self; return true; }
      return false;
    };

    if (checkDiagLtoR(0, 8) === true) return true; // check diagonal left to right

    const checkDiagRtoL = (startIndex, endIndex) => {
      let enemyCount = 0; // counter for number of tiles an enemy player has on a given row
      let selfCount = 0; // counter for number of tiles the computer has on a given row
      let tileFill; // missing tile to fill

      for (let i = startIndex; i <= endIndex; i += 2) {
        if (tiles[i].innerText === opponent) { enemyCount += 1; }
        if (tiles[i].innerText === self) { selfCount += 1; }
        if (tiles[i].innerText === "") { tileFill = tiles[i]; }
      }

      if (selfCount === 2 && enemyCount === 0) { tileFill.innerText = self; return true; }
      return false;
    };

    if (checkDiagRtoL(2, 6) === true) return true; // check diagonal right to left

    return false;
  }

  // Checks to see if the player has two in a row with a spot waiting to be filled.
  function aiEnemyWin(two) {
    const boardDisplay = document.getElementById("brd");
    const tiles = boardDisplay.children;
    let opponent; // player one is either X or O
    let self; // computer is either X or O
    if (two.getStart() === true) { opponent = "O"; self = "X"; } else { opponent = "X"; self = "O"; }

    const checkRow = (startIndex, endIndex) => {
      let enemyCount = 0; // counter for number of tiles an enemy player has on a given row
      let selfCount = 0; // counter for number of tiles the computer has on a given row
      let tileFill; // missing tile to fill

      for (let i = startIndex; i <= endIndex; i += 1) {
        if (tiles[i].innerText === opponent) { enemyCount += 1; }
        if (tiles[i].innerText === self) { selfCount += 1; }
        if (tiles[i].innerText === "") { tileFill = tiles[i]; }
      }

      // If the selfCount is 0 on a row and the enemy count is 2, then fill the last tile.
      if (enemyCount === 2 && selfCount === 0) { tileFill.innerText = self; return true; }
      return false;
    };

    if (checkRow(0, 2) === true) return true; // check rows
    if (checkRow(3, 5) === true) return true;
    if (checkRow(6, 8) === true) return true;

    const checkColumn = (startIndex, endIndex) => {
      let enemyCount = 0; // counter for number of tiles an enemy player has on a given row
      let selfCount = 0; // counter for number of tiles the computer has on a given row
      let tileFill; // missing tile to fill

      for (let i = startIndex; i <= endIndex; i += 3) {
        if (tiles[i].innerText === opponent) { enemyCount += 1; }
        if (tiles[i].innerText === self) { selfCount += 1; }
        if (tiles[i].innerText === "") { tileFill = tiles[i]; }
      }

      if (enemyCount === 2 && selfCount === 0) { tileFill.innerText = self; return true; }
      return false;
    };

    if (checkColumn(0, 6) === true) return true; // check columns
    if (checkColumn(1, 7) === true) return true;
    if (checkColumn(2, 8) === true) return true;

    const checkDiagLtoR = (startIndex, endIndex) => {
      let enemyCount = 0; // counter for number of tiles an enemy player has on a given row
      let selfCount = 0; // counter for number of tiles the computer has on a given row
      let tileFill; // missing tile to fill

      for (let i = startIndex; i <= endIndex; i += 4) {
        if (tiles[i].innerText === opponent) { enemyCount += 1; }
        if (tiles[i].innerText === self) { selfCount += 1; }
        if (tiles[i].innerText === "") { tileFill = tiles[i]; }
      }

      if (enemyCount === 2 && selfCount === 0) { tileFill.innerText = self; return true; }
      return false;
    };

    if (checkDiagLtoR(0, 8) === true) return true; // check diagonal left to right

    const checkDiagRtoL = (startIndex, endIndex) => {
      let enemyCount = 0; // counter for number of tiles an enemy player has on a given row
      let selfCount = 0; // counter for number of tiles the computer has on a given row
      let tileFill; // missing tile to fill

      for (let i = startIndex; i <= endIndex; i += 2) {
        if (tiles[i].innerText === opponent) { enemyCount += 1; }
        if (tiles[i].innerText === self) { selfCount += 1; }
        if (tiles[i].innerText === "") { tileFill = tiles[i]; }
      }

      if (enemyCount === 2 && selfCount === 0) { tileFill.innerText = self; return true; }
      return false;
    };

    if (checkDiagRtoL(2, 6) === true) return true; // check diagonal right to left

    return false;
  }

  // If the AI cannot find two in a row from previous functions,
  // then it will choose a random unfilled tile and fill it.
  function aiRandomMove(two, tiles) {
    let flag = false;
    // If computer starts and it's turn 0, fill the middle tile.
    for (let i = 0; i < tiles.length; i += 1) {
      if (tiles[i].innerText === "") {
        if (two.getStart() === true) {
          tiles[i].innerText = "X";
          flag = true;
          break;
        } else {
          tiles[i].innerText = "O"; // marks first available tile, if going second
          flag = true;
          break;
        }
      }
    }
    if (flag === true) return true;
    return false;
  }

  function aiPlays(two) {
    const boardDisplay = document.getElementById("brd");
    const tiles = boardDisplay.children;

    if (aiSelfWin(two) === true) return true; // check to see if the AI can win
    if (aiEnemyWin(two) === true) return true; // check to if the player can win
    if (aiRandomMove(two, tiles) === true) return true;
    return false;
  }

  // The AI makes the first move, if the AI is going first.
  // A click event is attached to each tile.
  // When a move is made, the AI makes a corresponding move.
  function aiGame(one, two) {
    const boardDisplay = document.getElementById("brd");
    const tiles = boardDisplay.children; // get tiles to be filled in
    aiStarts(two, tiles); // determines the AI's starting move, if X
    for (let i = 0; i < tiles.length; i += 1) {
      tiles[i].addEventListener("click", () => {
        generateWithAI(tiles[i]);
      });
    }

    function generateWithAI(tile) {
    // If tile is empty and the game is not over.
      if (tile.innerText === "" && privateFlag !== true) {
        if (privateTurn === 0 || privateTurn % 2 === 0) {
          tile.innerText = "X";
          // If player "X" wins.
          gameStateCheck("even", one, two);
          // AI follows player turn on the same click.
          if (privateFlag !== true) {
            setTimeout(() => {
              aiPlays(two);
              gameStateCheck("odd", one, two);
            }, 1000);
          } // check computer "O" win condition
        } else {
          tile.innerText = "O";
          // If player "O" wins.
          gameStateCheck("odd", one, two);
          // AI follows player turn on the same click.
          if (privateFlag !== true) {
            setTimeout(() => {
              aiPlays(two);
              gameStateCheck("even", one, two);
            }, 1000);
          }
        }
      }
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
