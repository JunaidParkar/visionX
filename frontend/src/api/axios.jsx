import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://visionx-b9zs.onrender.com',
});

api.interceptors.request.use((config) => {
  config.headers['X-Origin'] = window.location.origin;
  return config;
});