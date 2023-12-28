/* JavaScript FRONT
 * Project: GameBox
 * Package: profile
 * Module: profile.mjs
 * Usage: 
 * Date: 27/12/2023
 * author: BoxBoxJason
 */

import { getQueryParam } from "../../resources/js/queries.mjs";

const username = getQueryParam('username');
if ( username != null) {
    const response = await fetch(`/api/users/user/${username}?avatar&username&time`);
    const data = await response.json();
} else {
    const response = await fetch(`/api/users/user?avatar&username&time&email&track_time&track_score`);
    if (response.status == 401) {
        window.location.href = "/static/auth";
    } else {
        const user_data = await response.json();
        setUserEditInfo(user_data);
    }
}

/**
 * Sets the user information in the profile edit page
 * @param {Object<string,any>} user_data 
 */
function setUserEditInfo(user_data){
    document.getElementById("username_input").value = user_data.username;
    document.getElementById("email_input").value = user_data.email;
    document.getElementById("user_avatar").src = `/static/resources/images/avatars/${user_data.avatar}`;

    // Set the track score property
    const scores_property = document.getElementById('scores_property');
    if (user_data.track_score) {
        scores_property.value = 'Disable';
        scores_property.className = 'red_submit';
    } else {
        scores_property.value = 'Enable';
        scores_property.className = 'green_submit';
    }

    // Set the track time property
    const time_property = document.getElementById('time_property');
    if (user_data.track_time) {
        time_property.value = 'Disable';
        time_property.className = 'red_submit';
    } else {
        time_property.value = 'Enable';
        time_property.className = 'green_submit';
    }
    // document.getElementById("time").innerHTML = user_data.time;
}

/**
 * Shows the profile element with the given id and hides the elements with the given ids
 * @param {string} visible_element_id 
 * @param {Array<string>} hidden_elements_ids 
 */
function showProfileElement(visible_element_id,hidden_elements_ids){
    document.getElementById(visible_element_id).style.display = 'flex';
    hidden_elements_ids.forEach(element_id => {
        document.getElementById(element_id).style.display = 'none';
    });
}

document.getElementById('show_profile').addEventListener('click',function(){
    showProfileElement('profile',['settings','statistics','scores']);
});

document.getElementById('show_settings').addEventListener('click',function(){
    showProfileElement('settings',['profile','statistics','scores']);
});

document.getElementById('show_statistics').addEventListener('click',function(){
    showProfileElement('statistics',['settings','profile','scores']);
});

document.getElementById('show_scores').addEventListener('click',function(){
    showProfileElement('scores',['settings','statistics','profile']);
});

function submitUserInfoForm(event) {
    event.preventDefault();
    fetch('your_endpoint', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          new_values: {
            username: document.getElementById('username_input').value,
            email: document.getElementById('email_input').value,
          },
          attempt_password: document.getElementById('password_info').value
        }),
    })
      .then(response => {
        // Handle response
      })
      .catch(error => {
        // Handle error
      });
}