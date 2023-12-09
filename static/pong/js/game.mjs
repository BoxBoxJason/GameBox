/* JavaScript FRONT
 * Project: Pong
 * Package: js
 * Module: game
 * Usage: Game related functions and listeners.
 * Date: 15/10/2023
 * author: BoxBoxJason
 */
import { moveBotPaddle } from "./bot.mjs";
import { ball, paddle1, paddle2, game_frame } from "./constants.mjs";
import { moveBall, placeBall, resetScores } from "./interface.mjs";
import { playSound } from "./sounds.mjs";

// Consecutive rebounds 
var consecutive_rebounds = 0;
// Gamestate (-1 Not started, 0 Game ended, 1 Playing, 2 Pause)
var game_status = -1;
// Current animation id
var current_animation_id;
// x velocity
var dx = 0;
// y velocity
var dy = 0;

await respawnBall(game_frame.getBoundingClientRect());

// Start or end game
document.addEventListener("keydown", async (e) => {
	let game_state = document.getElementById('gameState');
	if (game_state != null){
		if (e.key == ' ') {
			if (game_status == 1) {
				game_status = 2;
				cancelAnimationFrame(current_animation_id);
				game_state.innerHTML = "Game Paused"
			}

			else if (game_status == 2) {
				game_state.innerHTML = "Game Playing";
				game_status = 1;
				await processBall();
			}
		}
		if (e.key == "Enter" && game_status < 1) {
			game_status = 1;
			game_state.innerHTML = "Game Playing";
			resetScores();
			await startGame();
		}
		
		else if (e.key == "Escape" && game_status > 0) {
			game_status = 0;
			game_state.innerHTML = "Game Ended";
			cancelAnimationFrame(current_animation_id);
		}
	}
});


async function startGame() {
	// Start a set, relaunches a ball at the center
	consecutive_rebounds = 0;
	if (game_status < 2 && game_frame != null) {
		let game_frame_rect = game_frame.getBoundingClientRect();

		await respawnBall(game_frame_rect);
		game_status = 1;
		processBall();
	}
}


async function respawnBall(game_frame_rect){
	const response = await fetch(`/games/pong/starting-point/${game_frame_rect.top}/${game_frame_rect.right}/${game_frame_rect.bottom}/${game_frame_rect.left}`);
	const data = await response.json();

	placeBall(data.x,data.y);
	dx = data.dx;
	dy = data.dy;
	consecutive_rebounds = 0;
}


async function processBall() {
	// Generates the movement animation, handles the boucing of ball and the scoring
	if (ball != null && game_frame != null && paddle1 != null && paddle2 != null){
		let ball_rect = ball.getBoundingClientRect();
		let game_frame_rect = game_frame.getBoundingClientRect();
		let paddle1_rect = paddle1.getBoundingClientRect();
		let paddle2_rect = paddle2.getBoundingClientRect();

		// Bouncing off top-bottom walls
		if (ballBouncesWall(ball_rect,game_frame_rect)) {
			playSound('WALL_BOUNCE');
			dy = -dy;
		}

		// Boucing off paddles
		if (ballBouncesPaddle(ball_rect,paddle1_rect,paddle2_rect)) {bouncePaddle();}

		// Scoring
		else if (ballScoresP1(ball_rect,game_frame_rect)) {await score('1');}
		else if (ballScoresP2(ball_rect,game_frame_rect)){await score('2');}

		// Move
		moveBall(dx,dy);
		moveBotPaddle();
		current_animation_id = requestAnimationFrame(() => {
			processBall();
		});
	}
}


function bouncePaddle() {
	playSound('PADDLE_BOUNCE');
	dx = -dx;
	consecutive_rebounds += 1;
	// Speeding up after a set number of paddle rebounds
	if (consecutive_rebounds > 10) {
		playSound('SPEED_UP');
		consecutive_rebounds = 0;
		dx *= 1.1;
		dy *= 1.1;
	}
}


async function score(scorer){
	// Adds a point to the current score of a player
	if (scorer == '1'){playSound('PLAYER_SCORE');}
	else{playSound('BOT_SCORE');}
	let scorer_id = "score" + scorer;
	let score_to_update = document.getElementById(scorer_id);
	if (score_to_update != null && game_frame != null){
		score_to_update.innerHTML = (+score_to_update.innerHTML + 1).toString();
		await respawnBall(game_frame.getBoundingClientRect());
	}
}


function ballBouncesPaddle(ball_rect, paddle1_rect, paddle2_rect) {
	return ball_rect.left <= paddle1_rect.right &&
	ball_rect.bottom >= paddle1_rect.top &&
	ball_rect.top <= paddle1_rect.bottom &&
	dx < 0 || 
	ball_rect.right >= paddle2_rect.left &&
	ball_rect.bottom >= paddle2_rect.top &&
	ball_rect.top <= paddle2_rect.bottom &&
	dx > 0;
}


function ballBouncesWall(ball_rect,game_frame_rect) {
	return ball_rect.top <= game_frame_rect.top && dy < 0 || ball_rect.bottom >= game_frame_rect.bottom && dy > 0;
}


function ballScoresP1(ball_rect, game_frame_rect) {
	return ball_rect.right >= game_frame_rect.right;
}


function ballScoresP2(ball_rect, game_frame_rect) {
	return ball_rect.left <= game_frame_rect.left;
}
