import { Request, Router } from 'express';
import { postController } from '../controllers/postController'
const postRouter = Router();

postRouter.post('/', () =>{console.log('Create a new post')});

postRouter.get('/', async (req: Request<{}, {}, {}, Record<string, string | undefined>>, res) => 
    await postController.getAllPosts(req, res) 
);

postRouter.get('/:id',() =>{console.log('get  id post')} );

postRouter.put('/:id', () =>{console.log('update post')});

postRouter.delete('/:id',() =>{console.log('delete post')} );

export default postRouter;
