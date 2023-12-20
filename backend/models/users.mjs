import { createTableRow, deleteTableRowMatchingColumns, getTableRowIdMatchingColumnValue } from './models.mjs';


/**
 * Creates a new row (user) in the Users database table.
 * @param {string} username - (Unique) username
 * @param {string} hashed_password - Hashed password (by bcrypt or some other lib)
 * @param {string} email - (Unique) email
 * @returns {boolean} - Success status of the query.
 */
export async function createUserDB(username,hashed_password,email){return await createTableRow('Users',{'username':username,'password':hashed_password,'email':email});}


/**
 * Deletes an existing row (user) in the Users database table.
 * @param {number} user_id 
 * @returns {boolean} - Success status of the query.
 */
async function deleteUserFromId(user_id){return await deleteTableRowMatchingColumns('Users',['id'],[user_id]);}


/**
 * Returns user id that matches username / email given. Returns null if there is no result.
 * @param {string} username_or_email - User id or email
 * @returns {number || null} - Result of the query
 */
export async function getUserIdFromNameOrEmail(username_or_email) {
    let user_id = getUserIdFromUsername(username_or_email);
    if (user_id == null) user_id = await getTableRowIdMatchingColumnValue('Users','email',username_or_email);
    return user_id;
}


/**
 * Returns user id that matches username given. Returns null if there is no result.
 * @param {string} username 
 * @returns {number || null} - Result of the query
 */
export async function getUserIdFromUsername(username){return await getTableRowIdMatchingColumnValue('Users','username',username);}


/**
 * Returns the username matching user ID.
 * @param {number} user_id 
 * @returns {string} - Corresponding username
 */
export async function getUsernameFromId(user_id){return await getTableRowColumn('Users','username',user_id);}
