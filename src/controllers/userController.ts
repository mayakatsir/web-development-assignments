import { Request, Response } from 'express';
import UserRepository from '../repositories/userRepository';
import { isValidObjectId } from 'mongoose';

class UserController {
    async createUser(req: Request, res: Response) {
        try {
            const { username, email, password } = req.body;
            if (!username || !email || !password) {
                res.status(400).send({ message: 'body param is missing (username or email or password)' });
                return;
            }
            const user = await UserRepository.createUser(username,  email, password);
            res.status(200).send(user);
        } catch (err) {
            console.error('Error creating user', err);  
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getUserById(req: Request, res: Response){
        try{
            const { id } = req.params;
            if (!isValidObjectId(id)) {
                res.status(400).send({ message: `id: ${id} is not valid` });
                return;
            }       
            const user = await UserRepository.getUserById(id);
            if (!user) {
                res.status(404).send({ message: `didn't find user with id: ${id}` });
                return;
            }   
            res.status(200).send({ user });
        } catch (err) {
            console.error('Error getting user by id', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };


    async getAllUsers(req: Request, res: Response) {
        try {
            res.status(200).send({ users: await UserRepository.getAllUsers()});
        } catch (err) {
            console.error('Failed getting all users', err);
        }   
    };


    async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { username, email } = req.body;   
            if (!isValidObjectId(id)) {
                res.status(400).send({ message: `id: ${id} is not valid` });
                return;
            }
            await UserRepository.updateUser(id, username, email);
            res.status(200).send({ message: `Successfully updated user with id: ${id}` });
        } catch (err) {
            console.error('Error updating user', err);
            return res.status(500).json({ message: 'Internal server error' });
        }           
    }

    async deleteUserById(req: Request, res: Response) {     
        try {
            const { id } = req.params;
            if (!isValidObjectId(id)) {
                res.status(400).send({ message: `id: ${id} is not valid` });
                return;
            }   
            await UserRepository.deleteUserById(id);
            res.status(200).send({ message: `Successfully deleted user with id: ${id}` });
        } catch (err) {
            console.error('Error deleting user', err);
            return res.status(500).json({ message: 'Internal server error' });
        }       
    }



}

export default new UserController();
