import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import commentRepository from '../repositories/commentRepository';
import postRepository from '../repositories/postRepository';

class CommentController {
    async createComment(req: Request, res: Response) {
        try {
            const { sender, content, postID } = req.body;

            if (!sender || !postID) {
                return res.status(400).json({ message: 'Sender or postID is missing from body params' });
            }

            if (!isValidObjectId(postID)) {
                return res.status(400).json({ message: `Invalid postID: ${postID} param` });
            }

            if (!(await postRepository.getPostById(postID))) {
                return res.status(400).json({ message: `Non existent post with id: ${postID}` });
            }

            const comment = await commentRepository.createComment({ sender, content, postID });

            return res.status(201).json(comment);
        } catch (err) {
            console.error('Error creating comment', err);

            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getCommentsByPostId(req: Request, res: Response) {
        const { postId } = req.params;

        if (!isValidObjectId(postId)) {
            return res.status(400).json({ message: `Invalid postId: ${postId} param` });
        }

        const comments = await commentRepository.getCommentsByPostId(postId);
        return res.status(200).json({ comments });
    }   
}

export default new CommentController();
