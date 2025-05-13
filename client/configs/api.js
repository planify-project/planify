import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://172.20.10.3:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      throw new Error('Connection timeout. Please check your internet connection.');
    }

    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused');
      throw new Error('Server is not running. Please try again later.');
    }

    if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }

    throw error;
  }
);

export default api;
