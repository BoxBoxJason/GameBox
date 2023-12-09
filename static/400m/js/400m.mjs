/* JavaScript FRONT
 * Project: 400m
 * Package: js
 * Module: 400m
 * Usage: General 400m functions & listeners.
 * Date: 15/11/2023
 * author: BoxBoxJason
 */

import { keepDices, play } from "./gamePlay.mjs";
import { setMusicAuthor, setMusicTitle, showNavBar, showPage, showStartText, showTravelledDistance } from "./interface.mjs";
import { shuffleMusics } from "./music.mjs";

// Throw (dices) button
const throwButton = document.getElementById("throwButton");
// Keep (dices) button
const keepButton = document.getElementById("keepButton");

// Music player object
const musicPlayer = document.getElementById("musicPlayer");
musicPlayer.volume = 0.2;
// Randomly shuffled musics list
var musics;
// Current music index
var musicIndex = 0;

var topBar = document.getElementById("topBar");

// ### EVENTS LISTENERS ###
// Scroll
var lastScrollTop = 0;

window.addEventListener('scroll', function() {
  let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScrollTop) {
    // Scrolling down
    topBar.style.transform = 'scale(0)'; // Decrease size
  } else {
    // Scrolling up
    topBar.style.transform = 'scaleY(1)'; // Increase size
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
});

// Rules
document.getElementById("closeRules").addEventListener("click",() => {
	showPage([false,true,false,false]);
});

document.getElementById("rulesButton").addEventListener("click",() => {
	showPage([true,false,false,false]);
});

// Settings
document.getElementById("closeSettings").addEventListener("click",() => {
	showPage([false,true,false,false]);
});

document.getElementById("settingsButton").addEventListener("click",() => {
	showPage([false,false,true,false]);
});

// About
document.getElementById("closeAbout").addEventListener("click",() => {
	showPage([false,true,false,false]);
});

document.getElementById("aboutButton").addEventListener("click", () => {
	showPage([false,false,false,true]);
});


document.getElementById("musicVolume").addEventListener("input", () => {
	musicPlayer.volume = document.getElementById("musicVolume").value;
});

// Music
for (const listenerType of ['click', 'dblclick', 'contextmenu', 'touchstart', 'touchmove', 'keydown']){
	document.addEventListener(listenerType,onFirstInteractDoc);
}

function onFirstInteractDoc(){
	showNavBar(true);
	showStartText(false);
	showPage([true,false,false,false]);
	musics = shuffleMusicsRemoveListeners();
	playNewMusic();
}

function shuffleMusicsRemoveListeners(){
	let shuffledMusics = shuffleMusics();
	musicPlayer.addEventListener('ended', () => {playNewMusic();});
	
	for (const listenerType of ['click', 'dblclick', 'contextmenu', 'touchstart', 'touchmove', 'keydown']){
		document.removeEventListener(listenerType,onFirstInteractDoc);
	}

	return shuffledMusics;
}

function playNewMusic() {
	let fileTitle = musics[musicIndex];
	const songInfo = fileTitle.split("-");
	setMusicTitle(songInfo[0].trim());
	setMusicAuthor(songInfo[1].replace(".mp3","").trim());

	musicPlayer.src = "./musics/" + fileTitle;
	musicPlayer.load();
	musicPlayer.play();

	musicIndex = (musicIndex + 1) % musics.length;
}


// ## Dices ##
throwButton.addEventListener("click",play);
keepButton.addEventListener("click",keepDices);

keepButton.style.display = "none";
showTravelledDistance(0,0);
