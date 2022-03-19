const width = 10,
  playerShipsObject = {},
  computerShipsObject = {};

const playerSquares = [],
  computerSquares = [];

const explosion = new Audio("sounds/success.mp3"),
  splash = new Audio("sounds/fail.wav"),
  startSound = new Audio("sounds/sea.wav"),
  firing = new Audio("sounds/shot.wav");

const masterShipsArray = [
  {
    name: "airplane",
    size: 5,
  },
  {
    name: "tank1",
    size: 4,
  },
  {
    name: "tank2",
    size: 4,
  },
  {
    name: "contra1",
    size: 3,
  },
  {
    name: "contra2",
    size: 3,
  },
  {
    name: "contra3",
    size: 3,
  },
  {
    name: "sub1",
    size: 2,
  },
  {
    name: "sub2",
    size: 2,
  },
  {
    name: "sub3",
    size: 2,
  },
  {
    name: "sub4",
    size: 2,
  },
];

let shipLength = 0,
  playerShips = 10,
  playerShipsLeft = 10,
  computerShipsLeft = 10,
  ships = masterShipsArray.slice(),
  shipType,
  randomIndex,
  clickedIndex,
  orientation,
  placeShip,
  playerChoice = false,
  playerTurn = true,
  block;

let shipChoiceButtons,
  horizontalBtn,
  verticalBtn,
  shipTypeBtn,
  resetBtn,
  startBtn,
  anotherGameBtn,
  modalWrapper,
  gameOverWrapper,
  shipsToPlace,
  yourShipsDestroyed,
  computerShipsDestroyed,
  errorMessage;

function initialiseGame() {
  modalWrapper = document.querySelector(".modal-wrapper");
  gameOverWrapper = document.querySelector(".gameover");

  shipChoiceButtons = document.querySelectorAll(".player-choice-button");
  horizontalBtn = document.getElementById("placeHorizontal");
  verticalBtn = document.getElementById("placeVertical");
  shipTypeBtn = document.querySelectorAll(".ship-button");
  resetBtn = document.querySelector(".reset-button");
  startBtn = document.querySelector(".start-button");
  anotherGameBtn = document.querySelector(".play-again-button");

  shipsToPlace = document.getElementById("ships-to-place");
  yourShipsDestroyed = document.getElementById("ships-destroyed");
  computerShipsDestroyed = document.getElementById("comp-destroyed");
  errorMessage = document.querySelector(".error-message");

  createGrid();
}

function createGrid() {
  for (let i = 0; i < width * width; i++) {
    const compGridSquare = document.createElement("div");
    document.querySelector(".grid").appendChild(compGridSquare);
    compGridSquare.classList.add("square");
    computerSquares.push(compGridSquare); //computador
  }

  for (let i = 0; i < width * width; i++) {
    const playerGridSquare = document.createElement("div");
    document.querySelector(".player-grid").appendChild(playerGridSquare);
    playerGridSquare.classList.add("player-square");
    playerSquares.push(playerGridSquare); // jogador
  }

  shipsToPlace.innerText = playerShips;

  computerPlaceShips();
  addEventListeners();
}

