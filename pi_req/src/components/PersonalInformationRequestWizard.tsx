import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { piRequestAPI, type PersonalInfo } from '../utils/piRequestAPI';

interface WizardStep {
  id: number;
  title: string;
  description: string;
  component: React.ReactNode;
}

interface MfaInfo {
  mobileNumber: string;
  mfaCode: string;
  isCodeSent: boolean;
  isVerified: boolean;
  sessionId: string;
}

const PersonalInformationRequestWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  // Style definitions
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    padding: '3rem',
    margin: '2rem auto',
    maxWidth: '800px',
    position: 'relative',
    overflow: 'hidden'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    backgroundColor: '#ffffff',
    outline: 'none'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.75rem',
    fontWeight: '600',
    color: '#374151',
    fontSize: '1rem'
  };

  const buttonPrimaryStyle: React.CSSProperties = {
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.4)'
  };

  const buttonSecondaryStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    color: '#667eea',
    border: '2px solid #667eea',
    padding: '1rem 2rem',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const progressBarStyle: React.CSSProperties = {
    width: '100%',
    height: '8px',
    backgroundColor: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '2rem'
  };

  const progressFillStyle: React.CSSProperties = {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: '4px',
    transition: 'width 0.5s ease',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
  };

  // Validation functions
  const validateStep1 = () => {
    return personalInfo.firstName && personalInfo.lastName && personalInfo.address && 
           personalInfo.state && personalInfo.email && personalInfo.dateOfBirth && personalInfo.ssn;
  };

  const validateStep2 = () => {
    return captchaVerified && mfaInfo.mobileNumber && mfaInfo.isVerified;
  };

  const validateStep3 = () => {
    return requestType && deliveryMethod;
  };

  // API functions
  const sendMfaCode = async () => {
    if (!mfaInfo.mobileNumber || !captchaVerified) {
      setErrorMessage('Please verify you are human and enter a mobile number.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await piRequestAPI.requestMfaCode(personalInfo, mfaInfo.mobileNumber);

      if (data.success) {
        setMfaInfo(prev => ({ 
          ...prev, 
          isCodeSent: true,
          sessionId: data.data?.sessionId || ''
        }));
        setSuccessMessage(`MFA code sent to ${data.data?.phoneNumber}! Check the console for the code in development.`);
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
      const data = await piRequestAPI.verifyMfaCode(mfaInfo.mobileNumber, mfaInfo.mfaCode, mfaInfo.sessionId);

      if (data.success) {
        setMfaInfo(prev => ({ ...prev, isVerified: true }));
        setSuccessMessage('MFA verification successful!');
        setTimeout(() => {
          setCurrentStep(3);
          setSuccessMessage('');
        }, 1500);
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

  const submitRequest = async () => {
    if (!validateStep3()) {
      setErrorMessage('Please complete all fields before submitting.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await piRequestAPI.submitRequest(
        personalInfo, 
        mfaInfo.mobileNumber, 
        requestType, 
        deliveryMethod, 
        mfaInfo.sessionId
      );

      if (data.success) {
        setSuccessMessage(`Request submitted successfully! Request ID: ${data.data?.requestId}`);
        setCurrentStep(4);
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

  // Step components
  const Step1PersonalInfo = () => (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
          Personal Information
        </h2>
        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
          Please provide your personal details as they appear on your MetLife policy
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={labelStyle}>First Name *</label>
          <input
            type="text"
            style={inputStyle}
            value={personalInfo.firstName}
            onChange={(e) => setPersonalInfo(prev => ({ ...prev, firstName: e.target.value }))}
            placeholder="Enter your first name"
            required
          />
        </div>
        <div>
          <label style={labelStyle}>Last Name *</label>
          <input
            type="text"
            style={inputStyle}
            value={personalInfo.lastName}
            onChange={(e) => setPersonalInfo(prev => ({ ...prev, lastName: e.target.value }))}
            placeholder="Enter your last name"
            required
          />
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={labelStyle}>Address on File *</label>
        <input
          type="text"
          style={inputStyle}
          placeholder="Address associated with your policy"
          value={personalInfo.address}
          onChange={(e) => setPersonalInfo(prev => ({ ...prev, address: e.target.value }))}
          required
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={labelStyle}>Current US State or Territory *</label>
        <select
          style={inputStyle}
          value={personalInfo.state}
          onChange={(e) => setPersonalInfo(prev => ({ ...prev, state: e.target.value }))}
          required
        >
          <option value="">Select your state/territory</option>
          {usStates.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={labelStyle}>Email Address *</label>
        <input
          type="email"
          style={inputStyle}
          value={personalInfo.email}
          onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
          placeholder="your.email@example.com"
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div>
          <label style={labelStyle}>Date of Birth *</label>
          <input
            type="date"
            style={inputStyle}
            value={personalInfo.dateOfBirth}
            onChange={(e) => setPersonalInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
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
            onChange={(e) => setPersonalInfo(prev => ({ ...prev, ssn: e.target.value }))}
            required
          />
        </div>
      </div>
    </div>
  );

  const Step2Verification = () => (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
          Identity Verification
        </h2>
        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
          Verify your identity to secure your personal information request
        </p>
      </div>

      <div style={{ 
        backgroundColor: '#f0f9ff',
        border: '2px solid #0ea5e9',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={captchaVerified}
              onChange={(e) => setCaptchaVerified(e.target.checked)}
              style={{ 
                width: '20px', 
                height: '20px',
                accentColor: '#667eea'
              }}
            />
            <span style={{ fontSize: '1.1rem' }}>I am not a robot (Human verification) *</span>
          </label>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Mobile Number for Verification *</label>
          <input
            type="tel"
            style={inputStyle}
            placeholder="(555) 123-4567"
            value={mfaInfo.mobileNumber}
            onChange={(e) => setMfaInfo(prev => ({ ...prev, mobileNumber: e.target.value }))}
            required
          />
        </div>

        {!mfaInfo.isCodeSent ? (
          <button
            type="button"
            onClick={sendMfaCode}
            disabled={!captchaVerified || !mfaInfo.mobileNumber || isLoading}
            style={{
              ...buttonPrimaryStyle,
              backgroundColor: (!captchaVerified || !mfaInfo.mobileNumber || isLoading) ? '#94a3b8' : '#667eea',
              cursor: (!captchaVerified || !mfaInfo.mobileNumber || isLoading) ? 'not-allowed' : 'pointer',
              width: '100%'
            }}
          >
            {isLoading ? 'Sending Code...' : 'Send Verification Code'}
          </button>
        ) : (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Enter Verification Code *</label>
              <input
                type="text"
                style={inputStyle}
                placeholder="Enter 6-digit code"
                value={mfaInfo.mfaCode}
                onChange={(e) => setMfaInfo(prev => ({ ...prev, mfaCode: e.target.value }))}
                maxLength={6}
              />
            </div>
            <button
              type="button"
              onClick={verifyMfaCode}
              disabled={mfaInfo.mfaCode.length !== 6 || isLoading}
              style={{
                ...buttonPrimaryStyle,
                backgroundColor: (mfaInfo.mfaCode.length !== 6 || isLoading) ? '#94a3b8' : '#10b981',
                cursor: (mfaInfo.mfaCode.length !== 6 || isLoading) ? 'not-allowed' : 'pointer',
                width: '100%'
              }}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
            
            {mfaInfo.isVerified && (
              <div style={{ 
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: '#d1fae5',
                border: '2px solid #10b981',
                borderRadius: '12px',
                color: '#065f46',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                ✓ Verification Successful! Proceeding to next step...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const Step3RequestDetails = () => (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
          Request Details
        </h2>
        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
          Choose what you'd like to do with your personal information
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label style={labelStyle}>What would you like to do? *</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            padding: '1.5rem',
            border: `2px solid ${requestType === 'report' ? '#667eea' : '#e2e8f0'}`,
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backgroundColor: requestType === 'report' ? '#f0f4ff' : 'white'
          }}>
            <input
              type="radio"
              name="requestType"
              value="report"
              checked={requestType === 'report'}
              onChange={(e) => setRequestType(e.target.value)}
              style={{ 
                width: '20px', 
                height: '20px',
                accentColor: '#667eea'
              }}
            />
            <div>
              <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                📊 Receive a Personal Information Report
              </div>
              <div style={{ color: '#6b7280' }}>
                Get a comprehensive report of all personal information we have collected about you
              </div>
            </div>
          </label>
          
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            padding: '1.5rem',
            border: `2px solid ${requestType === 'delete' ? '#667eea' : '#e2e8f0'}`,
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backgroundColor: requestType === 'delete' ? '#f0f4ff' : 'white'
          }}>
            <input
              type="radio"
              name="requestType"
              value="delete"
              checked={requestType === 'delete'}
              onChange={(e) => setRequestType(e.target.value)}
              style={{ 
                width: '20px', 
                height: '20px',
                accentColor: '#667eea'
              }}
            />
            <div>
              <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                🗑️ Delete Personal Information
              </div>
              <div style={{ color: '#6b7280' }}>
                Request deletion of personal information (subject to MetLife retention policies)
              </div>
            </div>
          </label>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label style={labelStyle}>How would you like to receive your report? *</label>
        <select
          style={inputStyle}
          value={deliveryMethod}
          onChange={(e) => setDeliveryMethod(e.target.value)}
          required
        >
          <option value="">Select delivery method</option>
          <option value="email">📧 Email (PDF)</option>
          <option value="mail">📮 US Mail (Hard Copy)</option>
          <option value="secure-portal">🔒 Secure Online Portal</option>
        </select>
      </div>
    </div>
  );

  const Step4Confirmation = () => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ 
        width: '80px', 
        height: '80px', 
        backgroundColor: '#10b981', 
        borderRadius: '50%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        margin: '0 auto 2rem',
        fontSize: '2.5rem'
      }}>
        ✓
      </div>
      
      <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem' }}>
        Request Submitted Successfully!
      </h2>
      
      <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '2rem' }}>
        Your personal information request has been submitted and is being processed.
      </p>

      <div style={{ 
        backgroundColor: '#f0f9ff',
        border: '2px solid #0ea5e9',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
        textAlign: 'left'
      }}>
        <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Request Summary:</h3>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <div><strong>Name:</strong> {personalInfo.firstName} {personalInfo.lastName}</div>
          <div><strong>Email:</strong> {personalInfo.email}</div>
          <div><strong>Request Type:</strong> {requestType === 'report' ? 'Personal Information Report' : 'Delete Personal Information'}</div>
          <div><strong>Delivery Method:</strong> {deliveryMethod}</div>
          <div><strong>Processing Time:</strong> 5-7 business days</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <button style={buttonPrimaryStyle}>
            Return to Home
          </button>
        </Link>
        <button 
          style={buttonSecondaryStyle}
          onClick={() => {
            setCurrentStep(1);
            // Reset all form data
            setPersonalInfo({
              firstName: '', lastName: '', address: '', state: '', 
              email: '', dateOfBirth: '', ssn: ''
            });
            setMfaInfo({
              mobileNumber: '', mfaCode: '', isCodeSent: false, 
              isVerified: false, sessionId: ''
            });
            setCaptchaVerified(false);
            setRequestType('');
            setDeliveryMethod('');
            setErrorMessage('');
            setSuccessMessage('');
          }}
        >
          Submit Another Request
        </button>
      </div>
    </div>
  );

  const steps: WizardStep[] = [
    {
      id: 1,
      title: "Personal Information",
      description: "Basic details",
      component: <Step1PersonalInfo />
    },
    {
      id: 2,
      title: "Verification",
      description: "Identity check",
      component: <Step2Verification />
    },
    {
      id: 3,
      title: "Request Details",
      description: "What you want",
      component: <Step3RequestDetails />
    },
    {
      id: 4,
      title: "Confirmation",
      description: "All done!",
      component: <Step4Confirmation />
    }
  ];

  const currentStepData = steps.find(step => step.id === currentStep);
  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div style={containerStyle}>
      <Header />
      
      <div style={{ padding: '2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Link to="/" style={{ 
              color: 'white', 
              textDecoration: 'none',
              fontSize: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '2rem',
              opacity: 0.9
            }}>
              ← Back to Home
            </Link>
            
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              color: 'white',
              marginBottom: '1rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              Personal Information Request
            </h1>
            
            <p style={{ 
              color: 'rgba(255,255,255,0.9)', 
              fontSize: '1.2rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Request access to your personal information with our secure, step-by-step process
            </p>
          </div>

          {/* Progress Steps */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            {steps.slice(0, 3).map((step, index) => (
              <div key={step.id} style={{ 
                display: 'flex', 
                alignItems: 'center',
                color: 'white'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: currentStep >= step.id ? '#10b981' : 'rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease'
                }}>
                  {currentStep > step.id ? '✓' : step.id}
                </div>
                <div style={{ marginLeft: '1rem', minWidth: '120px' }}>
                  <div style={{ fontWeight: '600' }}>{step.title}</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{step.description}</div>
                </div>
                {index < 2 && (
                  <div style={{ 
                    width: '60px', 
                    height: '2px', 
                    backgroundColor: currentStep > step.id ? '#10b981' : 'rgba(255,255,255,0.3)',
                    margin: '0 1rem',
                    transition: 'all 0.3s ease'
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Main Card */}
          <div style={cardStyle}>
            {/* Progress Bar */}
            <div style={progressBarStyle}>
              <div style={{ ...progressFillStyle, width: `${progressPercentage}%` }} />
            </div>

            {/* Messages */}
            {errorMessage && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '2px solid #f87171',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '2rem',
                color: '#dc2626',
                textAlign: 'center'
              }}>
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '2px solid #22c55e',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '2rem',
                color: '#16a34a',
                textAlign: 'center'
              }}>
                {successMessage}
              </div>
            )}

            {/* Current Step Content */}
            {currentStepData?.component}

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginTop: '3rem',
                gap: '1rem'
              }}>
                <button
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  style={{
                    ...buttonSecondaryStyle,
                    opacity: currentStep === 1 ? 0.5 : 1,
                    cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Previous
                </button>

                <button
                  onClick={() => {
                    if (currentStep === 1 && validateStep1()) {
                      setCurrentStep(2);
                      setErrorMessage('');
                    } else if (currentStep === 2 && validateStep2()) {
                      setCurrentStep(3);
                      setErrorMessage('');
                    } else if (currentStep === 3) {
                      submitRequest();
                    } else {
                      setErrorMessage('Please complete all required fields before proceeding.');
                    }
                  }}
                  disabled={isLoading || (currentStep === 2 && !mfaInfo.isVerified)}
                  style={{
                    ...buttonPrimaryStyle,
                    opacity: (isLoading || (currentStep === 2 && !mfaInfo.isVerified)) ? 0.5 : 1,
                    cursor: (isLoading || (currentStep === 2 && !mfaInfo.isVerified)) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isLoading ? 'Processing...' : (currentStep === 3 ? 'Submit Request' : 'Next')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationRequestWizard;
