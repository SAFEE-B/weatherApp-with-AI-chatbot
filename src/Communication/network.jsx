import axios from 'axios';

// API Key is now read from environment variables
// Define the base URL - check if this endpoint is allowed by your subscription
const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast'; 
const getAll = (lat, lon) => {
    // Use the lat and lon arguments passed to the function
    // Read API key from environment variables
    const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
    // Return the promise chain
    return axios.get(`${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`) // Added units=metric as an example
        .then(response => {
            // Return the data for the .then() in App.jsx
            return response.data; 
        })
        .catch(error => {
            console.error('Error from Networks File: ', error.response || error.message); // Log more detailed error
            // Re-throw the error for the .catch() in App.jsx
            throw error; 
        });
};

export default getAll;