import { Comment, commentModel } from "../models/comment";

class CommentRepository {
  async createComment(comment: Comment) {
    await commentModel.create(comment);
}

    async getCommentById(id: string) {
        return await commentModel.findById(id);
    }
}

export default new CommentRepository();
