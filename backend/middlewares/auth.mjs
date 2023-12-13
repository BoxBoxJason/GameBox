import { getTableRowColumn, getTableRowIdMatchingColumnValue } from "../models/models.mjs";
import { InvalidArgumentException,NotUniqueDatabaseRowException } from "../../utils/exceptions.mjs"
import { createUserDB, getUserIdFromNameOrEmail } from "../models/users.mjs"


export async function checkUserPassword(username_or_email,attempt_password) {
    let password_matches = false;
    let user_id = await getUserIdFromNameOrEmail(username_or_email);

    if (user_password != null) {
        const user_password = await getTableRowColumn('Users','"password"',user_id);
        password_matches = bcrypt.compare(attempt_password,user_password);
    }

    return password_matches;
}


export async function createUser(username,password,email) {
    if (! checkUsername(username)){throw new InvalidArgumentException("Invalid Username");}
    if (! checkPassword(password)){throw new InvalidArgumentException("Invalid Password");}
    if (! checkEmail(email)){throw new InvalidArgumentException("Invalid Email");}
    if (getTableRowIdMatchingColumnValue('Users','"username"',username) != null){throw new NotUniqueDatabaseRowException(`Username ${username} already taken`);}
    if (getTableRowIdMatchingColumnValue('Users','"email"',email) != null){throw new NotUniqueDatabaseRowException(`email ${email} already taken`);}
    
    return await createUserDB(username,password,email);
}


function checkPassword(password){
    return password.test(/^(?=.*[!@#$%^&*()_+|~\-={}\[\]:;"'<>,.?\/])(?=.*[a-zA-Z0-9]).{8,64}$/);
}


function checkUsername(username){
    return username.test(/^[a-zA-Z0-9_À-ÿ\s]{3,20}$/);
}


function checkEmail(email){
    return email.test(/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/);
}
