import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import { db_config } from '../constants.mjs';
import { createTableRow, deleteTableRowMatchingColumns, editTableRowColumn, getTableRowColumn } from './models.mjs';

async function createUser(username,password){
    const hashed_password = await new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error(`Could not create user ${username} because of password hash error`);
                reject(err);
            }
            else {resolve(hash);}
        });
    });
    return await createTableRow('Users',['"username"','"password"'],[username,hashed_password]);
}


async function deleteUserFromId(user_id){return await deleteTableRowMatchingColumns('Users',['"id"'],[user_id]);}

async function setUserPassword(user_id,passsword){
    let success = true;
    const hashed_password = await new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error(`Could not create user ${username} because of password hash error`);
                reject(err);
            }
            else {resolve(hash);}
        });
    });

    success = await editTableRowColumn('Users',user_id,'"password"',hashed_password);

    return success;
}


async function getUserIdFromName(username) {
    let user_id = null;
    try {
        const connection = mysql.createConnection(db_config);
        const [rows] = await connection.execute('SELECT "id" FROM Users WHERE "username" = ?', [username]);
        await connection.end();

        if (rows.length > 0) {
            user_id = rows[0].id;
        }
    }
    catch (error) {
        console.error('Error retrieving user ID: ', error);
    }

    return user_id;
}
