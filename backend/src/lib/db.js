import mongoose from "mongoose";

export const dbConnect = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected successfully");
    }catch(err){
        console.error("Mongo db connection error: ", err);
        process.exit(1); // Exit process with failure
    }
}