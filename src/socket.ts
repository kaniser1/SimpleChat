import { Server as SocketIOServer, Socket } from "socket.io";
import { saveMessage } from "./services/chatService";
import { IHandshakeQuery } from "./types/requests";

let connectedUsers: string[] = [];

export const initializeSocket = (io: SocketIOServer) => {
  io.on("connection", (socket: Socket & { handshake: { query: IHandshakeQuery } }) => {
      console.log("A user connected");

      // Handle user joining chat
      socket.on("join", async (username: string) => {
        socket.handshake.query.username = username;
        connectedUsers.push(username);
        socket.emit("user list", connectedUsers);
        socket.broadcast.emit("user connected", username);
        socket.broadcast.emit("user list", connectedUsers);
      });

      // Handle incoming chat messages
      socket.on("chat message", async (msg) => {
        const username = socket.handshake.query.username;

        try {
          if (username) {
            await saveMessage(username, msg);
            io.emit("chat message", `${username}: ${msg}`);
          }
        } catch (error) {
          console.error("Error saving message:", error);
        }
      });

      // Handle typing indicator
      socket.on("typing", () => {
        const username = socket.handshake.query.username;
        socket.broadcast.emit("typing", username);
      });

      // Handle user disconnect
      socket.on("disconnect", () => {
        const username = socket.handshake.query.username;
        console.log("A user disconnected");
        connectedUsers = connectedUsers.filter((user) => user !== username);
        socket.broadcast.emit("user disconnected", username);
        socket.broadcast.emit("user list", connectedUsers);
      });
    }
  );
};
