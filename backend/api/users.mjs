/* Node.js BACKEND
 * Project: GameBox
 * Package: api
 * Module: users
 * Usage: Users related API routes and processing.
 * Date: 20/12/2023
 * author: BoxBoxJason
 */

import { Router } from "express";
import { rateLimit } from "express-rate-limit"; 
import { getQueryParams } from "./utils.mjs";
import { deleteTableRowsMatchingColumns, getTableRowColumnsFromId, getTableRowsMatchingColumns, setTableRowColumnsFromId } from "../models/models.mjs";
import { checkUserPasswordFromId, createUser } from "../middlewares/auth.mjs";
import { getUserIdFromNameOrEmail, getUserIdFromUsername } from "../models/users.mjs";

// USERS API ROUTER
const users_api_router = Router();
// ALLOWED PARAMETERS FOR GET REQUESTS
const ALLOWED_GET_REQUEST_PARAMS = ['avatar','id','time','username','track_time','track_score'];
// ALLOWED PARAMETERS FOR PUT REQUESTS
const ALLOWED_PUT_REQUEST_PARAMS = ['track_time','track_score','time','avatar','username','email','password'];
// RATE LIMITERS
const account_creation_limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 1 // limit each IP to 1 requests per windowMs
});
const login_limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // limit each IP to 5 requests per windowMs
});

// Create user route
users_api_router.post('/create',account_creation_limiter,async function(req,res) {
    const { username,email,password } = req.body;
    const user_creation_response = await createUser(username,password,email);
    res.status(user_creation_response[0]).json({ message: user_creation_response[1]}).send();
});

// Get user route
users_api_router.get('/user/:user_id_or_username', async function(req,res){
    let user_id = req.params.user_id_or_username;
    if (!/^\d+$/.test(user_id)) {
        user_id = await getUserIdFromUsername(user_id);
    } else {
        user_id = parseInt(user_id);
    }
    if (user_id != null) {
        const query_params = getQueryParams(req.query,ALLOWED_GET_REQUEST_PARAMS);
        const user_data = await getTableRowColumnsFromId('User',user_id,Object.keys(query_params));
        res.status(200).json(user_data);
    } else {
        res.status(400).json({ error: 'No matching id was found for given username'});
    }
});


users_api_router.get('/user', async function(req,res){
    const user_id = req.session.user_id || null;

    if (user_id != null) {
        const query_params = getQueryParams(req.query,[...ALLOWED_GET_REQUEST_PARAMS,'email']);
        const user_data = await getTableRowColumnsFromId('User',user_id,Object.keys(query_params));
        res.status(200).json(user_data);
    } else {
        res.status(401).json({ message: 'Please log in to do that' });
    }
});


// Get users route
users_api_router.get('', async function(req,res) {
    const query_params = getQueryParams(req.query,ALLOWED_GET_REQUEST_PARAMS,false);
    const users_data = await getTableRowsMatchingColumns('User',ALLOWED_GET_REQUEST_PARAMS,query_params);
    res.status(200).json(users_data);
});

// Set user attributes route
users_api_router.put('/set/:user_id', async function (req,res) {
    const user_id = parseInt(req.params.user_id);
    const { column_name,new_value,attempt_password,token } = req.body

    // Case user not logged in
    if (user_id !== req.session.user_id) {
        res.status(401).json({ message:'Please log in to do that' });
    // Case user requested unknown / unauthorized column change
    } else if (! ALLOWED_PUT_REQUEST_PARAMS.includes(column_name)){
        res.status(400).json({ message:'Unknown / unauthorized parameter set attempted'});
    // Able to proceed
    } else {
        let set_outcome = false
        // Case no password confirmation required
        if (ALLOWED_PUT_REQUEST_PARAMS.slice(0,2).includes(column_name) || token === process.env.ADMIN_TOKEN) {
            set_outcome = await setTableRowColumnsFromId('User',user_id,{column_name,new_value});
        // Case password required
        } else {
            if (attempt_password && await checkUserPasswordFromId(user_id,attempt_password)) {
                set_outcome = await setTableRowColumnsFromId('User',user_id,{column_name,new_value});
            } else {
                res.status(401).json({ message:'Passwords do not match' });
            }
        }
        // Everything went well
        if (set_outcome) {
            res.status(200).json({ message: `${column_name} set to new value`});
        // Error in set function
        } else {
            res.status(500).json({ message: 'Internal server error while processing set request'});
        }
    }
});

// Set user attributes route
users_api_router.put('/set', async function (req,res) {
    const user_id = req.session.user_id || null;
    const { new_values,attempt_password } = req.body

    // Case user not logged in
    if (user_id == null) {
        res.status(401).json({ message:'Please log in to do that' });
    // Case user requested unknown / unauthorized column change
    } else if (! Object.keys(new_values).every(column_name => ALLOWED_PUT_REQUEST_PARAMS.includes(column_name))){
        res.status(400).json({ message:'Unknown / unauthorized parameter set attempted'});
    // Able to proceed
    } else {
        let set_outcome = false
        // Case no password confirmation required
        if (Object.keys(new_values).every(column_name => ALLOWED_PUT_REQUEST_PARAMS.slice(0,3).includes(column_name))) {
            set_outcome = await setTableRowColumnsFromId('User',user_id,new_values);
        // Case password required
        } else {
            if (attempt_password && await checkUserPasswordFromId(user_id,attempt_password)) {
                set_outcome = await setTableRowColumnsFromId('User',user_id,new_values);
            } else {
                res.status(401).json({ message:'Passwords do not match' });
            }
        }
        // Everything went well
        if (set_outcome) {
            res.status(200).json({ message: `${column_name} set to new value`});
        // Error in set function
        } else {
            res.status(500).json({ message: 'Internal server error while processing set request'});
        }
    }
});

// Delete user route
users_api_router.delete('/delete/:user_id', async function(req,res){
    const user_id = parseInt(req.params.user_id);
    const { attempt_password,token } = req.body;
    // Check if user is logged in and password confirmation
    if (user_id === req.session.user_id && checkUserPasswordFromId(user_id,attempt_password) || ! isNaN(user_id) && token === process.env.ADMIN_TOKEN) {
        if (await deleteTableRowsMatchingColumns('User',{'id':user_id})) {
            res.status(204).send();
        } else {
            res.status(500).json({ message: 'Internal server error while processing delete query' });
        }
    } else {
        res.status(401).json( { message: 'Auth failed, please check credentials OR log in' });
    }
});

// Login route
users_api_router.post('/login',login_limiter, async function(req,res) {
    const { username_or_email,password } = req.body;
    const user_id = await getUserIdFromNameOrEmail(username_or_email);
    if (typeof user_id === 'number' && checkUserPasswordFromId(user_id,password)){
        req.session.user_id = user_id 
        res.redirect('/');
    } else {
        res.status(400).json({ message: 'Invalid credentials !' });
    }
});

// Logout route
users_api_router.post('/logout', (req,res) => {
    req.session.user_id = null;
    res.redirect('/');
});

export default users_api_router;
