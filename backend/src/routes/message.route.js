import express from "express";

import { userIdRateLimitter } from "../middleware/ratelimiiter.middleware.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllUser, getChatPartner, getMessageByUserId, sendMessage} from "../controllers/message.controller.js";

const router = express.Router();

router.use(protectRoute, userIdRateLimitter);

router.get("/contacts", getAllUser);
router.get("/chats", getChatPartner);
router.get("/:id", getMessageByUserId);
router.post("/send/:id", sendMessage);

export default router;