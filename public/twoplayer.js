const canvas = document.getElementById("canvas");
const announce = document.getElementById("announce");
const ctx = canvas.getContext("2d");
const socket = io({ path: '/socket.io' });
let CANVAS_WIDTH = canvas.width = 780;
let CANVAS_HEIGHT = canvas.height = 780;
const boardImage = new Image();
boardImage.src = './Images/basicBoard.png';
const offense = "offense";
const defense = "defense";
const turn = "offense";
let userName = '';
let roomNumber;
let TwoPlayers;
let playersRole;
let playerColor; 

class Piece {
  constructor(img, x, y, width, height, spriteX, spriteY, spriteWidth, spriteHeight, role, id, king = false) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.spriteX = spriteX;
    this.spriteY = spriteY;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.isSelected = false;
    this.role = role;
    this.king = king;
    this.id = id;
  }

  includesCell(cell) {
    const pieceCellX = Math.floor(this.x / board.cellSize);
    const pieceCellY = Math.floor(this.y / board.cellSize);
    return pieceCellX === cell.x && pieceCellY === cell.y;
  }
  
  draw() {
    ctx.drawImage(
      this.img,
      this.spriteX,
      this.spriteY,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  toggleSelection() {
    this.isSelected = !this.isSelected;
  }

  moveTo(newX, newY) {
    this.x = newX;
    this.y = newY;
    this.isSelected = false;
  }
}

class Board {
  constructor() {
    this.cellSize = CANVAS_WIDTH / 13;
    this.boardSize = CANVAS_WIDTH / 13; 
    this.square = CANVAS_WIDTH / 13;
    this.pieces = [];
    this.pieceLocations = []; 
    this.lastMovedCell = { x: null, y: null }; 
    this.turn = turn; 
    this.loadPieces();
    this.winner = null;
    this.lastMovedPieceIndex = 0; 
    this.running = true;
    this.statsUpdated = false;

    canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));

    this.run();
  }

  run() {
    const gameLoop = () => {
      if (this.running) {
        this.drawBoard();
  
        if (this.turn === "offense") {
          //this.ComputerMove();
          //this.capture();
        }
  
        // Call gameLoop again after a short delay
        setTimeout(gameLoop, 100); // Adjust the delay time as needed
        
        
      }
    };
  
    
    gameLoop();
  }

  findKingLocation() {
    for (let i = 0; i < this.pieces.length; i++) {
      const piece = this.pieces[i];
      if (piece.king === true) {
        return { x: piece.x, y: piece.y };
      }
    }
    return null;
  }

  gameover() {
    const kingLocation = board.findKingLocation();
    const spot1 = { x: this.cellSize, y: this.cellSize };
    const spot2 = { x: (this.cellSize * 11), y: this.cellSize };
    const spot3 = { x: this.cellSize, y: (this.cellSize * 11) };
    const spot4 = { x: (this.cellSize * 11), y: (this.cellSize * 11) };
   

    
  
    const yellowWins = this.winner === "yellow"; 
    
    if (yellowWins) {
      
      announce.innerHTML = "Yellow Wins!"
      this.showPlayAgainButton();
      console.log("Yellow Wins!");
      if(userName && this.statsUpdated === false){
        updatePlayerStats(userName, 'loss', 60); // Update player1's stats for winning a game that lasted 60 seconds
        this.statsUpdated = true;
        fetchUserNameAndUpdate();
      }
    } else if (kingLocation !== null) { 
      if (
        (kingLocation.x === spot1.x && kingLocation.y === spot1.y) ||
        (kingLocation.x === spot2.x && kingLocation.y === spot2.y) ||
        (kingLocation.x === spot3.x && kingLocation.y === spot3.y) ||
        (kingLocation.x === spot4.x && kingLocation.y === spot4.y)
      ) {
        announce.innerHTML = "Blue Wins!";
        console.log("Blue Wins!");
        this.showPlayAgainButton();
        if(userName && this.statsUpdated === false){
          updatePlayerStats(userName, 'win', 60); // Update player1's stats for winning a game that lasted 60 seconds
          this.statsUpdated = true;
          fetchUserNameAndUpdate();
          
          }
      }
    }
  }
  


  
   showPlayAgainButton() {
    var button = document.getElementById('playAgainButton');
    button.style.display = 'block';
    console.log("THIS SHOULD SHOW THE PLAY BUTTON")
  }
  

  capture() {
    let xAdjacentCount = 0;
    let yAdjacentCount = 0;
    const range = 5;
    const kingLocation = board.findKingLocation();

    
  
    for (let i = 0; i < this.pieces.length; i++) {
      const currentPiece = this.pieces[i];
  
      for (let j = 0; j < this.pieces.length; j++) {
        if (i !== j) {
          const otherPiece = this.pieces[j];
  
          const xDiff = Math.abs(currentPiece.x - otherPiece.x);
          const yDiff = Math.abs(currentPiece.y - otherPiece.y);

  
          if (xDiff >= this.cellSize - range && xDiff <= this.cellSize + range && currentPiece.role !== otherPiece.role && yDiff >= 0 - range && yDiff <= 0 + range && otherPiece.king === false) {
            xAdjacentCount++;
          }
          
          if (yDiff >= this.cellSize - range && yDiff <= this.cellSize + range && currentPiece.role !== otherPiece.role && xDiff >= 0 - range && xDiff <= 0 + range && otherPiece.king === false)  {
            yAdjacentCount++;
          }
        }
      }

      if((kingLocation.x === this.cellSize || kingLocation.x ===  (this.cellSize * 11) || kingLocation.y === this.cellSize|| kingLocation.y === (this.cellSize * 11)) && currentPiece.king === true && xAdjacentCount === 2 && yAdjacentCount === 1){
        this.pieces.splice(i, 1);
        i--; 
        this.winner = "yellow"  
      }

      if((kingLocation.x === this.cellSize || kingLocation.x === (this.cellSize * 11) || kingLocation.y === this.cellSize|| kingLocation.y === (this.cellSize * 11)) && currentPiece.king === true && xAdjacentCount === 1 && yAdjacentCount === 2){
        this.pieces.splice(i, 1);
        i--; 
        this.winner = "yellow"  

      }

      if (currentPiece.king === true && xAdjacentCount === 2 && yAdjacentCount === 2) {
        this.pieces.splice(i, 1);
        i--; 
        this.winner = "yellow"   
    } else if ((currentPiece.king === false && xAdjacentCount === 2) || (currentPiece.king === false && yAdjacentCount === 2)) {
        this.pieces.splice(i, 1);
        i--; 
    }
    
  
      // Reset counts for the next iteration
      xAdjacentCount = 0;
      yAdjacentCount = 0;
    }
  }
  

  updatePieceLocations() {
    // Clear the piece locations array
    this.pieceLocations = [];

    // Update the piece locations based on the current pieces array
    this.pieces.forEach((piece) => {
      const cellX = Math.floor(piece.x / this.cellSize);
      const cellY = Math.floor(piece.y / this.cellSize);
      this.pieceLocations.push({ x: cellX, y: cellY, role: piece.role });
    });
  }


  drawBoard() {
    ctx.clearRect(0, 0 , CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(boardImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.pieces.forEach((piece) => {
      
      piece.draw();
    });
  }


  validMove(selectedPiece, newX, newY) {
    const deltaX = Math.abs(newX - selectedPiece.x);
    const deltaY = Math.abs(newY - selectedPiece.y);
  
    if ((deltaX === 0 && deltaY > 0) || (deltaX > 0 && deltaY === 0)) {
      // Check for pieces in the path
      const pieceIntheWay = this.pieces.some(piece => {
        if (piece !== selectedPiece) {
          // Check if the piece is in the same row or column
          if (
            // Check if moving horizontally and there is a piece in the same row
            (deltaX > 0 && piece.y === selectedPiece.y && piece.x > Math.min(newX, selectedPiece.x) && piece.x < Math.max(newX, selectedPiece.x)) ||
            // Check if moving vertically and there is a piece in the same column
            (deltaY > 0 && piece.x === selectedPiece.x && piece.y > Math.min(newY, selectedPiece.y) && piece.y < Math.max(newY, selectedPiece.y))
          ) {
            return true; // Piece found in the way
          }
        }
        return false;
      });

      // Check if the new position is not occupied by another piece
      const newPositionOccupied = this.pieces.some(piece => piece.x === newX && piece.y === newY);

      const validXPosition = newX > 40 && newX <= (this.cellSize * 12);
      const validYPosition = newY > 40 && newY <= (this.cellSize * 12);

  
      // Return true only if there are no obstacles
      return !pieceIntheWay && !newPositionOccupied && validXPosition && validYPosition;
    }
  
    return false; // move isn't horizontal or vertical
  }
  





  loadPieces() {
    const spriteSheetImage = new Image();
    spriteSheetImage.onload = () => {
      const targetColor = { red: 0, green: 0, blue: 5 };
      const imageWithoutBackground = this.removeBackground(spriteSheetImage, targetColor);

      //center blue pieces
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 6), (this.cellSize * 4), this.cellSize, this.cellSize, 0, 580, 96, 96, defense, 1));
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 6), (this.cellSize * 5), this.cellSize, this.cellSize, 0, 580, 96, 96, defense, 2));
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 6), (this.cellSize * 7), this.cellSize, this.cellSize, 0, 580, 96, 96, defense, 3));
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 6), (this.cellSize * 8), this.cellSize, this.cellSize, 0, 580, 96, 96, defense, 4));
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 5), (this.cellSize * 7), this.cellSize, this.cellSize, 0, 580, 96, 96, defense, 5));
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 7), (this.cellSize * 7), this.cellSize, this.cellSize, 0, 580, 96, 96, defense, 6));
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 7), (this.cellSize * 6), this.cellSize, this.cellSize, 0, 580, 96, 96, defense, 7));
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 8), (this.cellSize * 6), this.cellSize, this.cellSize, 0, 580, 96, 96, defense, 8));
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 4), (this.cellSize * 6), this.cellSize, this.cellSize, 0, 580, 96, 96, defense, 9));
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 6), (this.cellSize * 6), this.cellSize, this.cellSize, 0, 676, 96, 96, defense, 10, true));
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 7), (this.cellSize * 5), this.cellSize, this.cellSize, 0, 580, 96, 96, defense, 11));
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 5), (this.cellSize * 5), this.cellSize, this.cellSize, 0, 580, 96, 96, defense, 12));
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 5), (this.cellSize * 6), this.cellSize, this.cellSize, 0, 580, 96, 96, defense, 13));

      //left yellow pieces
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 2), (this.cellSize * 6), this.cellSize, this.cellSize, 0, 388, 96, 96, offense, 14));
      this.pieces.push(new Piece(imageWithoutBackground, this.cellSize, (this.cellSize * 6), this.cellSize, this.cellSize, 0, 388, 96, 96, offense, 15));
      this.pieces.push(new Piece(imageWithoutBackground, this.cellSize, (this.cellSize * 5), this.cellSize, this.cellSize, 0, 388, 96, 96, offense, 16));
      this.pieces.push(new Piece(imageWithoutBackground, this.cellSize, (this.cellSize * 4), this.cellSize, this.cellSize, 0, 388, 96, 96, offense, 17));
      this.pieces.push(new Piece(imageWithoutBackground, this.cellSize, (this.cellSize * 7), this.cellSize, this.cellSize, 0, 388, 96, 96, offense, 18));
      this.pieces.push(new Piece(imageWithoutBackground, this.cellSize, (this.cellSize * 8), this.cellSize, this.cellSize, 0, 388, 96, 96, offense, 19));

      // right yellow pieces
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 10), (this.cellSize * 6), this.cellSize, this.cellSize, 0, 388, 96, 96, offense, 20));
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 11), (this.cellSize * 6), this.cellSize, this.cellSize, 0, 388, 96, 96, offense, 21));
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 11), (this.cellSize * 5), this.cellSize, this.cellSize, 0, 388, 96, 96, offense, 22));
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 11), (this.cellSize * 4), this.cellSize, this.cellSize, 0, 388, 96, 96, offense, 23));
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 11), (this.cellSize * 7), this.cellSize, this.cellSize, 0, 388, 96, 96, offense, 24));
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 11), (this.cellSize * 8), this.cellSize, this.cellSize, 0, 388, 96, 96, offense, 25));

      // top yellow pieces
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 4), this.cellSize, this.cellSize, this.cellSize, 0, 388, 96, 96, offense, 26));
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 5), this.cellSize, this.cellSize, this.cellSize, 0, 388, 96, 96, offense, 27));
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 6), this.cellSize, this.cellSize, this.cellSize, 0, 388, 96, 96, offense, 28));
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 7), this.cellSize, this.cellSize, this.cellSize, 0, 388, 96, 96, offense, 29));
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 8), this.cellSize, this.cellSize, this.cellSize, 0, 388, 96, 96, offense, 30));
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 6), (this.cellSize * 2), this.cellSize, this.cellSize, 0, 388, 96, 96, offense, 31));
      
      // bottom yellow pieces
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 5), (this.cellSize * 11), this.cellSize, this.cellSize, 0, 388, 96, 96, offense, 32));
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 4), (this.cellSize * 11), this.cellSize, this.cellSize, 0, 388, 96, 96, offense, 33));
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 6), (this.cellSize * 11), this.cellSize, this.cellSize, 0, 388, 96, 96, offense, 34));
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 7), (this.cellSize * 11), this.cellSize, this.cellSize, 0, 388, 96, 96, offense, 35));
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 8), (this.cellSize * 11), this.cellSize, this.cellSize, 0, 388, 96, 96, offense, 36));
      this.pieces.push(new Piece(imageWithoutBackground, (this.cellSize * 6), (this.cellSize * 10), this.cellSize, this.cellSize, 0, 388, 96, 96, offense, 37));

      // Add more pieces as needed for the board
      this.drawBoard();
    };
    spriteSheetImage.src = "./Sprites/rbsprites.png";
  }

  removeBackground(image, targetColor) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
  
    // Draw the original image onto the canvas
    ctx.drawImage(image, 0, 0);
  
    // Get the image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
  
    // Iterate through each pixel
    for (let i = 0; i < data.length; i += 4) {
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];
  
      // Check if the pixel matches the target color 
      if (red === targetColor.red && green === targetColor.green && blue === targetColor.blue) {
        // Make the pixel transparent (set alpha to 0)
        data[i + 3] = 0;
      }
    }
  
    // Put the modified image data back onto the canvas
    ctx.putImageData(imageData, 0, 0);
  
    // Return the modified image
    const modifiedImage = new Image();
    modifiedImage.src = canvas.toDataURL();
    return modifiedImage;
  }

  findPiece(x, y) {
    for (let i = this.pieces.length - 1; i >= 0; i--) {
      const piece = this.pieces[i];
      if (
        x >= piece.x &&
        x <= piece.x + piece.width &&
        y >= piece.y &&
        y <= piece.y + piece.height
      ) {
        return piece;
      }
    }
    return null;
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  getRandomPiece(role = "offense") {
    let currentPiece = null;
    while (!currentPiece || currentPiece.role !== role) {
        const pieceNumber = this.getRandomInt(this.pieces.length - 1);
        currentPiece = this.pieces[pieceNumber];
    }
    return currentPiece;
}


  // Function to calculate distance between two points (x1, y1) and (x2, y2) pythagorean theorem
  distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}


  

