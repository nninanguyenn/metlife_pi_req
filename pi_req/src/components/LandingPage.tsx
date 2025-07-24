import React, {useState} from 'react';
import { PersonalInfoBot } from '../components/PersonalInfoBot.tsx'
import { PersonalInfoReport } from '../components/PersonalInfoReport.tsx'
import logo from './assets/metlife-logo.png'

const [activeTab, setActiveTab] = useState<'personal-info' | 'personal-info-report'>('personal-info');


const LandingPage: React.FC = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1><img src={logo} alt="MetLife Logo" className='metlife-logo-header'/> MetLife</h1>
      </header>
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
