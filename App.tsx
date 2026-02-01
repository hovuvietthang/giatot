
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { RedirectPage } from './pages/RedirectPage';

/**
 * Main Application Component
 * Using HashRouter for maximum compatibility in all environments.
 */
const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:slug" element={<RedirectPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
