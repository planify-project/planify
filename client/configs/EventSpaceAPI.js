import axios from 'axios';

// Update the base URL to match your backend route
const API_BASE = 'http://172.20.10.3:3000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const fetchEventSpaces = async (filters) => {
  try {
    // Update the endpoint to match your backend route
    const response = await api.get('/events/spaces', { params: filters });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch event spaces');
  }
};

// Update other endpoint paths as well
export const fetchAvailability = async (spaceId, date) => {
  try {
    const response = await api.get(`/events/spaces/${spaceId}/availability`, { 
      params: { date } 
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to check availability');
  }
};

export const bookEventSpace = async (bookingData) => {
  try {
    const response = await api.post('/events/spaces/book', bookingData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to book event space');
  }
};