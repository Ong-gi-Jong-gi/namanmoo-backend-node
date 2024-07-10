import { Server as SocketIo, Socket } from 'socket.io';

/* WebSocket */
const totalRooms = {} as { [key: string]: { users: string[] } };

const socketHandler = (wsServer: SocketIo) => {
  // Step 1: Connection
  wsServer.on('connection', (socket: Socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Step 2: Join Room
    socket.on('join', (data: { room: string }) => {
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

    // Step 3: Offer
    socket.on('offer', (data: { room: string; sdp: string }) => {
      socket.to(data.room).emit('offer', { sdp: data.sdp, sender: socket.id });
      console.log(`[Socket] Offer from ${socket.id} to ${data.room}`);
    });

    // Step 4: Answer
    socket.on('answer', (data: { sdp: string; room: string }) => {
      socket.to(data.room).emit('answer', { sdp: data.sdp, sender: socket.id });
      console.log(`[Socket] Answer from ${socket.id} to ${data.room}`);
    });

    // Step 5: Candidate
    socket.on('candidate', (data: { candidate: string; room: string }) => {
      socket.to(data.room).emit('candidate', {
        candidate: data.candidate,
        sender: socket.id,
      });
      console.log(`[Socket] Candidate from ${socket.id} to ${data.room}`);
    });

    // Step 6: Leave
    socket.on('disconnect', () => {
      // 연결이 끊어지면 방에서 사용자 제거
      if (socket.rooms) {
        Object.keys(socket.rooms).forEach((room) => {
          if (totalRooms[room]) {
            totalRooms[room].users = totalRooms[room].users.filter(
              (userId: string) => userId !== socket.id,
            );
          }
        });
      }

      // 방에 사용자가 없으면 방 제거
      Object.keys(totalRooms).forEach((room) => {
        if (totalRooms[room].users.length === 0) {
          delete totalRooms[room];
        }
      });

      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
    socket.on(
      'filter',
      (data: {
        room: string;
        type: string;
        x: number;
        y: number;
        width: number;
        height: number;
      }) => {
        socket.to(data.room).emit('filter', {
          type: data.type,
          x: data.x,
          y: data.y,
          width: data.width,
          height: data.height,
          // sender: socket.id,
        });
        console.log(`[Socket] Filter from ${socket.id} to ${data.room}`);
      },
    );
  });
};

export default socketHandler;
