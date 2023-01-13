 const defaultLayout = {
    a1: "wR",
    b1: "wN",
    c1: "wB",
    d1: "wQ",
    e1: "wK",
    f1: "wB",
    g1: "wN",
    h1: "wR",
    a2: "wP",
    b2: "wP",
    c2: "wP",
    d2: "wP",
    e2: "wP",
    f2: "wP",
    g2: "wP",
    h2: "wP",
    a8: "bR",
    b8: "bN",
    c8: "bB",
    d8: "bQ",
    e8: "bK",
    f8: "bB",
    g8: "bN",
    h8: "bR",
    a7: "bP",
    b7: "bP",
    c7: "bP",
    d7: "bP",
    e7: "bP",
    f7: "bP",
    g7: "bP",
    h7: "bP",

    /*Testing */
    e4: "wP",
    e5: "bP",
    d5: "bP",
    f3: "wP"

    /* End of Testing */
 }

 const letters = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h'
];
const numbers = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8
];
 
var playingAsWhite = true;
 
 /* Piece initialization */
 export function initPieces (layout=defaultLayout) {
    for (const tile in layout) {
        const square = document.getElementById(tile);
        /* Creating img element for displaying the pieces accordingly.*/
        const img = document.createElement("img");
        img.src = "./pieces/" + layout[tile] + ".svg";
        img.alt = layout[tile];

        const isWhite = layout[tile][0] == 'w';

        img.classList.add("piece",isWhite ? "white" : "black", layout[tile][1], "new");


        square.appendChild(img);
    }
 }

 function getLeftColumn (column) {
    const index = letters.indexOf(column) - 1;
    if (index < 0) {
        return "n"
    }
    return letters[index];
 }

 function getRightColumn (column) {
    const index = letters.indexOf(column) + 1;
    if (index >= letters.length) {
        return "n"
    }
    return letters[index];
 }

 function capture () {

 }

function move (square){
    const movingPiece = document.getElementsByClassName("selected-piece").item(0);
    const previousSquare = movingPiece.parentElement;
    const readPiece = hasPiece(previousSquare);
    const squareCoords = square.id;

    square.appendChild(movingPiece);

    movingPiece.classList.remove("selected-piece");
    movingPiece.classList.remove("new");
    deleteActivePrompts();
    deleteActivePrompts();
}

function hasPiece (square) {
    if (square.children.length === 0) {
        return [false, -1];
    }

    if (square == NaN || square == undefined){
        return [false,-1];
    }

    for (let index = 0; index < square.children.length; index++) {
        if (square.children.item(index).classList.contains("piece")) {
            return [true, index];
        }
    }
    return [false, -1];
 }

function deleteActivePrompts () {
    const activeMovePrompts = document.getElementsByClassName("move-prompt");
    for (let index = 0; index < activeMovePrompts.length; index++) {
        activeMovePrompts.item(0).remove();
    }
    const activeCapturePrompts = document.getElementsByClassName("capture-prompt");
    for (let index = 0; index < activeCapturePrompts.length; index++) {
        activeCapturePrompts.item(0).remove();
    }

}

/* Creating move prompts and capture prompts */
function createMovePrompt (capture){
    const prompt = document.createElement("div");
    if (capture) {
        prompt.classList.add("capture-prompt");
    } else {
        prompt.classList.add("move-prompt");
    }
    return prompt;
}

function placeMovePrompt(coordinates,prompt){
    const square = document.getElementById(coordinates);
    if (square == NaN || square == undefined) {
        return;
    }
    square.appendChild(prompt);
}

function possibleMoves(coordinates, piece, isNew, white) {
    const column = coordinates[0];
    const row = parseInt(coordinates[1]);
    const availableMoves = [];
    if (piece.classList.contains("P")) {
        /* Pawn */
        /* Defining potentially available squares and their coords */
        const nextSquareCoords = white ? column+(row+1).toString() : column+(row-1).toString();
        const nextNextSquareCoords = white ? column+(row+2).toString() : column+(row-2).toString();
        const leftNextSquareCoords = white ? getLeftColumn(column)+(row+1).toString() : getRightColumn(column)+(row-1).toString();
        const rightNextSquareCoords = white ? getRightColumn(column)+(row+1).toString() : getLeftColumn(column)+(row-1).toString();

        const nextSquare = document.getElementById(nextSquareCoords);
        const nextNextSquare = document.getElementById(nextNextSquareCoords);
        const leftNextSquare = !(leftNextSquareCoords[0] == 'n') ? document.getElementById(leftNextSquareCoords) : undefined;
        const rightNextSquare = !(rightNextSquareCoords[0] == 'n') ? document.getElementById(rightNextSquareCoords) : undefined;
            
        if (!hasPiece(nextSquare)[0]){
            availableMoves.push(nextSquareCoords);

            /* If the pawn is new, if it has not moved, it can move two squares instead of just one */
            if(!hasPiece(nextNextSquare)[0] && isNew){
                availableMoves.push(nextNextSquareCoords);
            }
        }
        
        /* Pawn captures */
        /* first checking if the square exist, then checking if there is pieces on that square - hasPieces() */
        if (leftNextSquare != undefined){
            const readPiece = hasPiece(leftNextSquare);
            if (readPiece[0]){
                /* ? ternary operator to take into consideration the color of the pieces for the capture */ 
                if (white ? leftNextSquare.children.item(readPiece[1]).classList.contains("black") : leftNextSquare.children.item(readPiece[1]).classList.contains("white")){
                    availableMoves.push(leftNextSquareCoords + 'x');
                }
            }
        }
        if (rightNextSquare != undefined){
            const readPiece = hasPiece(rightNextSquare);
            if (readPiece[0]){
                if (white ? rightNextSquare.children.item(readPiece[1]).classList.contains("black") : rightNextSquare.children.item(readPiece[1]).classList.contains("white")){
                    availableMoves.push(rightNextSquareCoords+'x');
                }
            }
        }
    }
    return availableMoves;
}

