// add api methods
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Replace with your backend server URL

const AuthAPIService = {
  // Google OAuth
  loginWithGoogle: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },

  // Facebook OAuth
  loginWithFacebook: () => {
    window.location.href = `${API_BASE_URL}/auth/facebook`;
  },

  // Microsoft OAuth
  loginWithMicrosoft: () => {
    window.location.href = `${API_BASE_URL}/auth/microsoft`;
  },

  // Callback after OAuth authentication
  handleAuthentication: () => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');
    if (code) {
      return axios.post(`${API_BASE_URL}/auth/callback`, { code })
        .then(response => response.data);
    }
    return Promise.reject('Authentication failed');
  },
};

export default AuthAPIService;
