import express  from 'express';
import {
    loginUser,
    signupUser,
    getUserByEmail,
    logoutUser
} from '../controllers/userController.js'

const router = express.Router();

//login route
router.post('/login', loginUser)


//signup route
router.post('/signup', signupUser)

//get user by id
router.get('/:email', getUserByEmail);


//logout route
router.post('/logout', logoutUser)


export default router;