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

  async updatePost(id: string, title?: string, content?: string, author?: string) {
    const updateData: Partial<Post> = {};

    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (author !== undefined) updateData.author = author ;

    await postModel.findByIdAndUpdate(id, updateData);
  }
}

export default new PostRepository();
