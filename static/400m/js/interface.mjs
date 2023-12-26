/* JavaScript FRONT
 * Project: 400m
 * Package: js
 * Module: interface
 * Usage: General 400m interface functions & listeners.
 * Date: 15/11/2023
 * author: BoxBoxJason
 */

import { maxDistance, maxThrows } from "./constants.mjs";

// Throw button
const throwButton = document.getElementById("throwButton");
// Keep button
const keepButton = document.getElementById("keepButton");
// Canvas (used to display player travelled distance)
const canvas = document.getElementById("showDistance");
canvas.width = Math.round(canvas.width);
canvas.height = Math.round(canvas.height);
// Canvas context object
const ctx = canvas.getContext("2d");
ctx.font = "40px Arial";
ctx.textAlign = "center";
// Dice throw area
const diceArea = document.getElementById("diceArea");
// Dices history area
const historyArea = document.getElementById("historyArea");
const rollAudio = new Audio("./soundeffects/roll.mp3");
rollAudio.volume = 0.5;

document.getElementById("soundVolume").addEventListener("input", () => {
	rollAudio.volume = document.getElementById("soundVolume").value;
});

export function showTravelledDistance(formerDistance, newDistance) {
	const cw = canvas.width;
	const ch = canvas.height;
	const centerX = Math.round(cw / 2);
	const centerY = Math.round(ch / 2);
  
	ctx.clearRect(0, 0, cw, ch);
  
	ctx.translate(centerX, centerY); // Move origin to the center
	ellipse(0, 0, 0, 360, Math.round(cw / 3) - 20, Math.round(ch / 2) - 10, "red"); // Base ellipse
	ellipse(0, 0, 0, (newDistance * 360) / maxDistance, Math.round(cw / 3) - 20, Math.round(ch / 2) - 10, "green"); // Potential distance
	ellipse(0, 0, 0, (formerDistance * 360) / maxDistance, Math.round(cw / 3) - 20, Math.round(ch / 2) - 10, "blue"); // Confirmed distance
  
	ctx.fillStyle = "green";
	ctx.fillText(Math.round(newDistance) + "m", 0, 15); // Centered text
	ctx.translate(-centerX, -centerY); // Reset the origin
  }
  
  function ellipse(cx, cy, ds, de, w, h, color) {
	ctx.imageSmoothingEnabled = false; // Disable anti-aliasing

	for (let i = ds; i < de; i++) {
		let angle = i * ((Math.PI * 2) / 360);
		let x = Math.cos(Math.PI + angle) * w;
		let y = Math.sin(Math.PI + angle) * h;
  
		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.arc(cx + x, cy + y, 6, 0, 2 * Math.PI);
		ctx.fill();
	}
	ctx.imageSmoothingEnabled = true; // Re-enable anti-aliasing for other elements if needed
  }
  

function showButton(button,show){
	if (show) {button.style.display = "block";}
	else{button.style.display = "none";}
}


// "throw / rethrow" related interface function
export function updateRemainingThrows(numberThrows){document.getElementById("remainingThrows").textContent = "Remaining Throws: " + (maxThrows - numberThrows);}
export function updateThrowButton(text){throwButton.title = text;}
export function showThrowButton(show){showButton(throwButton,show);}
export function showKeepButton(show){showButton(keepButton,show);}
export function updateGameStatus(text){document.getElementById("gameStatus").textContent = text;}

export function gameOver() {
	// Stops the game
	showKeepButton(false);
	showThrowButton(false);
	const audio = new Audio('./soundeffects/victory.mp3');
	audio.play();
	const gameStatus = document.getElementById("gameStatus");
	gameStatus.textContent = "Game Over !";

}


export function putDicesHistory(dices) {
	let dicesSave = document.createElement('div');
	dicesSave.className = "dicesSave";

	for (const diceValue of dices){
		let newDice = document.createElement("div");
		newDice.className = "dice-" + Math.abs(diceValue);
		dicesSave.appendChild(newDice);
	}
	historyArea.appendChild(dicesSave);
}


export function animateDicesThrow(dices) {
	diceArea.textContent = '';
	rollAudio.play();
	for (const diceValue of dices) {
		let newDice = createDice();
		newDice.style.animationName = "roll" + diceValue;
		diceArea.appendChild(newDice);
	}
}


function createDice() {
	// Creates a 3d dice div and returns it
	let dice = document.createElement('div');
	dice.className = 'throwDice';
	for (const divname of ['front','back','left','right','top','bottom']){
		let newChild = document.createElement('div');
		newChild.className = "face " + divname;
		dice.appendChild(newChild);
	}
	return dice;
}
