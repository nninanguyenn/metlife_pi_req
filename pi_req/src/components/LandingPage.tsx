import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const LandingPage: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <Header />
      
      {/* Hero Section */}
      <section style={{
        backgroundColor: '#0066cc',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            Protecting What Matters Most
          </h1>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '2rem',
            opacity: 0.9,
            lineHeight: '1.6'
          }}>
            For over 150 years, MetLife has been helping people secure their financial future 
            with comprehensive life insurance, employee benefits, and retirement solutions.
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>

            <Link 
              to="/personal-information-request"
              style={{
                backgroundColor: '#ff6b35',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '5px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Personal Information Request
            </Link>
            <Link 
              to="/pi-request-v2"
              style={{
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '5px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Personal Information Request (Wizard)
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: '4rem 2rem',
        backgroundColor: 'white'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '2.5rem',
            marginBottom: '3rem',
            color: '#333'
          }}>
            Why Choose MetLife?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#0066cc',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                color: 'white'
              }}>
                🛡️
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '1rem',
                color: '#333'
              }}>
                Trusted Protection
              </h3>
              <p style={{
                color: '#666',
                lineHeight: '1.6'
              }}>
                Over 150 years of experience protecting families and businesses worldwide.
              </p>
            </div>
            
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#00a651',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                color: 'white'
              }}>
                💼
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '1rem',
                color: '#333'
              }}>
                Comprehensive Solutions
              </h3>
              <p style={{
                color: '#666',
                lineHeight: '1.6'
              }}>
                Life insurance, employee benefits, and retirement planning all in one place.
              </p>
            </div>
            
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#0066cc',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                color: 'white'
              }}>
                🤝
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '1rem',
                color: '#333'
              }}>
                Customer Support
              </h3>
              <p style={{
                color: '#666',
                lineHeight: '1.6'
              }}>
                24/7 customer service and dedicated support when you need it most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#333',
        color: 'white',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            marginBottom: '1rem',
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link 
              to="/personal-information-request"
              style={{
                color: '#00a651',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}
            >
              Request Your Personal Information Report
            </Link>
            <Link 
              to="/pi-request-v2"
              style={{
                color: '#8b5cf6',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}
            >
              Try Our New Wizard Experience
            </Link>
          </div>
          <p style={{
            margin: 0,
            opacity: 0.8
          }}>
            © 2025 MetLife, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
