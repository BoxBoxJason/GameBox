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
import { getQueryParams } from "./utils.mjs";
import { setTableRowColumnsFromId } from "../models/models.mjs";
import { static_dir_path } from "../constants.mjs";
import { createGame, deleteGameFromId, getGameIdFromName, getGameSlugFromId } from "../models/games.mjs";

// GAMES API ROUTER
const games_api_router = Router();
// ALLOWED GET REQUEST PARAMS
const ALLOWED_GET_REQUEST_PARAMS = ['id','slug','illustration','description','rules','about'];
// ALLOWED PUT REQUEST PARAMS
const ALLOWED_PUT_REQUEST_PARAMS = ['slug','illustration','description','rules','about'];
// ALLOWED POST REQUEST PARAMS
const REQUIRED_POST_REQUEST_PARAMS = ['slug','illustration','description','rules','about'];


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


games_api_router.get('/:game_id_or_slug', async function(req,res){
    let game_id = req.params.game_id_or_slug;
    if (isNaN(parseInt(game_id))) {
        game_id = getGameIdFromName(game_id);
        res.status(400).json({ error: 'No matching game ID was found for given game name'});
    } 
    else {
        game_id = parseInt(game_id);
    }
    if (game_id != null) {
        const query_params = getQueryParams(req.query,ALLOWED_GET_REQUEST_PARAMS);
        const game_data = await getTableRowColumns('Games',Object.keys(query_params),game_id);
        res.status(200).json(game_data)
    }
    res.send();
});


games_api_router.get('', async function(req,res) {
    const query_params = getQueryParams(req.query,ALLOWED_GET_REQUEST_PARAMS,false);
    const games_data = getTableRowsMatchingColumns('Games',ALLOWED_GET_REQUEST_PARAMS,query_params);
    res.status(200).json(games_data).send();
});


games_api_router.get('/musics_files_paths/:game_id', async function(req, res){
  const game_id = parseInt(req.params.game_id);
  if (isNaN(game_id)) {
      res.status(400).json({ message:'Game ID has invalid format (must be integer)' });
  } else {
      const game_dir_name = getGameSlugFromId(game_id).toLowerCase();
      const musics_dir_path = join(static_dir_path,game_dir_name,'musics');
      const files = fs.readdirSync(musics_dir_path).map(file => join(musics_dir_path,file));
      res.json(files);
  }
  res.send();
});


games_api_router.put('/set/:game_id', async function(req,res){
    const game_id = parseInt(req.params.game_id);
    const { token } = req.body;
    const query_params = getQueryParams(req.query,ALLOWED_GET_REQUEST_PARAMS.slice(1,ALLOWED_PUT_REQUEST_PARAMS.length),false);
    if (token !== process.env.ADMIN_TOKEN){
        res.status(401).json({ message: 'You must input an authorized token to edit games'});
    } else if (isNaN(game_id)) {
        res.status(400).json({error: 'Invalid game ID format (must be integer)'});
    } else {
        const query_outcome = await setTableRowColumnsFromId('Games',game_id,query_params);
        if (query_outcome) {
            res.status(200);
        } else {
            res.status(500).json({ message: 'Internal server error while processing set query'});
        }
    }
    res.send();
});


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
            res.status(204);
        } else {
            res.status(500).json({ message:'Internal server error while processing delete game query' });
        }
    }
    res.send();
});


export default games_api_router;
