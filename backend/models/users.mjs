import bcrypt from 'bcrypt';
import { createTableRow, deleteTableRowMatchingColumns, editTableRowColumn, getTableRowIdMatchingColumnValue } from './models.mjs';

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
    try{
        return await editTableRowColumn('Users',user_id,'"password"',hashed_password);
    }
    catch (error) {
        console.error(`Could not change user ${username} password because of password hash error`);
        throw error;
    }
}


async function getUserIdFromName(username) {return await getTableRowIdMatchingColumnValue('Users','"username"',username);}
