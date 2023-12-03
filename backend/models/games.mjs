import mysql from 'mysql2/promise';
import { db_config } from '../constants.mjs';
import { getTableRowColumns,deleteTableRowMatchingColumns, createTableRow } from './models.mjs';

async function createGame(slug,description,rules,about){
    return await createTableRow('Games',['"slug"','"description"','"rules"','"about"'],[slug,description,rules,about])
}


async function getGameDescriptionRulesAbout(game_id){
    return await getTableRowColumns('Games',['"description"','"rules"','"about"'],game_id);
}


async function deleteGameFromId(game_id){return await deleteTableRowMatchingColumns('Games',['"id"'],[game_id]);}

async function getGameIdFromName(name) {
    game_id = null;
    try {
        const connection = mysql.createConnection(db_config);
        const [rows] = await connection.execute('SELECT "slug" FROM Games WHERE "slug" = ?', [name]);
        await connection.end();

        if (rows.length > 0) {
            game_id = rows[0].id;
        }
    }
    catch (error) {
        console.error('Error retrieving game ID: ', error);
    }

    return game_id;
}
