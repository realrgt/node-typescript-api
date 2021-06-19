import mongoose, { Model } from 'mongoose';

export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: [true, 'Email must be unique'],
    },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret._v;
      },
    },
  }
);

interface UserModel extends Omit<User, '_id'>, Document {}
export const User: Model<UserModel> = mongoose.model('User', schema);
