import axios from "axios";
import { API_PATHS, baseURL } from "../routes/APIRoutes";
// add api methods

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};
export const axiosApi = axios.create({
  baseURL: baseURL,
  headers: headers,
});

axiosApi.interceptors.request.use(
  (config) => {
    const options = { ...config };
    const accessToken = localStorage.getItem("access-token");

    options.headers.Accept = options.headers.Accept || "application/json";
    options.headers["Content-Type"] =
      options.headers["Content-Type"] || "application/json";

    if (accessToken) options.headers["Authorization"] = `Bearer ${accessToken}`;
    return options;
  },
  (error) => {
    console.log(error);
  }
);

axiosApi.interceptors.response.use(
  (response) => {
    if (response.status === 401) {
      localStorage.clear();
      window.location.href = baseURL + "login";
    }
    return response;
  },
  (error) => {
    if (error.response.status === 403 || error.response.status === 401) {
      const originalRequest = error.config;
      const refreshToken = localStorage.getItem("refresh-token");
      if (refreshToken) {
        return axios
          .post(
            API_PATHS.AUTH.refreshToken,
            {},
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          )
          .then((response) => {
            if (response.status === 200) {
              localStorage.setItem("access-token", response.data.accessToken);
              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${response.data.accessToken}`;
              return axiosApi(originalRequest);
            }
            localStorage.clear();
            window.location.href = baseURL + "/login";
          })
          .catch((error) => {
            if (error.response.status === 401) {
              console.log(error.response.data.message);
            }
            if (error.response.status === 403) {
              console.log(error.response.data.message);
            }
            localStorage.clear();
            return (window.location.href = "/login");
          });
      }
      // localStorage.clear();
      // return window.location.href=baseURL + "login";
    }
  }
);

const AuthAPIService = {
  // Google OAuth
  loginWithGoogle: () => {
    window.location.href = `${baseURL}/auth/google`;
  },

  // Facebook OAuth
  loginWithFacebook: () => {
    window.location.href = `${baseURL}/auth/facebook`;
  },

  // Microsoft OAuth
  loginWithMicrosoft: () => {
    window.location.href = `${baseURL}/auth/microsoft`;
  },

  // Callback after OAuth authentication
  handleAuthentication: () => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    if (code) {
      return axios
        .post(`${baseURL}/auth/callback`, { code })
        .then((response) => response.data);
    }
    return Promise.reject("Authentication failed");
  },
};

export default AuthAPIService;
