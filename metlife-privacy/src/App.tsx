import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PrivacyPage from './components/PrivacyPage';
import VirtualAssistant from './components/VirtualAssistant';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" component={PrivacyPage} />
      </Switch>
      <VirtualAssistant />
    </Router>
  );
};

export default App;