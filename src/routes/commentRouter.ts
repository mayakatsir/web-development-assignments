import { Router } from 'express';
import commentController from '../controllers/commentController';

export const commentRouter = Router();

commentRouter.post('/', commentController.post);


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

commentRouter.delete('/:id', () => {
    console.log('Delete comment by ID');
});

export default commentRouter;
