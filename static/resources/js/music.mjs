/* JavaScript FRONT
 * Project: 400m
 * Package: js
 * Module: music
 * Usage: 400m musics functions & listeners.
 * Date: 15/11/2023
 * author: BoxBoxJason
 */

import { basename } from "./utils.mjs";

// Randomly shuffled musics list
var musics;
// Current music index
var music_index = 0;

/**
 *	Init musics
 * @param {string} game_dir_name 
 */
export async function initMusics(game_dir_name) {
	await shuffleMusics(game_dir_name);
}

/**
 * Returns a list of musics files path randomly shuffled
 * @param {string} game_dir_name - game directory name
 * @returns {Promise<Array>} shuffled musics list
 */
async function shuffleMusics(game_dir_name) {
	const response = await fetch(`/api/games/musics_files_paths/${game_dir_name}`);
    const data =  await response.json();
    const shuffled_musics = data.slice(0).sort(() => Math.random() - 0.5);
    musics = shuffled_musics;
}

/**
 * Play music on first user interaction
 */
function onFirstInteractDoc(){
	playNewMusic();
    for (const listenerType of ['click', 'dblclick', 'contextmenu', 'touchstart', 'touchmove', 'keydown']){
		document.removeEventListener(listenerType,onFirstInteractDoc);
	}
}

/**
 * Play a new music
 */
function playNewMusic() {
	const music_file_path = musics[music_index];
	const song_info = basename(music_file_path).replace('.mp3','').split('-').map((str) => str.trim());
	setMusicTitle(song_info[0]);
	setMusicAuthor(song_info[1]);

	music_player.src = music_file_path;
	music_player.load();
	music_player.play();

	music_index = (music_index + 1) % musics.length;
}


function setMusicTitle(text){document.getElementById("musicTitle").textContent = text;}
function setMusicAuthor(text){document.getElementById("musicAuthor").textContent = text;}


// Music player object
const music_player = document.getElementById("musicPlayer");
if (music_player) {
	music_player.volume = 0.2;
	music_player.addEventListener('ended', () => {playNewMusic();});
	// Manage music volume
	const music_volume = document.getElementById("musicVolume");
	music_volume.addEventListener("input", () => {
		music_player.volume = music_volume.value;
	});
	// Add listener to play music on first user interaction
	for (const listenerType of ['click', 'dblclick', 'contextmenu', 'touchstart', 'touchmove', 'keydown']){
		document.addEventListener(listenerType,onFirstInteractDoc);
	}
}