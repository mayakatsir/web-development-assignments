import { InferSchemaType, Schema, model } from 'mongoose';

const postSchema = new Schema({
  title: { 
    type: String,
    required: true 
},
  content: { 
    type: String,
    required: true
},
  author: { 
    type: String,
    required: true 
},
});

export const postModel = model('post', postSchema);
export type Post = InferSchemaType<typeof postSchema>;