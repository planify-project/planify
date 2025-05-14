import { io } from "socket.io-client";
import { BACKEND } from "../configs/url";

const socket = io(`${BACKEND}`); // Replace with your server's address

export default socket;