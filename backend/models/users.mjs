import bcrypt from 'bcrypt';
import { createTableRow, deleteTableRowMatchingColumns, editTableRowColumn, getTableRowColumn, getTableRowIdMatchingColumnValue } from './models.mjs';

export async function createUserDB(username,password,email){
    const hashed_password = await new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error(`Could not hash the password`);
                reject(err);
            }
            else {resolve(hash);}
        });
    });

    try {
        return await createTableRow('Users',['"username"','"password"','"email"'],[username,hashed_password,email]);
    }
    catch (error){
        console.error(`Could not create user ${username}`);
        throw error;
    }
}


async function deleteUserFromId(user_id){return await deleteTableRowMatchingColumns('Users',['"id"'],[user_id]);}

async function setUserPassword(user_id,password){
    const hashed_password = await new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error(`Could not hash the password`);
                reject(err);
            }
            else {resolve(hash);}
        });
    });
    try {
        return await editTableRowColumn('Users',user_id,'"password"',hashed_password);
    }
    catch (error) {
        console.error(`Could not change user ${username} password because of password hash error`);
        throw error;
    }
}


export async function getUserIdFromNameOrEmail(username_or_email) {
    let user_id = await getTableRowIdMatchingColumnValue('Users','"username"',username_or_email);
    if (user_id == null) user_id = await getTableRowIdMatchingColumnValue('Users','"email"',username_or_email);
    return user_id;
}


export async function getUsernameFromId(user_id){return await getTableRowColumn('Users','"username"',user_id);}
