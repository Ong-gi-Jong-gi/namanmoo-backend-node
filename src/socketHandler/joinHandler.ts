import { Socket } from "socket.io";
import { TotalRooms } from "../types/socket.js";
import EVENT from "../constants/EVENT.js";

const joinHandler = (socket: Socket, totalRooms: TotalRooms) => {
  socket.on(EVENT.JOIN, (data: { room: string }) => {
    console.log(`[Socket] ${socket.id} is trying to join ${data.room}`);
    if (!data.room) return;

    socket.join(data.room);

    // 방이 없으면 생성
    if (!totalRooms[data.room]) {
      totalRooms[data.room] = { users: [], challengeStatus: "idle" };
    }

    // 방에 사용자 추가
    totalRooms[data.room].users.push(socket.id);
    // 방에 들어온 사용자에게 현재 챌린지 상태 전송
    socket.emit(EVENT.CHALLENGE_STATUS, {
      room: data.room,
      challengeStatus: totalRooms[data.room].challengeStatus,
    });
    console.log(`[Socket] ${socket.id} joined ${data.room}`);
  });
};

export default joinHandler;
