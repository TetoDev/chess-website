import { isBoardFlipped } from "chess-board.js"

export class clock {
    constructor(white, time) {
        this.white = white;
        this.time = time;
        this.element = document.createElement("div");
        this.element.classList.add("clock");

        const clockWrappers = document.getElementsByClassName("clock-wrapper");
        
        if ((isBoardFlipped() && white) || (!isBoardFlipped() && !white)){
            clockWrappers.item(0).appendChild(this.element);
        } else {
            clockWrappers.item(1).appendChild(this.element);
        }
    }

    translateTime() {
        var minutes = (Math.floor(time/60)).toString();
        var seconds = (time - minutes*60).toString();

        if (minutes.length<=1){
            minutes = "0" + minutes
        }
        if (seconds.length<=1){
            seconds = "0" + seconds;
        }

        return minutes + ":" + seconds;
    }
    
    async countdown () {

    }

    async syncTime () {
        
    }
}