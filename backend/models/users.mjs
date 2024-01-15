import { createTableRow, deleteTableRowsMatchingColumns, getTableRowColumnsFromId, getTableRowsIdsMatchingColumnsValues } from './models.mjs';


/**
 * Creates a new row (user) in the Users database table.
 * @param {string} username - (Unique) username
 * @param {string} hashed_password - Hashed password (by bcrypt or some other lib)
 * @param {string} email - (Unique) email
 * @returns {Promise<boolean>} - Success status of the query.
 */
export async function createUserDB(username,hashed_password,email){return await createTableRow('User',{'username':username,'password':hashed_password,'email':email});}

/**
 * Deletes an existing row (user) in the Users database table.
 * @param {number} user_id 
 * @returns {Promise<boolean>} - Success status of the query.
 */
async function deleteUserFromId(user_id){return await deleteTableRowsMatchingColumns('User',{'id':user_id});}

/**
 * Returns user id that matches username / email given. Returns null if there is no result.
 * @param {string} username_or_email - User id or email
 * @returns {Promise<number || null>} - Result of the query
 */
export async function getUserIdFromNameOrEmail(username_or_email) {
    let user_id = await getUserIdFromUsername(username_or_email);
    if (user_id == null) {
        user_id = await getUserIdFromEmail(username_or_email);
    }
    return user_id;
}

/**
 * Returns user id that matches email given. Returns null if there is no result.
 * @param {string} email 
 * @returns {Promise<number || null>}
 */
export async function getUserIdFromEmail(email){
    const rows = await getTableRowsIdsMatchingColumnsValues('User',{'email':email});
    return rows.length > 0 ? rows[0].id : null;
}


/**
 * Returns user id that matches username given. Returns null if there is no result.
 * @param {string} username 
 * @returns {Promise<number || null>} - Result of the query
 */
export async function getUserIdFromUsername(username){
    const rows = await getTableRowsIdsMatchingColumnsValues('User',{'username':username})
    return rows.length > 0 ? rows[0].id : null;
}

/**
 * Returns the username matching user ID.
 * @param {number} user_id 
 * @returns {Promise<string>} - Corresponding username
 */
export async function getUsernameFromId(user_id){
    const row = await getTableRowColumnsFromId('User',user_id,['username']);
    return row.length > 0 ? row.username : null;
}
