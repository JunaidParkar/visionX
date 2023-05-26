import axios from 'axios';

export const api = axios.create({
  baseURL: 'your server api.com',
});

api.interceptors.request.use((config) => {
  config.headers['X-Origin'] = window.location.origin;
  return config;
});