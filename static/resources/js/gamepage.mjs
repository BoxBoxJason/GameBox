/* JavaScript FRONT
 * Project: GameBox
 * Package: resources
 * Module: gamepage
 * Usage: Game page related scripts.
 * Date: 22/12/2023
 * author: BoxBoxJason
 */

export function setGameInfos(game_name){
    fetch(`http://localhost:8080/api/games/${game_name}?rules&about`)
    .then(res => res.json())
    .then((data) => {
        document.getElementById('rules_section').innerHTML = data.rules;
        document.getElementById('about_section').innerHTML = data.about;
    })
    .catch(err => console.log(err));
}
