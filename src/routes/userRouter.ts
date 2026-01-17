import { Router } from 'express';
import userController from '../controllers/userController';

const userRouter = Router();
 
userRouter.get('/', userController.getAllUsers);

userRouter.get('/:id',userController.getUserById );

userRouter.put('/:id', userController.updateUser );

userRouter.delete('/:id',userController.deleteUserById );

export default userRouter;
