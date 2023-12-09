/* JavaScript FRONT
 * Project: GameBox
 * Package:
 * Module: frontendChecks
 * Usage: General auth functions & listeners frontend side.
 * Date: 15/11/2023
 * author: BoxBoxJason
 */
function checkPassword(password){
    return password.test(/^(?=.*[!@#$%^&*()_+|~\-={}\[\]:;"'<>,.?\/])(?=.*[a-zA-Z0-9]).{8,64}$/);
}


function onRegister(event){
    let password1 = document.getElementById('password_register').value;
    let password2 = document.getElementById('confirm_password_register').value;

    if (checkPassword(password1)){
        if (password1 === password2){

        }
        else {
            alert('Passwords do not match');
            event.preventDefault();
        }
    }
    else {
        alert('Invalid password: must be between 8 and 64 characters, 1 special character and 1 alphanumeric character');
        event.preventDefault();
    }
}


document.getElementById('login_switch').addEventListener('click', () => {
    document.getElementById('login_switch').style.borderColor = '#269bed';
    document.getElementById('register_switch').style.borderColor = '#aaa';
    document.getElementById('register_form').style.display = 'none';
    document.getElementById('login_form').style.display = 'block';
});
document.getElementById('register_switch').addEventListener('click', () => {
    document.getElementById('register_switch').style.borderColor = '#269bed';
    document.getElementById('login_switch').style.borderColor = '#aaa';
    document.getElementById('login_form').style.display = 'none';
    document.getElementById('register_form').style.display = 'block';
});
