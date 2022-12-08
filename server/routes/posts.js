import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/feeds", verifyToken, getFeedPosts);
router.get("/:userId", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/like/:id", verifyToken, likePost);

export default router;