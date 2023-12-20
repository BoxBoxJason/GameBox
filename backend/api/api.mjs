/* Node.js BACKEND
 * Project: 
 * Package:
 * Module:
 * Usage: 
 * Date: 
 * author: BoxBoxJason
 */
import { Router } from "express";
import users_api_router from "./users.mjs";
import games_api_router from "./games.mjs";

const api_router = Router();
api_router.use('/users',users_api_router);
api_router.use('/games',games_api_router);

export default api_router;
