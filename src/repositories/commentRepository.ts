import { Comment, commentModel } from '../models/comment';

class CommentRepository {
    async createComment(comment: Comment) {
        await commentModel.create(comment);
    }

    async updateComment(id: string, updatedFields: Partial<Comment>) {
        return await commentModel.findByIdAndUpdate(id, updatedFields, { new: true }).select('-__v');
    }

    async getCommentsByPostId(postId: string) {
        return await commentModel.find({ postID: postId });
    }

    async getCommentById(id: string) {
        return await commentModel.findById(id);
    }

    async deleteCommentById(commentId: string) {
        await commentModel.deleteOne({ _id: commentId });
    }
}

export default new CommentRepository();
