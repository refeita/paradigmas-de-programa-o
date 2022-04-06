let width;
(playerShipsObject = {}), (computerShipsObject = {});

const playerSquares = [],
  computerSquares = [],
  playerScores = [
    { score: 0 },
    { score: 0 },
    { score: 0 },
    { score: 0 },
    { score: 0 },
  ];

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
  orientation2,
  valor,
  classSquare,
  placeShip,
  playerChoice = false,
  block,
  contClick = 0,
  randMin = 0,
  randNum,
  contPlayerHits = 0,
  contPlayerMiss = 0,
  play = true,
  specialPlayCount = 0,
  compNextIndex;

let shipChoiceButtons,
  horizontalBtn,
  verticalBtn,
  shipTypeBtn,
  resetBtn,
  startBtn10,
  startBtn15,
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

  specialPlayButton = document.getElementById("special-play");

  shipChoiceButtons = document.querySelectorAll(".player-choice-button");
  horizontalBtn = document.getElementById("placeHorizontal");
  verticalBtn = document.getElementById("placeVertical");
  shipTypeBtn = document.querySelectorAll(".ship-button");
  resetBtn = document.querySelector(".reset-button");
  startBtn10 = document.querySelector(".start-button-10");
  startBtn15 = document.querySelector(".start-button-15");
  anotherGameBtn = document.querySelector(".play-again-button");
  playerShipsDestroyed = document.querySelector(".ships-player");
  compShipsDestroyed = document.querySelector(".ships-computer");
  bestScores = document.querySelector(".best-scores");

  shipsToPlace = document.getElementById("ships-to-place");
  yourShipsDestroyed = document.getElementById("ships-destroyed");
  computerShipsDestroyed = document.getElementById("comp-destroyed");
  errorMessage = document.querySelector(".error-message");
  addBtnEventListeners();
}

function createGrid() {
  for (let i = 0; i < width * width; i++) {
    const compGridSquare = document.createElement("div");
    document.querySelector(".grid").appendChild(compGridSquare);
    compGridSquare.classList.add(classSquare);
    computerSquares.push(compGridSquare); //computador
  }

  for (let i = 0; i < width * width; i++) {
    const playerGridSquare = document.createElement("div");
    document.querySelector(".player-grid").appendChild(playerGridSquare);
    playerGridSquare.classList.add("player-square");
    playerGridSquare.classList.add(classSquare);
    playerSquares.push(playerGridSquare); // jogador
  }

  shipsToPlace.innerText = playerShips;

  computerPlaceShips();
  addEventListeners();
  showScores();
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
      orientation = orientation2;
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
            orientation === orientation2
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
    columnIndex === valor &&
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
  } else if (randomIndex === valor) {
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

  for (let i = 0; i < lengthOfBlockade * width; i = i + width) {
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
  } else if (
    (randomIndex + shipLength) % width === 0 &&
    rowIndex === width - 1
  ) {
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
  startBtn10.setAttribute("style", "display:none");
  startBtn15.setAttribute("style", "display:none");

  if (playerShipsLeft === 0) {
    gameOverText.innerText = "Você perdeu!";
  } else if (computerShipsLeft === 0) {
    gameOverText.innerText = "Você venceu!";
  }
}

function resetGame() {
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
  const computerSquares = document.querySelectorAll(classSquare);
  playerSquares.forEach((element) => {
    element.className = "player-square";
  });

  computerSquares.forEach((element) => {
    element.className = classSquare;
  });

  computerPlaceShips();
}

function markAsHitOrMiss() {
  firing.play();

  if (playerSquares[randomIndex].classList.contains("ship")) {
    playerSquares[randomIndex].classList.add("hit");
    playerSquares[randomIndex].classList.remove("ship");
    explosion.play();
    compShipDestroyed();
    lastHit = randomIndex;
    randMin = randomIndex;
  } else {
    // Guess has missed
    playerSquares[randomIndex].classList.add("miss");
    playerSquares[randomIndex].classList.remove("block");
    splash.play();
    randMin = 0;
  }
}

function markAsHitOrMissSpecial() {
  firing.play();

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      indexOfPlay = compNextIndex + i + j * orientation2;

      if (playerSquares[indexOfPlay].classList.contains("ship")) {
        playerSquares[indexOfPlay].classList.add("hit");
        playerSquares[indexOfPlay].classList.remove("ship");
        explosion.play();
        compShipDestroyedSpecial(indexOfPlay);
        lastHit = indexOfPlay;
        randMin = indexOfPlay;
      } else {
        // Guess has missed
        playerSquares[indexOfPlay].classList.add("miss");
        playerSquares[indexOfPlay].classList.remove("block");
        splash.play();
        randMin = 0;
      }
    }
  }
}

