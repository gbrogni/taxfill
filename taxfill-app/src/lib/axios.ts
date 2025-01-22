import axios, { AxiosInstance } from 'axios';
import { env } from '@/env';

export const api: AxiosInstance = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
});