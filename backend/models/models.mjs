import mysql from 'mysql2/promise';
import { db_config } from "../constants.mjs";


export async function createTableRow(table,columns_names,columns_values){
    let success = true;
    let query_txt = `INSERT INTO ${table_name} (${columns_names.join(',')}) VALUES (${Array.from({ length: n }, () => '?').join(',')})`;
    try {
        const connection = mysql.createConnection(db_config);
        await connection.execute(query_txt,columns_values);
        await connection.end();
    }
    catch (error) {
        success = false;
        console.error(`Could not create new row in table ${table}`);
    }

    return success;
}


export async function getTableRowColumn(table_name,column_name,row_id) {
    let column_value = null;
    try {
        const connection = await mysql.createConnection(db_config);
        const [rows] = await connection.execute(`SELECT ${column_name} FROM ${table_name} WHERE "id" = ?`, [row_id]);
        await connection.end();

        if (rows.length > 0) {
            column_value = rows[0][column_name];
        }
    }
    catch (error) {
        console.error(`Error while retrieving ${table_name}, id=${row_id}, column ${column_name}: `, error);
    }

    return column_value;
}


export async function getTableRowColumns(table_name,columns_names,row_id){
    let columns_values = null;
    try {
        const connection = await mysql.createConnection(db_config);
        const [rows] = await connection.execute(`SELECT ${columns_names.join(',')} FROM ${table_name} WHERE "id" = ?`, [row_id]);
        await connection.end();

        if (rows.length > 0) {
            columns_values = [];
            for (let column_name of columns_names){
                columns_values.push(rows[0][column_name]);
            }
        }
    }
    catch (error) {
        console.error(`Error while retrieving ${table_name}, id=${row_id}, columns ${columns_names.join(',')}: `, error);
    }

    return columns_values;
}


export async function deleteTableRowMatchingColumns(table_name,columns_names,columns_values) {
    let success = true;
    try {
        let intermediate_text = '';
        for (let column_name of columns_names){
            intermediate_text += `${column_name} = ? AND `;
        }
        intermediate_text = intermediate_text.substring(0,intermediate_text-5);

        const connection = await mysql.createConnection(db_config);
        await connection.execute(`DELETE FROM ${table_name} WHERE ${intermediate_text}`, columns_values);
        await connection.end();
    }
    catch (error){
        console.log(`Error while deleting row from table ${table_name}`);
        success = false;
    }

    return success;
}


export async function editTableRowColumn(table_name,row_id,column_name,column_value){
    let success = true;
    try{
        const connection = await mysql.createConnection(db_config);
        await connection.execute(`UPDATE ${table_name} SET ${column_name} = ? WHERE "id" = ?`,[column_name,column_value]);
        await connection.end();
    }
    catch (error){
        console.error(`Could not edit ${table_name} ${row_id} ${column_name}`);
        success = false;
    }
    return success;
}
