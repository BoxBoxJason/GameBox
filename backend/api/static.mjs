import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { getUserIdFromUsername } from '../models/users.mjs';
import { getGameIdFromName } from '../models/games.mjs';

// STATIC ROUTER
const static_router = Router();
// STATIC SUB ROUTER
const static_sub_router = Router();
// BASE ROUTER
const base_router = Router();
// REQUESTS LIMITER
const static_limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100 // limit each IP to 60 requests per windowMs
});
static_router.use(static_limiter);
base_router.use(static_limiter);
static_sub_router.use(static_limiter);

// Redirect to home page
base_router.get('/', (req, res) => {
    res.redirect(301, '/static/home/index.html');
});

// Redirect to home page
static_sub_router.get('/home', (req, res) => {
    res.redirect(301, '/static/home/index.html');
});

// Redirect to auth page
static_sub_router.get('/auth', (req, res) => {
    if (req.session.user_id != null) {
        res.redirect(301, `/static/profile/index.html?id=${req.session.user_id}`);
    } else {
        res.redirect(301, '/static/auth/index.html');
    }
});

// Redirect to profile page, no user specified
static_sub_router.get('/profile', (req, res) => {
    if (req.session.user_id != null) {
        res.redirect(301, `/static/profile/index.html?id=${req.session.user_id}`);
    } else {
        res.redirect(301, '/static/auth/index.html');
    }
});

// Redirect to profile page for selected user
static_sub_router.get('/profile/:username', async function (req, res) {
    const user_id = await getUserIdFromUsername(req.params.username);
    if (user_id == null) {
        res.status(404).send(`User ${username} not found`);
    } else {
        res.redirect(301, `/static/profile/index.html?id=${user_id}`);
    }
    res.send();
});

// Redirect to games page, no game specified
static_sub_router.get('/games', (req, res) => {
    res.redirect(301, '/static/games/index.html');
});

// Redirect to game page for selected game
static_sub_router.get('/games/:game_name', (req, res) => {
    const game_id = getGameIdFromName(req.params.game_name);
    if (game_id == null) {
        res.status(404).send(`Game ${game_name} not found`);
    } else {
        res.redirect(301, `/static/${req.params.game_name.toLowerCase()}/index.html`);
    }
    res.send();
});

// Redirect to scores page
static_sub_router.get('/scores', (req, res) => {
    res.redirect(301, '/static/scores/index.html');
});

// Redirect to scores page for selected game
static_sub_router.get('/scores/:game_name', (req, res) => {
    const game_id = getGameIdFromName(req.params.game_name);
    if (game_id == null) {
        res.status(404).send(`Game ${game_name} not found`);
    } else {
        res.redirect(301, `/static/scores/index.html?game_id=${game_id}`);
    }
    res.send();
});

// Redirect to scores page for selected player and game
static_sub_router.get('/scores/:game_name/:username', async function(req, res) {
    const game_id = await getGameIdFromName(req.params.game_name);
    const user_id = await getUserIdFromUsername(req.params.username);
    if (game_id == null) {
        res.status(404).send(`Game ${game_name} not found`);
    } else if (user_id == null) {
        res.status(404).send(`User ${username} not found`);
    } else {
        res.redirect(301, `/static/scores/index.html?game_id=${game_id}&user_id=${user_id}`);
    }
    res.send();
});

// Redirect to scores page for selected player
static_sub_router.get('/scores/:username', async function (req, res) {
    const user_id = await getUserIdFromUsername(req.params.username);
    if (user_id == null) {
        res.status(404).send(`User ${username} not found`);
    } else {
        res.redirect(301, `/static/scores/index.html?user_id=${user_id}`);
    }
    res.send();
});

// Redirect to api documentation
static_sub_router.get('/api', (req, res) => {
    res.redirect(301, '/static/api/index.html');
});

static_router.use(base_router);
static_router.use('static',static_sub_router);
export default static_router;
