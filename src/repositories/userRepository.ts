import { FilterQuery } from "mongoose";
import { Post, postModel } from "../models/post";

class UserRepository {
  async createPost(title: string, sender: string, content?: string) {await postModel.create({ title, sender, content });}

  async getPostById(id: string){return await postModel.findById(id).select('-__v');}

  async getAllPosts(query: Record<string, string | undefined>) {
    const filters: FilterQuery<Post> = {};

    if ('sender' in query) {
        filters.sender = query.sender;
    }

    return await postModel.find(filters).select('-__v');
  };

  async updatePost(id: string, title?: string, content?: string, sender?: string) {
    const updateData: Partial<Post> = {};

    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (sender !== undefined) updateData.sender = sender ;

    await postModel.findByIdAndUpdate(id, updateData);
  }

  async deletePostById(postId: string) {
    await postModel.deleteOne({ _id: postId });
  }
}

export default new UserRepository();
