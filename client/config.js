// Get the local IP address from environment or use localhost
const getLocalIP = () => {
  // You can replace this with your actual IP address if needed
  return 'localhost';
};

export const API_BASE = `http://${getLocalIP()}:3000/api`;
export const SOCKET_URL = `http://${getLocalIP()}:3000`;