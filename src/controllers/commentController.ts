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

            return res.status(200).json(comment);
        } catch (err) {
            console.error('Error creating comment', err);

            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getAllComments(req: Request, res: Response) {
        try {
            const comments = await commentRepository.getAllComments();

            return res.status(200).json({ comments });
        } catch (err) {
            console.error('Failed fetching all comments', err);

            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteCommentById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!isValidObjectId(id)) {
                return res.status(400).json({ message: `Invalid comment ID: ${id}` });
            }

            await commentRepository.deleteCommentById(id);

            return res.status(200).json({ message: `Successfully deleted comment ${id}` });
        } catch (err) {
            console.error('Failed deleting comment', err);

            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateComment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { content } = req.body;

            if (!isValidObjectId(id)) {
                return res.status(400).json({ message: `Invalid comment ID: ${id}` });
            }

            const updatedComment = await commentRepository.updateComment(id, { content });

            if (!updatedComment) {
                return res.status(404).json({ message: `Comment with ID: ${id} not found` });
            }

            return res.status(200).json(updatedComment);
        } catch (err) {
            console.error('Error updating comment', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getCommentsByPostId(req: Request, res: Response) {
        try {
            const { postId } = req.params;

            if (!isValidObjectId(postId)) {
                return res.status(400).json({ message: `Invalid postId: ${postId} param` });
            }

            const comments = await commentRepository.getCommentsByPostId(postId);
            return res.status(200).json({ comments });
        } catch (err) {
            console.error('Error getting comments by post id', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getCommentById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!isValidObjectId(id)) {
                return res.status(400).json({ message: `Invalid id: ${id} param` });
            }

            const comment = await commentRepository.getCommentById(id);

            if (!comment) {
                return res.status(404).json({ message: `Comment with id: ${id} not found` });
            }

            return res.status(200).json(comment);
        } catch (err) {
            console.error('Error getting comment by id', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default new CommentController();
