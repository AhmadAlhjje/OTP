import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://whatsapp-project-gamma.vercel.app ',
});

// تسجيل الدخول
export const login = async (emailOrName: string, password: string) => {
  const response = await apiClient.post('/auth/login', {
    email: emailOrName,
    password,
  });
  return response.data;
};

// التسجيل
export const register = async (
  username: string,
  email: string,
  phone_number: string,
  password: string
) => {
  const response = await apiClient.post('/auth/register', {
    username,
    email,
    phone_number,
    password,
  });
  return response.data;
};