import { Request, Response } from 'express';
import PostRepository from '../repositories/postRepository';
import { isValidObjectId } from 'mongoose';

class PostController {
    async createPost(req: Request, res: Response) {
        try {
            const { sender, content, title } = req.body;
            if (!sender || !title) {
                res.status(400).send({ message: 'body param is missing (sender or title)' });
                return;
            }
            const post = await PostRepository.createPost(title, sender, content);
            res.status(200).send(post);
        } catch (err) {
            console.error('Error creating post', err);

            return res.status(500).json({ message: 'Internal server error' });
        }
    }


    async getPostById(req: Request, res: Response){
    try{
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            res.status(400).send({ message: `id: ${id} is not valid` });
            return;
        }

        const post = await PostRepository.getPostById(id);
        if (!post) {
            res.status(404).send({ message: `didn't find post with id: ${id}` });
            return;
        }

        res.status(200).send({ post });
    } catch (err) {
        console.error('Error getting post by id', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
    };
    
    async getAllPosts(req: Request<{}, {}, {}, Record<string, string | undefined>>, res: Response) {
        try {
            res.status(200).send({ posts: await PostRepository.getAllPosts(req.query) });
        } catch (err) {
            console.error('Failed getting all posts', err);
        }
    };

    async updatePost(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { title, content, sender } = req.body;

            if (!isValidObjectId(id)) {
                res.status(400).send({ message: `id: ${id} is not valid` });
                return;
            }

            const post = await PostRepository.getPostById(id);
            if (!post) {
                res.status(404).send({ message: `didn't find post with id: ${id}` });
                return;
            }

            await PostRepository.updatePost(id, title, content, sender);
            res.status(200).send({ message: 'Post updated successfully' });
        } catch (err) {
            console.error('Error updating post', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    async deletePostById(req: Request, res: Response) {
        try {
            const { id } = req.params;   

            if (!isValidObjectId(id)) {
                res.status(400).send({ message: `id: ${id} is not valid` });
                return;
            }

            const post = await PostRepository.getPostById(id);

            if (!post) {
                res.status(404).send({ message: `didn't find post with id: ${id}` });
                return;
            }   

            await PostRepository.deletePostById(id);
            res.status(200).send({ message: 'Post deleted successfully' });
        } catch (err) {
            console.error('Error deleting post', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default new PostController();
