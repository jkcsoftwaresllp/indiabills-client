import { io } from "socket.io-client";
import { getBaseURL } from "../api/api-config";

export const socket = io(getBaseURL(), {
    autoConnect: true,
    reconnection: true,
});
