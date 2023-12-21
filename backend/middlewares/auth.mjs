import bcrypt from 'bcrypt';
import { createUserDB, getUserIdFromEmail, getUserIdFromUsername } from "../models/users.mjs"
import { checkEmailFormat, checkPasswordFormat, checkUsernameFormat } from "../../static/resources/js/credentialsChecks.mjs";
import { getTableRowColumnsFromId } from '../models/models.mjs';


/**
 * Checks if user id given corresponds to registered password.
 * @param {number} user_id 
 * @param {string} attempt_password 
 * @returns {Promise<boolean>} - Indicates if password matches or not
 */
export async function checkUserPasswordFromId(user_id,attempt_password) {
    let password_matches = false;
    if (user_id != null) {
        const user_password_hash = await getTableRowColumnsFromId('Users',user_id,['password']);
        if (user_password_hash.hasOwnProperty('password')) {
            password_matches = bcrypt.compare(attempt_password,user_password_hash.password);
        }
    }
    return password_matches;
}


export async function createUser(username,password,email) {
    let result = [];
    if ( ! checkUsernameFormat(username)){
        result.push(400);
        result.push('Invalid username format, must be 3-20 alphanumeric characters (accent included)');
    }
    else if (await getUserIdFromUsername(username) != null){
        result.push(400);
        result.push('Username already in use !');
    }
    else if (! checkEmailFormat(email)) {
        result.push(400);
        result.push('Invalid email format');
    }
    else if (await getUserIdFromEmail(email) != null){
        result.push(400);
        result.push('Email already in use !');
    }
    else if (! checkPasswordFormat(password)) {
        result.push(400);
        result.push('Invalid password format, must be 8-64 alphanumeric characters and contain at least one special character');
    }
    else {
        const hashed_password = await hashPassword(password);
        await createUserDB(username,hashed_password,email);
        result.push(200,'User register successful ! Please log in.');
    }
    return result;
}


async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}
