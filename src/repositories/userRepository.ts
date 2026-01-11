import { FilterQuery } from "mongoose";
import { User, userModel } from "../models/user";
import { postModel } from "../models/post";
import { commentModel } from "../models/comment";

class UserRepository {
    async createUser(username: string, email: string, password: string) {
        await userModel.create({ username, email, password });
    }

    async getUserById(id: string) {
        return await userModel.findById(id).select('-__v');
    }   

    async getAllUsers() {  
        return await userModel.find().select('-__v');
    }

    async updateUser(id: string, username?: string, email?: string, password?: string) {
        const updateData: Partial<User> = {};

        if (username !== undefined) updateData.username = username;
        if (email !== undefined) updateData.email = email ;
        if (password !== undefined) updateData.password = password ;

        await userModel.findByIdAndUpdate(id, updateData);
    }

    async deleteUserById(userId: string) {
        await userModel.deleteOne({ _id: userId });
        await postModel.deleteMany({ sender: userId });
        await commentModel.deleteMany({ sender: userId });
    }

    async isUsernameExists(username: string) {
        return (await userModel.countDocuments({ username })) > 0
    }

}

export default new UserRepository();
