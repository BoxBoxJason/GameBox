import sqlite3 from 'sqlite3';
import { db_path } from '../constants.mjs';


export async function initDatabase() {
    const db = await connectDB();
    createTables(db);
    db.close();
    console.log('Database healthy and up');
}


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


async function createTables(db) {
    await db.run(`
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(32) UNIQUE NOT NULL,
            password VARCHAR(64) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            avatar VARCHAR(36) DEFAULT 'default.png',
            time INTEGER DEFAULT 0
        );
        
        CREATE TABLE IF NOT EXISTS Games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            slug VARCHAR(255) UNIQUE NOT NULL,
            illustration VARCHAR(50) UNIQUE NOT NULL,
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
        `
    );
}


async function createGames() {
    const default_games = [
        {'slug':'Pong','illustration':'pong.png','description':``,'rules':``,'about':``},
        {'slug':'400m','illustration':'400m.png','description':``,'rules':``,'about':``},
        {'slug':'TypeWritter','illustration':'typewritter.png','description':``,'rules':``,'about':``},
        {'slug':'Re-Flex','illustration':'reflex.png','description':``,'rules':``,'about':``},
        {'slug':'Slasher','illustration':'slasher.png','description':``,'rules':``,'about':``},
        {'slug':'SimonSays','illustration':'simon-says.png','description':``,'rules':``,'about':``},
        {'slug':'FlyBird','illustration':'flybird.png','description':``,'rules':``,'about':``},
        {'slug':'Smasher','illustration':'smasher.png','description':``,'rules':``,'about':``},
    ]
}


async function checkUsersTable(db){
    db.all('SELECT * FROM Users', [], (err, rows) => {
        if (err) {
            console.error(err.message);
        }
        else {
            rows.forEach((row) => {
            console.log(row);
            });
        }
    });
}
