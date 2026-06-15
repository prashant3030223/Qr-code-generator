import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, Settings2, RefreshCw, AlertCircle, Copy, Check } from 'lucide-react';
import { api } from '../utils/api';
import AnalyticsChart from '../components/AnalyticsChart';
import QRCodeGenerator from '../components/QRCodeGenerator';

const QRDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('analytics'); // 'analytics' | 'edit'
  
  const [qrCode, setQrCode] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch details and analytics in parallel
      const [detailsData, analyticsData] = await Promise.all([
        api.getQRCode(id),
        api.getAnalytics(id)
      ]);
      
      setQrCode(detailsData);
      setAnalytics(analyticsData);
    } catch (err) {
      setError(err.message || 'Failed to fetch details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCopyLink = () => {
    if (!qrCode?.shortId) return;
    const redirectLink = `http://localhost:5001/r/${qrCode.shortId}`;
    navigator.clipboard.writeText(redirectLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateSuccess = (updatedCode) => {
    setQrCode(updatedCode);
    fetchData();
  };

  if (loading) {
    return (
      <div className="detail-loading-container">
        <RefreshCw className="spinner" size={40} />
        <p>Loading QR code statistics and parameters...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card detail-error-card">
        <AlertCircle size={40} className="error-icon" />
        <h3>Error Loading Details</h3>
        <p>{error}</p>
        <Link to="/dashboard" className="btn btn-secondary btn-back-err">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  const redirectUrl = qrCode?.isDynamic ? `http://localhost:5001/r/${qrCode.shortId}` : '';

  return (
    <div className="qr-detail-container animate-fade-in">
      {/* Back button and title */}
      <section className="detail-header-row">
        <Link to="/dashboard" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
        <div className="title-section">
          <h2>{qrCode?.title}</h2>
          <span className={`badge ${qrCode?.isDynamic ? 'badge-success' : 'badge-info'}`}>
            {qrCode?.isDynamic ? 'Dynamic Tracking' : 'Static Offline'}
          </span>
        </div>
      </section>

      {/* Dynamic Link copy box */}
      {qrCode?.isDynamic && (
        <section className="glass-card link-share-card">
          <div className="link-share-details">
            <span className="share-label">Short Redirect Link:</span>
            <a href={redirectUrl} target="_blank" rel="noopener noreferrer" className="share-link">
              {redirectUrl}
            </a>
          </div>
          <button onClick={handleCopyLink} className="btn btn-secondary btn-copy">
            {copied ? <Check size={16} style={{ color: 'var(--success)' }} /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </section>
      )}

      {/* Navigation tabs */}
      <div className="detail-tabs">
        <button 
          className={`detail-tab-btn ${activeView === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveView('analytics')}
        >
          <BarChart3 size={18} />
          <span>Analytics Dashboard</span>
        </button>
        <button 
          className={`detail-tab-btn ${activeView === 'edit' ? 'active' : ''}`}
          onClick={() => setActiveView('edit')}
        >
          <Settings2 size={18} />
          <span>Design & Parameters</span>
        </button>
      </div>

      {/* Inner Views */}
      <div className="detail-tab-content">
        {activeView === 'analytics' ? (
          <div className="analytics-view-wrapper">
            <div className="analytics-quick-stats">
              <div className="glass-card stat-bubble">
                <span className="bubble-label">Total Scans logged</span>
                <span className="bubble-val">{analytics?.totalScans || 0}</span>
              </div>
              <div className="glass-card stat-bubble">
                <span className="bubble-label">Destination Web Address</span>
                <span className="bubble-val destination-val" title={qrCode?.targetUrl}>
                  {qrCode?.targetUrl || 'N/A'}
                </span>
              </div>
            </div>
            
            {analytics?.totalScans > 0 ? (
              <AnalyticsChart analytics={analytics} />
            ) : (
              <div className="glass-card no-scans-alert">
                <BarChart3 size={32} />
                <h4>No scans logged yet</h4>
                <p>This dynamic QR code hasn't been scanned by any device yet. Print it, share it, or test scan it with your phone to start collecting analytical metrics.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="edit-view-wrapper">
            <QRCodeGenerator 
              user={user} 
              initialData={qrCode} 
              onSaveSuccess={handleUpdateSuccess} 
            />
          </div>
        )}
      </div>

      <style>{`
        .qr-detail-container {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .detail-loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          min-height: 300px;
          color: var(--text-secondary);
        }
        .detail-error-card {
          max-width: 500px;
          margin: 2rem auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
          padding: 1.5rem;
        }
        .btn-back-err {
          width: 100%;
        }
        .error-icon {
          color: var(--danger);
        }
        
        /* Mobile First Default layout */
        .detail-header-row {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          transition: var(--transition-smooth);
        }
        .back-link:hover {
          color: white;
        }
        .title-section {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .title-section h2 {
          font-size: 1.5rem;
          margin-bottom: 0;
        }
        
        .link-share-card {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          padding: 1.25rem;
          background: rgba(99, 102, 241, 0.04);
          border: 1px solid rgba(99, 102, 241, 0.15);
          gap: 1rem;
        }
        .link-share-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .share-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .share-link {
          color: white;
          font-weight: 600;
          text-decoration: none;
          font-size: 0.95rem;
          border-bottom: 1px dashed rgba(255,255,255,0.3);
          transition: var(--transition-smooth);
          word-break: break-all;
        }
        .share-link:hover {
          color: var(--accent-primary);
          border-color: var(--accent-primary);
        }
        .btn-copy {
          width: 100%;
          height: 44px;
        }
        
        /* Tab buttons (scrollable horizontally if needed) */
        .detail-tabs {
          display: flex;
          border-bottom: 1px solid var(--border-color);
          overflow-x: auto;
          gap: 0.25rem;
          margin-top: 0.5rem;
        }
        .detail-tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          color: var(--text-secondary);
          padding: 0.75rem 1rem;
          cursor: pointer;
          font-family: var(--font-primary);
          font-size: 0.95rem;
          font-weight: 600;
          transition: var(--transition-smooth);
          white-space: nowrap;
        }
        .detail-tab-btn:hover {
          color: white;
        }
        .detail-tab-btn.active {
          color: var(--accent-primary);
          border-bottom-color: var(--accent-primary);
        }
        
        .detail-tab-content {
          margin-top: 1rem;
        }
        
        /* Analytics view (default stack) */
        .analytics-view-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .analytics-quick-stats {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        
        .stat-bubble {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .bubble-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .bubble-val {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
        }
        .destination-val {
          font-size: 1.1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.4;
          margin-top: 0.25rem;
        }
        
        .no-scans-alert {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 3rem 1rem;
          gap: 0.75rem;
          color: var(--text-muted);
        }
        .no-scans-alert h4 {
          color: white;
          font-size: 1.15rem;
          margin-top: 0.25rem;
        }
        .no-scans-alert p {
          max-width: 400px;
          font-size: 0.9rem;
        }
        
        /* Tablets & Desktops (min-width: 768px) */
        @media (min-width: 768px) {
          .qr-detail-container {
            gap: 1.5rem;
          }
          .detail-loading-container {
            min-height: 400px;
          }
          .detail-error-card {
            padding: 2rem;
            margin: 4rem auto;
          }
          .btn-back-err {
            width: auto;
          }
          
          .detail-header-row {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
          .title-section {
            flex-direction: row;
            align-items: center;
            gap: 1rem;
          }
          .title-section h2 {
            font-size: 2rem;
          }
          
          .link-share-card {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 1.25rem 1.5rem;
            gap: 1.5rem;
          }
          .link-share-details {
            flex-direction: row;
            align-items: center;
            gap: 0.75rem;
          }
          .share-link {
            font-size: 1rem;
          }
          .btn-copy {
            width: auto;
            padding: 0 1.25rem;
          }
          
          .detail-tab-btn {
            padding: 0.85rem 1.5rem;
            font-size: 1rem;
          }
          
          .analytics-quick-stats {
            grid-template-columns: 1fr 2fr;
            gap: 1.5rem;
          }
          .stat-bubble {
            padding: 1.25rem 1.5rem;
          }
          .bubble-val {
            font-size: 1.75rem;
          }
          .destination-val {
            font-size: 1.25rem;
            margin-top: 0.35rem;
          }
          
          .no-scans-alert {
            padding: 4rem 2rem;
          }
          .no-scans-alert h4 {
            font-size: 1.25rem;
          }
          .no-scans-alert p {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
};

export default QRDetail;
