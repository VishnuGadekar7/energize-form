require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { generatePDF } = require('./generatePDF');
const { sendEmail } = require('./emailSender');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Multer config for photo upload ─────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
  },
});

// ── Routes ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/submit', upload.single('Photograph'), async (req, res) => {
  let photoPath = null;

  try {
    console.log('📝 Form submission received');

    const formData = req.body;
    photoPath = req.file ? req.file.path : null;

    // Generate PDF
    console.log('📄 Generating PDF...');
    const pdfBuffer = await generatePDF(formData, photoPath);
    console.log('✅ PDF generated successfully');

    // Send email
    console.log('📧 Sending email to HR...');
    await sendEmail(pdfBuffer, formData);
    console.log('✅ Email sent successfully');

    // Clean up temp photo
    if (photoPath && fs.existsSync(photoPath)) {
      fs.unlinkSync(photoPath);
      console.log('🗑️  Temp photo deleted');
    }

    res.json({
      success: true,
      message: 'Application submitted successfully',
    });
  } catch (error) {
    console.error('❌ Submission error:', error.message);

    // Clean up temp photo on error too
    if (photoPath && fs.existsSync(photoPath)) {
      try {
        fs.unlinkSync(photoPath);
      } catch (_) {}
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Something went wrong. Please try again.',
    });
  }
});

// ── Error handling for multer ──────────────────────────
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, error: err.message });
  }
  if (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
  next();
});

// ── Start server ───────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Energize server running at http://localhost:${PORT}`);
});
