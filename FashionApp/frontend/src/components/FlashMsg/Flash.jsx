import React from 'react';

const FlashMessage = ({ message, type }) => {
  if (!message) return null;

  return (
    <div className={`alert alert-danger alert-${type} alert-dismissible fade show col-6 offset-3`} role="alert">
      <h4>{message}</h4>
      <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close">
      </button>
    </div>
  );
};

export default FlashMessage;
