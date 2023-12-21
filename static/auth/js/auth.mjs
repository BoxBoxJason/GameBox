/* JavaScript FRONT
 * Project: GameBox
 * Package:
 * Module: frontendChecks
 * Usage: General auth functions & listeners frontend side.
 * Date: 15/11/2023
 * author: BoxBoxJason
 */

import { checkEmailFormat, checkPasswordFormat, checkUsernameFormat } from "../../resources/js/credentialsChecks.mjs";


// Form switch listeners
document.getElementById('login_switch').addEventListener('click', () => {
    switchForm(document.getElementById('login_form'),document.getElementById('login_switch'),document.getElementById('register_form'),document.getElementById('register_switch'));
});
document.getElementById('register_switch').addEventListener('click', () => {
    switchForm(document.getElementById('register_form'),document.getElementById('register_switch'),document.getElementById('login_form'),document.getElementById('login_switch'));
});

// Form submit buttons
document.getElementById('register_form').addEventListener('submit', async function(event){
    event.preventDefault();
    await onRegister();
});
document.getElementById('login_form').addEventListener('submit', async function(event) {
    event.preventDefault();
    await onLogin();
});

/**
 * Switches between login and register forms
 * @param {HTMLElement} visible_form 
 * @param {HTMLElement} visible_switch 
 * @param {HTMLElement} invisible_form 
 * @param {HTMLElement} invisible_switch 
 */
function switchForm(visible_form,visible_switch,invisible_form,invisible_switch) {
    invisible_form.style.display = 'none';
    invisible_switch.style.borderColor = '#aaa';
    visible_form.style.display = 'block';
    visible_switch.style.borderColor = '#269bed';
    document.getElementById('alert_section').style.display = 'none';
}

/**
 * Actions performed when user clicks on login button
 */
async function onLogin(){
    const form_data = {
        username_or_email: document.getElementById('username_email_login').value,
        password: document.getElementById('password_login').value
    }

    const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form_data)
    });

    if (!response.ok) {
        const response_json = await response.json();
        displayAlertMessage(response_json.message);
    } else {
        window.location.href = '/';
    }
}

/**
 * Actions performed when user clicks on register button
 */
async function onRegister(){
    const username = document.getElementById('username_register').value;
    const email = document.getElementById('email_register').value;
    const password1 = document.getElementById('password_register').value;
    const password2 = document.getElementById('password_register_confirmation').value;

    if (! checkUsernameFormat(username)){displayAlertMessage('Invalid username format, must be 3-20 alphanumeric characters (accent included)');}
    if (! checkEmailFormat(email)){displayAlertMessage('Invalid email format');}
    if (! checkPasswordFormat(password1)){displayAlertMessage('Invalid password format, must be 8-64 alphanumeric characters and contain at least one special character');}
    else if (password1 != password2){displayAlertMessage('Passwords do not match !');}
    else {
        const form_data = {
            'username': username,
            password: password1,
            'email': email
        }

        const response = await fetch('/api/users/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form_data)
        });

        const response_json = await response.json();

        if(response.ok) {
            displaySuccessMessage(response_json.message);
            switchForm(document.getElementById('login_form'),document.getElementById('login_switch'),document.getElementById('register_form'),document.getElementById('register_switch'));
        }
        else {
            displayAlertMessage(response_json.message);
        }
    }
}

/**
 * Displays an alert message
 * @param {string} message 
 */
function displayAlertMessage(message) {
    const alert_section = document.getElementById('alert_section');
    alert_section.classList.remove('success','fail');
    alert_section.classList.add('fail');
    alert_section.innerHTML = message;
    alert_section.style.display = 'block';
}

/**
 * Displays a success message
 * @param {string} message 
 */
function displaySuccessMessage(message) {
    const alert_section = document.getElementById('alert_section');
    alert_section.classList.remove('success','fail');
    alert_section.classList.add('success');
    alert_section.innerHTML = message;
    alert_section.style.display = 'block';
}
