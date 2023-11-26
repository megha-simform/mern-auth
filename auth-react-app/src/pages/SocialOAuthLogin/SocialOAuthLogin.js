import React from 'react';
import AuthService from '../services/AuthService';

const Login = () => {
  const handleGoogleLogin = () => {
    AuthService.loginWithGoogle();
  };

  const handleFacebookLogin = () => {
    AuthService.loginWithFacebook();
  };

  const handleMicrosoftLogin = () => {
    AuthService.loginWithMicrosoft();
  };

  return (
    <div>
      <button onClick={handleGoogleLogin}>Login with Google</button>
      <button onClick={handleFacebookLogin}>Login with Facebook</button>
      <button onClick={handleMicrosoftLogin}>Login with Microsoft</button>
    </div>
  );
};

export default Login;
