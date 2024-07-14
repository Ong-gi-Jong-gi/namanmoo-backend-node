// server.js
import express from "express";
import {
  AccessToken,
  AccessTokenOptions,
  VideoGrant,
} from "livekit-server-sdk";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import socketHandler from "./socketHandler.js";
dotenv.config();

const createToken = async (userInfo: AccessTokenOptions, grant: VideoGrant) => {
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    userInfo
  );
  at.addGrant(grant);

  return await at.toJwt();
};

const app = express();
app.use(cors());
const PORT = 8080;

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
  cors: {
    origin: [
      process.env.LOCALHOST_URL as string,
      process.env.APP_URL as string,
    ],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.status(200).send("Hello, World!");
});

app.get("/getToken", async (req, res) => {
  const { roomName, identity, name } = req.query;
  if (!roomName || !identity || !name) {
    return res.status(400).send("Missing required parameters");
  }
  console.log(roomName, identity, name);

  const grant: VideoGrant = {
    room: roomName as string,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
    canUpdateOwnMetadata: true,
  };
  const token = await createToken(
    { identity: identity as string, name: name as string },
    grant
  );

  res.status(200).json({ identity: identity, accessToken: token });
});

socketHandler(wsServer);

httpServer.listen(PORT, () =>
  console.log(`HTTP Server is running on http://localhost:${PORT}`)
);
