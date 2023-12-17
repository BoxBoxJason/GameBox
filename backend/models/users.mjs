import { createTableRow, deleteTableRowMatchingColumns, editTableRowColumn, getTableRowColumn, getTableRowIdMatchingColumnValue } from './models.mjs';

export async function createUserDB(username,hashed_password,email){
    return await createTableRow('Users',['username','password','email'],[username,hashed_password,email]);
}


async function deleteUserFromId(user_id){return await deleteTableRowMatchingColumns('Users',['id'],[user_id]);}

async function setUserPassword(user_id,hashed_password){return await editTableRowColumn('Users',user_id,'password',hashed_password);}


export async function getUserIdFromNameOrEmail(username_or_email) {
    let user_id = await getTableRowIdMatchingColumnValue('Users','username',username_or_email);
    if (user_id == null) user_id = await getTableRowIdMatchingColumnValue('Users','email',username_or_email);
    return user_id;
}


export async function getUsernameFromId(user_id){return await getTableRowColumn('Users','username',user_id);}
export async function setUsername(user_id,username){
    let result = false;
    if (await getUserIdFromNameOrEmail(username) != null) {result =  await editTableRowColumn('Users',user_id,'username',username);}
    return result;
}


export async function getUserAvatar(user_id){return await getTableRowColumn('Users','avatar',user_id);}
export async function setUserAvatar(user_id,avatar_image_name){return await editTableRowColumn('Users',user_id,'avatar',avatar_image_name);}