function markAsHitOrMissSpecial() {
  firing.play();

  if (playerSquares[randomIndex].classList.contains("ship")) {
    playerSquares[randomIndex].classList.add("hit");
    playerSquares[randomIndex].classList.remove("ship");
    explosion.play();
    compShipDestroyed();
    lastHit = randomIndex;
    randMin = randomIndex;
  } else {
    // Guess has missed
    playerSquares[randomIndex].classList.add("miss");
    playerSquares[randomIndex].classList.remove("block");
    splash.play();
    randMin = 0;
  }
}

function playerShipDestroyed() {
  const hitArray =
    computerShipsObject[computerSquares[clickedIndex].dataset.computership];
  let count = 0;
  console.log(hitArray);
  for (let i = 0; i < hitArray.length; i++) {
    const hitCheck = computerSquares[hitArray[i]];
    if (hitCheck.classList.contains("hit")) {
      count++;
    }
    if (count === hitArray.length) {
      computerShipsLeft--;
      if (hitArray.length === 5) {
        let shipDestroyed = document.createElement("div");
        shipDestroyed.textContent = "Porta-Avião";
        document.querySelector(".ships-computer").appendChild(shipDestroyed);
        shipDestroyed.classList.add(".destroyed-ship");
      } else if (hitArray.length === 4) {
        let shipDestroyed = document.createElement("div");
        shipDestroyed.textContent = "Navio-Tanque";
        document.querySelector(".ships-computer").appendChild(shipDestroyed);
        shipDestroyed.classList.add(".destroyed-ship");
      } else if (hitArray.length === 3) {
        let shipDestroyed = document.createElement("div");
        shipDestroyed.textContent = "Contratorpedeiro";
        document.querySelector(".ships-computer").appendChild(shipDestroyed);
        shipDestroyed.classList.add(".destroyed-ship");
      } else if (hitArray.length === 2) {
        let shipDestroyed = document.createElement("div");
        shipDestroyed.textContent = "Submarino";
        document.querySelector(".ships-computer").appendChild(shipDestroyed);
        shipDestroyed.classList.add(".destroyed-ship");
      }
      computerShipsDestroyed.innerText = computerShipsLeft;
    }
  }

  if (computerShipsLeft === 0 || playerShipsLeft === 0) {
    savePlayerScores();
    gameOver();
  }
}

function playerShipSpecial(indexClicked) {
  const hitArray =
    computerShipsObject[computerSquares[indexClicked].dataset.computership];
  let count = 0;
  console.log(hitArray);
  for (let i = 0; i < hitArray.length; i++) {
    const hitCheck = computerSquares[hitArray[i]];
    if (hitCheck.classList.contains("hit")) {
      count++;
    }
    if (count === hitArray.length) {
      computerShipsLeft--;
      if (hitArray.length === 5) {
        let shipDestroyed = document.createElement("div");
        shipDestroyed.textContent = "Porta-Avião";
        document.querySelector(".ships-computer").appendChild(shipDestroyed);
        shipDestroyed.classList.add(".destroyed-ship");
      } else if (hitArray.length === 4) {
        let shipDestroyed = document.createElement("div");
        shipDestroyed.textContent = "Navio-Tanque";
        document.querySelector(".ships-computer").appendChild(shipDestroyed);
        shipDestroyed.classList.add(".destroyed-ship");
      } else if (hitArray.length === 3) {
        let shipDestroyed = document.createElement("div");
        shipDestroyed.textContent = "Contratorpedeiro";
        document.querySelector(".ships-computer").appendChild(shipDestroyed);
        shipDestroyed.classList.add(".destroyed-ship");
      } else if (hitArray.length === 2) {
        let shipDestroyed = document.createElement("div");
        shipDestroyed.textContent = "Submarino";
        document.querySelector(".ships-computer").appendChild(shipDestroyed);
        shipDestroyed.classList.add(".destroyed-ship");
      }
      computerShipsDestroyed.innerText = computerShipsLeft;
    }
  }

  if (computerShipsLeft === 0 || playerShipsLeft === 0) {
    savePlayerScores();
    gameOver();
  }
}

