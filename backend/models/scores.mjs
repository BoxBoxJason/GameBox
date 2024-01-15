import { connectDB } from '../controllers/databaseController.mjs'
import { createTableRow, deleteTableRowMatchingColumns, editTableRowColumn } from "./models.mjs";

async function createScore(value,game_id,user_id) {
    return await createTableRow('Score',['value','game_id','user_id'],[value,game_id,user_id]);
}


async function deleteUserScores(user_id) {
    return await deleteTableRowMatchingColumns('Score',['user_id'],[user_id]);
}


async function deleteGameScores(game_id) {
    return await deleteTableRowMatchingColumns('Score',['game_id'],[game_id]);
}


async function editScore(score_id,value) {
    return await editTableRowColumn('Score',score_id,'value',value);
}


export async function getGameScores(game_id, max_index) {
    const db = await connectDB();
    const Score = db.models.Score;

    const scores = await Score.findAll({
        attributes: ['value', 'user_id'],
        where: { game_id },
        order: [['value', 'DESC']],
        limit: max_index
    });

    // Close the connection
    await db.close();

    return scores ? scores : [];
}
