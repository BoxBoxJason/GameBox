/* JavaScript FRONT
 * Project: 400m
 * Package: js
 * Module: music
 * Usage: 400m musics functions & listeners.
 * Date: 15/11/2023
 * author: BoxBoxJason
 */

import { basename } from "../../resources/js/utils.mjs";
import { setMusicAuthor, setMusicTitle } from "./interface.mjs";


// Music player object
const music_player = document.getElementById("musicPlayer");
music_player.volume = 0.2;
// Randomly shuffled musics list
var musics = await shuffleMusics();
// Current music index
var music_index = 0;


music_player.addEventListener('ended', () => {playNewMusic();});

/**
 * Returns a list of musics files path randomly shuffled
 * @returns {Promise<Array>} shuffled musics list
 */
async function shuffleMusics() {
	const response = await fetch('/api/games/musics_files_paths/400m');
    const data =  await response.json();
    const shuffled_musics = data.slice(0).sort(() => Math.random() - 0.5);
    return shuffled_musics;
}

// Manage music volume
document.getElementById("musicVolume").addEventListener("input", () => {
	music_player.volume = document.getElementById("musicVolume").value;
});

// Add listener to play music on first user interaction
for (const listenerType of ['click', 'dblclick', 'contextmenu', 'touchstart', 'touchmove', 'keydown']){
	document.addEventListener(listenerType,onFirstInteractDoc);
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
