import { Router } from "express";
const auth_router = Router();


auth_router.post('/register', (req,res) => {
    const { username, password, email } = req.body;
});
export default auth_router;