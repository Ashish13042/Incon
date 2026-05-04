import express, { type Response } from 'express';
import { protect, type AuthRequest } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Notice how we put 'protect' in the middle!
router.get('/feed', protect, async (req: AuthRequest, res: Response) => {

    try {
        const userRole = req.user.role;
        let profile = []

        if (userRole === 'entrepreneur') {
            profile = await User.find({ role: 'investor' }).select('-password')
            res.json({ message: "Welcome Entrepreneur! here are some investors looking for deals...", profile });
        } else {
            profile = await User.find({ role: 'entrepreneur' }).select('-password')
            res.json({ message: "Welcome Investor! Here are some Startups looking for funding...", profile });
        }
    }
    catch (error) {
        console.error("Error fetching feed: ", error);
        res.status(500).json({ message: "Server Error" });
    }

});

export default router;