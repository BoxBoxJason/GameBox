import mysql from 'mysql2/promise';
import { createTableRow, deleteTableRowMatchingColumns, editTableRowColumn } from "./models.mjs";
import { db_config } from '../constants.mjs';

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
    let success = true;
    let query = `SELECT *FROM Scores WHERE "game_id" = ? ORDER BY "value" DESC LIMIT ${max_index};`
    try {
        const connection = await mysql.createConnection(db_config);
        await connection.execute(query,[game_id]);
        await connection.end();
    }
    catch (error) {
        success = false;
        console.error(`Could not retrieve scores for Game: ${game_id}`,error);
    }

    return success;
}