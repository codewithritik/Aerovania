import React from 'react';

const Button = ({ children, className = '', ...props }) => (
  <button
    className={`btn-primary ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button; 