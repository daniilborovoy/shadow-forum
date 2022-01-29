import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import router from './routes/api.routes';

const app = express();
const PORT: number = Number(process.env.PORT) || 5000;
const DB_URL: string | null = process.env.DB_URL || null;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api', router);

const start = async (): Promise<void> => {
  try {
    if (DB_URL) {
      await mongoose.connect(DB_URL);
      app.listen(PORT, () => console.log(`Server listen port: ${PORT}`));
    } else {
      throw new Error('Database connection link not found!');
    }
  } catch (err: any) {
    console.error(`Server error: ${err.message}`);
  }
};
start();
