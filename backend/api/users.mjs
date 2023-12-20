/* Node.js BACKEND
 * Project: GameBox
 * Package: api
 * Module: users
 * Usage: Users related API routes and processing.
 * Date: 20/12/2023
 * author: BoxBoxJason
 */

import { Router } from "express";
import { getQueryParams } from "./utils.mjs";
import { deleteTableRowsMatchingColumns, getTableRowColumns, getTableRowsMatchingColumns, setTableRowColumnsFromId } from "../models/models.mjs";
import { checkUserPasswordFromId, createUser } from "../middlewares/auth.mjs";
import { getUserIdFromUsername } from "../models/users.mjs";

// USERS API ROUTER
const users_api_router = Router();
// ALLOWED PARAMETERS FOR GET REQUESTS
const ALLOWED_GET_REQUEST_PARAMS = ['avatar','id','time'];
// ALLOWED PARAMETERS FOR PUT REQUESTS
const ALLOWED_PUT_REQUEST_PARAMS = ['username','avatar','email','password'];
// ALLOWED PARAMETERS FOR POST REQUESTS
const REQUIRED_POST_REQUEST_PARAMS = ['username','email','password','avatar'];


users_api_router.post('/create',async function(req,res) {
    const { username,email,password } = req.body;
    const user_creation_response = await createUser(username,password,email);
    res.status(user_creation_response[0]).json({ message: user_creation_response[1]}).send();
});


users_api_router.get('/:user_id_or_username', async function(req,res){
    let { user_id } = req.params.user_id;
    if (isNaN(parseInt(user_id))) {
        user_id = getUserIdFromUsername(user_id);
        res.status(400).json({ error: 'No matching id was found for given username'})
    }
    else {
        user_id = parseInt(user_id);
    }
    if (user_id != null) {
        const query_params = getQueryParams(req.query,ALLOWED_GET_REQUEST_PARAMS);
        const user_data = await getTableRowColumns('Users',Object.keys(query_params),user_id);
        res.status(200).json(user_data);
    }
    res.send();
});


users_api_router.get('', async function(req,res) {
    const query_params = getQueryParams(req.query,ALLOWED_GET_REQUEST_PARAMS,false);
    const users_data = getTableRowsMatchingColumns('Users',ALLOWED_GET_REQUEST_PARAMS,query_params);
    res.status(200).json(users_data).send();
});


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
            set_outcome = await setTableRowColumnsFromId('Users',user_id,{column_name,new_value});
        // Case password required
        } else {
            if (attempt_password && await checkUserPasswordFromId(user_id,attempt_password)) {
                set_outcome = await setTableRowColumnsFromId('Users',user_id,{column_name,new_value});
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
    res.send();
});


users_api_router.delete('/delete/:user_id', async function(req,res){
    const user_id = parseInt(req.params.user_id);
    const { attempt_password,token } = req.body;
    // Check if user is logged in and password confirmation
    if (user_id === req.session.user_id && checkUserPasswordFromId(user_id,attempt_password) || ! isNaN(user_id) && token === process.env.ADMIN_TOKEN) {
        if (await deleteTableRowsMatchingColumns('Users',{'id':user_id})) {
            res.status(204);
        } else {
            res.status(500).json({ message: 'Internal server error while processing delete query' });
        }
    } else {
        res.status(401).json( { message: 'Auth failed, please check credentials OR log in' });
    }
    res.send();
});

export default users_api_router;
