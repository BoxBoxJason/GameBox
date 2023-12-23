/* JavaScript FRONT
 * Project: GameBox
 * Package: home
 * Module: home
 * Usage: General functions and listeners for home page.
 * Date: 22/12/2023
 * author: BoxBoxJason
 */

import { fillGamesDisplay } from "../../resources/js/gamesFromDB.mjs";
const games_display = document.getElementById('games_display');
fillGamesDisplay(games_display);
