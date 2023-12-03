import { getTableRowColumn } from "../models/models.mjs";

async function checkUserPassword(user_id,attempt_password) {
    let password_matches = false;
    const user_password = await getTableRowColumn('Users','"password"',user_id);

    if (user_password != null) {
        password_matches = bcrypt.compare(attempt_password,user_password);
    }
    else{
        console.error('Password could not be retrieved from database');
        password_matches = false;
    }

    return password_matches;
}