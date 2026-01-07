import { Comment, commentModel } from "../models/comment";

class CommentRepository {
  async createComment(comment: Comment) {await commentModel.create(comment);}
}

export default new CommentRepository();
