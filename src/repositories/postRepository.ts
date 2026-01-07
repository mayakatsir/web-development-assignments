import { Post, postModel } from "../models/post";

class PostRepository {
  async createPost(title: string, sender: string, content?: string) {await postModel.create({ title, sender, content });}

  async getPostById(id: string){return await postModel.findById(id).select('-__v');}

}

export default new PostRepository();
