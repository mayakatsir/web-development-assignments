import { Comment, commentModel } from "../models/comment";

class CommentRepository {
  async createComment(comment: Comment) {await commentModel.create(comment);}

  async updateComment(id: string, updatedFields: Partial<Comment>) {
    return await commentModel.findByIdAndUpdate(id, updatedFields, { new: true }).select('-__v');
  }
}

export default new CommentRepository();
