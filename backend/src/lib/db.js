import mongoose from "mongoose";

import { ENV } from "./env.js";

export const dbConnect = async()=>{
    try{
        await mongoose.connect(ENV.MONGODB_URI);
        console.log("Connected successfully");
    }catch(err){
        console.error("Mongo db connection error: ", err);
        process.exit(1); // Exit process with failure
    }
}