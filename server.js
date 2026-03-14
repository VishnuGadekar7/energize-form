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
  try {
    console.log('📝 Form submission received');

    const formData = req.body;
    const photoPath = req.file ? req.file.path : null;

    // Send the response IMMEDIATELY to prevent Render's 60-second timeout
    res.json({
      success: true,
      message: 'Application submitted successfully. Processing in background.',
    });

    // ── Run Heavy Operations Asynchronously in Background ──
    (async () => {
      try {
        // Generate PDF
        console.log('📄 Generating PDF (Background)...');
        const pdfBuffer = await generatePDF(formData, photoPath);
        console.log('✅ PDF generated successfully (Background)');

        // Send email
        console.log('📧 Sending email to HR (Background)...');
        await sendEmail(pdfBuffer, formData);
        console.log('✅ Email sent successfully (Background)');
      } catch (bgError) {
        console.error('❌ Background processing error:', bgError.message);
      } finally {
        // Clean up temp photo
        if (photoPath && fs.existsSync(photoPath)) {
          try {
            fs.unlinkSync(photoPath);
            console.log('🗑️  Temp photo deleted');
          } catch (_) {}
        }
      }
    })();
  } catch (error) {
    console.error('❌ Immediate submission error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Something went wrong processing your request.',
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
