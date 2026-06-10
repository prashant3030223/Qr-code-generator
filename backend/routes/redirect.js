import express from 'express';
import useragent from 'express-useragent';
import QRCode from '../models/QRCode.js';
import Scan from '../models/Scan.js';

const router = express.Router();

// Middleware to parse User-Agent
router.use(useragent.express());

// @desc    Redirect dynamic QR code short URL to target URL
// @route   GET /r/:shortId
// @access  Public
router.get('/:shortId', async (req, res) => {
  try {
    const { shortId } = req.params;

    // Find the QR Code
    const qrCode = await QRCode.findOne({ shortId });
    if (!qrCode) {
      return res.status(404).send('<h1>QR Code Link Invalid or Expired</h1>');
    }

    // Determine OS, Browser, and Device from User Agent
    const ua = req.useragent;
    let device = 'Desktop';
    if (ua.isMobile) {
      device = 'Mobile';
    } else if (ua.isTablet) {
      device = 'Tablet';
    }

    const os = ua.os || 'Unknown';
    const browser = ua.browser || 'Unknown';
    
    // Capture IP
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    if (ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }

    // Record the scan asynchronously
    Scan.create({
      qrcode: qrCode._id,
      os,
      browser,
      device,
      ip
    }).catch(err => console.error('Error logging scan:', err));

    // Ensure target URL starts with a protocol
    let target = qrCode.targetUrl;
    if (!/^https?:\/\//i.test(target)) {
      target = `http://${target}`;
    }

    // Redirect to the target URL
    res.redirect(target);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).send('<h1>Server Error</h1>');
  }
});

export default router;
