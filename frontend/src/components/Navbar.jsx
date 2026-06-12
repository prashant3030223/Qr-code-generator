import React from 'react';
import { QrCode } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="nav-header">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo">
          <div className="logo-icon">
            <QrCode size={22} />
          </div>
          <span>QR<span className="logo-highlight">Pulse</span></span>
        </div>
      </div>

      <style>{`
        .nav-header {
          background: rgba(18, 19, 26, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 0.85rem 1rem;
        }
        
        .nav-container {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          justify-content: center; /* Center logo on purely static mobile-first view */
          align-items: center;
        }
        
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
          font-size: 1.35rem;
          font-weight: 800;
          color: white;
          letter-spacing: -0.03em;
        }
        
        .logo-icon {
          background: var(--accent-gradient);
          padding: 0.4rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
        }
        
        .logo-highlight {
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @media (min-width: 768px) {
          .nav-header {
            padding: 1rem 1.5rem;
          }
          .nav-logo {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
