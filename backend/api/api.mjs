/* Node.js BACKEND
 * Project: 
 * Package:
 * Module:
 * Usage: 
 * Date: 
 * author: BoxBoxJason
 */
import { rateLimit } from "express-rate-limit";
import { Router } from "express";
import users_api_router from "./users.mjs";
import games_api_router from "./games.mjs";

// REQUESTS LIMITER
const api_requests_limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30 // limit each IP to 30 requests per windowMs
});

const api_router = Router();
api_router.use(api_requests_limiter);
api_router.use('/users',users_api_router);
api_router.use('/games',games_api_router);

export default api_router;
