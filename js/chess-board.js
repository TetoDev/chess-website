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
    h7: "bP"
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

var game = undefined;

/* Piece initialization */
function initPieces(layout = defaultLayout) {
    for (const tile in layout) {
        const square = document.getElementById(tile);
        /* Creating img element for displaying the pieces accordingly.*/
        const img = document.createElement("img");
        img.src = "./pieces/" + layout[tile] + ".svg";
        img.alt = layout[tile];

        const isWhite = layout[tile][0] == 'w';

        img.classList.add("piece", isWhite ? "white" : "black", layout[tile][1], "new");


        square.appendChild(img);
    }
}

function getLeftColumn(column) {
    const index = letters.indexOf(column) - 1;
    if (index < 0) {
        return "n"
    }
    return letters[index];
}

function getRightColumn(column) {
    const index = letters.indexOf(column) + 1;
    if (index >= letters.length || column == "n") {
        return "n"
    }
    return letters[index];
}

function getRightSquare(coordinates) {
    return getRightColumn(coordinates[0]) + coordinates[1];
}

function getLeftSquare(coordinates) {
    return getLeftColumn(coordinates[0]) + coordinates[1];
}

function isKing (piece) {
    return piece.classList.contains("K");
}

function move(piece, square) { /* Capture any pieces on target square */
    for (let index = 0; index < square.children.length; index++) {
        if (square.children.item(index).classList.contains("piece")) {
            square.children.item(index).remove();
        }
    }

    square.appendChild(piece);

}

function hasPiece(square) {

    if (square == NaN || square == undefined) {
        return [false, -1];
    }

    if (square.children.length === 0) {
        return [false, -1];
    }

    for (let index = 0; index < square.children.length; index++) {
        if (square.children.item(index).classList.contains("piece")) {
            return [true, index];
        }
    }
    return [false, -1];
}

