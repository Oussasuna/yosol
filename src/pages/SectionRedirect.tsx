
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Index from './Index';

const SectionRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const section = location.pathname.replace('/', '');
      const element = document.getElementById(section);
      
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [location]);
  
  return <Index />;
};

export default SectionRedirect;
