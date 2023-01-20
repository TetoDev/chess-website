import { isBoardFlipped } from "./chess-board.js"

export class clock {
    constructor(white, time) {
        this.stop = false;
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
        this.updateTime();
    }

    translateTime() {
        var minutes = (Math.floor(this.time/60)).toString();
        var seconds = (this.time - minutes*60).toString();

        if (minutes.length<=1){
            minutes = "0" + minutes
        }
        if (seconds.length<=1){
            seconds = "0" + seconds;
        }

        return minutes + ":" + seconds;
    }

    minus(time) {
        this.time = this.time - time;
    }
    
    plus(time) {
        this.time = this.time - time;
    }
    
    updateTime () {
        const stringedTime = this.translateTime();
        this.element.innerHTML = stringedTime;
        
        if (stringedTime == "00:00"){
            this.stop = true;
            // Determine looser.
        }
    }
    
    async countdown () {
        while (true){
            if (this.stop) break;
            
            setTimeout(() => this.minus(1),1000);
        }
    }

    async syncTime () {
// WOP, implementation with backend
    }
}