function compShipDestroyed() {
  const hitArray =
    playerShipsObject[playerSquares[randomIndex].dataset.playership];
  console.log(hitArray);
  let count = 0;

  for (let i = 0; i < hitArray.length; i++) {
    const hitCheck = playerSquares[hitArray[i]];
    if (hitCheck.classList.contains("hit")) {
      count++;
    }
    if (count === hitArray.length) {
      playerShipsLeft--;
      if (hitArray.length === 5) {
        let shipDestroyed = document.createElement("div");
        shipDestroyed.textContent = "Porta-Avião";
        document.querySelector(".ships-player").appendChild(shipDestroyed);
        shipDestroyed.classList.add(".destroyed-ship");
      } else if (hitArray.length === 4) {
        let shipDestroyed = document.createElement("div");
        shipDestroyed.textContent = "Navio-Tanque";
        document.querySelector(".ships-player").appendChild(shipDestroyed);
        shipDestroyed.classList.add(".destroyed-ship");
      } else if (hitArray.length === 3) {
        let shipDestroyed = document.createElement("div");
        shipDestroyed.textContent = "Contratorpedeiro";
        document.querySelector(".ships-player").appendChild(shipDestroyed);
        shipDestroyed.classList.add(".destroyed-ship");
      } else if (hitArray.length === 2) {
        let shipDestroyed = document.createElement("div");
        shipDestroyed.textContent = "Submarino";
        document.querySelector(".ships-player").appendChild(shipDestroyed);
        shipDestroyed.classList.add(".destroyed-ship");
      }

      yourShipsDestroyed.innerText = playerShipsLeft;
    }
  }

  if (computerShipsLeft === 0 || playerShipsLeft === 0) {
    playerScores();
    gameOver();
  }
}

function compShipDestroyedSpecial(indexOfPlay) {
  const hitArray =
    playerShipsObject[playerSquares[indexOfPlay].dataset.playership];
  console.log(hitArray);
  let count = 0;

  for (let i = 0; i < hitArray.length; i++) {
    const hitCheck = playerSquares[hitArray[i]];
    if (hitCheck.classList.contains("hit")) {
      count++;
    }
    if (count === hitArray.length) {
      playerShipsLeft--;
      if (hitArray.length === 5) {
        let shipDestroyed = document.createElement("div");
        shipDestroyed.textContent = "Porta-Avião";
        document.querySelector(".ships-player").appendChild(shipDestroyed);
        shipDestroyed.classList.add(".destroyed-ship");
      } else if (hitArray.length === 4) {
        let shipDestroyed = document.createElement("div");
        shipDestroyed.textContent = "Navio-Tanque";
        document.querySelector(".ships-player").appendChild(shipDestroyed);
        shipDestroyed.classList.add(".destroyed-ship");
      } else if (hitArray.length === 3) {
        let shipDestroyed = document.createElement("div");
        shipDestroyed.textContent = "Contratorpedeiro";
        document.querySelector(".ships-player").appendChild(shipDestroyed);
        shipDestroyed.classList.add(".destroyed-ship");
      } else if (hitArray.length === 2) {
        let shipDestroyed = document.createElement("div");
        shipDestroyed.textContent = "Submarino";
        document.querySelector(".ships-player").appendChild(shipDestroyed);
        shipDestroyed.classList.add(".destroyed-ship");
      }

      yourShipsDestroyed.innerText = playerShipsLeft;
    }
  }

  if (computerShipsLeft === 0 || playerShipsLeft === 0) {
    playerScores();
    gameOver();
  }
}

