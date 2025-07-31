import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NewHeader from './NewHeader';
import DocIntelligenceComponentTemp from './DocIntelligence/DocIntelligenceComponentTemp';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  address: string;
  state: string;
  email: string;
  dateOfBirth: string;
  ssn: string;
}

interface MfaInfo {
  mobileNumber: string;
  mfaCode: string;
  isCodeSent: boolean;
  isVerified: boolean;
  sessionId: string;
}

const PersonalInformationRequest: React.FC = () => {
  // API Configuration
  const API_BASE_URL = 'http://localhost:3001/api';

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    address: '',
    state: '',
    email: '',
    dateOfBirth: '',
    ssn: ''
  });

  const [mfaInfo, setMfaInfo] = useState<MfaInfo>({
    mobileNumber: '',
    mfaCode: '',
    isCodeSent: false,
    isVerified: false,
    sessionId: ''
  });

  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [requestType, setRequestType] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [isFormLocked, setIsFormLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming', 'District of Columbia', 'Puerto Rico', 'U.S. Virgin Islands',
    'American Samoa', 'Guam', 'Northern Mariana Islands'
  ];

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    if (!isFormLocked) {
      setPersonalInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleMfaChange = (field: keyof MfaInfo, value: string | boolean) => {
    setMfaInfo(prev => ({ ...prev, [field]: value }));
  };

  const sendMfaCode = async () => {
    if (!mfaInfo.mobileNumber || !captchaVerified) {
      setErrorMessage('Please verify you are human and enter a mobile number.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/pi-request/request-mfa-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalInfo,
          mobileNumber: mfaInfo.mobileNumber,
          captchaVerified: true
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMfaInfo(prev => ({ 
          ...prev, 
          isCodeSent: true,
          sessionId: data.data.sessionId 
        }));
        setIsFormLocked(true);
        setErrorMessage('');
        alert(`MFA code sent to ${data.data.phoneNumber}! Check the console for the code in development.`);
      } else {
        setErrorMessage(data.message || 'Failed to send MFA code. Please try again.');
      }
    } catch (error) {
      console.error('Error sending MFA code:', error);
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyMfaCode = async () => {
    if (!mfaInfo.mfaCode || mfaInfo.mfaCode.length !== 6) {
      setErrorMessage('Please enter a 6-digit MFA code.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/pi-request/verify-mfa-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobileNumber: mfaInfo.mobileNumber,
          mfaCode: mfaInfo.mfaCode,
          sessionId: mfaInfo.sessionId
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMfaInfo(prev => ({ ...prev, isVerified: true }));
        setErrorMessage('');
        alert('MFA verification successful!');
      } else {
        setErrorMessage(data.message || 'Invalid MFA code. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying MFA code:', error);
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mfaInfo.isVerified) {
      setErrorMessage('Please complete MFA verification first.');
      return;
    }
    
    if (!requestType || !deliveryMethod) {
      setErrorMessage('Please complete all sections before submitting.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/pi-request/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalInfo,
          mobileNumber: mfaInfo.mobileNumber,
          requestType,
          deliveryMethod,
          sessionId: mfaInfo.sessionId
        }),
      });

      const data = await response.json();

      if (data.success) {
        setErrorMessage('');
        alert(`Personal Information Request submitted successfully!\n\nRequest ID: ${data.data.requestId}\nStatus: ${data.data.status}\nEstimated Processing Time: ${data.data.estimatedProcessingTime}`);
        
        // Reset form
        setPersonalInfo({
          firstName: '',
          lastName: '',
          address: '',
          state: '',
          email: '',
          dateOfBirth: '',
          ssn: ''
        });
        setMfaInfo({
          mobileNumber: '',
          mfaCode: '',
          isCodeSent: false,
          isVerified: false,
          sessionId: ''
        });
        setCaptchaVerified(false);
        setRequestType('');
        setDeliveryMethod('');
        setIsFormLocked(false);
      } else {
        setErrorMessage(data.message || 'Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for DocIntelligence extracted fields
  const handleDocIntelligenceFields = (fields: {
    firstName?: string;
    lastName?: string;
    address?: string;
    state?: string;
    dateOfBirth?: string;
  }) => {
    setPersonalInfo(prev => ({
      ...prev,
      firstName: fields.firstName || prev.firstName,
      lastName: fields.lastName || prev.lastName,
      address: fields.address || prev.address,
      state: fields.state || prev.state,
      dateOfBirth: fields.dateOfBirth || prev.dateOfBirth
    }));
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    backgroundColor: isFormLocked ? '#f5f5f5' : 'white',
    color: isFormLocked ? '#666' : '#333'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#333'
  };

  const sectionStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <NewHeader />
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/" style={{ 
            color: '#0066cc', 
            textDecoration: 'none',
            fontSize: '1rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ← Back to Home
          </Link>
        </div>
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '1rem', 
          color: '#333',
          textAlign: 'center'
        }}>
          Personal Information Request
        </h1>
        <p style={{ 
          textAlign: 'center', 
          marginBottom: '2rem', 
          color: '#666',
          fontSize: '1.1rem',
          lineHeight: '1.6'
        }}>
          Request a report of all Personal Information retained by MetLife. This service is available to current and previous MetLife customers.
        </p>
        {/* DocIntelligenceComponent for document upload and autofill */}
        <div style={{ marginBottom: '2rem' }}>
          <DocIntelligenceComponentTemp onExtractedFields={handleDocIntelligenceFields} />
        </div>
        {/* Error Message Display */}
        {errorMessage && (
          <div style={{
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '5px',
            padding: '1rem',
            marginBottom: '2rem',
            color: '#c33',
            textAlign: 'center'
          }}>
            {errorMessage}
          </div>
        )}
        {/* Development Notice */}
        <div style={{
          backgroundColor: '#e3f2fd',
          border: '1px solid #2196f3',
          borderRadius: '5px',
          padding: '1rem',
          marginBottom: '2rem',
          color: '#1565c0',
          textAlign: 'center',
          fontSize: '0.9rem'
        }}>
          <strong>Development Mode:</strong> Check the browser console for MFA codes when testing.
        </div>
        <form onSubmit={handleSubmit}>
          {/* Section 1: Personal Information */}
          <div style={sectionStyle}>
            <h2 style={{ marginBottom: '1.5rem', color: '#0066cc' }}>
              Section 1: Personal Information
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>First Name *</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={personalInfo.firstName}
                  onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                  disabled={isFormLocked}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Last Name *</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={personalInfo.lastName}
                  onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                  disabled={isFormLocked}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Address on File *</label>
              <input
                type="text"
                style={inputStyle}
                placeholder="Address associated with your policy"
                value={personalInfo.address}
                onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                disabled={isFormLocked}
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Current US State or Territory of Residence *</label>
              <select
                style={inputStyle}
                value={personalInfo.state}
                onChange={(e) => handlePersonalInfoChange('state', e.target.value)}
                disabled={isFormLocked}
                required
              >
                <option value="">Select your state/territory</option>
                {usStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Email Address *</label>
              <input
                type="email"
                style={inputStyle}
                value={personalInfo.email}
                onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                disabled={isFormLocked}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Date of Birth *</label>
                <input
                  type="date"
                  style={inputStyle}
                  value={personalInfo.dateOfBirth}
                  onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
                  disabled={isFormLocked}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Social Security Number *</label>
                <input
                  type="password"
                  style={inputStyle}
                  placeholder="XXX-XX-XXXX"
                  value={personalInfo.ssn}
                  onChange={(e) => handlePersonalInfoChange('ssn', e.target.value)}
                  disabled={isFormLocked}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Human Check and MFA */}
          <div style={sectionStyle}>
            <h2 style={{ marginBottom: '1.5rem', color: '#0066cc' }}>
              Verification
            </h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={captchaVerified}
                  onChange={(e) => setCaptchaVerified(e.target.checked)}
                  style={{ width: 'auto' }}
                />
                I am not a robot (Human verification) *
              </label>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Mobile Number for MFA *</label>
              <input
                type="tel"
                style={inputStyle}
                placeholder="(555) 123-4567"
                value={mfaInfo.mobileNumber}
                onChange={(e) => handleMfaChange('mobileNumber', e.target.value)}
                required
              />
            </div>

            {!mfaInfo.isCodeSent ? (
              <button
                type="button"
                onClick={sendMfaCode}
                disabled={!captchaVerified || !mfaInfo.mobileNumber || isLoading}
                style={{
                  backgroundColor: (!captchaVerified || !mfaInfo.mobileNumber || isLoading) ? '#ccc' : '#0066cc',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '5px',
                  fontSize: '1rem',
                  cursor: (!captchaVerified || !mfaInfo.mobileNumber || isLoading) ? 'not-allowed' : 'pointer',
                  marginBottom: '1rem'
                }}
              >
                {isLoading ? 'Sending...' : 'Send MFA Code'}
              </button>
            ) : (
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle}>Enter MFA Code *</label>
                  <input
                    type="text"
                    style={inputStyle}
                    placeholder="Enter 6-digit code"
                    value={mfaInfo.mfaCode}
                    onChange={(e) => handleMfaChange('mfaCode', e.target.value)}
                    maxLength={6}
                  />
                </div>
                <button
                  type="button"
                  onClick={verifyMfaCode}
                  disabled={mfaInfo.mfaCode.length !== 6 || isLoading}
                  style={{
                    backgroundColor: (mfaInfo.mfaCode.length !== 6 || isLoading) ? '#ccc' : '#00a651',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '5px',
                    fontSize: '1rem',
                    cursor: (mfaInfo.mfaCode.length !== 6 || isLoading) ? 'not-allowed' : 'pointer',
                    marginBottom: '1rem'
                  }}
                >
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </button>
                {mfaInfo.isVerified && (
                  <div style={{ color: '#00a651', fontWeight: '600', marginTop: '0.5rem' }}>
                    ✓ MFA Verification Successful
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 3: Request Details */}
          <div style={sectionStyle}>
            <h2 style={{ marginBottom: '1.5rem', color: '#0066cc' }}>
              Request Details
            </h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>What would you like to do? *</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'normal' }}>
                  <input
                    type="radio"
                    name="requestType"
                    value="report"
                    checked={requestType === 'report'}
                    onChange={(e) => setRequestType(e.target.value)}
                    style={{ width: 'auto' }}
                  />
                  Receive a report of all personal information collected about me
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'normal' }}>
                  <input
                    type="radio"
                    name="requestType"
                    value="delete"
                    checked={requestType === 'delete'}
                    onChange={(e) => setRequestType(e.target.value)}
                    style={{ width: 'auto' }}
                  />
                  Delete all personal information collected about me (if allowed by MetLife retention policy)
                </label>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>How would you like to receive your report? *</label>
              <select
                style={inputStyle}
                value={deliveryMethod}
                onChange={(e) => setDeliveryMethod(e.target.value)}
                required
              >
                <option value="">Select delivery method</option>
                <option value="email">Email (PDF)</option>
                <option value="mail">US Mail (Hard Copy)</option>
                <option value="secure-portal">Secure Online Portal</option>
              </select>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              type="submit"
              disabled={!mfaInfo.isVerified || isLoading}
              style={{
                backgroundColor: (!mfaInfo.isVerified || isLoading) ? '#ccc' : '#00a651',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '5px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: (!mfaInfo.isVerified || isLoading) ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Submitting...' : 'Submit Personal Information Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInformationRequest;
