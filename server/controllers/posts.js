import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);

        const post = new Post(
            {
                userId,
                description,
                picturePath,
                likes: {},
                comments: [],
                firstName: user.firstName,
                lastName: user.lastName,
                location: user.location,
                userPicturePath: user.picturePath,
            }
        )
        const newPost = await post.save();
        res.status(201).json(newPost);
    }
    catch (err) {
        res.status(409).json({ error: err.message });
    }
}

/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);
    }
    catch (err) {
        res.status(409).json({ error: err.message });
    }
}
export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const userPosts = await Post.find({ userId })
        res.status(200).json(userPosts);
    }
    catch (err) {
        res.status(409).json({ error: err.message });
    }
}

/* UPDATES */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const isLiked = post.likes.get(userId);
        if (isLiked) {
            post.likes.delete(userId);
        }
        else {
            post.likes.set(userId, true);
        }
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        )

        res.status(200).json(updatedPost);
    }
    catch (err) {
        res.status(409).json({ error: err.message });
    }
}