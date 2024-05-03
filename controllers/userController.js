import {User} from "../models/userModel.js"
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../config.js"

const createToken = (_id) => {
    return jwt.sign({_id}, JWT_SECRET, {expiresIn: '30d'})
}

//login user
export const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try{
        const user = await User.login(email, password);

        //create token
        const token = createToken(user._id);

        res.status(200).json({
            email , token
        })
    }catch(error){
        res.status(400).json({
            error : error.message
        })
    }
}

//sign up user
export const signupUser = async (req, res) => {

    const {email, password, name , surname, picture} = req.body;

    try{
        const user = await User.signup(email, password ,name, surname , picture);

        //create token
        const token = createToken(user._id);

        res.status(200).json({
            name, surname, picture, email , token
        })
    }catch(error){
        res.status(400).json({
            error : error.message
        })
    }
}

//get user by id
export const getUserByEmail = async (req, res) => {
    const { email } = req.params;
  
    try {
      // Use Mongoose to find the user by their email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // If the user is found, send all user information
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

//logout user
export const logoutUser = async (req, res) => {
    const { email } = req.params;
  
    try {
      // Update the user document to clear the token
      await User.updateOne({ email }, { $set: { token: '' } });
  
      // Respond with a success message or status
      res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      // Handle any errors that occur during the logout process
      res.status(500).json({ error: "Internal server error" });
    }
  }
  