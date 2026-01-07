import { Router } from 'express';
import { createCommentController } from '../controllers/commentController';

export const commentRouter = Router();

// POST /api/comments
commentRouter.post('/', createCommentController);
