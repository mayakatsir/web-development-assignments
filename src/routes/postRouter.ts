import { Router } from 'express';

const postRouter = Router();

postRouter.post('/', () =>{console.log('Create a new post')});

postRouter.get('/',() =>console.log('get  post') );

postRouter.get('/:id',() =>{console.log('get  id post')} );

postRouter.put('/:id', () =>{console.log('update post')});

postRouter.delete('/:id',() =>{console.log('delete post')} );

export default postRouter;
