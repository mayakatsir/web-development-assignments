import { InferSchemaType, Schema, model } from 'mongoose';

const userSchema = new Schema({
  username: { 
    type: String,
    required: true 
},
  email: { 
    type: String,
    required: true
}
});

export const userModel = model('user', userSchema);
export type User = InferSchemaType<typeof userSchema>;