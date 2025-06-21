import {apiClient} from './apiClient'


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
  password: string
) => {
  console.log(username);
  console.log(email);
  console.log(password);
  const response = await apiClient.post('/auth/register', {
    username,
    email,
    password,
  });
  return response.data;
};