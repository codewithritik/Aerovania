import React from 'react';

const Input = React.forwardRef(({ className = '', ...props }, ref) => (
  <input
    ref={ref}
    className={`input-field ${className}`}
    {...props}
  />
));

export default Input; 