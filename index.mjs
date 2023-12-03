import express from 'express'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import game_router from './backend/routes/games.mjs';

const app = express();
// ### ROUTES ###

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use("/static", express.static(join(__dirname, '/static')));
app.get('/', (req, res) => {
    res.redirect(301, '/static/frontend/pong/index.html');
});

app.use('/games',game_router);

// ### HOSTING ###
const hostname = 'localhost';
const port = 8080;
const server = app.listen(port, hostname);
console.log(`Server running at http://${hostname}:${port}/`);

process.on("unhandledRejection", err => {
    console.log(`An error occurred: ${err.message}`);
    server.close(() => process.exit(1));
});
