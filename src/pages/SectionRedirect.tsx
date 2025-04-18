
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
      } else {
        // If the section doesn't exist, navigate to the home page
        console.log(`Section ${section} not found, redirecting to home`);
        navigate('/');
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [location, navigate]);
  
  return <Index />;
};

export default SectionRedirect;
