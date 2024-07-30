import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { IGetUsernameInfoRequest } from "../types/requests";

const authenticate = async (req: IGetUsernameInfoRequest, res: Response, next: NextFunction) => {
  
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    const username = await User.findById(decoded.userId).select("-password");
    if (username) {
        req.body = username;
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authenticate;
