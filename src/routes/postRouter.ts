import { Router } from 'express';

const PostsRouter = Router();

PostsRouter.post('/', () =>{console.log('Create a new post')});

PostsRouter.get('/',() =>console.log('get  post') );

PostsRouter.get('/:id',() =>{console.log('get  id post')} );

PostsRouter.put('/:id', () =>{console.log('update post')});

PostsRouter.delete('/:id',() =>{console.log('delete post')} );

export default PostsRouter;
