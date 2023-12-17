/* JavaScript FRONT
 * Project: GameBox
 * Package: resources
 * Module: js
 * Usage: Load games miniatures from database on frontend
 * Date: 15/12/2023
 * author: BoxBoxJason
 */

export async function fillGamesDisplay(container) {
    const response = await fetch('/games/get-all');
    if (response.ok) {
        const games_data = await response.json();
        games_data.array.forEach(game_dict => {
            container.appendChild(createGameMiniature(game_dict['"slug"'],game_dict['"illustration"']));
        });
    }
    else {
        console.warn('Could not retrieve games data from database');
    }
}


function createGameMiniature(game_name,game_illustration){
    let game_miniature = document.createElement('div');
    game_miniature.className = 'miniature';
    game_miniature.title = `Go to ${game_name}`;

    game_miniature.innerHTML = `
    <a href="/games/${game_name.toLowerCase()}">
    <h3>${game_name}</h3>
    <img src=../resources/images/games/${game_illustration}>
    </a>
    `;

    return game_miniature;
}
