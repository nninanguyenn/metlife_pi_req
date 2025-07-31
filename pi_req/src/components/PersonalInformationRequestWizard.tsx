import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { piRequestAPI, type PersonalInfo } from '../utils/piRequestAPI';
import styles from './PersonalInformationRequestWizard.module.css';

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

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  // Step components - memoized to prevent unnecessary re-renders
  const Step1PersonalInfo = useMemo(() => (
    <div>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          Personal Information
        </h2>
        <p className={styles.sectionSubtitle}>
          Please provide your personal details as they appear on your MetLife policy
        </p>
      </div>

      <div className={styles.gridContainer}>
        <div>
          <label className={styles.label}>First Name *</label>
          <input
            name="firstName"
            type="text"
            className={styles.input}
            value={personalInfo.firstName}
            onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
            placeholder="Enter your first name"
            required
          />
        </div>
        <div>
          <label className={styles.label}>Last Name *</label>
          <input
            name="lastName"
            type="text"
            className={styles.input}
            value={personalInfo.lastName}
            onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
            placeholder="Enter your last name"
            required
          />
        </div>
      </div>

      <div className={styles.fieldContainer}>
        <label className={styles.label}>Address on File *</label>
        <input
          type="text"
          className={styles.input}
          placeholder="Address associated with your policy"
          value={personalInfo.address}
          onChange={(e) => setPersonalInfo(prev => ({ ...prev, address: e.target.value }))}
          required
        />
      </div>

      <div className={styles.fieldContainer}>
        <label className={styles.label}>Current US State or Territory *</label>
        <select
          className={styles.input}
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

      <div className={styles.fieldContainer}>
        <label className={styles.label}>Email Address *</label>
        <input
          type="email"
          className={styles.input}
          value={personalInfo.email}
          onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
          placeholder="your.email@example.com"
          required
        />
      </div>

      <div className={styles.twoColumnGrid}>
        <div>
          <label className={styles.label}>Date of Birth *</label>
          <input
            type="date"
            className={styles.input}
            value={personalInfo.dateOfBirth}
            onChange={(e) => setPersonalInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className={styles.label}>Social Security Number *</label>
          <input
            type="password"
            className={styles.input}
            placeholder="XXX-XX-XXXX"
            value={personalInfo.ssn}
            onChange={(e) => setPersonalInfo(prev => ({ ...prev, ssn: e.target.value }))}
            required
          />
        </div>
      </div>
    </div>
  ), [personalInfo, handlePersonalInfoChange]);

  const Step2Verification = useMemo(() => (
    <div>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          Identity Verification
        </h2>
        <p className={styles.sectionSubtitle}>
          Verify your identity to secure your personal information request
        </p>
      </div>

      <div className={styles.verificationContainer}>
        <div className={styles.fieldContainer}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={captchaVerified}
              onChange={(e) => setCaptchaVerified(e.target.checked)}
              className={styles.checkbox}
            />
            <span>I am not a robot (Human verification) *</span>
          </label>
        </div>

        <div className={styles.fieldContainer}>
          <label className={styles.label}>Mobile Number for Verification *</label>
          <input
            type="tel"
            className={styles.input}
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
            className={(!captchaVerified || !mfaInfo.mobileNumber || isLoading) ? styles.buttonPrimaryDisabled : styles.buttonPrimaryFullWidth}
          >
            {isLoading ? 'Sending Code...' : 'Send Verification Code'}
          </button>
        ) : (
          <div>
            <div className={styles.fieldContainer}>
              <label className={styles.label}>Enter Verification Code *</label>
              <input
                type="text"
                className={styles.input}
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
              className={(mfaInfo.mfaCode.length !== 6 || isLoading) ? styles.buttonPrimaryDisabled : styles.buttonPrimarySuccess}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
            
            {mfaInfo.isVerified && (
              <div className={styles.successBox}>
                ✓ Verification Successful! Proceeding to next step...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  ), [captchaVerified, mfaInfo, isLoading, sendMfaCode, verifyMfaCode]);

  const Step3RequestDetails = useMemo(() => (
    <div>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          Request Details
        </h2>
        <p className={styles.sectionSubtitle}>
          Choose what you'd like to do with your personal information
        </p>
      </div>

      <div className={styles.fieldContainer}>
        <label className={styles.label}>What would you like to do? *</label>
        <div className={styles.radioContainer}>
          <label className={requestType === 'report' ? styles.radioOptionSelected : styles.radioOption}>
            <input
              type="radio"
              name="requestType"
              value="report"
              checked={requestType === 'report'}
              onChange={(e) => setRequestType(e.target.value)}
              className={styles.radioButton}
            />
            <div>
              <div className={styles.radioTitle}>
                📊 Receive a Personal Information Report
              </div>
              <div className={styles.radioDescription}>
                Get a comprehensive report of all personal information we have collected about you
              </div>
            </div>
          </label>
          
          <label className={requestType === 'delete' ? styles.radioOptionSelected : styles.radioOption}>
            <input
              type="radio"
              name="requestType"
              value="delete"
              checked={requestType === 'delete'}
              onChange={(e) => setRequestType(e.target.value)}
              className={styles.radioButton}
            />
            <div>
              <div className={styles.radioTitle}>
                🗑️ Delete Personal Information
              </div>
              <div className={styles.radioDescription}>
                Request deletion of personal information (subject to MetLife retention policies)
              </div>
            </div>
          </label>
        </div>
      </div>

      <div className={styles.fieldContainer}>
        <label className={styles.label}>How would you like to receive your report? *</label>
        <select
          className={styles.input}
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
  ), [requestType, deliveryMethod]);

  const Step4Confirmation = useMemo(() => (
    <div className={styles.confirmationCenter}>
      <div className={styles.confirmationIcon}>
        ✓
      </div>
      
      <h2 className={styles.confirmationTitle}>
        Request Submitted Successfully!
      </h2>
      
      <p className={styles.confirmationSubtitle}>
        Your personal information request has been submitted and is being processed.
      </p>

      <div className={styles.summaryBox}>
        <h3 className={styles.summaryTitle}>Request Summary:</h3>
        <div className={styles.summaryGrid}>
          <div><strong>Name:</strong> {personalInfo.firstName} {personalInfo.lastName}</div>
          <div><strong>Email:</strong> {personalInfo.email}</div>
          <div><strong>Request Type:</strong> {requestType === 'report' ? 'Personal Information Report' : 'Delete Personal Information'}</div>
          <div><strong>Delivery Method:</strong> {deliveryMethod}</div>
          <div><strong>Processing Time:</strong> 5-7 business days</div>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <Link to="/" className={styles.linkNoDecoration}>
          <button className={styles.buttonPrimary}>
            Return to Home
          </button>
        </Link>
        <button 
          className={styles.buttonSecondary}
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
  ), [personalInfo, requestType, deliveryMethod, setCurrentStep, setPersonalInfo, setMfaInfo, setCaptchaVerified, setRequestType, setDeliveryMethod, setErrorMessage, setSuccessMessage]);

  const steps: WizardStep[] = [
    {
      id: 1,
      title: "Personal Information",
      description: "Basic details",
      component: Step1PersonalInfo
    },
    {
      id: 2,
      title: "Verification",
      description: "Identity check",
      component: Step2Verification
    },
    {
      id: 3,
      title: "Request Details",
      description: "What you want",
      component: Step3RequestDetails
    },
    {
      id: 4,
      title: "Confirmation",
      description: "All done!",
      component: Step4Confirmation
    }
  ];

  const currentStepData = steps.find(step => step.id === currentStep);
  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className={styles.container}>
      <Header />
      
      <div className={styles.mainPadding}>
        <div className={styles.mainContainer}>
          {/* Header */}
          <div className={styles.headerSection}>
            <Link to="/" className={styles.backLink}>
              ← Back to Home
            </Link>
            
            <h1 className={styles.mainTitle}>
              Personal Information Request
            </h1>
            
            <p className={styles.mainSubtitle}>
              Request access to your personal information with our secure, step-by-step process
            </p>
          </div>

          {/* Progress Steps */}
          <div className={styles.progressStepsContainer}>
            {steps.slice(0, 3).map((step, index) => (
              <div key={step.id} className={styles.stepContainer}>
                <div className={`${styles.stepCircle} ${currentStep >= step.id ? styles.stepCircleActive : styles.stepCircleInactive}`}>
                  {currentStep > step.id ? '✓' : step.id}
                </div>
                <div className={styles.stepDetails}>
                  <div className={styles.stepTitle}>{step.title}</div>
                  <div className={styles.stepDescription}>{step.description}</div>
                </div>
                {index < 2 && (
                  <div className={`${styles.stepConnector} ${currentStep > step.id ? styles.stepConnectorActive : styles.stepConnectorInactive}`} />
                )}
              </div>
            ))}
          </div>

          {/* Main Card */}
          <div className={styles.card}>
            {/* Progress Bar */}
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Messages */}
            {errorMessage && (
              <div className={styles.errorMessage}>
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className={styles.successMessage}>
                {successMessage}
              </div>
            )}

            {/* Current Step Content */}
            {currentStepData?.component}

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div className={styles.navigationButtons}>
                <button
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className={currentStep === 1 ? styles.buttonSecondaryDisabled : styles.buttonSecondary}
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
                  className={(isLoading || (currentStep === 2 && !mfaInfo.isVerified)) ? styles.buttonPrimaryDisabledNav : styles.buttonPrimary}
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
