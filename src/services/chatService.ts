import Message from "../models/Message";

export const saveMessage = async (username: string | string[], message: string) => {
  
  if (typeof username !== 'string') {
    username = username[0];
  }

  const newMessage = new Message({ username, message });  
  await newMessage.save();
  return newMessage;
};

export const getMessageHistory = async () => {

  const messages = await Message.find({}, "-_id").sort({ createdAt: -1 }).limit(10);
  return messages;
};
