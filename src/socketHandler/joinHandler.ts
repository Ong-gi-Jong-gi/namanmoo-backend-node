import { Socket } from "socket.io";
import { TotalRooms } from "../types/socket.js";

const joinHandler = (socket: Socket, totalRooms: TotalRooms) => {
  socket.on("join", (data: { room: string }) => {
    if (!data.room) return;

    socket.join(data.room);

    // 방이 없으면 생성
    if (!totalRooms[data.room]) {
      totalRooms[data.room] = { users: [] };
    }

    // 방에 사용자 추가
    totalRooms[data.room].users.push(socket.id);
    console.log(`[Socket] ${socket.id} joined ${data.room}`);
  });
};

export default joinHandler;
