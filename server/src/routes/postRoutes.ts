import express from 'express';
import { createPost, getPosts } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Both routes require the user to have a valid VIP wristband (token)
router.post('/', protect, createPost);
router.get('/', protect, getPosts);

export default router;