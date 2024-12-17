import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost/financeapp/Myfinanceapp/Backend-finance',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});
