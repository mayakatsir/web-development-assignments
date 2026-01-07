import { Comment, commentModel } from "../models/comment";
import { Post, postModel } from "../models/post";

class PostRepository {
  async createPost(title: string, sender: string, content?: string) {await postModel.create({ title, sender, content });}
}

export default new PostRepository();
