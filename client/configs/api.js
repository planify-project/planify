import axios from 'axios';
import { API_BASE } from '../config';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(
  async (config) => {
    // Log the full URL being requested
    console.log('Making request to:', `${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;
    
    if (!config || !config.retry) {
      return Promise.reject(error);
    }

    config.retry -= 1;
    if (config.retry === 0) {
      return Promise.reject(error);
    }

    // Delay before retrying
    await new Promise(resolve => setTimeout(resolve, 1000));
    return api(config);
  }
);

export default api;
