import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    profiPic: {
        type: String,
        default: ""
    }
}, {timestamps: true});

export const User = mongoose.model("User", userSchema);