function computerPlaceShips() {
  // Creates a new array to keep the original intact ========
  ships = masterShipsArray.slice();

  while (ships.length > 0) {
    const ship = ships[0];
    shipLength = ship.size;

    let canPlaceShip = true;

    // Choose horizontal or vertical ship
    const randomDirection = Math.random() >= 0.5;
    randomIndex = Math.floor(Math.random() * computerSquares.length);

    let columnIndex = randomIndex % width;
    let rowIndex = Math.floor(randomIndex / width);

    //Make horizontal ship
    if (randomDirection === true) {
      orientation = 1;
      while (width - columnIndex < shipLength) {
        randomIndex = Math.floor(Math.random() * computerSquares.length);
        columnIndex = randomIndex % width;
      }

      // Make vertical ship
    } else {
      orientation = 10;
      while (rowIndex - 1 + shipLength >= width) {
        randomIndex = Math.floor(Math.random() * computerSquares.length);
        columnIndex = randomIndex % width;
        rowIndex = Math.floor(randomIndex / width);
      }
    }

    // creates ships
    for (let i = 0; i < shipLength; i++) {
      const nextIndex = randomIndex + i * orientation;
      if (
        computerSquares[nextIndex].classList.contains("ship") ||
        computerSquares[nextIndex].classList.contains("block")
      )
        canPlaceShip = false;
    }

    if (canPlaceShip) {
      ships.shift();
    }

    const computerShip = [];
    let shipSquare;
    if (canPlaceShip) {
      for (let i = 0; i < shipLength; i++) {
        const nextIndex = randomIndex + i * orientation;
        shipSquare = computerSquares[nextIndex];
        shipSquare.classList.add("ship");
        shipSquare.setAttribute("data-computership", ship.name);
        computerShip.push(nextIndex);
      }
      computerShipsObject[shipSquare.dataset.computership] = computerShip;

      if (randomDirection === true) {
        blockAroundHorizontalShip();
      } else {
        blockAroundVerticalShip();
      }
    }
  }
  ships = masterShipsArray.slice();
}

function playerCanPlaceShips() {
  playerSquares.forEach((element, index) => {
    element.addEventListener("click", () => {
      const selectedShip = ships.find((ship) => {
        return ship.name === shipType;
      });

      if (!selectedShip) {
        errorMessage.innerText = "Tipo não disponível. Coloque outro";
      } else {
        shipLength = selectedShip.size;
        placeShip = true;

        if (playerChoice && playerShips) {
          const playerShipStart = index;
          randomIndex = playerShipStart; //Sets index for blockade

          const playerColumnIndex = index % width;
          const playerRowIndex = Math.floor(index / width);

          if (width - playerColumnIndex < shipLength && orientation === 1) {
            placeShip = false;
            errorMessage.innerText =
              "Tente novamente. O navio vai exceder o grid";
          } else if (
            playerRowIndex - 1 + shipLength >= width &&
            orientation === 10
          ) {
            placeShip = false;
            errorMessage.innerText =
              "Tente novamente. O navio vai exceder o grid";
          } else if (placeShip) {
            for (let i = 0; i < shipLength; i++) {
              const playerNextIndex = randomIndex + i * orientation;
              if (
                playerSquares[playerNextIndex].classList.contains("ship") ||
                playerSquares[playerNextIndex].classList.contains("block")
              ) {
                placeShip = false;
                errorMessage.innerText =
                  "Você não pode colocar um navio sobre o outro";
              }
            }
          } else {
            placeShip = true;
            errorMessage.innerText = "Coloque seu navio";
          }
          playerPlaceShips();
        }
      }
    });
  });
}

function playerPlaceShips() {
  const playerShip = [];
  let playerShipSquare;

  if (placeShip) {
    for (let i = 0; i < shipLength; i++) {
      errorMessage.innerText = "Coloque seus navios";
      const playerNextIndex = randomIndex + i * orientation;
      playerShipSquare = playerSquares[playerNextIndex];
      playerShipSquare.classList.add("ship");
      playerShipSquare.setAttribute("data-playership", playerShips);
      playerShip.push(playerNextIndex);
    }
    playerShipsObject[playerShipSquare.dataset.playership] = playerShip;

    let shipToBeRemoved = ships.findIndex((ship) => ship.name === shipType);

    ships.splice(shipToBeRemoved, 1);

    playerShips--;
    const buttonDisabled = document.getElementById(shipType);
    buttonDisabled.classList.add("hidden");

    if (orientation === 1) {
      blockAroundHorizontalShip();
    } else {
      blockAroundVerticalShip();
    }
  }
  if (playerShips === 0) {
    errorMessage.innerText = "Comece a jogar";
  }
  shipsToPlace.innerText = playerShips;
}

