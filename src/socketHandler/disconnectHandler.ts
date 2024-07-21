import { Socket } from "socket.io";
import { TotalRooms } from "../types/socket.js";
import EVENT from "../constants/EVENT.js";

const disconnectHandler = (socket: Socket, totalRooms: TotalRooms) => {
  socket.on(EVENT.DISCONNECT, () => {
    // 연결이 끊어지면 방에서 사용자 제거
    Object.keys(socket.rooms).forEach((room) => {
      if (totalRooms[room]) {
        totalRooms[room].users = totalRooms[room].users.filter(
          (userId: string) => userId !== socket.id
        );
      }
    });

    const socketRooms = new Set(Object.keys(socket.rooms));
    const totalRoomsKeys = Object.keys(totalRooms);

    // 방에 사용자가 없으면 방 제거
    totalRoomsKeys.forEach((room) => {
      if (!socketRooms.has(room) || totalRooms[room].users.length === 0) {
        delete totalRooms[room];
      }
    });

    console.log(
      `[Socket] Rooms after disconnection: ${JSON.stringify(totalRooms)}`
    );
  });
};
export default disconnectHandler;
