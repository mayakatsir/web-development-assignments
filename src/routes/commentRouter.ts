import { Router } from 'express';

const CommentsRouter = Router();

CommentsRouter.post('/', () => {
    console.log('Create a new comment');
});

CommentsRouter.get('/', () => {
    console.log('Get all comments');
});

CommentsRouter.get('/:id', () => {
    console.log('Get comment by ID');
});

CommentsRouter.get('/post/:postId', () => {
    console.log('Get all comments for post');
});

CommentsRouter.put('/:id', () => {
    console.log('Update comment by ID');
});

CommentsRouter.delete('/:id', () => {
    console.log('Delete comment by ID');
});

export default CommentsRouter;