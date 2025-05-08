import axios from 'axios';
import { auth } from './config';

// Use your computer's local IP address for mobile development
const API_BASE_URL = 'http://192.168.128.126:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      // Get the current user's ID token
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.error('API Error:', error);

    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. Please check if the server is running.');
      throw new Error('Unable to connect to the server. Please check if the server is running.');
    }

    if (error.code === 'ETIMEDOUT') {
      console.error('Request timed out. Please check your internet connection.');
      throw new Error('Request timed out. Please check your internet connection.');
    }

    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Server response error:', error.response.status, error.response.data);
      throw new Error(error.response.data?.message || 'An error occurred on the server');
    }

    if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      throw new Error('No response received from the server. Please check if the server is running.');
    }

    // Something happened in setting up the request
    console.error('Request setup error:', error.message);
    throw new Error('An error occurred while processing your request.');
  }
);

export default api;