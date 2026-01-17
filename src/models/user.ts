import { InferSchemaType, Schema, model } from 'mongoose';

const userSchema = new Schema({
  username: { 
    type: String,
    required: true,
    unique: true
},
  email: { 
    type: String,
    required: true
},
  password: {
    type: String,
    required: true
},
  refreshToken: {
    type: [String],
  },
});

export const userModel = model('user', userSchema);
export type User = InferSchemaType<typeof userSchema>;