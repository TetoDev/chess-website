import { createBoard, deleteBoard } from "./js/chess-board.js";
import { clock } from "./js/clock.js";



createBoard(false);

new clock(true,300);
new clock(false,300);
