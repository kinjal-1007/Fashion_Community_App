import React from 'react';
import { useNavigate } from 'react-router-dom';
// import './Error.css';

const Error = ({ message }) => {
  const navigate = useNavigate();

  return (
    <div className="alert alert-warning" role="alert">
      <h1 className='alert-heading'>Error</h1>
      <p>{message}</p>
      <button className="btn btn-danger" onClick={() => navigate('/list')}>Go to Home</button>
    </div>
  );
};

export default Error;
