/* JavaScript FRONT
 * Project: Pong
 * Package: js
 * Module: bot
 * Usage: Bot related functions.
 * Date: 15/10/2023
 * author: BoxBoxJason
 */
import { paddle2, game_frame, ball } from './constants.mjs'

// Bot difficulty level
var bot_level = 1;


// Change difficulty
document.getElementsByName('difficulty').forEach(button => {
	button.addEventListener('change', (e) => {
		bot_level = parseInt(button.value);
	});
});


export function moveBotPaddle() {
	// Moves bot paddle according to chosen difficulty
    if (ball != null && game_frame != null && paddle2 != null){
        let gameFramePos = game_frame.getBoundingClientRect();
        let newTopCoord = window.pageYOffset + ball.getBoundingClientRect().top - 75;
        newTopCoord = Math.max(0,newTopCoord);
        newTopCoord = Math.min(newTopCoord,gameFramePos.height - 100);

        setTimeout(() => paddle2.style.top = newTopCoord + 'px',200 - 15 * bot_level);
    }
}
