import { Comment, commentModel } from "../models/comment";

class CommentRepository {
  async createComment(comment: Comment) {await commentModel.create(comment);}

  async getAllComments() {return await commentModel.find().select('-__v');}
}

export default new CommentRepository();
