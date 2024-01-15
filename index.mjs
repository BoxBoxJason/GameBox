import express from 'express'
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
//import lusca from 'lusca';
import dotenv from 'dotenv';
dotenv.config();
import { static_dir_path } from './backend/constants.mjs';
import { initDatabase } from './backend/controllers/databaseController.mjs';
import static_router from './backend/api/static.mjs';
import api_router from './backend/api/api.mjs';

// ### EXPRESS SETUP ###
const app = express();
app.use(express.json());
app.use(bodyParser.json());

// ### SESSIONS ###
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
//app.use(lusca.csrf());

// ### ROUTES ###
app.use("/static", express.static(static_dir_path));
app.use(static_router);
app.use('/api',api_router);

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
