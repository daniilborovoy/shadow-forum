import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import chat from '../service/connection.service';
import app from '../app';

const PORT: number = Number(process.env.PORT) || 5000;
const DB_URL: string | null = process.env.DB_URL || null;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});
chat(io);

const start = (): void => {
  try {
    if (!DB_URL) throw new Error('Database connection link not found!');
    mongoose.connect(DB_URL)
      .then((): void => {
        httpServer.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
      });
  } catch
    (error: unknown) {
    console.error(`Server start error: ${error}`);
  }
};

start();