ComputerMove() {
  const kingLocation = this.findKingLocation();
  console.log("Computer's Move");


  let moved = false; // Flag to track if any piece was moved

  for (let i = this.lastMovedPieceIndex; i < this.pieces.length; i++) {
    const piece = this.pieces[i];
    if (piece.role === 'offense') {
      for (let j = this.cellSize; j <= (this.cellSize * 4); j += this.cellSize) {
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const newX = kingLocation.x + dx * j;
          const newY = kingLocation.y + dy * j;
          if (this.validMove(piece, newX, newY)) {
            piece.moveTo(newX, newY);
            this.capture();
            this.swapturn();
            this.gameover();
            this.lastMovedPieceIndex = i + 1; // Update the last moved piece index
            moved = true;
            return;
          }
        }
      }
    }
  }

  if (!moved) {
    console.log("Couldn't Find a Valid Move");
    this.lastMovedPieceIndex = 0;
    console.log(this.pieces);
    this.swapturn();
  }
}





  handleMouseDown(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
  
    const clickedX = Math.floor(mouseX / this.cellSize);
    const clickedY = Math.floor(mouseY / this.cellSize);
  
    const clickedPiece = this.findPiece(mouseX, mouseY);
  
    if (clickedPiece && clickedPiece.role === this.turn) {
      console.log('Selected piece:', clickedPiece);
      clickedPiece.toggleSelection();
      this.drawBoard();
    } else {
      const selectedPiece = this.pieces.find(piece => piece.isSelected);
      if (selectedPiece) {
        const newPieceX = (clickedX * this.cellSize) + (this.cellSize / 2) - (selectedPiece.width / 2);
        const newPieceY = (clickedY * this.cellSize) + (this.cellSize / 2) - (selectedPiece.height / 2);
        console.log(this.turn)
        console.log(playersRole)
        console.log(playersRole === this.turn)
        if (this.validMove(selectedPiece, newPieceX, newPieceY) && TwoPlayers && (playersRole === this.turn)) {
          console.log(this.turn)
          console.log(playersRole)
          socket.emit('move', { pieceId: selectedPiece.id, newX: newPieceX, newY: newPieceY, clientRoom: roomNumber });
          console.log('Moved piece:', selectedPiece, 'to:', newPieceX, newPieceY);
          selectedPiece.moveTo(newPieceX, newPieceY);
           
          this.capture();
          this.drawBoard();
        
          console.log(this.turn);
          console.log(playersRole);
          this.gameover();
        }
      }
    }
  }
  

  swapturn(){
    this.turn = (this.turn === "offense") ? "defense" : "offense";
  }
}




