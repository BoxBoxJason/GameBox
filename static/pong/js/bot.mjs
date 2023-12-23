/* JavaScript FRONT
 * Project: Pong
 * Package: js
 * Module: bot
 * Usage: Bot related functions.
 * Date: 15/10/2023
 * author: BoxBoxJason
 */
import { paddle2, game_frame, ball, paddle_height, ball_size } from './constants.mjs'

// Bot difficulty level
var bot_level = 1;


// Change difficulty
document.getElementsByName('difficulty').forEach(button => {
	button.addEventListener('change', (e) => {
		bot_level = parseInt(button.value);
        console.log(bot_level);
	});
});


export function moveBotPaddle() {
	// Moves bot paddle according to chosen difficulty
    if (ball != null && game_frame != null && paddle2 != null) {
        const gameframe_bounding_rect = game_frame.getBoundingClientRect();
        const ball_bounding_rect = ball.getBoundingClientRect();
        let newTopCoord = window.pageYOffset + (ball_bounding_rect.top + ball_bounding_rect.bottom) / 2 - paddle_height - ball_size;
        newTopCoord = Math.max(0,newTopCoord);
        newTopCoord = Math.min(newTopCoord,gameframe_bounding_rect.height - 100);

        setTimeout(() => paddle2.style.top = newTopCoord + 'px',200 - 15 * bot_level);
    }
}