function blockAroundVerticalShip() {
  let lengthOfBlockade = shipLength + 2;
  const rowIndex = Math.floor(randomIndex / width);
  const columnIndex = randomIndex % width;
  let startOfBlockade = randomIndex - width + 1;
  let endOfBlockade = randomIndex - width - 1;
  let topBlockade = randomIndex - width;
  let bottomBlockade = randomIndex + shipLength * width;

  // If vertical ship against left
  if (columnIndex === 0 && rowIndex !== 0 && rowIndex !== width - shipLength) {
    endOfBlockade = startOfBlockade;

    // If vertical ship against right
  } else if (
    columnIndex === 9 &&
    rowIndex !== 0 &&
    rowIndex !== width - shipLength
  ) {
    startOfBlockade = endOfBlockade;

    // If vertical ship on bottom row
  } else if (
    columnIndex !== width - width &&
    columnIndex !== width - 1 &&
    rowIndex === width - shipLength
  ) {
    bottomBlockade = topBlockade;
    lengthOfBlockade--;

    // If vertical ship in top left corner
  } else if (randomIndex === 0) {
    startOfBlockade = randomIndex + 1;
    endOfBlockade = startOfBlockade;
    topBlockade = bottomBlockade;
    lengthOfBlockade--;

    // If vertical ship in the top right corner
  } else if (randomIndex === 9) {
    topBlockade = randomIndex + shipLength * width;
    endOfBlockade = endOfBlockade + width;
    startOfBlockade = endOfBlockade;
    lengthOfBlockade--;

    //Vertical ship ends bottom right corner
  } else if (columnIndex === width - 1 && rowIndex === width - shipLength) {
    startOfBlockade = startOfBlockade - 2;
    bottomBlockade = topBlockade;
    lengthOfBlockade--;

    //Vertical ship ends bottom left corner
  } else if (columnIndex === 0 && rowIndex === width - shipLength) {
    endOfBlockade = startOfBlockade;
    bottomBlockade = topBlockade;
    lengthOfBlockade--;

    //Vertical ship top row
  } else if (rowIndex === 0 && columnIndex !== 0 && columnIndex !== width - 1) {
    startOfBlockade = startOfBlockade + width;
    endOfBlockade = endOfBlockade + width;
    topBlockade = bottomBlockade;
    lengthOfBlockade--;
  }

  //Default vertical blockade and sets whether player board or computer
  block = computerSquares;
  if (placeShip) {
    block = playerSquares;
  }

  block[topBlockade].classList.add("block"); // vertical top middle
  block[bottomBlockade].classList.add("block"); // vertical bottom middle

  for (let i = 0; i < lengthOfBlockade * width; i = i + 10) {
    block[startOfBlockade + i].classList.add("block"); // vertical right side
    block[endOfBlockade + i].classList.add("block"); // vertical left side
  }
}

