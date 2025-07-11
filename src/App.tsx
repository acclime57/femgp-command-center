import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { NetworkOperationsCenter } from './components/NetworkOperationsCenter';
import { BusinessIntelligence } from './components/BusinessIntelligence';
import { AdminManagement } from './components/AdminManagement';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <ExecutiveDashboard />;
      case 'operations':
        return <NetworkOperationsCenter />;
      case 'intelligence':
        return <BusinessIntelligence />;
      case 'admin':
        return <AdminManagement />;
      default:
        return <ExecutiveDashboard />;
    }
  };

  return (
    <div className="App">
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderCurrentPage()}
      </Layout>
    </div>
  );
}

export default App;