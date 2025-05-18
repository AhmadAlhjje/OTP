import axios from 'axios';
import Cookies from 'js-cookie';


export const apiClient = axios.create({
  baseURL: 'https://whatsapp-project-gamma.vercel.app',
  withCredentials: true,
});


// src/services/token-service.ts
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const saveTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 7 });
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 30 });
};

export const getAccessToken = () => {
  return Cookies.get(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = () => {
  return Cookies.get(REFRESH_TOKEN_KEY);
};

export const clearTokens = () => {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
};




// استخراج الـ ID من الـ JWT (Token)
export const extractUserIdFromToken = (): string | null => {
  const token = Cookies.get('access_token'); 
  if (!token) return null;

  try {
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload.sub || null; // sub يحتوي على user ID
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};