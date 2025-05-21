// API Configuration
export const API_BASE = 'http://192.168.1.164:3000/api';
export const SOCKET_URL = 'http://192.168.1.164:3000';

// Other configuration constants
export const APP_NAME = 'Planify';
export const APP_VERSION = '1.0.0';

// API Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  EVENTS: {
    PUBLIC: '/events/public',
    CREATE: '/events',
    UPDATE: '/events',
    DELETE: '/events',
  },
  SERVICES: {
    LIST: '/services',
    CREATE: '/services',
    UPDATE: '/services',
    DELETE: '/services',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users',
  },
};

// Socket Events
export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  JOIN_USER_ROOM: 'joinUserRoom',
  TEST: 'test',
}; 