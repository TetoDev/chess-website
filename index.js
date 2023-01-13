import { createBoard, initPieces, deleteBoard } from "./js/chess-board.js";



createBoard(false);
initPieces();

/* Testing */
const flip = document.createElement("button");
flip.innerText = "flip!"
flip.addEventListener('click',() => {
    const isFlipped = document.getElementById("chess-board").id == "h";
    deleteBoard();
    createBoard(!isFlipped);
    initPieces();
})
document.body.appendChild(flip);

/* End of testing */