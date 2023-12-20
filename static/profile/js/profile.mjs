/* JavaScript FRONT
 * Project: 
 * Package:
 * Module:
 * Usage: 
 * Date: 
 * author: BoxBoxJason
 */

import { getQueryParam } from "../../resources/js/queries.mjs";

const username = getQueryParam('username');
if ( username != null) {
    fetch(`/api/user/${username}`)
    .then(response => response.json())
    .then(user_data => {

    })
    .catch(error => {

    });
}
else {
    
}