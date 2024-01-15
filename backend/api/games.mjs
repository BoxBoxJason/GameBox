/* Node.js BACKEND
 * Project: GameBox
 * Package: api
 * Module: games
 * Usage: Games related API routes and processing.
 * Date: 20/12/2023
 * author: BoxBoxJason
 */

import { Router } from "express";
import { join } from 'path';
import fs from 'fs';
import { getQueryParams } from "./utils.mjs";
import { getTableRowColumnsFromId, getTableRowsMatchingColumns, setTableRowColumnsFromId } from "../models/models.mjs";
import { static_dir_path } from "../constants.mjs";
import { createGame, deleteGameFromId, getGameIdFromName } from "../models/games.mjs";
import { generatePongStartingPoint, throwDices } from "../middlewares/games.mjs";

// GAMES API ROUTER
export const games_api_router = Router();
export const play_api_router = Router();
// ALLOWED GET REQUEST PARAMS
const ALLOWED_GET_REQUEST_PARAMS = ['id','slug','illustration','description','rules','about'];
// ALLOWED PUT REQUEST PARAMS
const ALLOWED_PUT_REQUEST_PARAMS = ['slug','illustration','description','rules','about'];
// ALLOWED POST REQUEST PARAMS
const REQUIRED_POST_REQUEST_PARAMS = ['slug','illustration','description','rules','about'];

// Create a new game
games_api_router.post('/create',async function(req,res){
    const { token } = req.body;
    const query_params = getQueryParams(req.query,REQUIRED_POST_REQUEST_PARAMS);
    Object.keys(query_params).forEach(key => {
        if (query_params[key] == null) query_params[key] = '';
        query_params[key] = query_params[key].trim();
    });
    if ( ! query_params['slug']) {
        res.status(400).json({ message:'Slug is empty, cannot create object' });
    } else if (token === process.env.ADMIN_TOKEN) {
        if (createGame(query_params['slug'],query_params['illustration'],query_params['description'],query_params['rules'],query_params['about'])) {
            res.status(201);
        } else {
            res.status(500).json({ message:'Internal server error while processing game creation' });
        }
    } else {
        res.status(401).json({ message:'Unauthorized token' });
    }
    res.send();
});

// Get a game by its ID or slug
games_api_router.get('/:game_id_or_slug', async function(req,res){
    let game_id = req.params.game_id_or_slug;
    if (/^\d+$/.test(game_id)) {
        game_id = parseInt(game_id);
    } else {
        game_id = await getGameIdFromName(game_id);
    }
    if (game_id != null) {
        const query_params = getQueryParams(req.query,ALLOWED_GET_REQUEST_PARAMS);
        const game_data = await getTableRowColumnsFromId('Game',game_id,Object.keys(query_params));
        res.status(200).json(game_data)
    } else {
        res.status(400).json({ error: 'No matching game ID was found for given game name'});
    }
});

// Get all games
games_api_router.get('', async function(req,res) {
    const query_params = getQueryParams(req.query,ALLOWED_GET_REQUEST_PARAMS);
    const games_data = await getTableRowsMatchingColumns('Game',Object.keys(query_params),[]);
    res.status(200).json(games_data);
});

// Get all music files for a given game
games_api_router.get('/musics_files_paths/:game_name', async function(req, res){
    const game_id = getGameIdFromName(req.params.game_name);
    if (game_id == null) {
        res.status(404).json({ message:`Game name ${req.params.game_name} does not exist` });
    } else {
        const musics_dir_path = join(static_dir_path,req.params.game_name,'musics');
        const files = fs.readdirSync(musics_dir_path).map(file => `/static/${req.params.game_name}/musics/${file}`);
        res.json(files);
    }
});

// Set a game's data
games_api_router.put('/set/:game_id', async function(req,res){
    const game_id = parseInt(req.params.game_id);
    const { token } = req.body;
    const query_params = getQueryParams(req.query,ALLOWED_GET_REQUEST_PARAMS.slice(1,ALLOWED_PUT_REQUEST_PARAMS.length),false);
    if (token !== process.env.ADMIN_TOKEN){
        res.status(401).json({ message: 'You must input an authorized token to edit games'});
    } else if (isNaN(game_id)) {
        res.status(400).json({error: 'Invalid game ID format (must be integer)'});
    } else {
        const query_outcome = await setTableRowColumnsFromId('Game',game_id,query_params);
        if (query_outcome) {
            res.status(200).send();
        } else {
            res.status(500).json({ message: 'Internal server error while processing set query'});
        }
    }
});

// Delete a game given its ID
games_api_router.delete('/delete/:game_id', async function(req,res){
    const game_id = parseInt(req.params.game_id);
    const { token } = req.body;
    if (isNaN(game_id)) {
        res.status(400).json({ message:'Game ID has invalid format (must be integer)' });
    } else {
        let success = false;
        if (token === process.env.ADMIN_TOKEN) {
            success = deleteGameFromId(game_id);
        } else {
            res.status(401).json({ message:'Invalid token' });
        }
        if (success) {
            res.status(204).send();
        } else {
            res.status(500).json({ message:'Internal server error while processing delete game query' });
        }
    }
});

// ### PONG ###
const pong_router = Router();

pong_router.get('/starting-point/:top/:right/:bottom/:left', (req, res) => {
    const { top, right, bottom, left } = req.params;
    const starting_coordinates = generatePongStartingPoint(Number(top), Number(right), Number(bottom), Number(left));
    res.json({ x: starting_coordinates[0],
        y: starting_coordinates[1],
        dx: starting_coordinates[2],
        dy: starting_coordinates[3]
    });
});

play_api_router.use('/pong',pong_router);


// ### 400m ###
const olympic_400m_router = Router();
olympic_400m_router.get('/throw-dices/:number/:min/:max', (req, res) => {
    const number_of_dices = parseInt(req.params.number);
    const min = parseInt(req.params.min);
    const max = parseInt(req.params.max);
    
    const result = throwDices(number_of_dices, min, max);
    
    res.json({ result });
});

play_api_router.use('/400m',olympic_400m_router);