async function updatePlayerStats(user_name, outcome, playTime) {
  try {
      const response = await fetch("v1/auth/updateStats", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              user_name,
              outcome,
              playTime
          })
      });

      console.log(response); // Log the entire response object
      const data = await response.json();
      console.log(data.message); // Log the server response
  } catch (error) {
      console.error('Error updating player stats:', error);
      console.log(error);
  }
}

function fetchUserNameAndUpdate() {
  // Make a GET request to fetch the user_name after successful login
  fetch("v1/user")
      .then(response => {
          // Check if the response is OK (status code 200)
          if (response.ok) {
              // Parse the JSON response
              return response.json();
          } else {
              // If response is not OK, throw an error
              throw new Error("Failed to fetch user data");
          }
      })
      .then(data => {
        if (data) {
            userName = data.user_name;
            const wins = data.wins;
            const losses = data.losses;
    
            // Concatenate username, wins, and losses into a single string with new lines
            let userInfo = "";
            if (userName) {
                userInfo += `User Name: ${userName}\n`;
            } else {
                console.log("No username found in the response data.");
            }
    
            if (wins !== undefined) {
                userInfo += `Wins: ${wins}\n`;
            } else {
                console.log("Wins data not available in the response.");
            }
    
            if (losses !== undefined) {
                userInfo += `Losses: ${losses}\n`;
            } else {
                console.log("Losses data not available in the response.");
            }
    
            // Update the UI with the concatenated user info
            const usernameDisplay = document.getElementById("usernameDisplay");
            if (usernameDisplay) {
                usernameDisplay.textContent = userInfo;
            } else {
                console.error("Username display element not found in the DOM.");
            }
        } else {
            console.log("No data received from the server.");
        }
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
    });
    
    
}

