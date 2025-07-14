import { useState } from 'react'
import './App.css'
import { BotEmulator } from './components/BotEmulator'
import { BotClient } from './components/BotClient'

function App() {
  const [activeTab, setActiveTab] = useState<'emulator' | 'client'>('client');

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>MetLife PI Bot Interface</h1>
        <p>A custom user interface for the PI Bot emulator and client</p>
      </header>
      
      <div className="tab-container">
        <div className="tab-buttons">
          <button 
            className={`tab-button ${activeTab === 'client' ? 'active' : ''}`}
            onClick={() => setActiveTab('client')}
          >
            Bot Client
          </button>
          <button 
            className={`tab-button ${activeTab === 'emulator' ? 'active' : ''}`}
            onClick={() => setActiveTab('emulator')}
          >
            Bot Emulator
          </button>
        </div>
      </div>
      
      <main className="app-main">
        {activeTab === 'client' ? <BotClient /> : <BotEmulator />}
      </main>
      
      <footer className="app-footer">
        <p>Built with React + TypeScript | MetLife PI Bot Project</p>
      </footer>
    </div>
  );
}

export default App;
