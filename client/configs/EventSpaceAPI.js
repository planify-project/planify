import axios from 'axios';
import { API_BASE } from '../config';

const api = axios.create({
  baseURL: API_BASE, // Remove the extra /api since it's already in API_BASE
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(request => {
  console.log('API Request:', {
    url: `${request.baseURL}${request.url}`,
    method: request.method,
    data: request.data
  });
  return request;
});

export const fetchEventSpaces = async () => {
  try {
    const response = await api.get('/event-spaces');
    console.log('Event spaces response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching event spaces:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};