function computerGuess() {
  if (playerShipsLeft > 0) {
    randomIndex =
      Math.floor(Math.random() * (computerSquares.length - randMin + 1)) +
      randMin;

    while (
      playerSquares[randomIndex].classList.contains("hit") ||
      playerSquares[randomIndex].classList.contains("miss")
    ) {
      randomIndex =
        Math.floor(Math.random() * (computerSquares.length - randMin + 1)) +
        randMin;
    }
    markAsHitOrMissSpecial();
  }
}

function computerGuessSpecial() {
  if (playerShipsLeft > 0) {
    randomIndex =
      Math.floor(Math.random() * (computerSquares.length - randMin + 1)) +
      randMin;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        compNextIndex = randomIndex + i + j * orientation2;
        while (
          playerSquares[compNextIndex].classList.contains("hit") ||
          playerSquares[compNextIndex].classList.contains("miss")
        ) {
          randomIndex =
            Math.floor(Math.random() * (computerSquares.length - randMin + 1)) +
            randMin;
        }
        markAsHitOrMissSpecial();
      }
    }
  }
}

function checkIfHit() {
  if (playerShips === 0) {
    firing.play();
  } else {
    errorMessage.classList.add("message-in");
    errorMessage.innerText = "Você precisa colocar seus navios primeiro";
  }

  clickedIndex = computerSquares.indexOf(this);

  if (
    playerShips === 0 &&
    resetBtn.classList.contains("enabled") &&
    specialPlayCount < 2
  ) {
    checkIfHitSpecial(clickedIndex);
    specialPlayCount++;
    clickCount = 3;
  } else if (playerShips === 0) {
    if (computerSquares[clickedIndex].classList.contains("ship")) {
      computerSquares[clickedIndex].classList.add("hit");
      explosion.play();
      playerShipDestroyed();
      contPlayerHits++;
    } else {
      computerSquares[clickedIndex].classList.add("miss");
      splash.play();
      contPlayerMiss++;
    }
  }
}

function checkIfHitSpecial(indexOfPlay) {
  let playLength = 3;
  if (playerShips === 0) {
    firing.play();
  } else {
    errorMessage.classList.add("message-in");
    errorMessage.innerText = "Você precisa colocar seus navios primeiro";
  }

  specialPlay(indexOfPlay);

  if (playerShips === 0 && play) {
    clickedIndex = indexOfPlay;
    for (let i = 0; i < playLength; i++) {
      for (let j = 0; j < playLength; j++) {
        const playerNextIndex = clickedIndex + i + j * orientation2;

        if (computerSquares[playerNextIndex].classList.contains("ship")) {
          computerSquares[playerNextIndex].classList.add("hit");
          explosion.play();
          playerShipSpecial(playerNextIndex);
          contPlayerHits++;
        } else {
          computerSquares[playerNextIndex].classList.add("miss");
          splash.play();
          contPlayerMiss++;
        }
      }
    }
  }
}

function clickCount() {
  if (contClick === 3) {
    contClick = 1;
  } else {
    contClick++;
  }
}

function computerPlay() {
  if (contClick === 3) {
    for (let i = 0; i < 3; i++) {
      computerGuess();
    }
  }
}

