import { useState } from 'react'
import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import PersonalInformationRequest from './components/PersonalInformationRequest'
import PersonalInformationRequestWizard from './components/PersonalInformationRequestWizard'




function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/personal-information-request" element={<PersonalInformationRequest />} />
        <Route path="/pi-request-v2" element={<PersonalInformationRequestWizard />} />
      </Routes>
    </Router>
  );
}

export default App;
