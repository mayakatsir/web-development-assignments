import { FilterQuery } from "mongoose";
import { Post, postModel } from "../models/post";

class PostRepository {
  async createPost(title: string, sender: string, content?: string) {await postModel.create({ title, sender, content });}

  async getPostById(id: string){return await postModel.findById(id).select('-__v');}

  async getAllPosts(query: Record<string, string | undefined>) {
    const filters: FilterQuery<Post> = {};

    if ('sender' in query) {
        filters.sender = query.sender;
    }

    return await postModel.find(filters).select('-__v');
  };

}

export default new PostRepository();