function blockAroundHorizontalShip() {
  let lengthOfBlockade = shipLength + 2;
  const rowIndex = Math.floor(randomIndex / width);
  const columnIndex = randomIndex % width;
  let startOfBlockade = randomIndex - width - 1;
  let endOfBlockade = randomIndex + width - 1;
  let leftBlockade = randomIndex - 1;
  let rightBlockade = randomIndex + shipLength;

  // If ship in top left corner
  if (randomIndex === 0) {
    endOfBlockade++;
    startOfBlockade = endOfBlockade;
    leftBlockade = rightBlockade;
    lengthOfBlockade--;

    // If ship is against left side
  } else if (
    randomIndex % width === 0 &&
    (columnIndex === 0) & (rowIndex !== width - 1)
  ) {
    startOfBlockade++;
    endOfBlockade++;
    leftBlockade = rightBlockade;
    lengthOfBlockade--;

    //If the ship is against right side
  } else if (
    (randomIndex + shipLength) % width === 0 &&
    rowIndex !== 0 &&
    rowIndex !== width - 1
  ) {
    rightBlockade = leftBlockade;
    lengthOfBlockade--;

    // If ship is against the top
  } else if (
    rowIndex === 0 &&
    columnIndex !== 0 &&
    (randomIndex + shipLength) % width > 0
  ) {
    startOfBlockade = endOfBlockade;

    //If ship is in top left corner
  } else if (randomIndex === 0) {
    lengthOfBlockade--;

    //If ship is in top right corner
  } else if (rowIndex === 0) {
    rightBlockade = leftBlockade;
    startOfBlockade = endOfBlockade;
    lengthOfBlockade--;

    //If ship is bottom left corner
  } else if (columnIndex === 0 && rowIndex === width - 1) {
    startOfBlockade++;
    endOfBlockade = startOfBlockade;
    leftBlockade = rightBlockade;
    lengthOfBlockade--;

    //Bottom row
  } else if (
    rowIndex === width - 1 &&
    columnIndex !== 0 &&
    columnIndex !== width - shipLength
  ) {
    endOfBlockade = startOfBlockade;

    //If ship is bottom right corner
  } else if ((randomIndex + shipLength) % 10 === 0 && rowIndex === width - 1) {
    endOfBlockade = startOfBlockade;
    rightBlockade = leftBlockade;
    lengthOfBlockade--;
  }

  block = computerSquares;
  if (placeShip) {
    block = playerSquares;
  }

  // Default blockade
  if (randomIndex === 0) {
    for (let i = 0; i < lengthOfBlockade; i++) {
      block[rightBlockade].classList.add("block"); //right
      block[endOfBlockade + i].classList.add("block"); // bottom
    }
  } else {
    block[rightBlockade].classList.add("block"); //right
    block[leftBlockade].classList.add("block"); //left

    for (let i = 0; i < lengthOfBlockade; i++) {
      block[startOfBlockade + i].classList.add("block"); // top
      block[endOfBlockade + i].classList.add("block"); // bottom
    }
  }
}

function gameOver() {
  modalWrapper.setAttribute("style", "display:flex");
  const instructionText = document.querySelector(".instructions-text");
  instructionText.setAttribute("style", "display: none");
  const gameOverText = document.querySelector(".gameover-text");
  gameOverWrapper.setAttribute("style", "display: flex");
  const startImage = document.getElementById("start-image");
  startImage.setAttribute("style", "display: none");
  startBtn.setAttribute("style", "display:none");

  if (playerShipsLeft === 0) {
    gameOverText.innerText = "Você perdeu!";
  } else if (computerShipsLeft === 0) {
    gameOverText.innerText = "Você venceu!";
  }
}

function resetGame() {
  playerTurn = true;
  placeShip = false;
  playerShips = 10;
  shipsToPlace.innerText = playerShips;
  yourShipsDestroyed.innerText = 10;
  computerShipsDestroyed.innerText = 10;
  modalWrapper.setAttribute("style", "display:none");

  shipTypeBtn.forEach((element) => {
    element.classList.remove("ship-button-selected");
    element.classList.remove("hidden");
  });
  const playerSquares = document.querySelectorAll(".player-square");
  const computerSquares = document.querySelectorAll(".square");
  playerSquares.forEach((element) => {
    element.className = "player-square";
  });

  computerSquares.forEach((element) => {
    element.className = "square";
  });

  computerPlaceShips();
}

function markAsHitOrMiss() {
  firing.play();

  setTimeout(() => {
    if (playerSquares[randomIndex].classList.contains("ship")) {
      playerSquares[randomIndex].classList.add("hit");
      playerSquares[randomIndex].classList.remove("ship");
      explosion.play();
      isShipDestroyed();
      lastHit = randomIndex;
      playerTurn = true;
    } else {
      // Guess has missed
      playerSquares[randomIndex].classList.add("miss");
      playerSquares[randomIndex].classList.remove("block");
      splash.play();
      playerTurn = true;
    }
  }, 1500);
}

