
import './App.css';
import React, { useRef, useState } from 'react';
import { analyzeIdDocument } from './azureDocIntelligence';


function App() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult(null);
    setError(null);
    setLoading(true);
    try {
      const data = await analyzeIdDocument(file);
      setResult(data);
      console.log('Azure Document Intelligence result:', data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2>Azure Document Intelligence Demo</h2>
      <input
        type="file"
        accept="image/*,application/pdf"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        style={{ fontSize: '1.2rem', padding: '0.5rem 1.5rem', marginBottom: '1rem' }}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Upload Document'}
      </button>
      {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
      {result && result.documents && result.documents[0] && (
        <div style={{
          marginTop: '2rem',
          textAlign: 'left',
          maxWidth: 600,
          marginInline: 'auto',
          fontSize: '1rem',
          background: '#222',
          color: '#fff',
          padding: 20,
          borderRadius: 10,
          boxShadow: '0 2px 12px rgba(0,0,0,0.12)'
        }}>
          <h3 style={{ color: '#ffd700', marginBottom: 18 }}>Extracted Driver License Info</h3>
          {(() => {
            const doc = result.documents[0];
            const fields = doc.fields || {};
            const getVal = (f: any, fallback = '') => f && (f.valueString || f.valueDate || f.valueCountryRegion || f.valueNumber || f.valueInteger || f.valuePhoneNumber || f.valueTime || f.valueGender || f.value || fallback);
            return (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: 8 }}><b style={{ color: '#90cdf4' }}>Name:</b> <span style={{ color: '#fff' }}>{getVal(fields.FirstName)} {getVal(fields.LastName)}</span></li>
                <li style={{ marginBottom: 8 }}><b style={{ color: '#90cdf4' }}>Date of Birth:</b> <span style={{ color: '#fff' }}>{getVal(fields.DateOfBirth)}</span></li>
                <li style={{ marginBottom: 8 }}><b style={{ color: '#90cdf4' }}>License Number:</b> <span style={{ color: '#fff' }}>{getVal(fields.DocumentNumber)}</span></li>
                <li style={{ marginBottom: 8 }}><b style={{ color: '#90cdf4' }}>Eye Color:</b> <span style={{ color: '#fff' }}>{getVal(fields.EyeColor)}</span></li>
                <li style={{ marginBottom: 8 }}><b style={{ color: '#90cdf4' }}>Sex:</b> <span style={{ color: '#fff' }}>{getVal(fields.Sex)}</span></li>
                <li style={{ marginBottom: 8 }}><b style={{ color: '#90cdf4' }}>Height:</b> <span style={{ color: '#fff' }}>{getVal(fields.Height)}</span></li>
                <li style={{ marginBottom: 8 }}><b style={{ color: '#90cdf4' }}>Expiration Date:</b> <span style={{ color: '#fff' }}>{getVal(fields.DateOfExpiration)}</span></li>
                <li style={{ marginBottom: 8 }}><b style={{ color: '#90cdf4' }}>State:</b> <span style={{ color: '#fff' }}>{getVal(fields.Region) || getVal(fields.CountryRegion)}</span></li>
                <li style={{ marginBottom: 8 }}><b style={{ color: '#90cdf4' }}>Address:</b> <span style={{ color: '#fff' }}>{getVal(fields.Address)}</span></li>
              </ul>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default App;
