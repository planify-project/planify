// Get the local IP address from environment or use localhost
const getLocalIP = () => {
  // Use the same IP address as your API_BASE in EventSpaceAPI.js
  return '172.20.10.3';
};

export const API_BASE = `http://${getLocalIP()}:3000/api`;
export const SOCKET_URL = `http://${getLocalIP()}:3000`;