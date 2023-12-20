import express from 'express'
import session from 'express-session';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
import { static_dir_path } from './backend/constants.mjs';
import { initDatabase } from './backend/controllers/databaseController.mjs';
import games_router from './backend/routes/games.mjs';
import auth_router from './backend/routes/auth.mjs';
import user_router from './backend/routes/user.mjs';
import static_router from './backend/routes/static.mjs';
import api_router from './backend/api/api.mjs';

// ### EXPRESS SETUP ###
const app = express();
app.use(express.json());


// ### SESSIONS ###
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// ### ROUTES ###
app.use("/static", express.static(static_dir_path));
app.use(static_router);
app.use('/games',games_router);
app.use('/auth',auth_router);
app.use('user',user_router);
app.use('api',api_router);

// ### DATABASE ###
await initDatabase();

// ### HOSTING ###
const hostname = 'localhost';
const port = 8080;
const server = app.listen(port, hostname);
console.log(`Server running at http://${hostname}:${port}/`);

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception occurred:', err);
    process.exit(1);
});


process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