function addEventListeners() {
  computerSquares.forEach((element) => {
    element.addEventListener("click", checkIfHit);
    element.addEventListener("click", clickCount);
    element.addEventListener("click", computerPlay);
  });

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
        orientation = orientation2;
      }
    });
  });

  resetBtn.addEventListener("click", resetGame);

  anotherGameBtn.addEventListener("click", () => {
    gameOverWrapper.setAttribute("style", "display:none");
    savePlayerScores();
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

function savePlayerScores() {
  let score = contPlayerHits / contPlayerMiss;
  score = score.toFixed(2);
  let nome = document.getElementById("nome").value;

  let data = new Date();
  let dia = String(data.getDate()).padStart(2, "0");
  let mes = String(data.getMonth() + 1).padStart(2, "0");
  let ano = data.getFullYear();
  let dataAtual = dia + "/" + mes + "/" + ano;

  let hora = data.getHours();
  let min = data.getMinutes();
  let horario = hora + ":" + min;

  playerScores2 = JSON.parse(localStorage.getItem("scores"));
  console.log(playerScores2);

  if (playerScores2 === null) {
    for (let i = 0; i < playerScores.length; i++) {
      if (score > playerScores[i].score) {
        playerScores[i].score = score;
        playerScores[i].nome = nome;
        playerScores[i].dataAtual = dataAtual;
        playerScores[i].horario = horario;
        break;
      }
    }
    localStorage.removeItem("scores");
    localStorage.setItem("scores", JSON.stringify(playerScores));
  } else {
    for (let i = 0; i < playerScores2.length; i++) {
      if (score > playerScores2[i].score) {
        playerScores2[i].score = score;
        playerScores2[i].nome = nome;
        playerScores2[i].dataAtual = dataAtual;
        playerScores2[i].horario = horario;
        break;
      }
    }
    localStorage.removeItem("scores");
    localStorage.setItem("scores", JSON.stringify(playerScores2));
  }
}

function specialPlay(indexOfPlay) {
  let playLength = 3;
  let playWidth = 3;

  if (playerShips === 0) {
    const playerShipStart = indexOfPlay;
    randomIndex = playerShipStart;

    const playerColumnIndex = indexOfPlay % width;
    const playerRowIndex = Math.floor(indexOfPlay / width);

    if (width - playerColumnIndex < playLength) {
      play = false;
      errorMessage.innerText = "Tente novamente. A jogada vai exceder o grid";
    } else if (playerRowIndex - 1 + playWidth >= width) {
      play = false;
      errorMessage.innerText = "Tente novamente. A jogada vai exceder o grid";
    } else if (play) {
      for (let i = 0; i < playLength; i++) {
        for (let j = 0; j < playLength; j++) {
          const playerNextIndex = indexOfPlay + i + j * orientation2;
          if (
            playerSquares[playerNextIndex].classList.contains("hit") ||
            playerSquares[playerNextIndex].classList.contains("miss")
          ) {
            play = false;
            errorMessage.innerText = "Você não pode jogar sobre outra jogada";
          }
        }
      }
    } else {
      play = true;
      for (let i = 0; i < playLength; i++) {
        for (let j = 0; j < playLength; j++) {
          const playerNextIndex = indexOfPlay + i + j * orientation2;
          if (
            playerSquares[playerNextIndex].classList.contains("hit") ||
            playerSquares[playerNextIndex].classList.contains("miss")
          ) {
            play = false;
            errorMessage.innerText = "Você não pode jogar sobre outra jogada";
          }
        }
      }
    }
  }
}

function clickingSpecialButton() {
  resetBtn.classList.add("enabled");
}

function showScores() {
  let storedScores = JSON.parse(localStorage.getItem("scores"));

  if (storedScores) {
    for (let i = 0; i < storedScores.length; i++) {
      let scoreDiv = document.createElement("div");
      scoreDiv.textContent =
        "Jogador: " +
        storedScores[i].nome +
        ", Score: " +
        storedScores[i].score +
        ", Data: " +
        storedScores[i].dataAtual +
        ", Hora: " +
        storedScores[i].horario;
      document.querySelector(".best-scores").appendChild(scoreDiv);
      scoreDiv.classList.add(".score");
    }
  }
}

function addBtnEventListeners() {
  startBtn10.addEventListener("click", () => {
    width = 10;
    orientation2 = 10;
    valor = 9;
    classSquare = "square10";
    createGrid();
    modalWrapper.setAttribute("style", "display: none");
    startSound.play();
  });

  startBtn15.addEventListener("click", () => {
    width = 15;
    orientation2 = 15;
    valor = 14;
    classSquare = "square15";
    createGrid();
    modalWrapper.setAttribute("style", "display: none");
    startSound.play();
  });
}
document.addEventListener("DOMContentLoaded", initialiseGame);
