import { API_BASE } from '../configs/url';
import axios from 'axios';

export const totalUsers = async () => {
  const response = await axios.get(`${API_BASE}/users/totalusers`);
  return response.data.usersCount;
}


