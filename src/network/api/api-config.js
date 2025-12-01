import axios from "axios";

export const _getBaseURL = () => {
  const url_maybe = process.env.REACT_APP_SERVER_URL;

  if (url_maybe === "PROD") {
    // Get the protocol, hostname, and port from the window
    const { protocol, hostname, port } = window.location;

    let baseURL = `${protocol}//${hostname}`;

    // Append the port if it's not the default HTTP/HTTPS port
    if (port && port !== "80" && port !== "443") {
      baseURL += `:${port}`;
    }

    // console.log("baseURL",baseURL);

    if (port === "4173") {
      return "http://localhost:7980/";
    }

    // Append the API path
    baseURL;

    return baseURL;
  } else {
    return url_maybe;
  }
};

export const getBaseURL = () => {
  return `${_getBaseURL()}/v1`;
};

export const getSocketBaseURL = () => {
  return `${_getBaseURL()}`;
};

// Create an Axios instance
const serverInstance = axios.create({
  baseURL: getBaseURL(),
});

// Add a request interceptor to include the Bearer token
serverInstance.interceptors.request.use(
  (config) => {
    // Get the token from local storage or any other storage mechanism
    let token = null;
    
    // First try to get token from session
    const session = localStorage.getItem("session");
    if (session) {
      token = JSON.parse(session).token;
    } else {
      // If no session, try temp session for organization setup
      const tempSession = localStorage.getItem("tempUserSession");
      if (tempSession) {
        token = JSON.parse(tempSession).token;
      }
    }

    // If the token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log the outgoing request method and URL
    console.log(
      `Outgoing request: ${config.method?.toUpperCase()} ${config.baseURL}${
        config.url
      }`
    );

    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Response Interceptor ----
serverInstance.interceptors.response.use(
  (response) => response, // pass successful responses
  (error) => {
    if (error.response && error.response.status === 401) {
      const message = error.response.data?.message || '';
      
      // Only auto-logout if it's an expired/invalid token or no token provided
      const isTokenError = 
        message.includes('No token provided') ||
        message.includes('Invalid or expired session') ||
        message.includes('invalid token') ||
        message.includes('blacklisted') ||
        error.response.data?.valid === false;
      
      if (isTokenError) {
        console.warn("Session expired or invalid token. Redirecting to /login...");
        
        // Clear stored sessions
        localStorage.removeItem("session");
        localStorage.removeItem("organizationContext");
        localStorage.removeItem("tempUserSession");
        
        // Redirect to login page
        window.location.href = "/login";
      } else {
        // For permission-denied 401s, just log and let the calling function handle it
        console.warn(`Access denied to ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
      }
    }

    return Promise.reject(error);
  }
);

export default serverInstance;
