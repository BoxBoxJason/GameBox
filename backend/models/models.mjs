import { connectDB } from '../controllers/databaseController.mjs'
import { getKeysValuesOrderedArrays } from '../utils.mjs';

/**
 * Creates a new row in a database table.
 * @param {string} table_name - Database table name
 * @param {Object<string,any>} columns_values_dict - Column name: Column value pairs
 * @returns {Promise<boolean>} - Success status of the creation query
 */
export async function createTableRow(table_name,columns_values_dict){
    const db = await connectDB();
    const [columns_names,columns_values] = getKeysValuesOrderedArrays(columns_values_dict);

    const query = db.prepare(`INSERT INTO ${table_name} (${columns_names.join(',')}) VALUES (${columns_names.map(() => '?').join(',')})`);
    
    return new Promise((resolve,reject) => {
        query.run(columns_values, function (err) {
            query.finalize();
            db.close();
            if (err) {
                console.error('Error while running createTableRow query',err);
                reject(err);
            }
            else{
                resolve(true);
            }
        });
    });
}


/**
 * Returns all table rows ids that match all given filters.
 * @param {string} table_name - Database table name
 * @param {Object<string,any>} columns_values_dict - Column name: Column value pairs used to filter
 * @returns {Promise<Array<Object<string,any>>>} - Result of the database query
 */
export async function getTableRowsIdsMatchingColumnsValues(table_name,columns_values_dict){
    const db = await connectDB();
    const [columns_names,columns_values] = getKeysValuesOrderedArrays(columns_values_dict);
    const query = `SELECT id FROM ${table_name} WHERE ${columns_names.map(column_name => `${column_name} = ?`).join(' AND ')}`;
    return new Promise((resolve,reject) => {
        db.all(query.endsWith('WHERE ') ? query.slice(0,-6) : query, columns_values,(err,rows) =>{
            db.close();
            if (err){
                reject(err);
            }
            else{
                resolve(rows ? rows : []);
            }
        });
    });
}


/**
 * Requests columns for row matching row id in the database table. If columns_names is empty, requests all columns.
 * @param {string} table_name - Database table name
 * @param {Array<string>} columns_names - Table columns names requested
 * @param {number} row_id - Table row id filter
 * @returns {Promise<Object<string,any>>} - Result of database query
 */
export async function getTableRowColumnsFromId(table_name,row_id,columns_names) {
    const db = await connectDB();
    return new Promise((resolve,reject) => {
        db.get(`SELECT ${ columns_names.length != 0 ? columns_names.join(',') : '*'} FROM ${table_name} WHERE id = ?`, [row_id], (err,row) => {
            db.close();
            if (err){
                reject(err);
            }
            else {
                resolve(row ? row : {});
            }
        });
    });
}


/**
 * Deletes database rows that match filters. 
 * @param {string} table_name - Database table name
 * @param {Object<string,any>} columns_values_dict - Column name: Column value pairs used to filter
 * @returns {Promise<boolean>} - Success status of the query
 */
export async function deleteTableRowsMatchingColumns(table_name,columns_values_dict) {
    const db = await connectDB();
    const [columns_names,columns_values] = getKeysValuesOrderedArrays(columns_values_dict);

    const query = db.prepare(`DELETE FROM ${table_name} WHERE ${columns_names.map(column_name => `${column_name} = ?`).join(' AND ')}`);
    return new Promise((resolve,reject) => {
        query.run(columns_values, function(err) {
            query.finalize();
            db.close();
            if (err){
                reject(err);
            }
            else{
                resolve(true);
            }
        });
    });
}


/**
 * Edits existing row columns values in specified table.
 * @param {string} table_name - Database table name
 * @param {number} row_id - Table row id filter
 * @param {Object<string,any>} columns_values_dict - Column name: New column value pairs to edit
 * @returns {Promise<boolean>} - Success status of the query
 */
export async function setTableRowColumnsFromId(table_name,row_id,columns_values_dict){
    const db = await connectDB();
    const [columns_names,columns_values] = getKeysValuesOrderedArrays(columns_values_dict);
    columns_values.push(row_id)
    const query = db.prepare(`UPDATE ${table_name} SET ${columns_names.map(column_name => `${column_name} = ?`).join(' AND ')} WHERE id = ?`);

    return new Promise((resolve,reject) => {
        query.run(columns_values, function(err){
            query.finalize();
            db.close();
            if (err){
                console.error(`Could not edit ${table_name} ${row_id}`, err);
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    });
}


/**
 * Retrieves all table rows matching columns filters. If the filter dict is empty, retrieves all without filter.
 * @param {string} table_name - Database table name
 * @param {Array<string>} requested_columns_names - Requested table columns
 * @param {Object<string,any>} columns_values_dict - Dictionary representing query filters
 * @returns {Promise<Array<Object<string,any>>>} - Result of the query
 */
export async function getTableRowsMatchingColumns(table_name,requested_columns_names,columns_values_dict) {
    const db = await connectDB();
    const [columns_names,columns_values] = getKeysValuesOrderedArrays(columns_values_dict);

    return new Promise((resolve, reject) => {
        const query = `SELECT ${requested_columns_names.join(',')} FROM ${table_name} WHERE ${columns_names.map(column_name => `${column_name} = ?`).join(' AND ')}`;
        
        db.all(query.endsWith('WHERE ') ? query.slice(0,-6) : query, columns_values , (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows ? rows : []);
            }
        });
    });
}
