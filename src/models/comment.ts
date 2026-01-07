import { InferSchemaType, Schema, model } from 'mongoose';

const commentSchema = new Schema({
    postID: { 
        type: Schema.Types.ObjectId, 
        ref: 'post', 
        required: true
    },
    sender: { 
        type: String, 
        required: true 
    },
    content: { 
        type: String, 
        required: true
    },
});

export const commentModel = model('comment', commentSchema);
export type Comment = InferSchemaType<typeof commentSchema>;