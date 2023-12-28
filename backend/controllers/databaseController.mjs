import sqlite3 from 'sqlite3';
import fs from 'fs';
import { db_path, games_json_path } from '../constants.mjs';
import { createGame } from '../models/games.mjs';

/**
 * Initialize the database
 */
export async function initDatabase() {
    const db = await connectDB();
    await createTables(db);
    //await createGames();
    // await checkTable(db,'Games');
    db.close();
    console.log('Database healthy and up');
}

/**
 * Connect to the database
 * @returns {Promise<sqlite3.Database>}
 */
export async function connectDB() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(db_path, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(db);
            }
        });
    });
}

/**
 * Create the tables if they don't exist
 * @param {sqlite3.Database} db 
 */
async function createTables(db) {
    return new Promise((resolve, reject) => {
        db.run(`
            CREATE TABLE IF NOT EXISTS Users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(32) UNIQUE NOT NULL,
                password VARCHAR(64) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                avatar VARCHAR(36) DEFAULT 'default.png',
                time TEXT DEFAULT '',
                track_score BOOLEAN DEFAULT true,
                track_time BOOLEAN DEFAULT true
            );
        `, (err) => {
            if (err) {
                reject(err);
            } else {
                db.run(`
                    CREATE TABLE IF NOT EXISTS Games (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        slug VARCHAR(255) UNIQUE NOT NULL,
                        illustration VARCHAR(50) UNIQUE NOT NULL,
                        description TEXT NOT NULL,
                        rules TEXT NOT NULL,
                        about TEXT NOT NULL
                    );
                `, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        db.run(`
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
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    }
                });
            }
        });
    });
}

/**
 * Checks if the Users table exists and displays its content
 * @param {sqlite3.Database} db 
 */
async function checkTable(db,table_name){
    db.all(`SELECT * FROM ${table_name}`, [], (err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            rows.forEach((row) => {
            console.log(row);
            });
        }
    });
}

/**
 * Creates the default games if they don't exist
 */
async function createGames() {
    fs.readFile(games_json_path, 'utf8', async (err, data) => {
        if (err) {
            console.error(err.message);
        } else {
            const games = JSON.parse(data);
            for (const game of games) {
                await createGame(game.slug,game.illustration,game.description,game.rules,game.about);
            }
        }
    });
}