function isShipDestroyed() {
  if (playerTurn) {
    //Checks if player has destroyed a ship
    const hitArray =
      computerShipsObject[computerSquares[clickedIndex].dataset.computership];
    let count = 0;

    for (let i = 0; i < hitArray.length; i++) {
      const hitCheck = computerSquares[hitArray[i]];
      if (hitCheck.classList.contains("hit")) {
        count++;
      }
      if (count === hitArray.length) {
        computerShipsLeft--;
        computerShipsDestroyed.innerText = computerShipsLeft;
      }
    }
    playerTurn = false;
  } else {
    //Checks if computer has destroyed a ship
    const hitArray =
      playerShipsObject[playerSquares[randomIndex].dataset.playership];

    let count = 0;

    for (let i = 0; i < hitArray.length; i++) {
      const hitCheck = playerSquares[hitArray[i]];
      if (hitCheck.classList.contains("hit")) {
        count++;
      }
      if (count === hitArray.length) {
        playerShipsLeft--;
        yourShipsDestroyed.innerText = playerShipsLeft;
      }
    }
  }
  if (computerShipsLeft === 0 || playerShipsLeft === 0) {
    gameOver();
  }
}

function computerGuess() {
  if (!playerTurn && playerShipsLeft > 0) {
    randomIndex = Math.floor(Math.random() * playerSquares.length);

    while (
      playerSquares[randomIndex].classList.contains("hit") ||
      playerSquares[randomIndex].classList.contains("miss")
    ) {
      randomIndex = Math.floor(Math.random() * playerSquares.length);
    }
    markAsHitOrMiss();
  }
}

function checkIfHit() {
  if (playerShips === 0) {
    firing.play();
  } else {
    errorMessage.classList.add("message-in");
    errorMessage.innerText = "Você precisa colocar seus navios primeiro";
  }

  setTimeout(() => {
    if (playerShips === 0 && playerTurn) {
      if (this.classList.contains("ship")) {
        this.classList.add("hit");
        explosion.play();
        this.removeEventListener("click", checkIfHit);
        clickedIndex = computerSquares.indexOf(this);
        isShipDestroyed();
      } else {
        this.classList.add("miss");
        splash.play();
        this.removeEventListener("click", checkIfHit);
        playerTurn = false;
      }
    }
  }, 1500);
  setTimeout(computerGuess, 3000);
}

function addEventListeners() {
  // CHECKS WHETHER THE PLAYER HAS HIT
  computerSquares.forEach((element) => {
    element.addEventListener("click", checkIfHit);
  });

  //WHERE A PLAYER PLACES A SHIP
  shipChoiceButtons.forEach((element) => {
    element.addEventListener("click", (e) => {
      if (e.target.id === "placeHorizontal" && playerShips) {
        e.target.classList.toggle("selected");
        verticalBtn.classList.remove("selected");
        playerChoice = true;
        orientation = 1;
      } else if (playerShips) {
        e.target.classList.toggle("selected");
        horizontalBtn.classList.remove("selected");
        playerChoice = true;
        orientation = 10;
      }
    });
  });

  resetBtn.addEventListener("click", resetGame);

  startBtn.addEventListener("click", () => {
    modalWrapper.setAttribute("style", "display: none");
    startSound.play();
  });

  anotherGameBtn.addEventListener("click", () => {
    gameOverWrapper.setAttribute("style", "display:none");
    resetGame();
  });

  // ALLOWS A PLAYER TO CHOOSE A SHIP SIZE
  shipTypeBtn.forEach((element) => {
    element.addEventListener("click", () => {
      if (!element.classList.contains("hidden"))
        element.classList.toggle("ship-button-selected");
      shipType = element.id;
      playerCanPlaceShips();
    });
  });
}
document.addEventListener("DOMContentLoaded", initialiseGame);
