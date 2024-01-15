const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;
const boardImage = new Image();
boardImage.src = './Images/basicBoard.png';

class Piece {
  constructor(img, x, y, width, height, spriteX, spriteY, spriteWidth, spriteHeight) {
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
    this.pieces = [];
    this.loadPieces();

    canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
  }

  drawBoard() {
    ctx.clearRect(0, 0 , CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(boardImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.pieces.forEach((piece) => {
      piece.draw();
    });
  }

  loadPieces() {
    const spriteSheetImage = new Image();
    spriteSheetImage.onload = () => {
      const targetColor = { red: 0, green: 0, blue: 5 };
      const imageWithoutBackground = this.removeBackground(spriteSheetImage, targetColor);
      this.pieces.push(new Piece(imageWithoutBackground, 280, 190, 50, 50, 0, 580, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 280, 240, 50, 50, 0, 580, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 280, 330, 50, 50, 0, 580, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 280, 380, 50, 50, 0, 580, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 240, 330, 50, 50, 0, 580, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 330, 330, 50, 50, 0, 580, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 330, 290, 50, 50, 0, 580, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 380, 290, 50, 50, 0, 580, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 190, 290, 50, 50, 0, 580, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 280, 290, 50, 50, 0, 676, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 330, 240, 50, 50, 0, 580, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 230, 240, 50, 50, 0, 580, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 230, 290, 50, 50, 0, 580, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 100, 290, 50, 50, 0, 388, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 50, 290, 50, 50, 0, 388, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 50, 240, 50, 50, 0, 388, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 50, 190, 50, 50, 0, 388, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 50, 330, 50, 50, 0, 388, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 50, 380, 50, 50, 0, 388, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 465, 290, 50, 50, 0, 388, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 510, 290, 50, 50, 0, 388, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 510, 240, 50, 50, 0, 388, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 510, 190, 50, 50, 0, 388, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 510, 330, 50, 50, 0, 388, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 510, 380, 50, 50, 0, 388, 96, 96));

      this.pieces.push(new Piece(imageWithoutBackground, 235, 50, 50, 50, 0, 388, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 185, 50, 50, 50, 0, 388, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 285, 50, 50, 50, 0, 388, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 330, 50, 50, 50, 0, 388, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 375, 50, 50, 50, 0, 388, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 285, 100, 50, 50, 0, 388, 96, 96));

      this.pieces.push(new Piece(imageWithoutBackground, 235, 520, 50, 50, 0, 388, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 185, 520, 50, 50, 0, 388, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 285, 520, 50, 50, 0, 388, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 330, 520, 50, 50, 0, 388, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 375, 520, 50, 50, 0, 388, 96, 96));
      this.pieces.push(new Piece(imageWithoutBackground, 285, 470, 50, 50, 0, 388, 96, 96));

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

    if (clickedPiece) {
      clickedPiece.toggleSelection();
      this.drawBoard();
    } else {
      const selectedPiece = this.pieces.find(piece => piece.isSelected);
      if (selectedPiece) {
        const newPieceX = (clickedX * this.cellSize) + (this.cellSize / 2) - (selectedPiece.width / 2);
        const newPieceY = (clickedY * this.cellSize) + (this.cellSize / 2) - (selectedPiece.height / 2);
        selectedPiece.moveTo(newPieceX, newPieceY);
        this.drawBoard();
      }
    }
  }
}

const board = new Board();
board.drawBoard();




