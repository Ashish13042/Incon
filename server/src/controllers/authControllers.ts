import { type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password, role } = req.body;

        // 1. Check if the user already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "A user with this email already exists." });
            return;
        }

        // 2. Security: Hash the password (never store plain text!)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create the new user object
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        });

        // 4. Save to MongoDB
        await newUser.save();

        // 5. Send success response back to the frontend
        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        console.error("Error in registerUser: ", error);
        res.status(500).json({ message: "Server Error" });
    }
};
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // 1. Find the user by their email
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid credentials." });
            return;
        }

        // 2. Compare the typed password with the scrambled one in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials." });
            return;
        }

        // 3. Create the "VIP Wristband" (JWT)
        // We put their user ID and role inside the token so the frontend knows who they are
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET as string, 
            { expiresIn: '1d' } // Token expires in 1 day
        );

        // 4. Send the token and user data back to the frontend
        res.status(200).json({
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Error in loginUser: ", error);
        res.status(500).json({ message: "Server Error" });
    }
};