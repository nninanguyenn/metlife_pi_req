import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/metlife-logo.png';

const NewHeader: React.FC = () => {
  return (
    <header className="app-header">
      <h1>
        <img src={logo} alt="MetLife Logo" className="metlife-logo-header" /> MetLife
      </h1>
      <nav style={{ marginTop: '1rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap'
        }}>
          <Link 
            to="/" 
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              transition: 'background-color 0.3s ease',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Home
          </Link>
          <Link 
            to="/pi-request-v0" 
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              transition: 'background-color 0.3s ease',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            PI Request v0
          </Link>
          <Link 
            to="/pi-request-v1" 
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              transition: 'background-color 0.3s ease',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            PI Request v1
          </Link>
          <Link 
            to="/pi-request-v2" 
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              transition: 'background-color 0.3s ease',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            PI Request v2
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default NewHeader;
