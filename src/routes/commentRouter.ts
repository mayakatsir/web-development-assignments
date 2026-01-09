import { Router } from 'express';
import commentController from '../controllers/commentController';

export const commentRouter = Router();

commentRouter.post('/', async (req, res) => await commentController.createComment(req, res));


commentRouter.get('/', () => {
    console.log('Get all comments');
});

commentRouter.get('/:id', () => {
    console.log('Get comment by ID');
});

commentRouter.get('/post/:postId', () => {
    console.log('Get all comments for post');
});

commentRouter.put('/:id', () => {
    console.log('Update comment by ID');
});

commentRouter.delete('/:id', async (req, res) => await commentController.deleteCommentById(req, res));

export default commentRouter;
