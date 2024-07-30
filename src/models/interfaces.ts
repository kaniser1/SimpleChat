import { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
}

export interface IMessage extends Document {
  username: string;
  message: string;
  createdAt: Date;
}