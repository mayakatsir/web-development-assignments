import { Comment, commentModel } from "../models/comment";

export const createComment = async (comment: Comment) => await commentModel.create(comment);