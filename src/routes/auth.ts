import express, { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authService";

const router = express.Router();

// Register endpoint
router.post("/register", async (req: Request, res: Response) => {

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    await registerUser(username, password);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Login endpoint
router.post("/login", async (req: Request, res: Response) => {
  
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const token = await loginUser(username, password);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

export default router;
