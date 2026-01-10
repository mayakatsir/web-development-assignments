import { Router , Request} from 'express';
import {postController} from '../controllers/postController';

const postRouter = Router();

postRouter.post('/', postController.createPost);

postRouter.get('/', postController.getAllPosts);

postRouter.get('/:id',postController.getPostById );

postRouter.put('/:id', postController.updatePost );

postRouter.delete('/:id',postController.deletePostById );

export default postRouter;
