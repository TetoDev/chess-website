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
 }
 
 
 /* Piece initialization */
 export function initPieces (layout=defaultLayout) {
    for (const tile in layout) {
        const square = document.getElementById(tile);
        /* Creating img element for displaying the pieces accordingly.*/
        const img = document.createElement("img");
        img.src = "./pieces/" + layout[tile] + ".svg";
        img.alt = layout[tile];
        img.classList.add("piece")

        square.appendChild(img);
    }
 }

export function createBoard(flipped = false) {
    const board = document.createElement("div");
    board.classList.add("board");

    /*If the chess board is filpped, that means that we are playing with black and coordinates must be adjusted acordingly */
    if (flipped) {
        board.classList.add("flipped");
    }

    board.id = "chess-board";

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

    /* Flipping coordinates in the case that the board is flipped */
    const columns = flipped ? letters.reverse() : letters;
    const rows = flipped ? numbers : numbers.reverse();

    var wasLastLight = false;
    columns.forEach((letter) => {
        const column = document.createElement("div");
        column.classList.add("column");
        column.id = letter;


        rows.forEach((row, index, array) => {
            const square = document.createElement("div");
            square.classList.add("square");

            /* Light or dark tile assignment */
            if (wasLastLight) {
                square.classList.add("dark");
                wasLastLight = false;
            } else {
                square.classList.add("light");
                wasLastLight = true;
            }

            /* Adding square to the column */
            /*square.innerText = letter + row.toString();*/
            square.id = letter + row.toString();
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

    for (let index = 0; index < board.children.length; index++) {
        const columnCoordinate = document.createElement("div");
        columnCoordinate.innerText = board.children.item(index).id[0];
        columnCoordinate.classList.add("coordinate","letter");

        /*Adding coordinate to bottom squares*/
        board.children.item(index).children.item(7).appendChild(columnCoordinate);
    }
    
    document.body.appendChild(board)

}

export function deleteBoard (){
    document.getElementById("chess-board").remove();
}


/* WORK ON THIS FOR THE NEXT TIME */
export function updatePieces () {
    return 0;
}