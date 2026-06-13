import React from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      
      <main className="main-content">
        <Home />
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} QRPulse - Custom QR Code Studio. Mobile-first design.</p>
        </div>
      </footer>

      <style>{`
        .footer {
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-color);
          padding: 1rem;
          text-align: center;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .footer-content {
          max-width: 1280px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}

export default App;
