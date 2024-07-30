import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const registerUser = async (username: string, password: string) => {

  const existingUser = await User.findOne({ username }, '-password', {lean: true});

  if (existingUser) {
    throw new Error("User already exists");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    return newUser;
  } catch (error) {
    throw new Error("Error creating user");
  }
};

export const loginUser = async (username: string, password: string) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {expiresIn: "1h"});
  return token;
};
