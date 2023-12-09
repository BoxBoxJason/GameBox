import sqlite3 from 'sqlite3';
import { db_path } from '../constants.mjs';


export function initDatabase() {
    const db = connectDB();
    createTables(db);
    db.close();
}


export function connectDB(){
    return new sqlite3.Database(db_path);
}


function createTables(db) {
    db.serialize(() => {
        db.run(`
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(32) UNIQUE NOT NULL,
            password VARCHAR(64) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS Games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            slug VARCHAR(255) UNIQUE NOT NULL,
            description TEXT NOT NULL,
            rules TEXT NOT NULL,
            about TEXT NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS Scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            value REAL NOT NULL,
            user_id INTEGER NOT NULL,
            game_id INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES Users(id),
            FOREIGN KEY (game_id) REFERENCES Games(id)
        );
        `, (err) => {
            if (err) {
                console.error('Could not create database tables', err); 
            }
            else{
                console.log('Tables are available in database');
            }
        });
    });
}
