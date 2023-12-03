import { Router} from 'express';
import { generateStartingPoint } from '../middlewares/game.mjs';
const game_router = Router();

game_router.get('/pong/starting-point/:top/:right/:bottom/:left', (req, res) => {
    const { top, right, bottom, left } = req.params;
    const starting_coordinates = generateStartingPoint(Number(top), Number(right), Number(bottom), Number(left));
    res.json({ x: starting_coordinates[0],
        y: starting_coordinates[1],
        dx: starting_coordinates[2],
        dy: starting_coordinates[3]
    });
});


game_router.get('/scores/:game_id', (req,res) => {
    const { game_id } = req.params;

} );


export default game_router;
