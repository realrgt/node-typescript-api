import mongoose, { Model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
}

export enum CUSTOM_VALIDATION {
  DUPLICATED = 'DUPLICATED',
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

schema.path('email').validate(
  async (email: string) => {
    const emailCount = await mongoose.models.User.countDocuments({ email });
    return !emailCount;
  },
  'already exists in the database.',
  CUSTOM_VALIDATION.DUPLICATED
);

export async function hashPassword(
  password: string,
  salt = 10
): Promise<string> {
  return await bcrypt.hash(password, salt);
}

export async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

schema.pre<UserModel>('save', async function (): Promise<void> {
  if (!this.password || !this.isModified('password')) return;

  try {
    const hashedPassword = await hashPassword(this.password);
    this.password = hashedPassword;
  } catch (error) {
    console.error(`Error hashing password for the user ${this.name}`);
  }
});

interface UserModel extends Omit<User, '_id'>, Document {}
export const User: Model<UserModel> = mongoose.model('User', schema);
