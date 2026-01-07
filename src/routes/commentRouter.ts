import { Router } from 'express';
import commentController from '../controllers/commentController';

export const commentRouter = Router();

// POST /api/comments
commentRouter.post('/', commentController.post);