window.onload = function() {
  fetchUserNameAndUpdate();
};


/*window.addEventListener('resize', () => {
  const computedStyles = window.getComputedStyle(canvas);
  //CANVAS_WIDTH = parseInt(computedStyles.getPropertyValue('width'));
  //CANVAS_HEIGHT = parseInt(computedStyles.getPropertyValue('height'));
  
  // Get the value of the --custom-dimension CSS variable from the :root selector
  const rootStyles = getComputedStyle(document.documentElement);
  const customDimension = parseInt(rootStyles.getPropertyValue('--custom-dimension'));
  
  // Set the canvas width and height based on the --custom-dimension variable
  canvas.width = customDimension;
  canvas.height = customDimension;

   CANVAS_HEIGHT = customDimension;
   CANVAS_WIDTH = customDimension;
  
  // Redraw the entire board
  board.drawBoard();
  console.log("canvas.width = ", canvas.width, "canvas.height = " , canvas.height, "CANVAS_HEIGHT = ", CANVAS_HEIGHT, "CANVAS_WIDTH = ",  CANVAS_WIDTH);
});
*/

document.addEventListener("DOMContentLoaded", function() {
  var logoutButton = document.querySelector(".logout");
  logoutButton.addEventListener("click", function() {
   
    logout();
  });
});


    function logout() {
    fetch('v1/auth/logout', {
        method: 'GET',
        credentials: 'same-origin', // include cookies in the request if any
    })
    .then(response => {
        if (response.ok) {
          document.getElementById("usernameDisplay").textContent = "";
            // If logout was successful, redirect to the login page or perform any other action
            console.log("logged out successfully")
        } else {
            console.error('Logout failed');
        }
    })
    .catch(error => {
        // Handle network errors
        console.error('Network error:', error);
    });
}





