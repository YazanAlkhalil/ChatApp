import React, { useContext, useState } from 'react';
import './Register.css';
import { Link, useNavigate } from 'react-router-dom';
import { TokenContext } from './TokenProvider';
const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {setToken} = useContext(TokenContext)
  const navigate = useNavigate();
  const handleLogin = async () => {
    const res = await fetch("http://localhost:3000/api/auth/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        username,
        password
      })
    })
    if(res.ok){
      const data = await res.json()
      setToken(data.token)
      navigate("/homepage")
    }
    else{
      alert("incorrect credentials")
    }
  };

  return (
    <div className="register-container">
      <h2>Login</h2>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={username}
          onChange={e=>setUsername(e.target.value)}
          placeholder="Enter your name"
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          placeholder="Enter your password"
        />
      </div>
      <button onClick={handleLogin}>Login</button>
      <p>
        don't have an account? <Link to="/">register</Link>
      </p>
    </div>
  );
};

export default Register;