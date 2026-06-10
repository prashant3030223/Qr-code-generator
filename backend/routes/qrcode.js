import express from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import QRCode from '../models/QRCode.js';
import Scan from '../models/Scan.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Helper function to generate unique shortId
const generateShortId = async () => {
  let shortId;
  let isUnique = false;
  
  while (!isUnique) {
    shortId = crypto.randomBytes(4).toString('hex'); // 8 characters hex
    const existing = await QRCode.findOne({ shortId });
    if (!existing) {
      isUnique = true;
    }
  }
  return shortId;
};

// @desc    Create a new QR Code
// @route   POST /api/qrcode/create
// @access  Private
router.post('/create', protect, async (req, res) => {
  const { title, type, isDynamic, targetUrl, style } = req.body;

  try {
    if (!title || !type) {
      return res.status(400).json({ message: 'Title and type are required' });
    }

    if (isDynamic && !targetUrl) {
      return res.status(400).json({ message: 'Target URL is required for dynamic QR codes' });
    }

    let shortId = null;
    if (isDynamic) {
      shortId = await generateShortId();
    }

    const qrCode = await QRCode.create({
      user: req.user._id,
      title,
      type,
      isDynamic,
      targetUrl: isDynamic ? targetUrl : undefined,
      shortId,
      style,
    });

    res.status(201).json(qrCode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all QR codes of the logged-in user
// @route   GET /api/qrcode/my-codes
// @access  Private
router.get('/my-codes', protect, async (req, res) => {
  try {
    const codes = await QRCode.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user._id) } },
      {
        $lookup: {
          from: 'scans',
          localField: '_id',
          foreignField: 'qrcode',
          as: 'scans'
        }
      },
      {
        $project: {
          title: 1,
          type: 1,
          isDynamic: 1,
          targetUrl: 1,
          shortId: 1,
          style: 1,
          createdAt: 1,
          scanCount: { $size: '$scans' }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);
    res.json(codes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get specific QR code details
// @route   GET /api/qrcode/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const qrCode = await QRCode.findOne({ _id: req.params.id, user: req.user._id });
    if (!qrCode) {
      return res.status(404).json({ message: 'QR Code not found' });
    }
    res.json(qrCode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a QR code (Target URL or Style or Title)
// @route   PUT /api/qrcode/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { title, targetUrl, style } = req.body;

  try {
    const qrCode = await QRCode.findOne({ _id: req.params.id, user: req.user._id });
    if (!qrCode) {
      return res.status(404).json({ message: 'QR Code not found' });
    }

    if (title) qrCode.title = title;
    if (qrCode.isDynamic && targetUrl) qrCode.targetUrl = targetUrl;
    if (style) qrCode.style = { ...qrCode.style, ...style };

    const updatedCode = await qrCode.save();
    res.json(updatedCode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a QR code
// @route   DELETE /api/qrcode/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const qrCode = await QRCode.findOne({ _id: req.params.id, user: req.user._id });
    if (!qrCode) {
      return res.status(404).json({ message: 'QR Code not found' });
    }

    // Delete associated scans
    await Scan.deleteMany({ qrcode: qrCode._id });
    // Delete the QR code
    await QRCode.deleteOne({ _id: qrCode._id });

    res.json({ message: 'QR Code and scan history deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get QR code scan analytics
// @route   GET /api/qrcode/:id/analytics
// @access  Private
router.get('/:id/analytics', protect, async (req, res) => {
  try {
    const qrCode = await QRCode.findOne({ _id: req.params.id, user: req.user._id });
    if (!qrCode) {
      return res.status(404).json({ message: 'QR Code not found' });
    }

    // Total Scans
    const totalScans = await Scan.countDocuments({ qrcode: qrCode._id });

    // Scans by OS
    const osData = await Scan.aggregate([
      { $match: { qrcode: qrCode._id } },
      { $group: { _id: '$os', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Scans by Browser
    const browserData = await Scan.aggregate([
      { $match: { qrcode: qrCode._id } },
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Scans by Device Type
    const deviceData = await Scan.aggregate([
      { $match: { qrcode: qrCode._id } },
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Scans over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const timelineData = await Scan.aggregate([
      { 
        $match: { 
          qrcode: qrCode._id,
          timestamp: { $gte: thirtyDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalScans,
      byOS: osData.map(d => ({ name: d._id, value: d.count })),
      byBrowser: browserData.map(d => ({ name: d._id, value: d.count })),
      byDevice: deviceData.map(d => ({ name: d._id, value: d.count })),
      timeline: timelineData.map(d => ({ date: d._id, count: d.count }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
