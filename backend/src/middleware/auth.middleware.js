import jwt from "jsonwebtoken";

import { ENV } from "../lib/env.js";
import { User } from "../models/User.js";

export const protectRoute = async (req, res, next)=>{
    try{
        const token = req.cookies.token;
        if(!token) return res.status(401).json({message: "Unauthorized - No token provided"});

        //verify if token is valid
        let decoded;
        try{
            decoded = jwt.verify(token, ENV.JWT_SECRET);
        }catch(error){
            return res.status(401).json({message: "Unauthorized - Token is not valid"});
        }
        // get the user
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        req.user = user;
        next();

    }catch(error){
        console.error("Protect moddleware Failed", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}