const nodemailer = require('nodemailer');
const dns = require('dns');

/**
 * Send the generated PDF to the HR email address.
 * @param {Buffer} pdfBuffer - The PDF file as a buffer
 * @param {Object} formData  - The submitted form fields
 */
async function sendEmail(pdfBuffer, formData) {
  const transporter = nodemailer.createTransport({
    host: '142.251.2.108', // Explicit IPv4 address for smtp.gmail.com to bypass Render's IPv6 block
    port: 465,
    secure: true, 
    pool: true, 
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
    // Force Node to use IPv4 only, since Render IPv6 IPs often get blocked by Gmail
    ignoreTLS: false,
    requireTLS: true,
    name: 'energize-hr',
  });

  const firstName = formData.firstName || 'Applicant';
  const surname = formData.surname || '';
  const position = formData.position || 'N/A';
  const cell = formData.cell || 'N/A';
  const email = formData.email || 'N/A';
  const totalExperience = formData.totalExperience || 'N/A';
  const expectedSalary = formData.expectedSalary || 'N/A';
  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const fullName = `${firstName} ${surname}`.trim();

  const htmlBody = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #1a6b4a; padding: 24px 32px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px;">New Employment Application</h1>
        <p style="color: #c8e6d5; margin: 6px 0 0; font-size: 14px;">Energize HR Portal</p>
      </div>

      <div style="background: #ffffff; border: 1px solid #e0e0e0; border-top: none; padding: 28px 32px; border-radius: 0 0 8px 8px;">
        <p style="color: #333; font-size: 15px; line-height: 1.6; margin-top: 0;">
          A new employment application has been submitted. Here is a quick summary:
        </p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px 14px; background: #f5f5f5; font-weight: 600; color: #333; width: 40%; border: 1px solid #e0e0e0;">Applicant Name</td>
            <td style="padding: 10px 14px; border: 1px solid #e0e0e0; color: #555;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; background: #f5f5f5; font-weight: 600; color: #333; border: 1px solid #e0e0e0;">Position Applied For</td>
            <td style="padding: 10px 14px; border: 1px solid #e0e0e0; color: #555;">${position}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; background: #f5f5f5; font-weight: 600; color: #333; border: 1px solid #e0e0e0;">Mobile Number</td>
            <td style="padding: 10px 14px; border: 1px solid #e0e0e0; color: #555;">${cell}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; background: #f5f5f5; font-weight: 600; color: #333; border: 1px solid #e0e0e0;">Email Address</td>
            <td style="padding: 10px 14px; border: 1px solid #e0e0e0; color: #555;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; background: #f5f5f5; font-weight: 600; color: #333; border: 1px solid #e0e0e0;">Total Experience</td>
            <td style="padding: 10px 14px; border: 1px solid #e0e0e0; color: #555;">${totalExperience}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; background: #f5f5f5; font-weight: 600; color: #333; border: 1px solid #e0e0e0;">Expected Salary</td>
            <td style="padding: 10px 14px; border: 1px solid #e0e0e0; color: #555;">${expectedSalary}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; background: #f5f5f5; font-weight: 600; color: #333; border: 1px solid #e0e0e0;">Date of Application</td>
            <td style="padding: 10px 14px; border: 1px solid #e0e0e0; color: #555;">${today}</td>
          </tr>
        </table>

        <p style="color: #555; font-size: 14px; line-height: 1.6;">
          Please find the complete application form attached as PDF.
        </p>

        <hr style="border: none; border-top: 1px solid #e8e8e8; margin: 24px 0;">

        <p style="color: #999; font-size: 12px; margin-bottom: 0;">
          This is an automated email from the Energize HR Portal. Do not reply to this email.
        </p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `Energize HR Portal <${process.env.GMAIL_USER}>`,
    to: process.env.HR_EMAIL,
    subject: `New Employment Application — ${fullName} for ${position}`,
    html: htmlBody,
    attachments: [
      {
        filename: `Application_${firstName}_${surname}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('📧 Email message ID:', info.messageId);
  return { success: true };
}

module.exports = { sendEmail };
