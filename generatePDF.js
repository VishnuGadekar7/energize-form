const { buildTemplate } = require('./pdfTemplate');
const puppeteer = require('puppeteer');

/**
 * Generate a PDF buffer from form data using Puppeteer.
 * Uses the bundled Chromium that ships with the 'puppeteer' package,
 * so no system Chrome installation is needed.
 *
 * @param {Object} data      – submitted form fields
 * @param {string|null} photoPath – absolute path to the uploaded photo
 * @returns {Promise<Buffer>} PDF file as buffer
 */
async function generatePDF(data, photoPath) {
  let browser = null;

  try {
    console.log('🌐 Launching bundled Chromium via Puppeteer…');

    browser = await puppeteer.launch({
      headless: 'new',
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
