import { setGame } from "./chess-board.js";
import { flipBoard } from "./js/chess-board.js";
import { clock } from "./js/clock.js";

class game {
    constructor(type, time, flipBoard){
        this.gameType = type;
        this.time = time;
        this.isWhiteTurn = true;
        this.winner = undefined;

        setGame(self);
        if (flipBoard) flipBoard();

    }

}