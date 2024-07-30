import express, { Request, Response } from "express";
import { getMessageHistory } from "../services/chatService";
import authenticate from "../middleware/authenticate";

const router = express.Router();

router.get("/history", authenticate, async (req: Request, res: Response) => {

  try {
    console.log("Getting messages");
    const messages = await getMessageHistory();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
