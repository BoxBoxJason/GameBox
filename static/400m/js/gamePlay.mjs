/* JavaScript FRONT
 * Project: 400m
 * Package: js
 * Module: gamePlay
 * Usage: General 400m gameplay functions & listeners.
 * Date: 15/11/2023
 * author: BoxBoxJason
 */

import { gameOver,showKeepButton,showThrowButton,animateDicesThrow,showTravelledDistance,updateThrowButton,updateRemainingThrows,putDicesHistory, updateGameStatus } from "./interface.mjs";
import { minDiceValue,maxDiceValue,maxRound,maxThrows, maxDistance, numberDicesPerThrow } from "./constants.mjs";
import { sum } from "./utils.mjs";

const diceFactor = maxDistance / (maxDiceValue - 1) / numberDicesPerThrow / maxRound;
var numberThrows = 0;
var totalDistance = 0;
var roundIndex = 0;
var dices = [];
var currentTimeOutId;


export function play() {
	showThrowButton(false);
	fetch(`/throw-dices/${numberDicesPerThrow}/${minDiceValue}/${maxDiceValue}`)
    .then(response => response.json())
    .then(data => {
		dices = data.result;
		animateDicesThrow(dices);
		numberThrows++;
        updateRemainingThrows(numberThrows);
		for (let i=0;i<dices.length;i++){
			if (dices[i] == maxDiceValue){
				dices[i] = - dices[i];
			}
		}
		if (numberThrows < maxThrows && roundIndex < maxRound){
			updateThrowButton("Relancer");
			currentTimeOutId = setTimeout(showTravelledDistance,4000,totalDistance,totalDistance + sum(dices) * diceFactor);
	
			let remainingThrows = maxThrows - numberThrows;
			if (remainingThrows > maxRound - 1 - roundIndex) {
				showThrowButton(true);
				showKeepButton(true);
			}
			else {showKeepButton(true);}
		}
		else if(roundIndex < maxRound){
			showKeepButton(true);
		}
		else{gameOver();}
    })
    .catch(error => {
        console.error('Error:', error);
		showThrowButton(true);
    });
}


export function keepDices() {
	roundIndex++;
	totalDistance += sum(dices) * diceFactor;
	
	// Change display
	clearTimeout(currentTimeOutId);
	showTravelledDistance(totalDistance,totalDistance);
	showKeepButton(false);
	updateGameStatus("Lancers Validés: " + roundIndex);
	if (roundIndex == maxRound){gameOver();}
	else {
		updateThrowButton("Lancer");
		showThrowButton(true)
	}

	putDicesHistory(dices);
}
