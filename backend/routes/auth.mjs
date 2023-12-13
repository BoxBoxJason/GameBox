import { Router } from 'express';
import { checkUserPassword, createUser } from "../middlewares/auth.mjs";
import { AuthFailedException } from "../../utils/exceptions.mjs";
import { getUserIdFromNameOrEmail, getUsernameFromId } from '../models/users.mjs';
const auth_router = Router();


auth_router.get('', (req,res) => {
    res.redirect('/static/auth/index.html');
});


auth_router.post('/register', async function(req,res) {
    const { username, password, email } = req.body;
    await createUser(username,password,email);

    const form_data = {
        username_or_email: username,
        password: password
    }

    const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form_data)
    });
});


auth_router.post('/login', async function(req,res) {
    const { username_or_email,password } = req.body;

    if (await checkUserPassword(username_or_email,password)) {
        
        req.session.user_id = await getUserIdFromNameOrEmail(username_or_email);
        req.session.username = await getUsernameFromId(user_id);
        res.redirect('/');
    }
    else {
        throw new AuthFailedException('Login failed');
    }
});

export default auth_router;
