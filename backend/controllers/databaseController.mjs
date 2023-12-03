import mysql from 'mysql2/promise';
import db_config from '../constants.mjs'

async function initDatabase() {
    try {
      const connection = await mysql.createConnection(db_config);

      // Check if the database exists, create if not
      const [rows] = await connection.execute(`SHOW DATABASES LIKE ?`, [process.env.DB_NAME]);
      if (rows.length === 0) {
        await connection.execute(`CREATE DATABASE ${process.env.DB_NAME}`);
        console.log('Database created.');
      }
      await connection.end();
      await createTables();
    }
    catch (error) {
      console.error('Error initializing database:', error);
    }
}


async function createTables() {
    try {
        const connection = await mysql.createConnection(db_config);

        await connection.execute(`
        CREATE TABLE IF NOT EXISTS Users (
            "id" INT AUTO_INCREMENT PRIMARY KEY,
            "username" VARCHAR(255) NOT NULL,
            "password" VARCHAR(255) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Games (
            "id" INT AUTO_INCREMENT PRIMARY KEY,
            "slug" VARCHAR(255) UNIQUE NOT NULL,
            "description" TEXT NOT NULL,
            "rules" TEXT NOT NULL,
            "about" TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Scores (
            "id" INT AUTO_INCREMENT PRIMARY KEY,
            "value" FLOAT NOT NULL,
            "user_id" INT NOT NULL,
            "game_id" INT NOT NULL,
            FOREIGN KEY ("user_id") REFERENCES Users("id"),
            FOREIGN KEY ("game_id") REFERENCES Games("id")
        );
        `);

        await connection.end();
        }
    catch (error){
        console.error('Error while creating tables: ', error);
    }
}
