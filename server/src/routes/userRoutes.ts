import express, { type Response } from 'express';
import { protect, type AuthRequest } from '../middleware/authMiddleware.js';

const router = express.Router();

// Notice how we put 'protect' in the middle!
router.get('/feed', protect, (req: AuthRequest, res: Response) => {
    // Because they passed the middleware, we know req.user exists
    const userRole = req.user.role;

    if (userRole === 'entrepreneur') {
        res.json({ message: "Welcome Entrepreneur! Here is a list of Investors..." });
    } else {
        res.json({ message: "Welcome Investor! Here are some Startups looking for funding..." });
    }
});

export default router;