const express = require('express');
const QRCode = require('qrcode');
const multer = require('multer');
const cors = require('cors');
const sharp = require('sharp');
const merge = require('lodash/merge');

const upload = multer();
const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST']
}));

app.post('/generate', upload.single('logo'), async (req, res) => {
  const { url } = req.body;
  const logo = req.file;

  try {
    let qrCodeOptions = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
    };

    if (logo) {
      const logoImage = await sharp(logo.buffer)
        .resize(50, 50)  // Resize logo to fit in QR code
        .toBuffer();

      qrCodeOptions = merge(qrCodeOptions, {
        width: 300,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      const qrCodeImage = await QRCode.toBuffer(url, qrCodeOptions);
      const qrCodeWithLogo = await sharp(qrCodeImage)
        .composite([{ input: logoImage, gravity: 'center' }])
        .toBuffer();

      res.status(200).json({ qrCode: `data:image/png;base64,${qrCodeWithLogo.toString('base64')}` });
    } else {
      const qrCodeDataURL = await QRCode.toDataURL(url, qrCodeOptions);
      res.status(200).json({ qrCode: qrCodeDataURL });
    }
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ message: 'Error generating QR code' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});