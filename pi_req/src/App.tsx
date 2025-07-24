import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import PersonalInformationRequest from './components/PersonalInformationRequest'
import PersonalInformationRequestWizard from './components/PersonalInformationRequestWizard'
import PrivacyPage from './components/PrivacyPage';
import VirtualAssistant from './components/VirtualAssistant';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pi-request-v0" element={<PrivacyPage />} />
        <Route path="/pi-request-v1" element={<PersonalInformationRequest />} />
        <Route path="/pi-request-v2" element={<PersonalInformationRequestWizard />} />
      </Routes>
      {/* <VirtualAssistant /> */}
    </Router>
  );
}

export default App;
