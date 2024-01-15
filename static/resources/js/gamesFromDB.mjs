/* JavaScript FRONT
 * Project: GameBox
 * Package: resources
 * Module: js
 * Usage: Load games miniatures from database on frontend
 * Date: 15/12/2023
 * author: BoxBoxJason
 */

/**
 * Fill the given container with games miniatures
 * @param {HTMLElement} container 
 */
export async function fillGamesDisplay(container) {
    const response = await fetch('/api/games?slug&illustration');
    if (response.ok) {
        const games_data = await response.json();
        for (const game_dict of games_data) {
            container.appendChild(createGameMiniature(game_dict.slug,game_dict.illustration));
        }
    } else {
        console.warn('Could not retrieve games data from database');
    }
}

/**
 * Create a game miniature with given name and illustration.
 * @param {string} game_name 
 * @param {string} game_illustration 
 * @returns {HTMLElement} - The game miniature
 */
function createGameMiniature(game_name,game_illustration) {
    let game_miniature = document.createElement('div');
    game_miniature.className = 'miniature';
    game_miniature.title = `Go to ${game_name}`;

    if (game_illustration === '') {
      game_miniature.innerHTML = `
      <a href="/static/${game_name.toLowerCase()}"style="text-decoration: none; display: block; max-width:100%;">
          <h3>${game_name}</h3>
          <img src='https://picsum.photos/300/150' alt="${game_name} illustration">
      </a>
      `;
    } else {
        game_miniature.innerHTML = `
        <a href="/static/${game_name.toLowerCase()}"style="text-decoration: none; display: block; max-width:100%;">
            <h3>${game_name}</h3>
            <img src=../resources/images/games/${game_illustration} alt="${game_name} illustration">
        </a>
        `;
    }
    return game_miniature;
}