const board = new Board();
console.log(board.cellSize, "This is the cell size")
board.drawBoard();


// Listen for the 'connect' event to ensure the socket is connected before executing any logic
socket.on('connect', () => {
  console.log('Connected to server');

  // Listen for the 'Room Number:' event after the socket is connected
  socket.on('Room Number:', (number) => {
      roomNumber = number; // Assign received room number to roomNumber variable
      //announce.innerHTML = `Room Number: ${roomNumber}`;
      console.log('Received Room Number:', roomNumber);
  });

// Listen for the 'Player Color:' event from the server
socket.on('Player Color:', (color) => {
  playerColor = color; // Assign received player color to playerColor variable
  updateAnnouncementText(); // Update announcement text
  console.log('Received Player Color:', playerColor);
  if (playerColor === "blue"){
    playersRole = "defense"
  }
  else if(playerColor === "yellow"){
    playersRole = "offense"
  }
});

// Listen for the 'Two Players:' event from the server
socket.on('Two Players:', (hasTwoPlayers) => {
  console.log('Received Two Players:', hasTwoPlayers);
  TwoPlayers = hasTwoPlayers;
  updateAnnouncementText(); // Update announcement text
  // Use the received information about whether two players are in the room as needed
});

function updateAnnouncementText() {
  // Check if both playerColor and TwoPlayers are defined
  if (typeof playerColor !== 'undefined' && typeof TwoPlayers !== 'undefined') {
      let twoPlayersInfo = ""; // Default to empty string
      if (!TwoPlayers) {
          twoPlayersInfo = " | Waiting for 2 players"; // Show this if there are not two players
      }
      const combinedText = `Player Color: ${playerColor}${twoPlayersInfo}`;
      announce.textContent = combinedText; // Set the text content of announce element
  }
}




  // Listen for the 'move' event from the server
  socket.on('move', ({ pieceId, newX, newY }) => {
      // Check if roomNumber is defined and contains the current room
      if (roomNumber) {
          // Update game state on the receiving end based on the received move information
          const movedPiece = board.pieces.find(piece => piece.id === pieceId);
          if (movedPiece) {
              movedPiece.moveTo(newX, newY);
              board.capture();
              board.drawBoard();
              board.swapturn();
              board.gameover();
              console.log("socket move")
          }
      } else {
          console.error('Socket room is undefined or does not contain the current room.');
      }
  });
});
