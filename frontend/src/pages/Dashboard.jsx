import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Trash2, 
  ExternalLink, 
  QrCode, 
  Eye, 
  Calendar,
  Layers,
  Activity,
  RefreshCw
} from 'lucide-react';
import { api } from '../utils/api';

const Dashboard = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch all codes
  const fetchCodes = async () => {
    try {
      setLoading(true);
      const data = await api.getMyCodes();
      setQrCodes(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard codes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this QR Code? This will permanently delete its scan analytics history.')) {
      return;
    }

    setActionLoading(id);
    try {
      await api.deleteQRCode(id);
      setQrCodes(prev => prev.filter(code => code._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete QR Code');
    } finally {
      setActionLoading(null);
    }
  };

  // Filtered list
  const filteredCodes = qrCodes.filter(code => 
    code.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    code.targetUrl?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Analytics aggregates
  const totalCodes = qrCodes.length;
  const totalScans = qrCodes.reduce((sum, item) => sum + (item.scanCount || 0), 0);
  const dynamicCount = qrCodes.filter(item => item.isDynamic).length;
  const staticCount = totalCodes - dynamicCount;

  return (
    <div className="dashboard-container animate-fade-in">
      {/* Overview Analytics Headers */}
      <section className="dashboard-header-row">
        <div className="dashboard-title-area">
          <h1>Dashboard</h1>
          <p>Manage and track your custom QR codes</p>
        </div>
        <Link to="/" className="btn btn-primary btn-create-qr">
          <Plus size={16} />
          <span>Create New QR</span>
        </Link>
      </section>

      {/* Analytics Cards */}
      <section className="analytics-summary-grid">
        <div className="glass-card summary-card">
          <div className="summary-icon bg-indigo">
            <QrCode size={20} />
          </div>
          <div className="summary-info">
            <span className="summary-label">Total QR Codes</span>
            <span className="summary-val">{totalCodes}</span>
          </div>
        </div>

        <div className="glass-card summary-card">
          <div className="summary-icon bg-magenta">
            <Activity size={20} />
          </div>
          <div className="summary-info">
            <span className="summary-label">Total Scans</span>
            <span className="summary-val">{totalScans}</span>
          </div>
        </div>

        <div className="glass-card summary-card">
          <div className="summary-icon bg-emerald">
            <Layers size={20} />
          </div>
          <div className="summary-info">
            <span className="summary-label">Dynamic Links</span>
            <span className="summary-val">{dynamicCount}</span>
          </div>
        </div>

        <div className="glass-card summary-card">
          <div className="summary-icon bg-amber">
            <Calendar size={20} />
          </div>
          <div className="summary-info">
            <span className="summary-label">Static Codes</span>
            <span className="summary-val">{staticCount}</span>
          </div>
        </div>
      </section>

      {/* Filter and Table Section */}
      <section className="glass-card dashboard-table-card">
        <div className="table-actions-header">
          <div className="search-bar-wrapper">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Search QR codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input search-input"
            />
          </div>
          <button onClick={fetchCodes} className="btn btn-secondary btn-refresh" title="Refresh List">
            <RefreshCw size={16} />
          </button>
        </div>

        {error && <div className="message-box error-box">{error}</div>}

        {loading ? (
          <div className="dashboard-loading">
            <RefreshCw className="spinner" size={32} />
            <p>Loading your QR codes...</p>
          </div>
        ) : filteredCodes.length > 0 ? (
          <>
            {/* Mobile View: Cards Layout */}
            <div className="mobile-cards-list">
              {filteredCodes.map(code => (
                <div key={code._id} className="mobile-qr-card glass-card">
                  <div className="card-top-row">
                    <span className="qr-title-text">{code.title}</span>
                    <span className="date-text">
                      {new Date(code.createdAt).toLocaleDateString(undefined, { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>

                  {code.isDynamic && code.targetUrl ? (
                    <a 
                      href={code.targetUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="qr-target-link"
                    >
                      <span>{code.targetUrl}</span>
                      <ExternalLink size={11} />
                    </a>
                  ) : (
                    <span className="static-text-indicator">Static content encoded</span>
                  )}

                  <div className="card-badge-row">
                    <span className="badge badge-info">{code.type}</span>
                    <span className={`badge ${code.isDynamic ? 'badge-success' : 'badge-warning'}`}>
                      {code.isDynamic ? 'Dynamic' : 'Static'}
                    </span>
                    {code.isDynamic && (
                      <span className="scans-count-badge">
                        <strong>{code.scanCount}</strong> scans
                      </span>
                    )}
                  </div>

                  <div className="card-actions-row">
                    <Link 
                      to={`/qrcode/${code._id}`} 
                      className="btn btn-secondary btn-mobile-action"
                    >
                      <Eye size={16} />
                      <span>View & Edit</span>
                    </Link>
                    <button 
                      onClick={() => handleDelete(code._id)} 
                      className="btn btn-danger btn-mobile-danger"
                      disabled={actionLoading === code._id}
                    >
                      {actionLoading === code._id ? <RefreshCw className="spinner" size={16} /> : <Trash2 size={16} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Tabular Layout */}
            <div className="table-wrapper">
              <table className="qr-table">
                <thead>
                  <tr>
                    <th>QR Details</th>
                    <th>Type</th>
                    <th>Tracking Status</th>
                    <th>Scans</th>
                    <th>Created Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCodes.map(code => (
                    <tr key={code._id}>
                      <td>
                        <div className="qr-details-cell">
                          <span className="qr-title-text">{code.title}</span>
                          {code.isDynamic && code.targetUrl && (
                            <a 
                              href={code.targetUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="qr-target-link"
                            >
                              <span>{code.targetUrl}</span>
                              <ExternalLink size={12} />
                            </a>
                          )}
                          {!code.isDynamic && (
                            <span className="static-text-indicator">Static content encoded</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-info">{code.type}</span>
                      </td>
                      <td>
                        <span className={`badge ${code.isDynamic ? 'badge-success' : 'badge-warning'}`}>
                          {code.isDynamic ? 'Dynamic (Active)' : 'Static (Offline)'}
                        </span>
                      </td>
                      <td>
                        <span className="scans-count-text">
                          {code.isDynamic ? code.scanCount : 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span className="date-text">
                          {new Date(code.createdAt).toLocaleDateString(undefined, { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <Link 
                            to={`/qrcode/${code._id}`} 
                            className="btn btn-secondary btn-action"
                            title="View Analytics & Edit"
                          >
                            <Eye size={16} />
                            <span>View & Edit</span>
                          </Link>
                          <button 
                            onClick={() => handleDelete(code._id)} 
                            className="btn btn-danger btn-action-danger"
                            disabled={actionLoading === code._id}
                            title="Delete QR"
                          >
                            {actionLoading === code._id ? <RefreshCw className="spinner" size={16} /> : <Trash2 size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="empty-dashboard-state">
            <div className="empty-icon">
              <QrCode size={48} />
            </div>
            <h3>No QR Codes found</h3>
            <p>
              {searchTerm 
                ? 'No matching results found for your search term.' 
                : 'Get started by designing your first dynamic trackable QR code.'}
            </p>
            {!searchTerm && (
              <Link to="/" className="btn btn-primary btn-empty-create" style={{ marginTop: '1rem' }}>
                <Plus size={16} />
                <span>Create QR Code</span>
              </Link>
            )}
          </div>
        )}
      </section>

      <style>{`
        .dashboard-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .dashboard-header-row {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 0.5rem;
        }
        
        .dashboard-title-area h1 {
          font-size: 1.85rem;
        }
        
        .btn-create-qr {
          width: 100%;
        }
        
        /* Analytics summary grid is 1 col on mobile by default */
        .analytics-summary-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        
        .summary-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
        }
        
        .summary-icon {
          width: 42px;
          height: 42px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }
        
        .bg-indigo { background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.25); color: #818cf8 !important; }
        .bg-magenta { background: rgba(217, 70, 239, 0.15); border: 1px solid rgba(217, 70, 239, 0.25); color: #f472b6 !important; }
        .bg-emerald { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.25); color: #34d399 !important; }
        .bg-amber { background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.25); color: #fbbf24 !important; }
        
        .summary-info {
          display: flex;
          flex-direction: column;
        }
        .summary-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .summary-val {
          font-size: 1.35rem;
          font-weight: 700;
          color: white;
        }
        
        .dashboard-table-card {
          padding: 1rem;
        }
        
        .table-actions-header {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }
        
        .search-bar-wrapper {
          position: relative;
          flex: 1;
        }
        .search-input {
          padding-left: 2.5rem;
          height: 42px;
          font-size: 0.9rem;
        }
        .search-icon {
          position: absolute;
          left: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          width: 16px;
          height: 16px;
        }
        .btn-refresh {
          padding: 0;
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .dashboard-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 3rem 0;
          color: var(--text-secondary);
        }
        
        /* Mobile Card View (Default) */
        .mobile-cards-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .mobile-qr-card {
          padding: 1.25rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .card-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .card-badge-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        .scans-count-badge {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-left: auto;
        }
        .scans-count-badge strong {
          color: white;
        }
        
        .card-actions-row {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }
        
        .btn-mobile-action {
          flex: 1;
          height: 38px;
          font-size: 0.85rem;
          padding: 0 1rem;
        }
        .btn-mobile-danger {
          width: 38px;
          height: 38px;
          padding: 0;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Tabular Layout (Hidden on Mobile) */
        .table-wrapper {
          display: none;
        }
        
        .qr-details-cell {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .qr-title-text {
          font-weight: 600;
          color: white;
          font-size: 1rem;
        }
        .qr-target-link {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
          text-decoration: none;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
        }
        .qr-target-link:hover {
          color: var(--accent-primary);
        }
        .static-text-indicator {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-style: italic;
        }
        .date-text {
          color: var(--text-secondary);
          font-size: 0.85rem;
        }
        
        .empty-dashboard-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 4rem 1rem;
          gap: 1rem;
        }
        .empty-icon {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
        }
        .empty-dashboard-state h3 {
          font-size: 1.3rem;
          color: white;
        }
        .empty-dashboard-state p {
          color: var(--text-secondary);
          max-width: 320px;
          font-size: 0.9rem;
        }
        
        /* Tablet & Desktop Viewports (min-width: 768px) */
        @media (min-width: 768px) {
          .dashboard-container {
            gap: 2rem;
          }
          
          .dashboard-header-row {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
          
          .dashboard-title-area h1 {
            font-size: 2.25rem;
          }
          
          .btn-create-qr {
            width: auto;
          }
          
          .analytics-summary-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
          
          .summary-card {
            padding: 1.5rem;
          }
          
          .summary-val {
            font-size: 1.5rem;
          }
          
          .dashboard-table-card {
            padding: 1.5rem;
          }
          
          .table-actions-header {
            margin-bottom: 1.5rem;
          }
          
          .search-input {
            height: 44px;
            font-size: 0.95rem;
          }
          
          .btn-refresh {
            width: 44px;
            height: 44px;
          }
          
          /* Switch layouts */
          .mobile-cards-list {
            display: none;
          }
          
          .table-wrapper {
            display: block;
            overflow-x: auto;
          }
          
          .qr-table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
          }
          .qr-table th {
            padding: 1rem;
            border-bottom: 1px solid var(--border-color);
            color: var(--text-secondary);
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 600;
          }
          .qr-table td {
            padding: 1.25rem 1rem;
            border-bottom: 1px solid var(--border-color);
            vertical-align: middle;
          }
          .qr-table tbody tr:hover {
            background-color: rgba(255, 255, 255, 0.02);
          }
          
          .qr-title-text {
            font-size: 1.05rem;
          }
          .qr-target-link {
            max-width: 280px;
            font-size: 0.85rem;
          }
          .scans-count-text {
            font-weight: 600;
            color: white;
            font-size: 1.1rem;
          }
          .date-text {
            font-size: 0.9rem;
          }
          .actions-cell {
            display: flex;
            justify-content: flex-end;
            gap: 0.5rem;
          }
          .btn-action {
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
            height: 36px;
            width: auto;
          }
          .btn-action-danger {
            padding: 0;
            height: 36px;
            width: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        
        /* Larger Desktop Viewports (min-width: 1024px) */
        @media (min-width: 1024px) {
          .analytics-summary-grid {
            grid-template-columns: repeat(4, 1fr);
          }
          .qr-target-link {
            max-width: 400px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
