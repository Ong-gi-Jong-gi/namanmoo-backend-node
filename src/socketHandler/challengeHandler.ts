import { Socket } from "socket.io";
import { TotalRooms } from "../types/socket.js";

const challengeHandler = (socket: Socket, totalRooms: TotalRooms) => {
  socket.on("callengeStart", (data: { room: string }) => {
    console.log("callengeStart");
    // 챌린지 시작
    totalRooms[data.room].challengeStatus = "ongoing";
    socket.to(data.room).emit("callengeStart");

    // Timer logic

    // 40초 타이머
    let remainingTime = 40; // seconds
    const intervalId = setInterval(() => {
      remainingTime -= 1;
      // 방에 있는 모든 사용자에게 남은 시간 전송
      socket.to(data.room).emit("timeUpdate", { remainingTime });
      if (remainingTime <= 0) {
        clearInterval(intervalId);
        socket.to(data.room).emit("challengeEnd");
      }
    }, 1000);
  });

  socket.on("callengeEnd", (data: { room: string }) => {
    console.log("callengeEnd");
    // 챌린지 종료
    totalRooms[data.room].challengeStatus = "finished";
    socket.to(data.room).emit("callengeEnd");
  });
};

export default challengeHandler;
