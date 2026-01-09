import { Comment, commentModel } from "../models/comment";

class CommentRepository {
  async createComment(comment: Comment) {await commentModel.create(comment);}
  async deleteCommentById(commentId: string) {await commentModel.deleteOne({ _id: commentId });}
}

export default new CommentRepository();
