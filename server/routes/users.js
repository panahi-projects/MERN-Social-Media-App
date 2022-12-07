import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {getUser, getUserFriends, addRemoveFriend} from "../controllers/users.js"

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;