import { Sequelize , DataTypes } from 'sequelize';
import fs from 'fs';
import { db_path, games_json_path } from '../constants.mjs';
import { createGame } from '../models/games.mjs';

/**
 * Initialize the database
 */
export async function initDatabase() {
	const db = await connectDB();
  await db.close();
	//await createGames();

	//await checkTable('Game');
	console.log('Database healthy and up');
}

/**
 * Connect to the database
 * @returns {Promise<Sequelize>}
 */
export async function connectDB() {
	const db =  new Sequelize({
		dialect: 'sqlite',
		storage: db_path,
    logging: false
	});

	await db.authenticate();
  await createTables(db);
	return db;
}

/**
 * Create the tables if they don't exist
 * @param {Sequelize} db 
 */
async function createTables(db) {
	// Define User model
	const User = db.define('User', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		username: {
			type: DataTypes.STRING(32),
			unique: true,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING(64),
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING(255),
			unique: true,
			allowNull: false,
		},
		avatar: {
			type: DataTypes.STRING(36),
			defaultValue: 'default.png',
		},
		time: {
			type: DataTypes.TEXT,
			defaultValue: '',
		},
		track_score: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		track_time: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
	});

	// Define Game model
	const Game = db.define('Game', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		slug: {
			type: DataTypes.STRING(255),
			unique: true,
			allowNull: false,
		},
		illustration: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		rules: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		about: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	});

	// Define Score model
	const Score = db.define('Score', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		value: {
			type: DataTypes.REAL,
			allowNull: false,
		},
		user_id: { // foreign key for User model
			type: DataTypes.INTEGER,
			allowNull: false,
	},
		game_id: { // foreign key for Game model
			type: DataTypes.INTEGER,
			allowNull: false,
	}
	});

	// Define foreign keys relationships
	User.hasMany(Score , { onDelete: 'CASCADE' , foreignKey: 'user_id' });
	Game.hasMany(Score , { onDelete: 'CASCADE' , foreignKey: 'game_id' });

	await db.sync();
}

/**
 * Checks if the table exists and displays its content
 * @param {string} table_name 
 */
async function checkTable(table_name) {
  try {
    const db = await connectDB();

    const rows = await db.models[table_name].findAll();
    rows.forEach(row => {
      console.log(row.toJSON());
    });
    } catch (error) {
    console.error('Error checking table:', error);
  }
}

/**
 * Creates the default games if they don't exist
 */
async function createGames() {
  console.log('Creating games...');
	fs.readFile(games_json_path, 'utf8', async (err, data) => {
		if (err) {
			console.error(err.message);
		} else {
			const games = JSON.parse(data);
			for (const game of games) {
				await createGame(game.slug,game.illustration,game.description,game.rules,game.about);
			}
      console.log('Games created successfully.');
		}
	});
  
  return;
}
