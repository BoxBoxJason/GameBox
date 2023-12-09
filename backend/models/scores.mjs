import { connectDB } from '../controllers/databaseController.mjs'
import { createTableRow, deleteTableRowMatchingColumns, editTableRowColumn } from "./models.mjs";

async function createScore(value,game_id,user_id) {
    return await createTableRow('Scores',['"value"','"game_id"','"user_id"'],[value,game_id,user_id]);
}


async function deleteUserScores(user_id) {
    return await deleteTableRowMatchingColumns('Scores',['"user_id"'],[user_id]);
}


async function deleteGameScores(game_id) {
    return await deleteTableRowMatchingColumns('Scores',['"game_id"'],[game_id]);
}


async function editScore(score_id,value) {
    return await editTableRowColumn('Scores',score_id,'"value"',value);
}


async function getGameScores(game_id,max_index){
    let db = connectDB();
    
    return new Promise((resolve,reject) => {
        db.all(`SELECT "value","user_id" FROM Scores WHERE "game_id" = ? ORDER BY "value" DESC LIMIT ?;`,[game_id,max_index],(err,rows) => {
            db.close();
            if (err) {
                reject(err);
            }
            else{
                resolve(rows);
            }
        });
    });
}
