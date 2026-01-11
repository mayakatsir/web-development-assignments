import { FilterQuery } from "mongoose";
import { User, userModel } from "../models/user";

class UserRepository {
    async createUser(username: string, email: string) {
        await userModel.create({ username, email });
    }

    async getUserById(id: string) {
        return await userModel.findById(id).select('-__v');
    }   

    async getAllUsers(query: Record<string, string | undefined>) {
        const filters: FilterQuery<User> = {};
        if ('username' in query) {
            filters.username = query.username;
        }   
        return await userModel.find(filters).select('-__v');
    }

    async updateUser(id: string, username?: string, email?: string) {
        const updateData: Partial<User> = {};
        if (username !== undefined) updateData.username = username;
        if (email !== undefined) updateData.email = email ;
        await userModel.findByIdAndUpdate(id, updateData);
    }
    async deleteUserById(userId: string) {
        await userModel.deleteOne({ _id: userId });
    }
}

export default new UserRepository();
