
import React from 'react';
import { useAuth } from '../context/AuthContext';
import LoginForm from './LoginForm';
import '../styles/AuthPage.css';

const Login = () => {
  const { user, logout } = useAuth();

  return (
    <div className="login-container">
      {user ? (
        <div className="logged-in-message">
          <h2>Welcome, {user.name || user.email}!</h2>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <LoginForm />
      )}
    </div>
  );
};

export default Login;
