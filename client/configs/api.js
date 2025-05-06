// import axios from 'axios';

// const API_BASE_URL = 'http://10.0.2.2:3000/api'; // For Android emulator
// // const API_BASE_URL = 'http://localhost:3000/api'; // For iOS simulator

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 30000, // Increased timeout to 30 seconds
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add a request interceptor
// api.interceptors.request.use(
//   (config) => {
//     // You can add auth token here if needed
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Add a response interceptor
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     // If the error is due to timeout and we haven't retried yet
//     if (error.code === 'ECONNABORTED' && !originalRequest._retry) {
//       originalRequest._retry = true;
      
//       // Wait for 2 seconds before retrying
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       // Retry the request
//       return api(originalRequest);
//     }

//     if (error.code === 'ECONNREFUSED') {
//       console.error('Connection refused. Please check if the server is running.');
//     } else if (error.code === 'ETIMEDOUT') {
//       console.error('Request timed out. Please check your internet connection.');
//     } else if (error.response) {
//       // The request was made and the server responded with a status code
//       // that falls out of the range of 2xx
//       console.error('Server responded with error:', error.response.status);
//     } else if (error.request) {
//       // The request was made but no response was received
//       console.error('No response received:', error.request);
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       console.error('Error setting up request:', error.message);
//     }
//     return Promise.reject(error);
//   }
// );

// export default api; 
import axios from 'axios';
import { auth } from './config';

// Use the correct IP address for your development machine
const API_BASE_URL = 'http://192.168.43.149:3000/api'; // Update this with your machine's IP address

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
<<<<<<< HEAD
  async (config) => {
    // Get the current user's ID token
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
=======
  (config) => {
    // Add an Authorization token if available
    const token = localStorage.getItem('authToken'); // Replace with AsyncStorage for React Native
    if (token) {
>>>>>>> 1034aea1d1191c69209cb70d0303d66fbee3c70a
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Retry logic for timeout errors
    if (error.code === 'ECONNABORTED' && !originalRequest._retry) {
      originalRequest._retry = true;

      // Wait for 2 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Retry the request
      return api(originalRequest);
    }

    // Handle 401 Unauthorized errors (e.g., token expiration)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Refresh the token logic (if applicable)
      try {
        const refreshToken = localStorage.getItem('refreshToken'); // Replace with AsyncStorage for React Native
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          const newToken = response.data.token;

          // Save the new token
          localStorage.setItem('authToken', newToken); // Replace with AsyncStorage for React Native

          // Update the Authorization header and retry the original request
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        // Redirect to login or handle token expiration
      }
    }

    // Handle specific error codes
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. Please check if the server is running.');
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('Request timed out. Please check your internet connection.');
      throw new Error('Request timed out. Please check your internet connection.');
    } else if (error.response) {
<<<<<<< HEAD
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Server responded with error:', error.response.status);
      throw new Error(error.response.data?.message || 'An error occurred on the server');
=======
      console.error('Server responded with error:', error.response.status, error.response.data);
>>>>>>> 1034aea1d1191c69209cb70d0303d66fbee3c70a
    } else if (error.request) {
      console.error('No response received:', error.request);
      throw new Error('No response received from the server. Please try again.');
    } else {
      console.error('Error setting up request:', error.message);
      throw new Error('An error occurred while processing your request.');
    }
<<<<<<< HEAD
=======

    return Promise.reject(error);
>>>>>>> 1034aea1d1191c69209cb70d0303d66fbee3c70a
  }
);

export default api;