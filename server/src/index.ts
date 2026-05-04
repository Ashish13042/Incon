import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';

dotenv.config();

const app = express();
const Port = 5000;

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.get('/api/status', (req: Request, res: Response) => {
    res.json({ message: "hello, server is running" })
}
);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(Port, () => {
            console.log(`server is live on port ${Port}`);
        })
    }
    catch (err) {
        console.error(`server failed to start`, err);
        process.exit(1)
    }
}

startServer();
