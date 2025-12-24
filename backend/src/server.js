import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.route.js";
import { dbConnect } from "./lib/db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
const __dirname = path.resolve();

app.use(express.json());//to parse json body
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// serve frontend during production via backend
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));
    app.get("/*splat", (_, res)=>{
        res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
    })
}

app.listen(PORT, () => {
    dbConnect();
    console.log("Server is running on: "+ PORT);
});