export const baseURL = "http://localhost:3001/";

export const API_PATHS = {
  AUTH: {
    signup: baseURL + "auth/signup",
    login: baseURL + "auth/login",
    logout: baseURL + "auth/logout",
    refreshToken: baseURL + "auth/refresh-token",
  },
};
