import axios from 'axios';

const api = axios.create({
    baseURL: 'api url',
});

export default api;
