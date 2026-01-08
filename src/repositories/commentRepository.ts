import { Comment, commentModel } from "../models/comment";

class CommentRepository {
  async createComment(comment: Comment) {await commentModel.create(comment);}

  async getCommentsByPostId(postId: string) {
    return await commentModel.find({ postID: postId });   
  }
}

export default new CommentRepository();
