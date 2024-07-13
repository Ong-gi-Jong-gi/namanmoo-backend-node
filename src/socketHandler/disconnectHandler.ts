import { Socket } from "socket.io";
import { TotalRooms } from "../types/socket.js";

const disconnectHandler = (socket: Socket, totalRooms: TotalRooms) => {
  socket.on("disconnect", () => {
    // 연결이 끊어지면 방에서 사용자 제거
    Object.keys(socket.rooms).forEach((room) => {
      if (totalRooms[room]) {
        totalRooms[room].users = totalRooms[room].users.filter(
          (userId: string) => userId !== socket.id
        );

        // 방에 사용자가 없으면 방 제거
        if (totalRooms[room].users.length === 0) {
          delete totalRooms[room];
        }
      }
    });

    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
};
export default disconnectHandler;
