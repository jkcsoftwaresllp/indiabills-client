import { io } from "socket.io-client";
import { getBaseURL, getSocketBaseURL } from "../api/api-config";

console.log("WebSocket URL:", getSocketBaseURL());

export const socket = io(getSocketBaseURL(), {
  autoConnect: true,
  reconnection: true,
  transports: ["websocket"],
});
