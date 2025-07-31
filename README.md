# MetLife PI Bot Interface

A custom React-based user interface for the MetLife PI Bot that provides a bot interface.

### Start the Web Interface
In the main project directory:
```bash
cd pi_req
npm install
npm run dev
```

The web interface will be available at `http://localhost:5173`

## Customization
- Edit `src/App.tsx` to change the main component.
- Add new components in the `src` directory.

# Personal Information Report Feature

## Overview
The Personal Information Report feature provides users with access to their personal information request history and allows them to download comprehensive PDF reports containing all their personal data maintained by MetLife.

## Features

### 1. Request History Dashboard
- **Search Functionality**: Search by name, reference ID, or email
- **Status Filtering**: Filter requests by status (All, Pending, Processing, Completed)
- **Statistics Dashboard**: View counts of total, completed, processing, and pending requests
- **Request Type Distribution**: Visual chart showing the distribution of different request types

### 2. Request Cards
Each request is displayed as a card containing:
- **Personal Information**: Name, reference ID, email, address
- **Request Details**: Date requested, status, request types
- **Status Badge**: Color-coded status indicator
- **Action Buttons**: View details and download PDF (when available)

### 3. Detailed Modal View
When clicking "View Details", users can see:
- **Complete request information**
- **Why we're contacting you**: Explanation of the privacy request
- **What you need to know**: Information about the report contents
- **What you need to do**: Instructions for reviewing the information
- **We're here to help**: Contact information for support
- **Information Sources**: Where MetLife collected the data from
- **Purpose of Collection**: Why the information was collected
- **Information Disclosures**: How information is shared outside MetLife

### 4. PDF Report Generation
The system generates comprehensive PDF reports containing:
- **Letter Format**: Formal letter with recipient address and reference ID
- **Regulatory Compliance**: All required privacy law sections
- **Detailed Table**: Complete breakdown of personal information elements:
  - Personal Identity (Name, DOB, SSN, Gender, etc.)
  - Contact Information (Email, Phone, Address)
  - Financial Information (Income, Bank Account, Employment)
  - Health Information (Medical History, Prescriptions, Providers)
  - Policy Information (Policy Number, Coverage, Premiums, Beneficiaries)
  - Digital Interactions (Login History, Website Activity, App Usage)

---

This project was bootstrapped with Vite's React + TypeScript template.
