import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import postRouter from './src/routes/postRouter';
import commentRouter from './src/routes/commentRouter';
<<<<<<< HEAD
import userRouter from './src/routes/userRouter';
import { initializeDBConnection } from './src/utils/db';
=======
import { initializeDBConnection } from './src/services/db';
>>>>>>> 0d0a125935b9e39283bed6b363bbf591ff7d428c
import dotenv from 'dotenv';

dotenv.config(); 

const app: Application = express();
const PORT = process.env.PORT || 8080;

const main  = async () => {
  await initializeDBConnection();
  
  app.use(cors());
  app.use(express.json()); 
  
  app.use("/post", postRouter);
  app.use("/comment", commentRouter);
  app.use("/user", userRouter)
  
  app.get('/', (req: Request, res: Response) => {
    res.send({ message: 'API is running' });
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

main();
