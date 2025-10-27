// ErrorState.jsx
import React from 'react';

const ErrorState = ({ message }) => (
  <div className="flex h-screen bg-gray-100 items-center justify-center">
    <div className="text-xl text-red-600">{message}</div>
  </div>
);

export default ErrorState;