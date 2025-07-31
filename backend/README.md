# MetLife Personal Information Request Backend API

This is the backend API server for the MetLife Personal Information Request application.

## Features

- **MFA Code Request**: Send verification codes to mobile numbers
- **MFA Code Verification**: Verify user-entered codes
- **Personal Information Request Submission**: Handle PI request submissions
- **Request Status Tracking**: Check the status of submitted requests
- **Security**: Rate limiting, input validation, CORS protection
- **Error Handling**: Comprehensive error handling and logging

## API Endpoints

### Health Check
- `GET /health` - Check API health status

### Personal Information Request
- `POST /api/pi-request/request-mfa-code` - Request MFA code
- `POST /api/pi-request/verify-mfa-code` - Verify MFA code
- `POST /api/pi-request/submit` - Submit PI request
- `GET /api/pi-request/status/:requestId` - Get request status

## Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (not implemented yet)

### Environment Variables
See `.env.example` for available configuration options.

## API Documentation

### Request MFA Code
```http
POST /api/pi-request/request-mfa-code
Content-Type: application/json

{
  "personalInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "address": "123 Main St, Anytown, NY 12345",
    "state": "New York",
    "email": "john.doe@example.com",
    "dateOfBirth": "1980-01-01",
    "ssn": "123-45-6789"
  },
  "mobileNumber": "(555) 123-4567",
  "captchaVerified": true
}
```

### Verify MFA Code
```http
POST /api/pi-request/verify-mfa-code
Content-Type: application/json

{
  "mobileNumber": "(555) 123-4567",
  "mfaCode": "123456",
  "sessionId": "uuid-session-id"
}
```

### Submit Request
```http
POST /api/pi-request/submit
Content-Type: application/json

{
  "personalInfo": { /* same as above */ },
  "mobileNumber": "(555) 123-4567",
  "requestType": "report",
  "deliveryMethod": "email",
  "sessionId": "uuid-session-id"
}
```

## Security Features

- **Rate Limiting**: Prevents abuse with configurable limits
- **Input Validation**: Joi schema validation for all inputs
- **CORS Protection**: Configurable CORS policies
- **Helmet**: Security headers protection
- **Data Masking**: Sensitive data is masked in logs
- **Session Management**: Secure session handling for MFA

## Production Considerations

For production deployment, consider:

1. **Database Integration**: Replace in-memory storage with persistent database
2. **SMS Service**: Integrate with actual SMS provider (Twilio, AWS SNS, etc.)
3. **Logging**: Implement structured logging (Winston, Bunyan)
4. **Monitoring**: Add health checks and metrics
5. **Encryption**: Encrypt sensitive data at rest
6. **Authentication**: Add JWT or session-based authentication
7. **Load Balancing**: Configure for multiple instances
8. **SSL/TLS**: Enable HTTPS in production

## Mock Data

For development, the API returns mock responses:
- MFA codes are logged to console
- Request submissions return mock confirmation
- Status checks return mock processing status

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "details": ["Additional error details"]
}
```

## Testing

To test the MFA flow:
1. Use any 6-digit code when requesting MFA (it will be logged to console)
2. The verification will accept the generated code
3. Submit requests will return mock success responses
