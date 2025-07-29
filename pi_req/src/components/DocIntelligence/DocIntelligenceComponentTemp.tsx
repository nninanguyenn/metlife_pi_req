import './DocIntelligence.css';
import React, { useRef, useState } from 'react';
import { analyzeIdDocument } from './azureDocIntelligence';


interface DocIntelligenceComponentTempProps {
  onExtractedFields: (fields: {
    firstName?: string;
    lastName?: string;
    address?: string;
    state?: string;
    dateOfBirth?: string;
  }) => void;
}

const DocIntelligenceComponentTemp: React.FC<DocIntelligenceComponentTempProps> = ({ onExtractedFields }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setLoading(true);
    try {
      const data = await analyzeIdDocument(file);
      // Extract only the required fields
        console.log('Analysis result:', data);
      if (data && data.documents && data.documents[0]) {
        const fields = data.documents[0].fields || {};
        const getVal = (f: any) => f && (f.valueString || f.valueDate || f.valueCountryRegion || f.value || '');
        // Format address from valueAddress if available
        let formattedAddress = '';
        if (fields.Address && fields.Address.valueAddress) {
          const va = fields.Address.valueAddress;
          // Combine streetAddress, city, state, postalCode
          formattedAddress = [va.streetAddress, va.city, va.state, va.postalCode]
            .filter(Boolean)
            .join(', ');
        } else {
          formattedAddress = getVal(fields.Address);
        }
        onExtractedFields({
          firstName: getVal(fields.FirstName),
          lastName: getVal(fields.LastName),
          address: formattedAddress,
          state: getVal(fields.Region) || getVal(fields.CountryRegion),
          dateOfBirth: getVal(fields.DateOfBirth)
        });
      }
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333', textAlign: 'center' }}>
        Quickly Prefill Your Info: Upload a Driver License or ID Document
      </h2>
      <input
        type="file"
        accept="image/*,application/pdf"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button
        className="doc-intel-btn"
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Upload Document'}
      </button>
      {error && <div className="doc-intel-error">{error}</div>}
    </div>
  );
};

export default DocIntelligenceComponentTemp;



