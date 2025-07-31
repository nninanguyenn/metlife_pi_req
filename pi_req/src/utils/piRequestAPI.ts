// API utility for Personal Information Request
const API_BASE_URL = 'http://localhost:3001/api';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  address: string;
  state: string;
  email: string;
  dateOfBirth: string;
  ssn: string;
}

export interface MfaRequestResponse {
  success: boolean;
  message: string;
  data?: {
    sessionId: string;
    phoneNumber: string;
    expiresIn: number;
  };
  details?: string[];
}

export interface MfaVerifyResponse {
  success: boolean;
  message: string;
  data?: {
    sessionId: string;
    verified: boolean;
  };
  details?: string[];
}

export interface SubmitRequestResponse {
  success: boolean;
  message: string;
  data?: {
    requestId: string;
    status: string;
    estimatedProcessingTime: string;
    submittedAt: string;
  };
  details?: string[];
}

export const piRequestAPI = {
  async requestMfaCode(personalInfo: PersonalInfo, mobileNumber: string): Promise<MfaRequestResponse> {
    const response = await fetch(`${API_BASE_URL}/pi-request/request-mfa-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalInfo,
        mobileNumber,
        captchaVerified: true
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async verifyMfaCode(mobileNumber: string, mfaCode: string, sessionId: string): Promise<MfaVerifyResponse> {
    const response = await fetch(`${API_BASE_URL}/pi-request/verify-mfa-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobileNumber,
        mfaCode,
        sessionId
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async submitRequest(
    personalInfo: PersonalInfo, 
    mobileNumber: string, 
    requestType: string, 
    deliveryMethod: string, 
    sessionId: string
  ): Promise<SubmitRequestResponse> {
    const response = await fetch(`${API_BASE_URL}/pi-request/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalInfo,
        mobileNumber,
        requestType,
        deliveryMethod,
        sessionId
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async getRequestStatus(requestId: string) {
    const response = await fetch(`${API_BASE_URL}/pi-request/status/${requestId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
};
