import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import PostsRouter from './src/routes/postRouter';

const app: Application = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json()); 

app.use("/post",PostsRouter);
app.use("/comment",PostsRouter);

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

