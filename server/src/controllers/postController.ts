import type { Response } from 'express';
import type { AuthRequest } from '../middleware/authMiddleware.js';
import Post from '../models/Post.js';

// 1. Create a new Pitch/Post
export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, content } = req.body;

        // Create the post and attach the logged-in user's ID
        const newPost = new Post({
            author: req.user.id, // We get this from your authMiddleware!
            title,
            content
        });

        await newPost.save();
        res.status(201).json({ message: "Pitch published successfully!", post: newPost });

    } catch (error) {
        console.error("Error creating post: ", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// 2. Fetch all Posts for the Global Feed
export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // .populate() is Mongoose magic! It takes the author's ID and fetches 
        // their actual username and role from the User collection so we can display it.
        const posts = await Post.find()
            .populate('author', 'username role') 
            .sort({ createdAt: -1 }); // -1 sorts by newest first

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts: ", error);
        res.status(500).json({ message: "Server Error" });
    }
};