
import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8000',
});

export const loginUser = (credentials) => API.post('/login', credentials);
export const fetchTrips = () => API.get('/trips');

export default API;