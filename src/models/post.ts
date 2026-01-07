import { InferSchemaType, Schema, model } from 'mongoose';

const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String },
  author: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const postModel = model('post', postSchema);
export type Post = InferSchemaType<typeof postSchema>;
