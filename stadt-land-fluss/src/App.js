import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Test } from './View/home.js';
import { Spiel } from './View/spiel.js';
import { Highscore } from './View/highscore.js';
import { LoginWindow } from './View/login.js';
import Admin from './View/admin.js';
import HelpPage from './View/help.js';
import Impressum from './View/impressum.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Test />} />
        <Route path="/spiel" element={<Spiel />} />
        <Route path="/highscore" element={<Highscore />} />
        <Route path="/login" element={<LoginWindow />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/impressum" element={<Impressum />} />
      </Routes>
    </Router>
  );
}

export default App;
