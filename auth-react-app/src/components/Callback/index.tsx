// frontend/src/components/Callback.js
import React, { useEffect } from 'react';
import AuthService from '../../apis/auth';

const Callback = () => {
  useEffect(() => {
    AuthService.handleAuthentication()
      .then(userData => {
        // Handle successful authentication (e.g., update state, set user in context)
        console.log('Authenticated user:', userData);
      })
      .catch(error => {
        // Handle authentication failure
        console.error('Authentication failed:', error);
      });
  }, []);

  return (
    <div>
      <p>Processing authentication...</p>
    </div>
  );
};

export default Callback;
