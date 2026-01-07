import { Router } from 'express';

const postsRouter = Router();

postsRouter.post('/', () =>{console.log('Create a new post')});

postsRouter.get('/',() =>console.log('get  post') );

postsRouter.get('/:id',() =>{console.log('get  id post')} );

postsRouter.put('/:id', () =>{console.log('update post')});

postsRouter.delete('/:id',() =>{console.log('delete post')} );

export default postsRouter;
