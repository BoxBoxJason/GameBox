import { connectDB } from '../controllers/databaseController.mjs'

/**
 * Creates a new row in a database table.
 * @param {string} table_name - Database table name
 * @param {Object<string,any>} columns_values_dict - Column name: Column value pairs
 * @returns {Promise<boolean>} - Success status of the creation query
 */
export async function createTableRow(table_name, columns_values_dict) {
    const db = await connectDB();

    const table = db.models[table_name];
    const result = await table.create(columns_values_dict);

    await db.close();

    return !!result;
}


/**
 * Returns all table rows ids that match all given filters.
 * @param {string} table_name - Database table name
 * @param {Object<string,any>} columns_values_dict - Column name: Column value pairs used to filter
 * @returns {Promise<Array<Object<string,any>>>} - Result of the database query
 */
export async function getTableRowsIdsMatchingColumnsValues(table_name, columns_values_dict) {
    const db = await connectDB();
    const table = db.models[table_name];

    const rows = await table.findAll({
        attributes: ['id'],
        where: columns_values_dict,
        raw: true
    });

    await db.close();

    return rows ? rows : [];
}


/**
 * Requests columns for row matching row id in the database table. If columns_names is empty, requests all columns.
 * @param {string} table_name - Database table name
 * @param {Array<string>} columns_names - Table columns names requested
 * @param {number} row_id - Table row id filter
 * @returns {Promise<Object<string,any>>} - Result of database query
 */
export async function getTableRowColumnsFromId(table_name, row_id, columns_names) {
    const db = await connectDB();
    const table = db.models[table_name];

    const row = await table.findOne({
        attributes: columns_names.length !== 0 ? columns_names : undefined,
        where: { id: row_id },
        raw: true
    });

    await db.close();

    return row ? row : {};
}


/**
 * Deletes database rows that match filters. 
 * @param {string} table_name - Database table name
 * @param {Object<string,any>} columns_values_dict - Column name: Column value pairs used to filter
 * @returns {Promise<number>} - Number of rows deleted by the query
 */
export async function deleteTableRowsMatchingColumns(table_name, columns_values_dict) {
    const db = await connectDB();
    const table = db.models[table_name];

    const result = await table.destroy({
        where: columns_values_dict
    });

    await db.close();

    return result;

}


/**
 * Edits existing row columns values in specified table.
 * @param {string} table_name - Database table name
 * @param {number} row_id - Table row id filter
 * @param {Object<string,any>} columns_values_dict - Column name: New column value pairs to edit
 * @returns {Promise<boolean>} - Success status of the query
 */
export async function setTableRowColumnsFromId(table_name, row_id, columns_values_dict) {
    const db = await connectDB();
    const table = db.models[table_name];

    const result = await table.update(columns_values_dict, {
        where: { id: row_id }
    });

    await db.close();

    return result[0] > 0;
}


/**
 * Retrieves all table rows matching columns filters. If the filter dict is empty, retrieves all without filter.
 * @param {string} table_name - Database table name
 * @param {Array<string>} requested_columns_names - Requested table columns
 * @param {Object<string,any>} columns_values_dict - Dictionary representing query filters
 * @returns {Promise<Array<Object<string,any>>>} - Result of the query
 */
export async function getTableRowsMatchingColumns(table_name, requested_columns_names, columns_values_dict) {
    const db = await connectDB();
    const table = db.models[table_name];

    const options = {
        attributes: requested_columns_names.length !== 0 ? requested_columns_names : undefined,
        where: columns_values_dict
    };

    const rows = await table.findAll(options);

    await db.close();

    return rows ? rows : [];
}
