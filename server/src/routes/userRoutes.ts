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
// Fetch a single user profile by ID
router.get('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // req.params.id grabs the ID straight from the URL!
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching profile: ", error);
        // If the ID is an invalid format, Mongoose throws an error, so we catch it here
        res.status(500).json({ message: "Invalid User ID or Server Error" });
    }
});

export default router;