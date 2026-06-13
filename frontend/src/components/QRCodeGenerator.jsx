import React, { useState, useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { 
  Link as LinkIcon, 
  Wifi, 
  AlignLeft, 
  Mail, 
  Phone, 
  UserSquare2, 
  Download
} from 'lucide-react';

const QRCodeGenerator = () => {
  const [activeTab, setActiveTab] = useState('url');
  const [qrSize, setQrSize] = useState(window.innerWidth < 768 ? 140 : 280);

  // QR Form States
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState('WPA');
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  
  // vCard States
  const [vcardFirst, setVcardFirst] = useState('');
  const [vcardLast, setVcardLast] = useState('');
  const [vcardOrg, setVcardOrg] = useState('');
  const [vcardTitle, setVcardTitle] = useState('');
  const [vcardPhone, setVcardPhone] = useState('');
  const [vcardEmail, setVcardEmail] = useState('');
  const [vcardUrl, setVcardUrl] = useState('');

  const [downloadExt, setDownloadExt] = useState('png');
  const qrRef = useRef(null);
  const qrInstanceRef = useRef(null);

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      setQrSize(window.innerWidth < 768 ? 140 : 280);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Assemble QR content
  const getQRContent = () => {
    switch (activeTab) {
      case 'url':
        return url || 'https://google.com';
      case 'text':
        return text || 'Hello World';
      case 'wifi':
        return `WIFI:S:${wifiSSID};T:${wifiEncryption};P:${wifiPassword};H:false;;`;
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case 'phone':
        return `tel:${phoneNum}`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nN:${vcardLast};${vcardFirst};;;\nFN:${vcardFirst} ${vcardLast}\nORG:${vcardOrg}\nTITLE:${vcardTitle}\nTEL;TYPE=CELL:${vcardPhone}\nEMAIL;TYPE=PREF,INTERNET:${vcardEmail}\nURL:${vcardUrl}\nEND:VCARD`;
      default:
        return 'https://google.com';
    }
  };

  const getQRStyles = () => {
    return {
      width: qrSize,
      height: qrSize,
      type: 'svg',
      data: getQRContent(),
      margin: 8,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: 'M'
      },
      dotsOptions: {
        type: 'square',
        color: '#000000'
      },
      backgroundOptions: {
        color: '#ffffff',
      },
      cornersSquareOptions: {
        type: 'square',
        color: '#000000',
      },
      cornersDotOptions: {
        type: 'square',
        color: '#000000',
      }
    };
  };

  // Instantiation
  useEffect(() => {
    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      const config = getQRStyles();
      qrInstanceRef.current = new QRCodeStyling(config);
      qrInstanceRef.current.append(qrRef.current);
    }
  }, []);

  // Update QR code contents on changes
  useEffect(() => {
    if (qrInstanceRef.current) {
      const config = getQRStyles();
      qrInstanceRef.current.update(config);
    }
  }, [
    activeTab, url, text, wifiSSID, wifiPassword, wifiEncryption, emailTo, emailSubject, emailBody, phoneNum,
    vcardFirst, vcardLast, vcardOrg, vcardTitle, vcardPhone, vcardEmail, vcardUrl, qrSize
  ]);

  // Handle Download
  const handleDownload = () => {
    if (qrInstanceRef.current) {
      qrInstanceRef.current.download({
        name: `qrcode-${activeTab}`,
        extension: downloadExt
      });
    }
  };

  return (
    <div className="qrcode-editor-grid animate-fade-in">
      {/* Editor Panel */}
      <div className="glass-card editor-panel">
        <h2 className="panel-title">QR Code Inputs</h2>

        {/* Tab Headers */}
        <div className="tab-headers">
          <button 
            className={`tab-btn ${activeTab === 'url' ? 'active' : ''}`}
            onClick={() => setActiveTab('url')}
            type="button"
          >
            <LinkIcon size={14} />
            <span>Link</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
            onClick={() => setActiveTab('text')}
            type="button"
          >
            <AlignLeft size={14} />
            <span>Text</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'wifi' ? 'active' : ''}`}
            onClick={() => setActiveTab('wifi')}
            type="button"
          >
            <Wifi size={14} />
            <span>Wi-Fi</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'email' ? 'active' : ''}`}
            onClick={() => setActiveTab('email')}
            type="button"
          >
            <Mail size={14} />
            <span>Email</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'phone' ? 'active' : ''}`}
            onClick={() => setActiveTab('phone')}
            type="button"
          >
            <Phone size={14} />
            <span>Phone</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'vcard' ? 'active' : ''}`}
            onClick={() => setActiveTab('vcard')}
            type="button"
          >
            <UserSquare2 size={14} />
            <span>Contact</span>
          </button>
        </div>

        {/* Input Details */}
        <div className="section-container">
          {activeTab === 'url' && (
            <div className="form-group">
              <label className="form-label">Destination URL</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="https://example.com" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <p className="field-hint">The web address this QR code will point to.</p>
            </div>
          )}

          {activeTab === 'text' && (
            <div className="form-group">
              <label className="form-label">Plain Text</label>
              <textarea 
                className="form-input text-area" 
                placeholder="Type your text content here..." 
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
              />
            </div>
          )}

          {activeTab === 'wifi' && (
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Network Name (SSID)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Home Wi-Fi" 
                  value={wifiSSID}
                  onChange={(e) => setWifiSSID(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••" 
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                />
              </div>
              <div className="form-group grid-span-2">
                <label className="form-label">Security Type</label>
                <select 
                  className="form-input form-select"
                  value={wifiEncryption}
                  onChange={(e) => setWifiEncryption(e.target.value)}
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None (Open Network)</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <>
              <div className="form-group">
                <label className="form-label">Send Email To</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="contact@company.com" 
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Inquiry" 
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Message Body</label>
                <textarea 
                  className="form-input text-area" 
                  placeholder="Type email body..." 
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={3}
                />
              </div>
            </>
          )}

          {activeTab === 'phone' && (
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                type="tel" 
                className="form-input" 
                placeholder="+1 (555) 000-0000" 
                value={phoneNum}
                onChange={(e) => setPhoneNum(e.target.value)}
              />
            </div>
          )}

          {activeTab === 'vcard' && (
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="John" 
                  value={vcardFirst}
                  onChange={(e) => setVcardFirst(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Doe" 
                  value={vcardLast}
                  onChange={(e) => setVcardLast(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  placeholder="Cell number" 
                  value={vcardPhone}
                  onChange={(e) => setVcardPhone(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="john.doe@org.com" 
                  value={vcardEmail}
                  onChange={(e) => setVcardEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Organization</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Company Inc." 
                  value={vcardOrg}
                  onChange={(e) => setVcardOrg(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Engineer" 
                  value={vcardTitle}
                  onChange={(e) => setVcardTitle(e.target.value)}
                />
              </div>
              <div className="form-group grid-span-2">
                <label className="form-label">Website URL</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="www.doe.com" 
                  value={vcardUrl}
                  onChange={(e) => setVcardUrl(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Panel */}
      <div className="glass-card preview-panel-container">
        <div className="qr-preview-wrapper">
          <div ref={qrRef} className="qr-canvas-holder"></div>
          
          <div className="qr-download-column">
            <select 
              className="form-input form-select download-select"
              value={downloadExt}
              onChange={(e) => setDownloadExt(e.target.value)}
            >
              <option value="png">PNG</option>
              <option value="svg">SVG</option>
              <option value="jpeg">JPG</option>
            </select>
            <button onClick={handleDownload} className="btn btn-primary btn-download">
              <Download size={14} />
              <span>Get QR</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        /* Mobile-First Default layouts */
        .qrcode-editor-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 0.5rem;
        }
        .editor-panel {
          order: 2;
        }
        .preview-panel-container {
          order: 1; /* Sticky QR Preview at the top fold on mobile */
        }
        
        .panel-title {
          font-size: 1.15rem;
          margin-bottom: 1rem;
        }
        
        .tab-headers {
          display: flex;
          gap: 0.4rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
          scrollbar-width: none;
        }
        .tab-headers::-webkit-scrollbar {
          display: none;
        }
        
        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 0.45rem 0.75rem;
          border-radius: 8px;
          cursor: pointer;
          font-family: var(--font-primary);
          font-weight: 500;
          transition: var(--transition-smooth);
          white-space: nowrap;
          font-size: 0.8rem;
          flex-shrink: 0;
        }
        .tab-btn:hover {
          color: white;
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--text-muted);
        }
        .tab-btn.active {
          background: var(--accent-gradient);
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 10px rgba(99, 102, 241, 0.25);
        }
        
        .section-container {
          margin-bottom: 0.5rem;
        }
        
        .field-hint {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.3rem;
        }
        .text-area {
          resize: vertical;
          min-height: 90px;
        }

        /* Preview Panel */
        .preview-panel-container {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          padding: 0.5rem;
          margin-bottom: 0.25rem;
        }
        
        .qr-preview-wrapper {
          display: flex;
          flex-direction: row; /* Side-by-side layout on mobile */
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          width: 100%;
          justify-content: space-between;
          background: #ffffff !important; /* Always solid white background for scannability */
        }
        
        .qr-canvas-holder {
          width: 140px; /* Small 140px size */
          height: 140px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .qr-canvas-holder canvas {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 8px;
        }
        
        .qr-download-column {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }
        
        .download-select, .btn-download {
          height: 38px !important;
          padding: 0.4rem 0.6rem !important;
          font-size: 0.85rem !important;
          width: 100%;
        }

        /* Desktops and Tablets (min-width: 900px) */
        @media (min-width: 900px) {
          .qrcode-editor-grid {
            display: grid;
            grid-template-columns: 1.5fr 1fr;
            gap: 2rem;
            margin-top: 1.5rem;
          }
          
          .editor-panel {
            order: unset;
          }
          
          .panel-title {
            font-size: 1.5rem;
          }
          
          .tab-headers {
            gap: 0.5rem;
            margin-bottom: 2rem;
          }
          
          .tab-btn {
            padding: 0.6rem 1rem;
            font-size: 0.9rem;
            gap: 0.5rem;
          }
          
          .section-container {
            margin-bottom: 2rem;
          }
          
          .preview-panel-container {
            position: sticky;
            top: 90px;
            order: unset;
            padding: 1.5rem;
          }
          
          .qr-preview-wrapper {
            flex-direction: column; /* Stacked layout on desktop */
            padding: 2rem;
            margin: 1.5rem 0;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.15);
          }
          
          .qr-canvas-holder {
            width: 280px;
            height: 280px;
          }
          
          .qr-download-column {
            flex-direction: row; /* Horizontal below the QR code on desktop */
            width: 100%;
            margin-top: 1rem;
            gap: 0.75rem;
          }
          
          .download-select {
            height: 48px !important;
          }
          
          .btn-download {
            height: 48px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default QRCodeGenerator;
