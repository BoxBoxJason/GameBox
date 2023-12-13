import express from 'express'
import session from 'express-session';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();
import games_router from './backend/routes/games.mjs';
import { static_folder_path } from './backend/constants.mjs';
import { initDatabase } from './backend/controllers/databaseController.mjs';
import auth_router from './backend/routes/auth.mjs';
const app = express();

// ### SESSIONS ###
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// ### ROUTES ###

app.use("/static", express.static(static_folder_path));

app.get('/', (req, res) => {
    res.redirect(301, '/static/index.html');
});

app.use('/games',games_router);

app.use('/auth',auth_router);

initDatabase();

// ### HOSTING ###
const hostname = 'localhost';
const port = 8080;
const server = app.listen(port, hostname);
console.log(`Server running at http://${hostname}:${port}/`);

process.on("unhandledRejection", err => {
    console.log(`An error occurred: ${err.message}`);
    server.close(() => process.exit(1));
});
