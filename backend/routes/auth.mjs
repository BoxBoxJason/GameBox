import { Router } from 'express';
import { checkUserPassword, createUser } from "../middlewares/auth.mjs";
import { getUserAvatar, getUserIdFromNameOrEmail, getUsernameFromId } from '../models/users.mjs';
const auth_router = Router();


auth_router.get('', (req,res) => {
    res.redirect('/static/auth/index.html');
});


auth_router.post('/register', async function(req,res) {
    const { username, password, email } = req.body;
    const user_creation_response = await createUser(username,password,email);
    res.status(user_creation_response[0]).json({ message: user_creation_response[1]});
});


auth_router.post('/login', async function(req,res) {
    const { username_or_email,password } = req.body;

    try {
        if (await checkUserPassword(username_or_email,password)) {
            const user_id = await getUserIdFromNameOrEmail(username_or_email);
            req.session.user_id = user_id 
            req.session.username = await getUsernameFromId(user_id);
            res.status(200).json({ message: 'Login successful !' });
        }
        else {
            res.status(400).json({ message: 'Invalid credentials !' });
        }
    }
    catch(error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error while processing log in request' });
    }
});


auth_router.post('/logout', (req,res) => {
    req.session.user_id = null;
    res.redirect('/');
});


auth_router.get('/getAvatar', async function(req,res) {
    const user_id = req.session.user_id || null;
    let result = null;
    if (user_id != null){
        result = {"avatar": await getUserAvatar(user_id)};
    }
    res.json(result);
});

export default auth_router;
