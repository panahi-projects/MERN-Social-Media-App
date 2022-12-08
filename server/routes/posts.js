import express from "express";
import { createPost, getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/feeds", verifyToken, getFeedPosts);
router.get("/:userId", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/like/:id", verifyToken, getFeedPosts);

export default router;