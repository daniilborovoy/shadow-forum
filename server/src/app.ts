import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes';
import usersRouter from './routes/users.routes';
import discussionsRouter from './routes/discussions.routes';
import errorMiddleware from './middlewares/error.middleware';
import messagesRouter from './routes/messages.routes';

const app = express();
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use('/api', authRouter, usersRouter, discussionsRouter, messagesRouter);
app.use(errorMiddleware);
export default app;
