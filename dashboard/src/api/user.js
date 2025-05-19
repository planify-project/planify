import { API_BASE } from '../configs/url';
import axios from 'axios';

export const fetchUserStats = async () => {
            try {
                const res = await axios.get(`${API_BASE}/users/traffic/monthly`);
                return res.data;
            } catch (error) {
                console.error("Error fetching user stats:", error);
                throw error;
            }
        };


