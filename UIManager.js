import { GameManager } from "./gameManager.js";
import { InputManager } from "./InputManager.js";

export class UIManager{
    static {
        this.canvasEl = document.getElementById("canvas");
        this.mainMenuEl = document.getElementById("main-menu");
        this.newGameEl = document.getElementById("new-game");
        this.remapControlsEl = document.getElementById("remap-controls");
        this.highScoresEl = document.getElementById("high-scores");
        this.creditsEl = document.getElementById("credits");
        this.pauseMenuEl = document.getElementById("pause-menu");
        this.resumeEl = document.getElementById("resume");
        this.quitEl = document.getElementById("quit");
        this.controlsMenuEl = document.getElementById("controls-menu");
        this.remapMoveLeftButtonEl = document.getElementById("remap-move-left-button");
        this.remapMoveRightButtonEl = document.getElementById("remap-move-right-button");
        this.remapFireButtonEl = document.getElementById("remap-fire-button");
        this.remapPauseButtonEl = document.getElementById("remap-pause-button");
        this.resetDefaultButtonEl = document.getElementById("reset-default-button");
        this.highScoresDisplayEl = document.getElementById("high-scores-display");
        this.creditsDisplayEl = document.getElementById("credits-display");
        this.backBttn = document.getElementById("back-button");
        this.gameOverEl = document.getElementById("game-over");
        this.scoreSpanEl = document.getElementById("score-span");
        this.highScoresListEl = document.getElementById("high-scores-list");
        this.clearHighScoresEl = document.getElementById("clear-high-scores");

        /**@type {HTMLAudioElement} */
        this.BG_MUSIC = new Audio('./audio/NyanLoop.mp3');
        this.BG_MUSIC.loop = true;

        this.backableMenus = [this.controlsMenuEl, this.creditsDisplayEl, this.highScoresDisplayEl, this.gameOverEl];

        this.newGameEl.onclick = () => {
            this.showGame();
            //commenting out for now as it gets old during development
            // this.BG_MUSIC.play();
            GameManager.setDefaultState();
        }

        this.resumeEl.onclick = () => {
            this.showGame();
        }

        this.quitEl.onclick = () => {
            this.setDefaultState();
        }

        this.remapControlsEl.onclick = () => {
            this.showGenericMenu(this.controlsMenuEl);
        }

        this.remapMoveLeftButtonEl.onclick = () => {
            this.remapMoveLeft();
        }

        this.remapMoveRightButtonEl.onclick = () => {
            this.remapMoveRight();
        }

        this.remapFireButtonEl.onclick = () => {
            this.remapFire();
        }
        
        this.remapPauseButtonEl.onclick = () => {
            this.remapPause();
        };

        this.resetDefaultButtonEl.onclick = () => {
            this.resetDefaultControls();
        }

        this.highScoresEl.onclick = () => {
            this.showHighScores();
        }

        this.creditsEl.onclick = () => {
            this.showGenericMenu(this.creditsDisplayEl);
        }

        this.backBttn.onclick = () => {
            this.setDefaultState();
        }

        this.clearHighScoresEl.onclick = () => {
            SaveDataManager.clearScores();
            this.showHighScores();
        }

        this.setDefaultState();
    }
 
    static setDefaultState(){
        this.showGenericMenu(this.mainMenuEl);
        this.BG_MUSIC.pause();
    }

    /**
     * 
     * @param {HTMLElement} menuEl 
     */
    static showGenericMenu(menuEl){
        this.hideEverything();
        menuEl.style = "display: flex";
        if(this.backableMenus.includes(menuEl)){
            this.backBttn.style = "display: block";
        }
        this.inAMenu = true;
    }

    static remapMoveLeft(){
        this.remapMoveRightButtonEl.onclick = null;
        this.remapFireButtonEl.onclick = null;
        this.remapPauseButtonEl.onclick = null;

        this.remapMoveLeftButtonEl.innerHTML = "Press a key to set control for Move Left...";

        window.addEventListener('keyup', function(event) {
            const key = event.code;
            document.getElementById("remap-move-left-button").innerHTML = 'Move Left: "' + key + '"';
            InputManager.updateControls('left', event);
        }, { once : true });

        this.remapMoveRightButtonEl.onclick = () => {
            this.remapMoveRight();
        };
        this.remapFireButtonEl.onclick = () => {
            this.remapFire();
        };
        this.remapPauseButtonEl.onclick = () => {
            this.remapPause();
        };
    }