/* Add logic to account for capture prompts WOP WOP WOP WOP */
function displayPrompts (availableMoves) {
    deleteActivePrompts();
    /* Placing prompts */
    availableMoves.forEach((coordinate) => {
        const isCapture = coordinate.length > 2;
        if (isCapture) {
            coordinate = coordinate[0] + coordinate[1];
        }
        placeMovePrompt(coordinate,createMovePrompt(isCapture))
    })
}

function removeSelection(){
    const previousSelectedPieces = document.getElementsByClassName("selected-piece");
    for (let index = 0; index < previousSelectedPieces.length; index++) {
        previousSelectedPieces.item(index).classList.remove("selected-piece");
    }
}

function moveHandler (square, readPiece) {


    const updatedSquare = document.getElementById(square.id);
    const coordinates = updatedSquare.id;
    
    const piece = updatedSquare.children.item(readPiece[1]);
    const isWhite = piece.classList.contains("white");
    const isNew = piece.classList.contains("new");

    /* Deleting previous selected piece */
    removeSelection();
    
    /* Saving piece selection */
    piece.classList.add("selected-piece");
    
    displayPrompts(possibleMoves(coordinates,piece,isNew,isWhite));
}

 function onSquareClick (square) {

    const readPiece = hasPiece(square);
    /* If the clicked square doesn't have a piece, hasPiece() returns an array with a boolean representing if there is a piece and the index of that piece. */
    if (!readPiece[0]){
        var squareHasPrompt = false;
        for (let index = 0; index < square.children.length; index++) {
            squareHasPrompt = square.children.item(index).classList.contains("move-prompt") || square.children.item(index).classList.contains("capture-prompt");
            if (squareHasPrompt) {
                move(square);
                break;
            }
        }
    } else {
        deleteActivePrompts();
        deleteActivePrompts();
        
        moveHandler(square, readPiece);
    }

    

    
    
    
 }

export function createBoard(flipped = false) {
    const board = document.createElement("div");
    board.classList.add("board");

    /*If the chess board is filpped, that means that we are playing with black and coordinates must be adjusted acordingly */
    
    board.id = "chess-board";

    /* Flipping coordinates in the case that the board is flipped */
    const columns = flipped ? letters.reverse() : letters;
    const rows = flipped ? numbers : numbers.reverse();

    var wasLastLight = false;
    columns.forEach((letter) => {
        /* Creating columns and assigning their respective chess notation */
        const column = document.createElement("div");
        column.classList.add("column");
        column.id = letter;

        /* Creating the squares */
        rows.forEach((row, index, array) => {
            const square = document.createElement("div");
            square.classList.add("square");
            square.id = letter + row.toString();
            square.addEventListener("click", () => onSquareClick(square));

            /* Light or dark tile assignment */
            if (wasLastLight) {
                square.classList.add("dark");
                wasLastLight = false;
            } else {
                square.classList.add("light");
                wasLastLight = true;
            }

            /* Adding square to the column */
            /*square.innerText = letter + row.toString(); DEBUG*/
            column.append(square);

            /* Same color tile when it passes from column to column */
            wasLastLight = index == array.length - 1 ? !wasLastLight : wasLastLight;

        });

        board.append(column);
    });

    /* Adding coordinates to the board*/
    /* rows */
    const firstColumn = board.children.item(0);
    for (let index = 0; index < firstColumn.children.length; index++) {
        const rowCoordinate = document.createElement("div");
        rowCoordinate.innerText = firstColumn.children.item(index).id[1];
        rowCoordinate.classList.add("coordinate","number");

        /*Adding coordinate to left squares*/
        firstColumn.children.item(index).appendChild(rowCoordinate);
    }

    /* Columns */
    for (let index = 0; index < board.children.length; index++) {
        const columnCoordinate = document.createElement("div");
        columnCoordinate.innerText = board.children.item(index).id[0];
        columnCoordinate.classList.add("coordinate","letter");

        /*Adding coordinate to bottom squares*/
        board.children.item(index).children.item(7).appendChild(columnCoordinate);
    }
    
    /* Adding board to DOM */
    document.getElementById("board-wrapper").appendChild(board);

}

export function saveLayout () {

}

export function deleteBoard (){
    document.getElementById("chess-board").remove();
}

export function flipBoard (){
    const isFlipped = document.getElementById("chess-board").children.item(0).id == "h";
    
}


/* WORK ON THIS FOR THE NEXT TIME */
export function updatePieces () {
    return 0;
}