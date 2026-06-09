import mongoose from 'mongoose';

const scanSchema = new mongoose.Schema(
  {
    qrcode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QRCode',
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    os: {
      type: String,
      default: 'Unknown',
    },
    browser: {
      type: String,
      default: 'Unknown',
    },
    device: {
      type: String,
      default: 'Desktop', // Desktop, Mobile, Tablet
    },
    ip: {
      type: String,
      default: '127.0.0.1',
    },
  },
  {
    timestamps: true,
  }
);

const Scan = mongoose.model('Scan', scanSchema);
export default Scan;
