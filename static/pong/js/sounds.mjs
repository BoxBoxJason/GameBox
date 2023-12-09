/* JavaScript FRONT
 * Project: Pong
 * Package: js
 * Module: sounds
 * Usage: Sounds related functions.
 * Date: 15/10/2023
 * author: BoxBoxJason
 */
// Sound effects
const speed_up_sound = new Audio("./sounds/speedUp.mp3");
const wall_bounce_sound = new Audio("./sounds/wallBounce.mp3");
const paddle_bounce_sound = new Audio("./sounds/paddleBounce.mp3");
const player_score_sound = new Audio("./sounds/scorePlayer.mp3");
const bot_score_sound = new Audio("./sounds/scoreBot.mp3");

export function playSound(sound_name){
    let selected_sound = null;
    switch(sound_name){
        case 'PADDLE_BOUNCE':
            selected_sound = paddle_bounce_sound;
            break;
        case 'WALL_BOUNCE':
            selected_sound = wall_bounce_sound;
            break;
        case 'SPEED_UP':
            selected_sound = speed_up_sound;
            break;
        case 'PLAYER_SCORE':
            selected_sound = player_score_sound;
            break;
        case 'BOT_SCORE':
            selected_sound = bot_score_sound;
            break;
    }
    if (selected_sound != null){
        selected_sound.play();
    }
}