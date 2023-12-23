/* Node.js BACKEND
 * Project: GameBox
 * Package: api
 * Module: api
 * Usage: API router definition.
 * Date: 21/12/2023
 * author: BoxBoxJason
 */
import { rateLimit } from "express-rate-limit";
import { Router } from "express";
import users_api_router from "./users.mjs";
import { games_api_router , play_api_router } from "./games.mjs";

// REQUESTS LIMITER
const api_requests_limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100 // limit each IP to 30 requests per windowMs
});
const api_play_requests_limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 200 // limit each IP to 200 requests per windowMs
});


const api_router = Router();
api_router.use('/users',api_requests_limiter,users_api_router);
api_router.use('/games',api_requests_limiter,games_api_router);
api_router.use('/games',api_play_requests_limiter,play_api_router);

export default api_router;
