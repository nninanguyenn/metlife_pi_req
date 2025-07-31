import React from 'react';

const Header: React.FC = () => {
  return (
    <header style={{
      backgroundColor: '#0066cc',
      color: 'white',
      padding: '1rem 2rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#00a651'
          }}>
            MetLife
          </div>
        </div>
        <nav>
          <ul style={{
            display: 'flex',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            gap: '2rem'
          }}>
            <li>
              <a href="#" style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.3s ease'
              }}>
                Home
              </a>
            </li>
            <li>
              <a href="#" style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.3s ease'
              }}>
                Products
              </a>
            </li>
            <li>
              <a href="#" style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.3s ease'
              }}>
                About
              </a>
            </li>
            <li>
              <a href="#" style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.3s ease'
              }}>
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
