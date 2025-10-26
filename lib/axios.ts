import axios from 'axios';
import { auth } from './firebase';

const axiosInstance = axios.create({
  baseURL: '/',
});

// Add request interceptor to include token
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;