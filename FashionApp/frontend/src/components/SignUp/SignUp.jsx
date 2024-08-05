import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Server response:', data);
      navigate("/list");
    } catch (error) {
      console.error('Error during sign up:', error);
    }
  };

  return (
    <div className='add-form-container'>
      <h1 className='offset-1 mb-3'>Sign Up</h1>
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
          <label htmlFor="email" className='form-label'>Email:
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <div className="valid-feedback">Looks good!</div>
            <div className='invalid-feedback'>Please enter a valid email!</div>
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
          <button type="submit" className="btn btn-primary mb-2">Sign Up</button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
