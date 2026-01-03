import express from "express";

import {signup, login, logout, updateProfile} from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js";
import { userIdRateLimitter, ipRateLimitter } from "../middleware/ratelimiiter.middleware.js";

const router = express.Router();

router.post("/signup", ipRateLimitter, signup);
router.post("/login", ipRateLimitter, login);
router.post("/logout", ipRateLimitter, logout);

router.put("/update-profile", protectRoute, userIdRateLimitter, updateProfile);
router.get("/check", protectRoute, userIdRateLimitter, (req, res)=>res.status(200).json(req.user));

export default router;