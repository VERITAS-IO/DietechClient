import React, { useEffect } from 'react';

const MockApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
  }, []);
  
  return <>{children}</>;
};

export default MockApiProvider; 