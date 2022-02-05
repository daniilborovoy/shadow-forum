import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRouter from './routes/auth.routes';
import usersRouter from './routes/users.routes';
import discussionsRouter from './routes/discussions.routes';
import errorMiddleware from './middlewares/error.middleware';

const app = express();
const PORT: number = Number(process.env.PORT) || 5000;
const DB_URL: string | null = process.env.DB_URL || null;

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api', authRouter, usersRouter, discussionsRouter);
app.use(errorMiddleware);

const start = async (): Promise<void> => {
  try {
    if (!DB_URL) throw new Error('Database connection link not found!');
    await mongoose.connect(DB_URL);
    app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
  } catch
    (e: unknown) {
    console.error(`Server start error: ${e}`);
  }
};
start();
