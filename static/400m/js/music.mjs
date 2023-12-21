/* JavaScript FRONT
 * Project: 400m
 * Package: js
 * Module: music
 * Usage: 400m musics functions & listeners.
 * Date: 15/11/2023
 * author: BoxBoxJason
 */

export function shuffleMusics() {
	fetch('/api/games/musics_files_paths/400m')
    .then(response => response.json())
    .then(data => {
        const musicFiles = data.files;
		const shuffledMusics = musicFiles.slice(0).sort(() => Math.random() - 0.5);

		return shuffledMusics;
    })
    .catch(error => {
        console.error('Error:', error);
    });
	
}
