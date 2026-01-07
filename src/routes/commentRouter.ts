import { Router } from 'express';

const commentsRouter = Router();

commentsRouter.post('/', () => {
    console.log('Create a new comment');
});

commentsRouter.get('/', () => {
    console.log('Get all comments');
});

commentsRouter.get('/:id', () => {
    console.log('Get comment by ID');
});

commentsRouter.get('/post/:postId', () => {
    console.log('Get all comments for post');
});

commentsRouter.put('/:id', () => {
    console.log('Update comment by ID');
});

commentsRouter.delete('/:id', () => {
    console.log('Delete comment by ID');
});

export default commentsRouter;