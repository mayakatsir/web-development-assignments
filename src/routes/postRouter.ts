import { Router , Request} from 'express';
import {postController} from '../controllers/postController';

const postRouter = Router();

postRouter.post('/', postController.createPost);

postRouter.get('/', postController.getAllPosts);

postRouter.get('/:id',postController.getPostById );

postRouter.put('/:id', () =>{console.log('update post')});

postRouter.delete('/:id',() =>{console.log('delete post')} );

export default postRouter;
