import React from 'react';
import PromptApp from "./sendprompt";  // Import the PromptApp component
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
function App() {
  return (
    
    <Router>
    <Routes>
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/Export" element={<PromptApp/>}/>
      </Routes>
  </Router>
  );
}

export default App;

