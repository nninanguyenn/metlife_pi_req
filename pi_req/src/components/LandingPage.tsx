import React, { useState } from 'react';
import { PersonalInfoBot } from '../components/PersonalInfoBot.tsx'
import { PersonalInfoReport } from '../components/PersonalInfoReport.tsx'
import NewHeader from './NewHeader';

const LandingPage: React.FC = () => {
const [activeTab, setActiveTab] = useState('personal-info');

  return (
    <div className="app-container">
      <NewHeader />
      <div className="tab-container">
        <div className="tab-buttons">
          <button 
            className={`tab-button ${activeTab === 'personal-info' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal-info')}
          >
            Personal Info Request
          </button>
          <button 
            className={`tab-button ${activeTab === 'personal-info-report' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal-info-report')}
          >
            Personal Info Report
          </button>
        </div>
      </div>
      
      <main className="app-main">
        {activeTab === 'personal-info' && (
          <PersonalInfoBot />
        )}
        {activeTab === 'personal-info-report' && (
          <PersonalInfoReport />
        )}
      </main>
      
      <footer className="app-footer">
        <p>MetLife Personal Information Request System</p>
      </footer>
    </div>
  );
};

export default LandingPage;
