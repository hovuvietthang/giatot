import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Đã đổi sang BrowserRouter
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { RedirectPage } from './pages/RedirectPage';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Hứng trực tiếp slug từ domain.com/slug */}
          <Route path="/:slug" element={<RedirectPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
