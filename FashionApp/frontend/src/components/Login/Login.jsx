import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FlashMessage from '../FlashMsg/Flash'; 

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate();
  const [flashMessage, setFlashMessage] = useState(null);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Invalid username or password');
      }

      const data = await response.json();
      console.log('Server response:', data);
      setFlashMessage({ type: 'success', message: data.success[0] });

      navigate(data.redirectUrl);
    } catch (error) {
      console.error('Error during sign up:', error);
      setFlashMessage({ type: 'error', message: error.message });
    }
  };

  return (
    <div className='add-form-container'>
      <FlashMessage message={flashMessage?.message} type={flashMessage?.type} /> 
      <h1 className='offset-1 mb-3'>Login</h1>
      <form onSubmit={handleSubmit} noValidate className='add-form offset-1 needs-validation'>
        <div className="row">
          <label htmlFor="username" className='form-label'>Username:
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
            <div className="valid-feedback">Looks good!</div>
            <div className='invalid-feedback'>Please enter a username!</div>
          </label>
        </div>
        <div className="row">
          <label htmlFor="password" className='form-label'>Password:
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <div className="valid-feedback">Looks good!</div>
            <div className='invalid-feedback'>Please enter a password!</div>
          </label>
        </div>
        <div className='row'>
          <button type="submit" className="btn btn-primary mb-2">Login</button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
