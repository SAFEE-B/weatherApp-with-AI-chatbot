// Login.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../firebase/firebase";

const Login=({ToggleSignUpLoginHandler,loginPassedHandler})=>{
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in!");
      
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input 
          type="email" 
          placeholder="Email" 
          onChange={e => setEmail(e.target.value)} 
          className="login-input"
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={e => setPassword(e.target.value)} 
          className="login-input"
        />
        <button type="submit" className="login-button">Log In</button>
      </form>
      <button onClick={ToggleSignUpLoginHandler} className="switch-button">Go To Sign Up</button>
    </div>
  );
}

export default Login
