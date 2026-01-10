import { Comment, commentModel } from "../models/comment";

class CommentRepository {
  async createComment(comment: Comment) {await commentModel.create(comment);}

  async updateComment(id: string, updatedFields: Partial<Comment>) {
    return await commentModel.findByIdAndUpdate(id, updatedFields, { new: true }).select('-__v');
  }
  
  async getCommentsByPostId(postId: string) {
    return await commentModel.find({ postID: postId });   
  }
  
  async createComment(comment: Comment) {
    await commentModel.create(comment);
}

    async getCommentById(id: string) {
        return await commentModel.findById(id);
    }
}

export default new CommentRepository();
