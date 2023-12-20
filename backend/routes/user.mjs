import { Router } from 'express';
import { getUserIdFromUsername } from '../models/users.mjs';

const user_router = Router();

user_router.get('/profile/:username', async function(req,res){
    const username = req.params.username.toString();
    const user_id = getUserIdFromUsername(username);
    if (user_id != null){
        res.redirect(`/static/profile/index.html?username=${username}`);
    }
    else {
        res.status(404).send(`User ${username} not found`);
    }
});


user_router.post('/profile/edit' );

user_router.post('/account/delete');
export default user_router;