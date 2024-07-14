import { Socket } from "socket.io";
import { TotalRooms } from "../types/socket.js";
import EVENT from "../constants/EVENT.js";

const challengeHandler = (socket: Socket, totalRooms: TotalRooms) => {
  socket.on(EVENT.CHALLENGE_START, (data: { room: string }) => {
    // 챌린지 시작
    totalRooms[data.room].challengeStatus = "ongoing";
    socket.emit(EVENT.CHALLENGE_START);
    socket.to(data.room).emit(EVENT.CHALLENGE_START);

    // Timer logic
    // 40초 타이머
    let remainingTime = 40; // seconds
    const intervalId = setInterval(() => {
      remainingTime -= 1;
      // 방에 있는 모든 사용자에게 남은 시간 전송
      socket.emit(EVENT.TIME_UPDATE, { remainingTime });
      socket.to(data.room).emit(EVENT.TIME_UPDATE, { remainingTime });
      if (remainingTime <= 0) {
        clearInterval(intervalId);
        socket.emit(EVENT.CHALLENGE_END);
        socket.to(data.room).emit(EVENT.CHALLENGE_END);
        totalRooms[data.room].challengeStatus = "finished";
      }
    }, 1000);
  });

  socket.on(EVENT.CHALLENGE_END, (data: { room: string }) => {
    console.log(EVENT.CHALLENGE_END);
    // 챌린지 종료
    totalRooms[data.room].challengeStatus = "finished";
    socket.emit(EVENT.CHALLENGE_END);
    socket.to(data.room).emit(EVENT.CHALLENGE_END);
  });
};

export default challengeHandler;
