/* JavaScript FRONT
 * Project: 400m
 * Package: js
 * Module: 400m
 * Usage: General 400m functions & listeners.
 * Date: 15/11/2023
 * author: BoxBoxJason
 */
import { keepDices, play } from "./gamePlay.mjs";
import { showTravelledDistance } from "./interface.mjs";

// Throw (dices) button
const throwButton = document.getElementById("throwButton");
// Keep (dices) button
const keepButton = document.getElementById("keepButton");

// ### EVENTS LISTENERS ###

// ## Dices ##
throwButton.addEventListener("click",play);
keepButton.addEventListener("click",keepDices);

keepButton.style.display = "none";
showTravelledDistance(0,0);
