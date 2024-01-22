const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width = 650;
const CANVAS_HEIGHT = canvas.height = 650;
const boardImage = new Image();
boardImage.src = './Images/basicBoard.png';
const offense = "offense"
const defense = "defense"
const turn = "offense"

class Piece {
  constructor(img, x, y, width, height, spriteX, spriteY, spriteWidth, spriteHeight, role, king = false) {
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
    this.pieces = [];
    this.pieceLocations = []; 
    this.lastMovedCell = { x: null, y: null }; 
    this.turn = turn;
    this.loadPieces();
    this.winner = null;

    canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
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
    const spot1 = { x: 50, y: 50 };
    const spot2 = { x: 600, y: 50 };
    const spot3 = { x: 50, y: 600 };
    const spot4 = { x: 600, y: 600 };
  
    const yellowWins = this.winner === "yellow"; 
    
    if (yellowWins) {
      console.log("Yellow Wins!");
    } else if (kingLocation !== null) { 
      if (
        (kingLocation.x === spot1.x && kingLocation.y === spot1.y) ||
        (kingLocation.x === spot2.x && kingLocation.y === spot2.y) ||
        (kingLocation.x === spot3.x && kingLocation.y === spot3.y) ||
        (kingLocation.x === spot4.x && kingLocation.y === spot4.y)
      ) {
        console.log("Blue Wins!");
      }
    }
  }
  




