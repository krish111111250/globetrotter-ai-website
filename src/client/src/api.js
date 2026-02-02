import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000',
});

export const loginUser = (credentials) => API.post('/login', credentials);
export const registerUser = (userData) => API.post('/register', userData);
export const updateUser = (id, userData) => API.put(`/users/${id}`, userData);
export const fetchTrips = (userId) => API.get(`/trips/${userId}`);
export const createTrip = (tripData) => API.post('/trips', tripData);
export const chatWithAI = (message) => API.post('/chat', { message });

export const fetchExpenses = (tripId) => API.get(`/expenses/${tripId}`);
export const addExpense = (expenseData) => API.post('/expenses', expenseData);

export const fetchPosts = () => API.get('/posts');
export const createPost = (postData) => API.post('/posts', postData);

export const fetchActivities = (search) => API.get(`/activities?search=${search || ''}`);
export const fetchDestinations = (search) => API.get(`/destinations?search=${search || ''}`);

export const fetchChecklist = (userId) => API.get(`/checklist/${userId}`);
export const addChecklistItem = (itemData) => API.post('/checklist', itemData);
export const toggleChecklistItem = (id, completed) => API.put(`/checklist/${id}`, { completed });
export const deleteChecklistItem = (id) => API.delete(`/checklist/${id}`);

export const fetchItineraryStops = (tripId) => API.get(`/itinerary/${tripId}`);
export const addItineraryStop = (stopData) => API.post('/itinerary', stopData);
export const updateItineraryStop = (id, stopData) => API.put(`/itinerary/${id}`, stopData);
export const deleteItineraryStop = (id) => API.delete(`/itinerary/${id}`);

export const fetchWeather = (city) => API.get(`/weather?city=${city}`);
export const fetchAdminStats = () => API.get('/admin/stats');

export default API;