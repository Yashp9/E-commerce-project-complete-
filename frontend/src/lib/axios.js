
import axios from 'axios';

// Creating a pre-configured Axios instance
const axiosInstance = axios.create({
    // Setting the base URL dynamically based on the environment mode
    // If in development mode, use the local server URL
    // If in production mode, use the relative API endpoint
    baseURL: import.meta.mode === 'development' 
        ? 'http://localhost:5000/api' 
        : '/api',

    // Enabling credentials to send cookies or other authentication data with requests
    withCredentials: true, 
});

export default axiosInstance;
