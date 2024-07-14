import { Socket } from "socket.io";
import { TotalRooms } from "../types/socket.js";
import EVENT from "../constants/EVENT.js";

const leaveHandler = (socket: Socket, totalRooms: TotalRooms) => {
  socket.on(EVENT.LEAVE, (data: { room: string }) => {
    if (!data.room) return;
    socket.leave(data.room);
    // 방에서 사용자 제거
    if (totalRooms[data.room]) {
      totalRooms[data.room].users = totalRooms[data.room].users.filter(
        (userId: string) => userId !== socket.id
      );

      // 방에 사용자가 없으면 방 제거
      if (totalRooms[data.room].users.length === 0) {
        delete totalRooms[data.room];
      }
    }

    console.log(`[Socket] ${socket.id} left ${data.room}`);
    console.log(totalRooms);
  });
};

export default leaveHandler;
