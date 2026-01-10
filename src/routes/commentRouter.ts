import { Router } from 'express';
import commentController from '../controllers/commentController';

export const commentRouter = Router();

commentRouter.post('/', commentController.createComment);


commentRouter.get('/', () => {
    console.log('Get all comments');
});

commentRouter.get('/:id', commentController.getCommentById);

commentRouter.get('/post/:postId', commentController.getCommentsByPostId);

commentRouter.put('/:id', () => {
    console.log('Update comment by ID');
});

commentRouter.delete('/:id', () => {
    console.log('Delete comment by ID');
});

export default commentRouter;
