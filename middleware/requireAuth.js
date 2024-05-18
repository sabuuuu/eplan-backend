import jwt from 'jsonwebtoken';
import {JWT_SECRET} from "../config.js"
import {User} from '../models/userModel.js'
import {Prof} from '../models/profModel.js'

export const requireAuth = async(req, res, next) => {
    //verify authentication
    const { authorization }= req.headers 

        // Check if the request is for the loginProf route
        if (req.path === '/loginprof') {
            return next();
        }

        if (req.path === '/filtre') {
            return next();
        }
    if(!authorization){
        return res.status(401).json({error: 'Authorization required'})
    }

    const token = authorization.split(' ')[1]

    try {
        const {_id} = jwt.verify(token, JWT_SECRET)

        req.user = await User.findOne({_id}).select('_id')

        next()
    }catch(error){
        console.log(error)
        return res.status(401).json({error: 'request is not authorized'})
    }
}

// Middleware for professor authentication
export const requireProfAuth = async (req, res, next) => {
    // Verify authentication
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'Authentication required for professors.' });
    }

    const token = authorization.split(' ')[1];

    try {
        const { _id } = jwt.verify(token, JWT_SECRET);

        // Assuming Prof is your model for professors
        req.user = await Prof.findOne({ _id }).select('_id');
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Unauthorized request. Please authenticate as a professor.' });
    }
};