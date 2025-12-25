import jwt from "jsonwebtoken";

import { ENV } from "./env.js";

export const generateTokenAndAddToCookie = async(userId, res) =>{
    //generate token
    const token = jwt.sign({userId}, ENV.JWT_SECRET, {expiresIn: "7d"});
    //Add token to cookie
    res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
        httpOnly: true, // can not access via JS
        sameSite: "strict", // prevent CSRF attack
        secure: ENV.NODE_ENV=="development"? false: true // true for https
    })
}