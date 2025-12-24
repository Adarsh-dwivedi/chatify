import bcrypt from "bcryptjs";

import { User } from "../models/User.js";
import { generateTokenAndAddToCookie } from "../lib/jsonWebToken.js";

export const signup = async (req, res)=>{
    try{
        const {fullName, email, password, profilePic} = req.body;
        //some validation to check above field
        if(!fullName || !email || !password){
            return res.status(400).json({message: "All field are not present"});
        }

        if(password.length<6){
            return res.status(400).json({message: "Password length should be greater than 5"});
        }

        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message: "Invalid email"});
        }

        //Check if user with same email exist
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "User already exist"});
        }

        // hash password
        const saltRound = 10; // A cost factor between 10 and 12 is generally recommended
        const hashPassword = await bcrypt.hash(password, saltRound);
        // get the user model object
        const newUser = new User({
            fullName,
            email,
            profiPic: profilePic ? profilePic: "", //if not present send empty string
            password: hashPassword
        });
        if(!newUser){
            return res.status(400).json({message: "Invalid user data"});
        }
        await newUser.save();
        generateTokenAndAddToCookie(newUser._id, res);
        return res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic
        });
    }catch (err){
        console.error("Signup Error: ", err);
        res.status(500).json({message: "Internal Server Error, Try again later!"});
    }
    

};