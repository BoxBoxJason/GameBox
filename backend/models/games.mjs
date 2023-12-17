import { getTableRowColumns,deleteTableRowMatchingColumns, createTableRow, getTableRowIdMatchingColumnValue } from './models.mjs';

async function createGame(slug,description,rules,about){
    return await createTableRow('Games',['"slug"','description','rules','about'],[slug,description,rules,about])
}


async function getGameDescriptionRulesAbout(game_id){
    return await getTableRowColumns('Games',['description','rules','about'],game_id);
}


async function deleteGameFromId(game_id){return await deleteTableRowMatchingColumns('Games',['id'],[game_id]);}

async function getGameIdFromName(name) {
    return await getTableRowIdMatchingColumnValue('Games','slug',name);
}
