/* JavaScript FRONT
 * Project: Pong
 * Package: js
 * Module: interface
 * Usage: Interface related functions.
 * Date: 15/10/2023
 * author: BoxBoxJason
 */
import { paddle1, ball, game_frame } from './constants.mjs'
// Current animation ID
var currentAnimationId;

export function getOffsets(obj){
	let curleft = 0;
	let curtop = 0;
	if (obj.offsetParent) {
		do {
		curleft += obj.offsetLeft;
		curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
	}
	return [curleft,curtop];
}


export function placeBall(x,y) {
	// Respawns the ball at given coordinates
    if (ball != null) {
        let offsets = getOffsets(game_frame);

        ball.style.top = offsets[1] + y + 'px';
        ball.style.left = offsets[0] + x + 'px';
        cancelAnimationFrame(currentAnimationId);
    }
}


function movePlayerPaddle(e) {
	// Moves the player paddle by following the client cursor
    if (game_frame != null && paddle1 != null){
        const game_frame_pos = game_frame.getBoundingClientRect();
        let new_top_coord = e.pageY - (game_frame_pos.top  + 50) - window.scrollY;
        new_top_coord = Math.max(0,new_top_coord);
        new_top_coord = Math.min(new_top_coord,game_frame_pos.height -100);
        paddle1.style.top = new_top_coord + 'px';
    }
}


export function resetScores() {
	// Resets both players scores to 0
	let s1 = document.getElementById('score1');
    let s2 = document.getElementById('score2');
    if (s1 != null && s2 != null){
        s1.innerHTML = '0';
        s2.innerHTML = '0';
    }
}

// ### EVENT LISTERNERS ###
// Tracking paddle
if (game_frame != null){
    game_frame.addEventListener("mousemove", (e) => {
        movePlayerPaddle(e);
    });
}


export function moveBall(dx, dy) {
    if (ball != null) {
        const currentTop = parseInt(ball.style.top) || 0;
        const currentLeft = parseInt(ball.style.left) || 0;

        ball.style.top = (currentTop + dy) + 'px';
        ball.style.left = (currentLeft + dx) + 'px';
    }
}
