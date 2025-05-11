import React, { useEffect } from 'react';

const MockApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    console.log('⚠️ Mock API Provider is active');
  }, []);
  
  return <>{children}</>;
};

export default MockApiProvider; 