import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../config';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add better error handling
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log('Making request to:', config.url);
      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

export const fetchEventSpaces = async () => {
  try {
    console.log('Fetching event spaces...');
    const response = await api.get('/event-spaces');
    console.log('Response:', response.data);
    if (!response.data) {
      throw new Error('No data received');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching event spaces:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error('Failed to fetch event spaces');
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