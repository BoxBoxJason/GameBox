import { deleteTableRowsMatchingColumns, createTableRow, getTableRowsIdsMatchingColumnsValues, getTableRowColumnsFromId } from './models.mjs';


/**
 * Creates a new row (game) in the Games table.
 * @param {string} slug - Game slug (short name)
 * @param {string} illustration - File name of the game image
 * @param {string} description - Text used in the 'Description' section of the game (HTML displayable text)
 * @param {string} rules - Text used in the 'Rules' section of the game (HTML displayable text)
 * @param {string} about - Text used in the 'About' section of the game (HTML displayable text)
 * @returns {Promise<boolean>} - Success status of the query
 */
export async function createGame(slug,illustration,description,rules,about){return await createTableRow('Game',{'slug':slug,'illustration':illustration,'description':description,'rules':rules,'about':about});}


/**
 * Deletes every game that matches id in Games table.
 * @param {number} game_id - Database game ID
 * @returns {Promise<boolean>} - Success status of the query
 */
export async function deleteGameFromId(game_id){return await deleteTableRowsMatchingColumns('Game',{'id':game_id});}


/**
 * Returns the game ID corresponding to the requested name. Returns null if query returns no result.
 * @param {string} game_name - Game that needs to be retrieved
 * @returns {Promise<number || null>} - Database game ID
 */
export async function getGameIdFromName(game_name){
    const rows = await getTableRowsIdsMatchingColumnsValues('Game',{'slug':game_name});
    return rows.length > 0 ? rows[0].id : null;
}


/**
 * Returns the slug of the game that matches game_id. Returns null if the query does not retrieve anything.
 * @param {number} game_id 
 * @returns {Promise<string || null>} - Result of the query (Null if empty)
 */
export async function getGameSlugFromId(game_id){
    const row = await getTableRowColumnsFromId('Game',game_id,['slug']);
    return row ? row.slug : null;
  }
