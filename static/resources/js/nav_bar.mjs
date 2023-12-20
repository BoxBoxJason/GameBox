/* JavaScript FRONT
 * Project: 
 * Package:
 * Module:
 * Usage: 
 * Date: 
 * author: BoxBoxJason
 */


fetch('/auth/getAvatar')
.then(response => response.json())
.then(avatar => {
    if (avatar != null) {
        document.getElementById('nav_bar_avatar').src = `../resources/images/avatars/${avatar.avatar}`;
        document.getElementById('nav_bar_avatar_ref').href = '';
        document.getElementById('logout_button').style.display = 'block';
        const profile_form = document.getElementById('profile_form');
        profile_form.action = '/user/profile';
        profile_form.method = 'POST';
        document.getElementById('profile_button').innerHTML = 'Profile';
    }
    else {
        document.getElementById('nav_bar_avatar').src = `../resources/images/avatars/default.png`;
        document.getElementById('nav_bar_avatar_ref').href = '/auth';
        document.getElementById('logout_button').style.display = 'none';
        const profile_form = document.getElementById('profile_form');
        profile_form.action = '/auth';
        profile_form.method = 'GET';
        document.getElementById('profile_button').innerHTML = 'Log in';
    }
})
.catch(error => {
  console.error('Could not fetch username and avatar for this session',error);
});