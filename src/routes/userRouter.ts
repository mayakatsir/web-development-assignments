import { Router } from 'express';
import userController from '../controllers/userController';

const userRouter = Router();

userRouter.post('/', userController.createPost);   
 
userRouter.get('/', userController.getAllPosts);

userRouter.get('/:id',userController.getPostById );

userRouter.put('/:id', userController.updatePost );

userRouter.delete('/:id',userController.deletePostById );

export default userRouter;
