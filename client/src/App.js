import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ServiceProvider } from './context/ServiceContext';
import ServicesPage from './pages/ServicesPage';

function App() {
  return (
    <Router>
      <ServiceProvider>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/services/*" element={<ServicesPage />} />
            {/* Add other routes here */}
          </Routes>
        </div>
      </ServiceProvider>
    </Router>
  );
}

export default App; 