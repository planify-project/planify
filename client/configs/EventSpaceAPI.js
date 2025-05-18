import axios from 'axios';
import { API_BASE } from '../config';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const fetchEventSpaces = async () => {
  try {
    console.log('Fetching event spaces...');
    const response = await api.get('/event-spaces');
    console.log('Event spaces response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching event spaces:', error);
    throw error;
  }
};