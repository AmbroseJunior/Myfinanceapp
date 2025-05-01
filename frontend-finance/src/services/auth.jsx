import { api } from './api';

export const setSession = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    api.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
};

export const clearSession = () => {
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
};