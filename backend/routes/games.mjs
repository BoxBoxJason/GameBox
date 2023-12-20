import { Router } from 'express';
import { join } from 'path';
import { generateStartingPoint, throwDices } from '../middlewares/games.mjs';
import { static_dir_path } from '../constants.mjs';
import { getAllTableRows } from '../models/models.mjs';

const games_router = Router();

games_router.get('/get-all', async function(req,res){
    res.json(await getAllTableRows('Games')).send();
});


games_router.get('/scores/:game_id', (req,res) => {
    const { game_id } = req.params;

});

// ### PONG ###
const pong_router = Router();

pong_router.get('/starting-point/:top/:right/:bottom/:left', (req, res) => {
    const { top, right, bottom, left } = req.params;
    const starting_coordinates = generateStartingPoint(Number(top), Number(right), Number(bottom), Number(left));
    res.json({ x: starting_coordinates[0],
        y: starting_coordinates[1],
        dx: starting_coordinates[2],
        dy: starting_coordinates[3]
    });
});

games_router.use('/pong',pong_router);

// ### 400m ###
const olympic_400m_router = Router();
olympic_400m_router.get('/throw-dices/:number/:min/:max', (req, res) => {
    const number_of_dices = parseInt(req.params.number);
    const min = parseInt(req.params.min);
    const max = parseInt(req.params.max);
    
    const result = throwDices(number_of_dices, min, max);
    
    res.json({ result });
});

games_router.use('/400m',olympic_400m_router);


export default games_router;
