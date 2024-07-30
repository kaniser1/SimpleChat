import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat";
import authRoutes from "./routes/auth";
import { initializeSocket } from "./socket";

// Load environment variables from .env file
dotenv.config();

// Initialize app and server
export const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Middleware to parse JSON bodies and server static files
app.use(express.json());
app.use(express.static("public"));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Serve chat interface
app.get("/", (req: Request, res: Response) => {
  res.sendFile(__dirname + "/index.html");
});

// Socketio Init
initializeSocket(io);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
