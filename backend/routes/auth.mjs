import { Router } from "express";
import { createUser } from "../middlewares/auth.mjs"
const auth_router = Router();


auth_router.post('/register', (req,res) => {
    const { username, password, email } = req.body;
    createUser(username,password,email);
});
export default auth_router;