  capture() {
    let xAdjacentCount = 0;
    let yAdjacentCount = 0;
    const range = 5;

    
  
    for (let i = 0; i < this.pieces.length; i++) {
      const currentPiece = this.pieces[i];
  
      for (let j = 0; j < this.pieces.length; j++) {
        if (i !== j) {
          const otherPiece = this.pieces[j];
  
          const xDiff = Math.abs(currentPiece.x - otherPiece.x);
          const yDiff = Math.abs(currentPiece.y - otherPiece.y);

  
          if (xDiff >= 50 - range && xDiff <= 50 + range && currentPiece.role !== otherPiece.role && yDiff >= 0 - range && yDiff <= 0 + range ) {
            xAdjacentCount++;
          }
          
          if (yDiff >= 50 - range && yDiff <= 50 + range && currentPiece.role !== otherPiece.role && xDiff >= 0 - range && xDiff <= 0 + range)  {
            yAdjacentCount++;
          }
        }
      }

      if (currentPiece.king === true && xAdjacentCount === 2 && yAdjacentCount === 2) {
        this.pieces.splice(i, 1);
        i--; 
        this.winner = yellow   
    } else if (currentPiece.king === false && xAdjacentCount === 2 || yAdjacentCount === 2) {
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
  
      // Return true only if there are no obstacles
      return !pieceIntheWay;
    }
  
    return false; // move isn't horizontal or vertical
  }
  





  loadPieces() {
    const spriteSheetImage = new Image();
    spriteSheetImage.onload = () => {
      const targetColor = { red: 0, green: 0, blue: 5 };
      const imageWithoutBackground = this.removeBackground(spriteSheetImage, targetColor);

      //center blue pieces
      this.pieces.push(new Piece(imageWithoutBackground, 300, 200, 50, 50, 0, 580, 96, 96, defense));
      this.pieces.push(new Piece(imageWithoutBackground, 300, 250, 50, 50, 0, 580, 96, 96, defense));
      this.pieces.push(new Piece(imageWithoutBackground, 300, 350, 50, 50, 0, 580, 96, 96, defense));
      this.pieces.push(new Piece(imageWithoutBackground, 300, 400, 50, 50, 0, 580, 96, 96, defense));
      this.pieces.push(new Piece(imageWithoutBackground, 250, 350, 50, 50, 0, 580, 96, 96, defense));
      this.pieces.push(new Piece(imageWithoutBackground, 350, 350, 50, 50, 0, 580, 96, 96, defense));
      this.pieces.push(new Piece(imageWithoutBackground, 350, 300, 50, 50, 0, 580, 96, 96, defense));
      this.pieces.push(new Piece(imageWithoutBackground, 400, 300, 50, 50, 0, 580, 96, 96, defense));
      this.pieces.push(new Piece(imageWithoutBackground, 200, 300, 50, 50, 0, 580, 96, 96, defense));
      this.pieces.push(new Piece(imageWithoutBackground, 300, 300, 50, 50, 0, 676, 96, 96, defense,true));
      this.pieces.push(new Piece(imageWithoutBackground, 350, 250, 50, 50, 0, 580, 96, 96, defense));
      this.pieces.push(new Piece(imageWithoutBackground, 250, 250, 50, 50, 0, 580, 96, 96, defense));
      this.pieces.push(new Piece(imageWithoutBackground, 250, 300, 50, 50, 0, 580, 96, 96, defense));

      //left yellow pieces
      this.pieces.push(new Piece(imageWithoutBackground, 100, 300, 50, 50, 0, 388, 96, 96, offense));
      this.pieces.push(new Piece(imageWithoutBackground, 50, 300, 50, 50, 0, 388, 96, 96, offense));
      this.pieces.push(new Piece(imageWithoutBackground, 50, 250, 50, 50, 0, 388, 96, 96, offense));
      this.pieces.push(new Piece(imageWithoutBackground, 50, 200, 50, 50, 0, 388, 96, 96, offense));
      this.pieces.push(new Piece(imageWithoutBackground, 50, 350, 50, 50, 0, 388, 96, 96, offense));
      this.pieces.push(new Piece(imageWithoutBackground, 50, 400, 50, 50, 0, 388, 96, 96, offense));

      // right yellow pieces
      this.pieces.push(new Piece(imageWithoutBackground, 500, 300, 50, 50, 0, 388, 96, 96, offense));
      this.pieces.push(new Piece(imageWithoutBackground, 550, 300, 50, 50, 0, 388, 96, 96, offense));
      this.pieces.push(new Piece(imageWithoutBackground, 550, 250, 50, 50, 0, 388, 96, 96, offense));
      this.pieces.push(new Piece(imageWithoutBackground, 550, 200, 50, 50, 0, 388, 96, 96, offense));
      this.pieces.push(new Piece(imageWithoutBackground, 550, 350, 50, 50, 0, 388, 96, 96, offense));
      this.pieces.push(new Piece(imageWithoutBackground, 550, 400, 50, 50, 0, 388, 96, 96, offense));

      // top yellow pieces
      this.pieces.push(new Piece(imageWithoutBackground, 200, 50, 50, 50, 0, 388, 96, 96, offense));
      this.pieces.push(new Piece(imageWithoutBackground, 250, 50, 50, 50, 0, 388, 96, 96, offense));
      this.pieces.push(new Piece(imageWithoutBackground, 300, 50, 50, 50, 0, 388, 96, 96, offense));
      this.pieces.push(new Piece(imageWithoutBackground, 350, 50, 50, 50, 0, 388, 96, 96, offense));
      this.pieces.push(new Piece(imageWithoutBackground, 400, 50, 50, 50, 0, 388, 96, 96, offense));
      this.pieces.push(new Piece(imageWithoutBackground, 300, 100, 50, 50, 0, 388, 96, 96, offense));
      
      // bottom yellow pieces
      this.pieces.push(new Piece(imageWithoutBackground, 250, 550, 50, 50, 0, 388, 96, 96, offense));
      this.pieces.push(new Piece(imageWithoutBackground, 200, 550, 50, 50, 0, 388, 96, 96, offense));
      this.pieces.push(new Piece(imageWithoutBackground, 300, 550, 50, 50, 0, 388, 96, 96, offense));
      this.pieces.push(new Piece(imageWithoutBackground, 350, 550, 50, 50, 0, 388, 96, 96, offense));
      this.pieces.push(new Piece(imageWithoutBackground, 400, 550, 50, 50, 0, 388, 96, 96, offense));
      this.pieces.push(new Piece(imageWithoutBackground, 300, 500, 50, 50, 0, 388, 96, 96, offense));

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
        if (this.validMove(selectedPiece, newPieceX, newPieceY)) {
          selectedPiece.moveTo(newPieceX, newPieceY);
           
          this.capture();
          this.drawBoard();
          this.swapturn();
          this.gameover()
        }
      }
    }
  }
  

  swapturn(){
    this.turn = (this.turn === "offense") ? "defense" : "offense";
  }
}

const board = new Board();
board.drawBoard();