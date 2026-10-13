// Backend base URL for API requests.
// Set REACT_APP_API_URL in a .env file at the project root to override (see .env.example).
const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default API;
