import { Router } from 'express';
import commentController from '../controllers/commentController';

export const commentRouter = Router();

commentRouter.post('/', commentController.createComment);


commentRouter.get('/', () => {
    console.log('Get all comments');
});

commentRouter.get('/:id', commentController.getCommentById);

commentRouter.get('/post/:postId', commentController.getCommentsByPostId);

commentRouter.put('/:id', commentController.updateComment);

commentRouter.delete('/:id', async (req, res) => await commentController.deleteCommentById(req, res));

export default commentRouter;
