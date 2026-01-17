import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import authRouter from './src/routes/authRouter';
import commentRouter from './src/routes/commentRouter';
import postRouter from './src/routes/postRouter';
import userRouter from './src/routes/userRouter';
import { getConfig } from './src/services/config';
import { initializeDBConnection } from './src/services/db';
import userRouter from './src/routes/userRouter';
import { initializeDBConnection } from './src/utils/db';
import dotenv from 'dotenv';

const config = getConfig();

const app: Application = express();
const PORT = config.PORT;

const main  = async () => {
  await initializeDBConnection();
  
  app.use(cors());
  app.use(express.json()); 
  
  app.use("/post", postRouter);
  app.use("/comment", commentRouter);
  app.use("/user", userRouter)
  app.use("/auth", authRouter)

  app.get('/', (req: Request, res: Response) => {
    res.send({ message: 'API is running' });
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

main();
