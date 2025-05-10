import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Update the base URL to match your backend route
const API_BASE = 'http://172.20.10.3:3000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for authentication if needed
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error getting token:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      try {
        await AsyncStorage.removeItem('token');
        // Note: In React Native, we need to handle navigation differently
        // You might want to use a navigation service or context
      } catch (e) {
        console.error('Error removing token:', e);
      }
    }
    return Promise.reject(error);
  }
);

export const fetchEventSpaces = async (filters = {}) => {
  try {
    const response = await api.get('/event-spaces', { params: filters });
    if (!response.data) {
      throw new Error('Invalid response format');
    }
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch event spaces');
  }
};

// Update other endpoint paths as well
export const fetchAvailability = async (spaceId, date) => {
  try {
    const response = await api.get(`/event-spaces/${spaceId}/availability`, { 
      params: { date } 
    });
    return response.data;
  } catch (error) {
    console.error('Availability check error:', error);
    throw new Error(error.response?.data?.message || 'Failed to check availability');
  }
};

export const bookEventSpace = async (bookingData) => {
  try {
    const response = await api.post('/event-spaces/book', bookingData);
    return response.data;
  } catch (error) {
    console.error('Booking error:', error);
    throw new Error(error.response?.data?.message || 'Failed to book event space');
  }
};

export const getEventSpaceDetails = async (spaceId) => {
  try {
    const response = await api.get(`/event-spaces/${spaceId}`);
    return response.data;
  } catch (error) {
    console.error('Event space details error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch event space details');
  }
};