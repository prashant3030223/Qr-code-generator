import mongoose from 'mongoose';

const qrCodeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a title for your QR Code'],
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['url', 'text', 'wifi', 'vcard', 'email', 'phone'],
      default: 'url',
    },
    isDynamic: {
      type: Boolean,
      default: true,
    },
    targetUrl: {
      type: String,
      required: function() {
        return this.isDynamic;
      },
    },
    shortId: {
      type: String,
      unique: true,
      sparse: true, // Only required for dynamic codes, unique constraint ignores nulls
    },
    // Store user styling configurations
    style: {
      dotsColor: { type: String, default: '#000000' },
      dotsType: { type: String, default: 'rounded' },
      bgColor: { type: String, default: '#ffffff' },
      gradientType: { type: String, default: 'none' }, // 'none', 'linear', 'radial'
      gradientColor: { type: String, default: '#000000' },
      cornersSquareType: { type: String, default: 'square' },
      cornersDotType: { type: String, default: 'dot' },
      cornersSquareColor: { type: String, default: '#000000' },
      cornersDotColor: { type: String, default: '#000000' },
      logoUrl: { type: String, default: '' },
      logoMargin: { type: Number, default: 0 },
      logoSize: { type: Number, default: 0.15 },
      errorCorrectionLevel: { type: String, default: 'Q' }, // 'L', 'M', 'Q', 'H'
    },
  },
  {
    timestamps: true,
  }
);

const QRCode = mongoose.model('QRCode', qrCodeSchema);
export default QRCode;
