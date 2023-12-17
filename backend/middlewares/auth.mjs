import bcrypt from 'bcrypt';
import { getTableRowColumn } from "../models/models.mjs";
import { createUserDB, getUserIdFromNameOrEmail } from "../models/users.mjs"
import { checkEmailFormat, checkPasswordFormat, checkUsernameFormat } from "../../static/resources/js/credentialsChecks.mjs";


export async function checkUserPassword(username_or_email,attempt_password) {
    let password_matches = false;
    const user_id = await getUserIdFromNameOrEmail(username_or_email);
    if (user_id != null){
        let user_password_hash = await getTableRowColumn('Users','"password"',user_id);
        if (user_password_hash != null) {
            password_matches = bcrypt.compare(attempt_password,user_password_hash);
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
    else if (await getUserIdFromNameOrEmail(username) != null){
        result.push(400);
        result.push('Username already in use !');
    }
    else if (! checkEmailFormat(email)) {
        result.push(400);
        result.push('Invalid email format');
    }
    else if (await getUserIdFromNameOrEmail(email) != null){
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
