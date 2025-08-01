import axios from "axios";

export const getBaseURL = () => {
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
      return "http://localhost:8000/v1";
    }

    // Append the API path
    baseURL += "/api/v1";

    return baseURL;
  } else {
    return url_maybe + "/v1";
  }
};

// Create an Axios instance
const serverInstance = axios.create({
  baseURL: getBaseURL(),
});

// Add a request interceptor to include the Bearer token
serverInstance.interceptors.request.use(
  (config) => {
    // Get the token from local storage or any other storage mechanism
    const session = localStorage.getItem("session");
    const token = session ? JSON.parse(session).token : null;

    // If the token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    // Handle the error
    return Promise.reject(error);
  }
);

export default serverInstance;