    static remapMoveRight(){
        this.remapMoveLeftButtonEl.onclick = null;
        this.remapFireButtonEl.onclick = null;
        this.remapPauseButtonEl.onclick = null;

        this.remapMoveRightButtonEl.innerHTML = "Press a key to set control for Move Right...";

        window.addEventListener('keyup', function(event) {
            const key = event.code;
            document.getElementById('remap-move-right-button').innerHTML = 'Move Right: "' + key + '"';
            InputManager.updateControls('right', event);
        }, { once : true });

        this.remapMoveLeftButtonEl.onclick = () => {
            this.remapMoveLeft();
        };
        this.remapFireButtonEl.onclick = () => {
            this.remapFire();
        };
        this.remapPauseButtonEl.onclick = () => {
            this.remapPause();
        };
    }

    static remapFire(){
        this.remapMoveLeftButtonEl.onclick = null;
        this.remapMoveRightButtonEl.onclick = null;
        this.remapPauseButtonEl.onclick = null;

        this.remapFireButtonEl.innerHTML = "Press a key to set control for Fire...";

        window.addEventListener('keyup', function(event) {
            const key = event.code;
            document.getElementById('remap-fire-button').innerHTML = 'Fire: "' + key + '"';
            InputManager.updateControls('fire', event);
        }, { once : true });
        
        this.remapMoveLeftButtonEl.onclick = () => {
            this.remapMoveLeft();
        };
        this.remapMoveRightButtonEl.onclick = () => {
            this.remapMoveRight();
        };
        this.remapPauseButtonEl.onclick = () => {
            this.remapPause();
        };
    }

    static remapPause(){
        this.remapMoveLeftButtonEl.onclick = null;
        this.remapMoveRightButtonEl.onclick = null;
        this.remapFireButtonEl.onclick = null;

        this.remapPauseButtonEl.innerHTML = "Press a key to set control for Pause/Back...";

        window.addEventListener('keyup', function(event) {
            const key = event.code;
            document.getElementById('remap-pause-button').innerHTML = 'Pause/Back: "' + key + '"';
            InputManager.updateControls('pause', event);
        }, { once : true });
        
        this.remapMoveLeftButtonEl.onclick = () => {
            this.remapMoveLeft();
        };
        this.remapMoveRightButtonEl.onclick = () => {
            this.remapMoveRight();
        };
        this.remapFireButtonEl.onclick = () => {
            this.remapFire();
        };
    }

    static resetDefaultControls(){
        this.remapMoveLeftButtonEl.innerHTML = "Move Left: \"ArrowLeft\""
        this.remapMoveRightButtonEl.innerHTML = "Move Right: \"ArrowRight\""
        this.remapFireButtonEl.innerHTML = "Fire: \"Space\""
        this.remapPauseButtonEl.innerHTML = "Pause/Back: \"Escape\""
        InputManager.controls = {
            left: 'ArrowLeft',
            right: 'ArrowRight',
            fire: ' ',
            pause: 'Escape'
        }
    }

    static showHighScores(){
        this.showGenericMenu(this.highScoresDisplayEl);
        //custom high scores func here
        this.highScoresListEl.innerHTML = ``;
        for(let score of [0, 0, 0, 0, 0]){
            this.highScoresListEl.innerHTML += `<li class="list-group-item score">${score}</li>`;
        }
    }

    static showGameOver(){
        this.showGenericMenu(this.gameOverEl);
        this.BG_MUSIC.pause();
        this.scoreSpanEl.innerHTML = `Your Score: ${GameManager.score}`;
    }

    static showGame(){
        this.hideEverything();
        this.canvasEl.style = "display: block;";
        this.inAMenu = false;
    }

    static hideEverything(){
        this.pauseMenuEl.style = "display: none";
        this.canvasEl.style = "display: none;";
        this.mainMenuEl.style = "display: none;";
        this.controlsMenuEl.style = "display: none;";
        this.creditsDisplayEl.style = "display: none;";
        this.highScoresDisplayEl.style = "display: none";
        this.backBttn.style = "display: none";
        this.gameOverEl.style = "display: none";
    }
}