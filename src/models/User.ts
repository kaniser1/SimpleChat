import mongoose, { Schema } from "mongoose";
import { IUser } from "./interfaces";

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.model<IUser>("User", userSchema);
