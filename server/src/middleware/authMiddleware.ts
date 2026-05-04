import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. Tell TypeScript we are adding a 'user' property to the standard Request
export interface AuthRequest extends Request {
    user?: any;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
    // 2. Get the token from the headers (Frontend will send it as "Bearer <token>")
    const token = req.header('Authorization')?.split(' ')[1];

    // 3. If there's no token, stop them right here
    if (!token) {
        res.status(401).json({ message: "Not authorized, no token provided." });
        return;
    }

    try {
        // 4. Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

        // 5. Attach the decoded user info (id, role) to the request
        req.user = decoded;

        // 6. Let them pass to the actual route!
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized, token failed." });
    }
};