function deleteActivePrompts() {
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
function createMovePrompt(capture) {
    const prompt = document.createElement("div");
    if (capture) {
        prompt.classList.add("capture-prompt");
    } else {
        prompt.classList.add("move-prompt");
    }
    return prompt;
}

function placeMovePrompt(coordinates, prompt) {
    const square = document.getElementById(coordinates);
    if (square == NaN || square == undefined) {
        return;
    }
    square.appendChild(prompt);
}

export function setGame (instance) {
    game = instance;
}

function possibleMoves(coordinates, piece, isNew, white) {
    const column = coordinates[0];
    const row = parseInt(coordinates[1]);
    const availableMoves = [];
    if (piece.classList.contains("P")) {
        /* Pawn */
        /* Defining potentially available squares and their coords */
        const nextSquareCoords = white ? column + (row + 1).toString() : column + (row - 1).toString();
        const nextNextSquareCoords = white ? column + (row + 2).toString() : column + (row - 2).toString();
        const leftNextSquareCoords = white ? getLeftColumn(column) + (row + 1).toString() : getRightColumn(column) + (row - 1).toString();
        const rightNextSquareCoords = white ? getRightColumn(column) + (row + 1).toString() : getLeftColumn(column) + (row - 1).toString();

        const nextSquare = document.getElementById(nextSquareCoords);
        const nextNextSquare = document.getElementById(nextNextSquareCoords);
        const leftNextSquare = !(leftNextSquareCoords[0] == 'n') ? document.getElementById(leftNextSquareCoords) : undefined;
        const rightNextSquare = !(rightNextSquareCoords[0] == 'n') ? document.getElementById(rightNextSquareCoords) : undefined;

        if (! hasPiece(nextSquare)[0]) {
            availableMoves.push(nextSquareCoords);

            /* If the pawn is new, if it has not moved, it can move two squares instead of just one */
            if (! hasPiece(nextNextSquare)[0] && isNew && (white ? row == 2 : row == 7)) {
                availableMoves.push(nextNextSquareCoords);
            }
        }

        /* Pawn captures */
        /* first checking if the square exist, then checking if there is pieces on that square - hasPieces() */
        if (leftNextSquare != undefined) {
            const readPiece = hasPiece(leftNextSquare);
            if (readPiece[0]) { 
                if (white != leftNextSquare.children.item(readPiece[1]).classList.contains("white") && !isKing(leftNextSquare.children.item(readPiece[1]))) {
                    availableMoves.push(leftNextSquareCoords + 'x');
                }
            }
        }
        if (rightNextSquare != undefined) {
            const readPiece = hasPiece(rightNextSquare);
            if (readPiece[0]) {
                if (white != rightNextSquare.children.item(readPiece[1]).classList.contains("white") && !isKing(rightNextSquare.children.item(readPiece[1]))) {
                    availableMoves.push(rightNextSquareCoords + 'x');
                }
            }
        }
    }
    if (piece.classList.contains('R') || piece.classList.contains("Q")) {
        /* Rook and Queen*/
        /* ---- Column ----- */
        /* Top */
        for (let index = row + 1; index <= 8; index++) {
            const squareCoords = column + index.toString();
            const square = document.getElementById(squareCoords);
            const readPiece = hasPiece(square);
            if (! readPiece[0]) {
                availableMoves.push(squareCoords);
            } else {
                const piece = square.children.item(readPiece[1]);
                if (piece.classList.contains("white") != white && !isKing(piece)) {
                    availableMoves.push(squareCoords + "x");

                }
                break;
            }
        }
        /* Bottom */
        for (let index = row - 1; index >= 1; index--) {
            const squareCoords = column + index.toString();
            const square = document.getElementById(squareCoords);
            const readPiece = hasPiece(square);
            if (! readPiece[0]) {
                availableMoves.push(squareCoords);
            } else {
                const piece = square.children.item(readPiece[1]);
                if (piece.classList.contains("white") != white && !isKing(piece)) {
                    availableMoves.push(squareCoords + "x");
                }
                break;
            }
        }
        /* ---- Row ----- */
        const columnIndex = letters.indexOf(column);
        /* left */
        for (let index = columnIndex - 1; index >= 0; index--) {
            const squareCoords = letters[index] + row.toString();
            const square = document.getElementById(squareCoords);
            const readPiece = hasPiece(square);

            if (! readPiece[0]) {
                availableMoves.push(squareCoords);
            } else {
                const piece = square.children.item(readPiece[1]);
                if (piece.classList.contains("white") != white && !isKing(piece)) {
                    availableMoves.push(squareCoords + "x");
                }
                break;
            }
        }
        /* Right */
        for (let index = columnIndex + 1; index <= 7; index++) {
            const squareCoords = letters[index] + row.toString();
            const square = document.getElementById(squareCoords);
            const readPiece = hasPiece(square);

            if (! readPiece[0]) {
                availableMoves.push(squareCoords);
            } else {
                const piece = square.children.item(readPiece[1]);
                if (piece.classList.contains("white") != white && !isKing(piece)) {
                    availableMoves.push(squareCoords + "x");
                }
                break;
            }
        }

    }
    if (piece.classList.contains("B") || piece.classList.contains("Q")) {
        /* Bishop and Queen*/
        /* top left */
        const columnIndex = letters.indexOf(column);
        var rowCounter = 1;
        for (let index = columnIndex - 1; index >= 0; index--) {
            const rowMove = row + rowCounter;
            if (rowMove > 8) 
                break;
            
            rowCounter = rowCounter + 1;
            const squareCoords = letters[index] + (rowMove).toString();
            const square = document.getElementById(squareCoords);
            const readPiece = hasPiece(square);

            if (! readPiece[0]) {
                availableMoves.push(squareCoords);
            } else {
                const piece = square.children.item(readPiece[1]);
                if (piece.classList.contains("white") != white && isKing(piece)) {
                    availableMoves.push(squareCoords + "x");
                }
                break;
            }
        }
        /* top right */
        rowCounter = 1
        for (let index = columnIndex + 1; index < 8; index++) {
            const rowMove = row + rowCounter;
            if (rowMove > 8) 
                break;
            
            rowCounter = rowCounter + 1;
            const squareCoords = letters[index] + (rowMove).toString();
            const square = document.getElementById(squareCoords);
            const readPiece = hasPiece(square);

            if (! readPiece[0]) {
                availableMoves.push(squareCoords);
            } else {
                const piece = square.children.item(readPiece[1]);
                if (piece.classList.contains("white") != white && !isKing(piece)) {
                    availableMoves.push(squareCoords + "x");
                }
                break;
            }
        }
        /* Bottom left */
        rowCounter = 1;
        for (let index = columnIndex - 1; index >= 0; index--) {
            const rowMove = row - rowCounter;
            if (rowMove < 1) 
                break;
            
            rowCounter = rowCounter + 1;
            const squareCoords = letters[index] + (rowMove).toString();
            const square = document.getElementById(squareCoords);
            const readPiece = hasPiece(square);

            if (! readPiece[0]) {
                availableMoves.push(squareCoords);
            } else {
                const piece = square.children.item(readPiece[1]);
                if (piece.classList.contains("white") != white && !isKing(piece)) {
                    availableMoves.push(squareCoords + "x");
                }
                break;
            }
        }
        /* Bottom right */
        rowCounter = 1
        for (let index = columnIndex + 1; index < 8; index++) {
            const rowMove = row - rowCounter;
            if (rowMove < 1) 
                break;
            
            rowCounter = rowCounter + 1;
            const squareCoords = letters[index] + (rowMove).toString();
            const square = document.getElementById(squareCoords);
            const readPiece = hasPiece(square);

            if (! readPiece[0]) {
                availableMoves.push(squareCoords);
            } else {
                const piece = square.children.item(readPiece[1]);
                if (piece.classList.contains("white") != white && !isKing(piece)) {
                    availableMoves.push(squareCoords + "x");
                }
                break;
            }
        }
    }
    if (piece.classList.contains("K")){
        /* King */

        const leftColumnElement = document.getElementById(getLeftColumn(column));
        const columnElement = document.getElementById(column);
        const rightColumnElement = document.getElementById(getRightColumn(column));
        const columns = [leftColumnElement,columnElement,rightColumnElement];


        columns.forEach((availableColumn) => {
            if (availableColumn == undefined) return;
            for (let index = row-1; index <= row +1; index++) {
                const squareCoords = availableColumn.id + index.toString();
                const square = document.getElementById(squareCoords);
                const readPiece = hasPiece(square);

                if(readPiece[0]){
                    const piece = square.children.item(readPiece[1]);

                    if(piece.classList.contains("white") != white && !isKing(piece)){
                        availableMoves.push(squareCoords+"x");
                    }
                } else {
                    availableMoves.push(squareCoords);
                }
            }
        })
    }
    if (piece.classList.contains("N")){
        /* Knight */
        /* Top */
        const topSquareCoords = column + (row+2).toString();
        const topLeft = document.getElementById(getLeftSquare(topSquareCoords));
        const topRight = document.getElementById(getRightSquare(topSquareCoords));

        /* Bottom */
        const bottomSquareCoords = column + (row - 2).toString();
        const bottomLeft = document.getElementById(getLeftSquare(bottomSquareCoords));
        const bottomRight = document.getElementById(getRightSquare(bottomSquareCoords));

        /* Left */
        const leftSquareCoords = getLeftColumn(getLeftColumn(column)) + row.toString();
        const leftTop = document.getElementById(leftSquareCoords[0] + (row + 1).toString());
        const leftBottom = document.getElementById(leftSquareCoords[0] + (row -1).toString());

        /* Right */
        const rightSquareCoords = getRightColumn(getRightColumn(column)) + row.toString();
        const rightTop = document.getElementById(rightSquareCoords[0] + (row +1).toString());
        const rightBottom = document.getElementById(rightSquareCoords[0] + (row-1).toString());

        /* Checking squares */
        const possibleSquares = [topLeft,topRight,bottomLeft,bottomRight,leftTop,leftBottom,rightTop,rightBottom];
        possibleSquares.forEach((possibleSquare) => {
            if (possibleSquare == undefined || possibleSquare == NaN) return;
            const readPiece = hasPiece(possibleSquare);

            if(readPiece[0]){
                const piece = possibleSquare.children.item(readPiece[1]);

                if(piece.classList.contains("white") != white && !isKing(piece)){
                    availableMoves.push(possibleSquare.id+"x");
                }
            } else {
                availableMoves.push(possibleSquare.id);
            }
        })
    }
    return availableMoves;
}

function displayPrompts(availableMoves) {
    deleteActivePrompts();
    /* Placing prompts */
    availableMoves.forEach((coordinate) => {
        const isCapture = coordinate.length > 2;
        if (isCapture) {
            coordinate = coordinate[0] + coordinate[1];
        }
        placeMovePrompt(coordinate, createMovePrompt(isCapture))
    })
}

function removeSelection() {
    const previousSelectedPieces = document.getElementsByClassName("selected-piece");
    const previousSelectedSquares = document.getElementsByClassName("selected-square");
    for (let index = 0; index < previousSelectedPieces.length; index++) {
        previousSelectedPieces.item(index).classList.remove("selected-piece");
    }
    for (let index = 0; index < previousSelectedSquares.length; index++) {
        previousSelectedSquares.item(index).classList.remove("selected-square");
    }
}

function moveHandler(square, readPiece, squareHasPrompt) {


    const updatedSquare = document.getElementById(square.id);
    const coordinates = updatedSquare.id;


    const piece = updatedSquare.children.item(readPiece[1]);
    const hasPiece = !(piece == undefined || piece == NaN);

    /*console.log(hasPiece,squareHasPrompt)*/

    if (hasPiece && ! squareHasPrompt) {
        deleteActivePrompts();
        deleteActivePrompts();
        removeSelection();

        const isNew = piece.classList.contains("new");
        const isWhite = piece.classList.contains("white");
        piece.classList.add("selected-piece");
        updatedSquare.classList.add("selected-square");

        displayPrompts(possibleMoves(coordinates, piece, isNew, isWhite));

    } else if (squareHasPrompt) {
        const selectedPiece = document.getElementsByClassName("selected-piece").item(0);

        move(selectedPiece, updatedSquare);

        removeSelection()
        deleteActivePrompts();
        deleteActivePrompts();
    } else {
        removeSelection()
        deleteActivePrompts();
        deleteActivePrompts();
    }

}

function onSquareClick(square) {

    const readPiece = hasPiece(square);
    const squareHasPrompt = () => {
        for (let index = 0; index < square.children.length; index++) {
            if (square.children.item(index).classList.contains("move-prompt") || square.children.item(index).classList.contains("capture-prompt")) {
                return true;
            }
        }
        return false;
    }
    /* If the clicked square doesn't have a piece, hasPiece() returns an array with a boolean representing if there is a piece and the index of that piece. */
    moveHandler(square, readPiece, squareHasPrompt());

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
    columns.forEach((letter) => { /* Creating columns and assigning their respective chess notation */
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
            wasLastLight = index == array.length - 1 ? ! wasLastLight : wasLastLight;

        });

        board.append(column);
    });

    /* Adding coordinates to the board*/
    /* rows */
    const firstColumn = board.children.item(0);
    for (let index = 0; index < firstColumn.children.length; index++) {
        const rowCoordinate = document.createElement("div");
        rowCoordinate.innerText = firstColumn.children.item(index).id[1];
        rowCoordinate.classList.add("coordinate", "number");

        /*Adding coordinate to left squares*/
        firstColumn.children.item(index).appendChild(rowCoordinate);
    }

    /* Columns */
    for (let index = 0; index < board.children.length; index++) {
        const columnCoordinate = document.createElement("div");
        columnCoordinate.innerText = board.children.item(index).id[0];
        columnCoordinate.classList.add("coordinate", "letter");

        /*Adding coordinate to bottom squares*/
        board.children.item(index).children.item(7).appendChild(columnCoordinate);
    }

    /* Adding board to DOM */
    document.getElementById("board-wrapper").appendChild(board);
    /* Initializing pieces */
    initPieces();
}

export function saveLayout() {

}

export function deleteBoard() {
    document.getElementById("chess-board").remove();
}

export function isBoardFlipped() {
    return document.getElementById("chess-board").children.item(0).id == "h";

}

export function flipBoard () {
    const flipped = isBoardFlipped();
    deleteBoard();
    createBoard(!flipped);
}


/* WORK ON THIS FOR THE NEXT TIME */
export function updatePieces() {
    return 0;
}
