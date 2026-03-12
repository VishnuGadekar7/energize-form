const { buildTemplate } = require('./pdfTemplate');
const fs = require('fs');

/**
 * Find the Chrome executable on the local system.
 */
function findChrome() {
  // Allow explicit override via env
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  // Common Windows Chrome paths
  const winPaths = [
    process.env['PROGRAMFILES(X86)'] + '\\Google\\Chrome\\Application\\chrome.exe',
    process.env['PROGRAMFILES'] + '\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
  ];

  // Common Linux paths (Render.com, etc.)
  const linuxPaths = [
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ];

  const candidates = process.platform === 'win32' ? winPaths : linuxPaths;

  for (const p of candidates) {
    if (p && fs.existsSync(p)) return p;
  }

  throw new Error(
    'Chrome not found. Install Google Chrome or set PUPPETEER_EXECUTABLE_PATH in your .env file.'
  );
}

/**
 * Generate a PDF buffer from form data using Puppeteer.
 * @param {Object} data      – submitted form fields
 * @param {string|null} photoPath – absolute path to the uploaded photo
 * @returns {Promise<Buffer>} PDF file as buffer
 */
async function generatePDF(data, photoPath) {
  let browser = null;

  try {
    const puppeteer = require('puppeteer-core');
    const executablePath = findChrome();
    console.log('🌐 Using Chrome at:', executablePath);

    browser = await puppeteer.launch({
      headless: 'new',
      executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const page = await browser.newPage();

    // Build the HTML
    const html = buildTemplate(data, photoPath);

    // Set content and wait for images / styles
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Generate PDF — A4, with background colors
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
    });

    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF: ' + error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = { generatePDF };
