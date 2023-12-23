import sqlite3 from 'sqlite3';
import { db_path } from '../constants.mjs';
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
                time INTEGER DEFAULT 0
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
    const default_games = [
        {'slug':'Pong','illustration':'pong.png','description':``,'rules':``,'about':``},
        {'slug':'400m','illustration':'400m.png','description':``,'rules':`
        <article>
    <h1>Game Information</h1>
    
    <section>
      <h2>Objective of the Game</h2>
      <p>
        The goal of the game is to advance as far as possible on the 400m track.<br>
        For this, you have a total of 8 dice. These 8 dice are divided into groups of 2.<br>
        You have the right to 9 throws.
      </p>
    </section>
    
    <section>
      <h2>How to Play?</h2>
      <p>
        Roll the first 2 dice. If you are not satisfied with the result, pick up the 2 dice and roll them again.<br>
        This operation can be repeated several times until you are satisfied with the first series.<br>
        Then proceed in the same way for the second, third, and fourth series.
      </p>
    </section>
    
    <section>
      <h2>Scoring</h2>
      <p>
      Points are awarded as follows:
    </p>
      <table>
        <tr>
          <th>Die</th>
          <td>1</td>
          <td>2</td>
          <td>3</td>
          <td>4</td>
          <td>5</td>
          <td>6</td>
        </tr>
        <tr>
          <th>Points</th>
          <td>+1</td>
          <td>+2</td>
          <td>+3</td>
          <td>+4</td>
          <td>+5</td>
          <td>-6</td>
        </tr>
        <tr>
          <th>Distance</th>
          <td>+10m</td>
          <td>+20m</td>
          <td>+30m</td>
          <td>+40m</td>
          <td>+50m</td>
          <td>-60m</td>
        </tr>
      </table>
      <p>
        Thus, a dice roll earns its exact value in terms of points (10 times its value in distance).<br>
        HOWEVER, a 6 counts negatively unlike the other values! So they must be avoided at all costs!
      </p>
    </section>
    
    <section>
      <h2>Strategy</h2>
      <p>
        The mathematical expectation (without re-rolling) of the game is +3pt per turn.<br>
        The mathematical expectation (with re-rolling and assuming that we manage to avoid all 6s) is +6.25pt per turn.<br>
        A simple strategy and allowing to take the minimum risk would then be to accept all values, as soon as they exceed 6.
      </p>
    </section>
  </article>
          `,'about':`
          <section>
          <article>
    <h1>About</h1>
    
      <p>Author: BoxBoxJason</p>
      <p>Link: <a href="https://github.com/BoxBoxJason/GameBox" title="GitHub Repository Link">GitHub Repository</a></p>
      <p>Inspiration: <a href="https://www.knizia.de/wp-content/uploads/reiner/freebies/Website-Decathlon.pdf" title="PDF Dr. Reiner">Decathlon Dr. Reiner</a></p>
    </article>
  </section>
          `},
        {'slug':'TypeWritter','illustration':'typewritter.png','description':``,'rules':``,'about':``},
        {'slug':'Re-Flex','illustration':'reflex.png','description':``,'rules':``,'about':``},
        {'slug':'Slasher','illustration':'slasher.png','description':``,'rules':``,'about':``},
        {'slug':'SimonSays','illustration':'simon-says.png','description':``,'rules':``,'about':``},
        {'slug':'FlyBird','illustration':'flybird.png','description':``,'rules':``,'about':``},
        {'slug':'Smasher','illustration':'smasher.png','description':``,'rules':``,'about':``},
    ]
    for (const game of default_games) {
        await createGame(game.slug,game.illustration,game.description,game.rules,game.about);
    }
}