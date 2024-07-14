import { Server as SocketIo, Socket } from "socket.io";
import { TotalRooms } from "./types/socket.js";
import joinHandler from "./socketHandler/joinHandler.js";
import leaveHandler from "./socketHandler/leaveHandler.js";
import disconnectHandler from "./socketHandler/disconnectHandler.js";
import challengeHandler from "./socketHandler/challengeHandler.js";

/* WebSocket */

const totalRooms = {} as TotalRooms;

const socketHandler = (wsServer: SocketIo) => {
  // Step 1: Connection
  wsServer.on("connection", (socket: Socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Step 2: Join Room
    joinHandler(socket, totalRooms);
    // Step 3: Leave Room
    leaveHandler(socket, totalRooms);
    // Step 4: Disconnect
    disconnectHandler(socket, totalRooms);

    challengeHandler(socket, totalRooms);
  });
};

export default socketHandler;
