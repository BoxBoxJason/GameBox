import { connectDB } from '../controllers/databaseController.mjs'


export async function createTableRow(table_name,columns_names,columns_values){
    let db = await connectDB();
    
    let query = db.prepare(`INSERT INTO ${table_name} (${columns_names.join(',')}) VALUES (${columns_values.map(() => '?').join(',')})`);
    
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


export async function getTableRowIdMatchingColumnValue(table_name,column_name,column_value){
    let db = await connectDB();
    return new Promise((resolve,reject) => {
        db.get(`SELECT "id" FROM ${table_name} WHERE ${column_name} = ?`,[column_value],(err,row) =>{
            db.close();
            if (err){
                reject(err);
            }
            else{
                resolve(row ? Object.values(row)[0] : null);
            }
        });
    });
}


export async function getTableRowColumn(table_name,column_name,row_id) {
    let db = await connectDB();
    
    return new Promise((resolve, reject) => {
        db.get(`SELECT ${column_name} FROM ${table_name} WHERE "id" = ?`,[row_id],(err,row) =>{
            if (err){
                reject(err);
            }
            else{
                resolve(row ? Object.values(row)[0] : null);
            }
        });
    });
}


export async function getTableRowColumns(table_name,columns_names,row_id){
    let db = await connectDB();

    return new Promise((resolve,reject) => {
        db.get(`SELECT ${columns_names.join(',')} FROM ${table_name} WHERE "id" = ?`, [row_id], (err,row) => {
            db.close();
            if (err){
                reject(err);
            }
            else{
                resolve(row ? columns_names.map(column_name => row[column_name]) : null);
            }
        });
    });
}


export async function deleteTableRowMatchingColumns(table_name,columns_names,columns_values) {
    let db = await connectDB();

    let query = db.prepare(`DELETE FROM ${table_name} WHERE ${columns_names.map(column_name => `${column_name} = ?`).join(' AND ')}`)
    return new Promise((resolve,reject) => {
        query.run(columns_values, function(err){
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


export async function editTableRowColumn(table_name,row_id,column_name,column_value){
    let db = await connectDB();
    let query = db.prepare(`UPDATE ${table_name} SET ${column_name} = ? WHERE "id" = ?`);

    return new Promise((resolve,reject) => {
        query.run([column_value,row_id], function(err){
            query.finalize();
            db.close();
            if (err){
                console.error(`Could not edit ${table_name} ${row_id} ${column_name}`, err);
                reject(err);
            }
            else{
                resolve(true);
            }
        });
    });
}


export async function getAllTableRows(table_name){
    let db = await connectDB();

    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${table_name}`;
        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}
