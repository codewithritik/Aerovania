import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg relative">
        <button className="absolute top-2 right-2" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
};

export default Modal; 