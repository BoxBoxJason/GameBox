/* JavaScript FRONT
 * Project: GameBox
 * Package:
 * Module: frontendChecks
 * Usage: General auth functions & listeners frontend side.
 * Date: 15/11/2023
 * author: BoxBoxJason
 */

// Form switch listeners
document.getElementById('login_switch').addEventListener('click', () => {
    switchForm(document.getElementById('login_form'),document.getElementById('login_switch'),document.getElementById('register_form'),document.getElementById('register_switch'));
});
document.getElementById('register_switch').addEventListener('click', () => {
    switchForm(document.getElementById('register_form'),document.getElementById('register_switch'),document.getElementById('login_form'),document.getElementById('login_switch'));
});

// Form submit buttons
document.getElementById('submit_register').addEventListener('submit', async function(event){
    event.preventDefault();
    await onRegister();
});
document.getElementById('submit_login').addEventListener('submit', async function(event) {
    event.preventDefault();
    await onLogin();
});


async function onLogin(){
    const form_data = {
        username_or_email: document.getElementById('username_email_login').value,
        password: document.getElementById('password_login').value
    }

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form_data)
        });
    }
    catch {
        alert('Failed backend call to login');
    }
}


async function onRegister(){
    let password1 = document.getElementById('password_register').value;
    let password2 = document.getElementById('confirm_password_register').value;

    if (! checkPassword(password1)){
        alert('Password is invalid ! Make sure it is between 8-64 characters, with one special character and alphanumeric characters');
    }
    else if (password1 != password2){
        alert('Passwords do not match !');
    }
    else{
        const form_data = {
            username: document.getElementById('username_register').value,
            password: password1,
            email: document.getElementById('email_register').value
        }

        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form_data)
            });
        }
        catch {
            alert('Failed backend call to create user');
        }
    }
}


function checkPassword(password){
    return password.test(/^(?=.*[!@#$%^&*()_+|~\-={}\[\]:;"'<>,.?\/])(?=.*[a-zA-Z0-9]).{8,64}$/);
}


function switchForm(visible_form,visible_switch,invisible_form,invisible_switch) {
    invisible_form.style.display = 'none';
    invisible_switch.style.borderColor = '#aaa';
    visible_form.style.display = 'block';
    visible_switch.style.borderColor = '#269bed';
}
