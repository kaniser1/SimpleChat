import mongoose, { Schema } from "mongoose";
import { IMessage } from "./interfaces";

const MessageSchema: Schema = new Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMessage>("Message", MessageSchema);
