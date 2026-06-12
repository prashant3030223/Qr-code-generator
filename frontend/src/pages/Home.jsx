import React from 'react';
import QRCodeGenerator from '../components/QRCodeGenerator';

const Home = () => {
  return (
    <div className="home-container animate-fade-in">
      {/* Title Header */}
      <section className="hero-section text-center">
        <h1 className="hero-title">
          QR<span className="gradient-text">Pulse</span> Studio
        </h1>
        <p className="hero-subtitle">
          Design custom QR codes instantly. Choose eye shapes, gradients, and upload custom logos.
        </p>
      </section>

      {/* Editor Section */}
      <section className="editor-section">
        <QRCodeGenerator />
      </section>

      <style>{`
        .home-container {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        
        .hero-section {
          display: none;
        }
        .text-center {
          text-align: center;
        }
        .hero-title {
          font-size: 2.15rem;
          line-height: 1.2;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        .gradient-text {
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: 0.9rem;
          color: var(--text-secondary);
          max-width: 500px;
          line-height: 1.4;
        }
        
        .editor-section {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
        }
        
        @media (min-width: 768px) {
          .home-container {
            gap: 2rem;
          }
          .hero-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            max-width: 600px;
            margin: 1.5rem auto 1rem;
            gap: 0.5rem;
          }
          .hero-title {
            font-size: 2.75rem;
          }
          .hero-subtitle {
            font-size: 1.05rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
