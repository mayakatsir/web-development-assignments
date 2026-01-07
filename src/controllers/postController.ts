import { Request, Response } from 'express';
import PostRepository from '../repositories/postRepository';

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
    };
    async getAllPosts(req: Request<{}, {}, {}, Record<string, string | undefined>>, res: Response) {
        try {
            res.status(200).send({ posts: await PostRepository.getAllPosts(req.query) });
        } catch (err) {
            console.error('Failed getting all posts', err);
        }
    };
}

export const postController = new PostController();
