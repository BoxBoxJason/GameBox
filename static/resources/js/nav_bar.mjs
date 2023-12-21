/* JavaScript FRONT
 * Project: GameBox
 * Package: resources
 * Module: nav_bar
 * Usage: Front end management of nav bar.
 * Date: 18/12/2023
 * author: BoxBoxJason
 */


fetch('/api/users/user?avatar')
.then(response => {
    if (!response.ok) {
        document.getElementById('nav_bar_avatar').src = `../resources/images/avatars/default.png`;
        document.getElementById('nav_bar_avatar_ref').href = '/static/auth';
        document.getElementById('logout_button').style.display = 'none';
        const profile_form = document.getElementById('profile_form');
        profile_form.action = '/static/auth';
        document.getElementById('profile_button').innerHTML = 'Log in';
    } else {
        return response.json();
    }
})
.then(avatar => {
    if (avatar) {
        document.getElementById('nav_bar_avatar').src = `../resources/images/avatars/${avatar.avatar}`;
        document.getElementById('nav_bar_avatar_ref').href = '/static/profile';
        document.getElementById('logout_button').style.display = 'block';
        const profile_form = document.getElementById('profile_form');
        profile_form.action = '/static/profile';
        document.getElementById('profile_button').innerHTML = 'Profile';
    }
})
.catch(error => {
    console.error('Could not fetch username and avatar for this session',error);
});
