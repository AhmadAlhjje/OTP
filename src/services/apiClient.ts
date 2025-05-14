import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://whatsapp-project-gamma.vercel.app',
  withCredentials: true,
});