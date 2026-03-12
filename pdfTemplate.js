const fs = require('fs');
const path = require('path');

/**
 * Build the full HTML string for the ENERGIZE employment application PDF.
 * @param {Object} d   – form data fields
 * @param {string|null} photoPath – absolute path to uploaded photo (or null)
 * @returns {string} complete HTML document
 */
function buildTemplate(d, photoPath) {
  // ── Photo handling ───────────────────────────────────
  let photoHtml = '<div style="width:100px;height:120px;border:1px solid #ccc;display:flex;align-items:center;justify-content:center;color:#aaa;font-size:11px;">Photo</div>';
  if (photoPath && fs.existsSync(photoPath)) {
    const ext = path.extname(photoPath).toLowerCase().replace('.', '');
    const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
    const base64 = fs.readFileSync(photoPath).toString('base64');
    photoHtml = `<img src="data:${mime};base64,${base64}" style="width:100px;height:120px;object-fit:cover;border:1px solid #ccc;">`;
  }

  // ── Helper: safely read a field ──────────────────────
  const v = (key, fallback = '') => (d[key] != null ? d[key] : fallback);

  // ── Helper: parse JSON array fields ──────────────────
  const parseArr = (key) => {
    try {
      return JSON.parse(d[key] || '[]');
    } catch {
      return [];
    }
  };

  const languages = parseArr('languages');
  const education = parseArr('education');
  const training = parseArr('training');
  const employment = parseArr('employment');

  // ── Helper: build language rows ──────────────────────
  const langRows = () => {
    let rows = '';
    for (let i = 0; i < 3; i++) {
      const l = languages[i] || {};
      rows += `<tr>
        <td style="padding:6px 8px;border:1px solid #ccc;">${l.language || ''}</td>
        <td style="padding:6px 8px;border:1px solid #ccc;text-align:center;">${l.speak || ''}</td>
        <td style="padding:6px 8px;border:1px solid #ccc;text-align:center;">${l.read || ''}</td>
        <td style="padding:6px 8px;border:1px solid #ccc;text-align:center;">${l.write || ''}</td>
      </tr>`;
    }
    return rows;
  };

  // ── Helper: build education rows ─────────────────────
  const eduRows = () => {
    let rows = '';
    for (let i = 0; i < 5; i++) {
      const e = education[i] || {};
      rows += `<tr>
        <td style="padding:6px 8px;border:1px solid #ccc;">${e.exam || ''}</td>
        <td style="padding:6px 8px;border:1px solid #ccc;">${e.institute || ''}</td>
        <td style="padding:6px 8px;border:1px solid #ccc;text-align:center;">${e.year || ''}</td>
        <td style="padding:6px 8px;border:1px solid #ccc;">${e.subjects || ''}</td>
        <td style="padding:6px 8px;border:1px solid #ccc;text-align:center;">${e.percentage || ''}</td>
      </tr>`;
    }
    return rows;
  };

  // ── Helper: build training rows ──────────────────────
  const trainRows = () => {
    let rows = '';
    for (let i = 0; i < 3; i++) {
      const t = training[i] || {};
      rows += `<tr>
        <td style="padding:6px 8px;border:1px solid #ccc;">${t.organisation || ''}</td>
        <td style="padding:6px 8px;border:1px solid #ccc;text-align:center;">${t.from || ''}</td>
        <td style="padding:6px 8px;border:1px solid #ccc;text-align:center;">${t.to || ''}</td>
        <td style="padding:6px 8px;border:1px solid #ccc;">${t.details || ''}</td>
      </tr>`;
    }
    return rows;
  };

  // ── Helper: build employment rows ────────────────────
  const empRows = () => {
    const labels = ['a', 'b', 'c', 'd', 'e'];
    let rows = '';
    for (let i = 0; i < 5; i++) {
      const e = employment[i] || {};
      rows += `<tr>
        <td style="padding:6px 8px;border:1px solid #ccc;text-align:center;font-weight:bold;">${labels[i]}</td>
        <td style="padding:6px 8px;border:1px solid #ccc;">${e.organisation || ''}</td>
        <td style="padding:6px 8px;border:1px solid #ccc;text-align:center;">${e.from || ''}</td>
        <td style="padding:6px 8px;border:1px solid #ccc;text-align:center;">${e.to || ''}</td>
        <td style="padding:6px 8px;border:1px solid #ccc;">${e.designation || ''}</td>
        <td style="padding:6px 8px;border:1px solid #ccc;text-align:right;">${e.salary || ''}</td>
        <td style="padding:6px 8px;border:1px solid #ccc;">${e.reason || ''}</td>
      </tr>`;
    }
    return rows;
  };

  // ── Common styles ────────────────────────────────────
  const styles = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Helvetica, Arial, sans-serif; font-size: 11px; color: #222; line-height: 1.45; }
    .page { width: 210mm; min-height: 297mm; padding: 14mm 16mm; page-break-after: always; }
    .page:last-child { page-break-after: auto; }
    .header { background: #1a6b4a; color: #fff; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .header h1 { font-size: 20px; letter-spacing: 1px; }
    .header .subtitle { font-size: 11px; opacity: 0.85; }
    .section-title { background: #1a6b4a; color: #fff; padding: 5px 10px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; margin: 10px 0 6px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    .field-table td { padding: 5px 8px; border: 1px solid #ccc; vertical-align: top; }
    .field-table .label { background: #f5f5f5; font-weight: bold; width: 28%; color: #333; }
    .field-table .value { color: #444; }
    .data-table th { background: #f5f5f5; padding: 6px 8px; border: 1px solid #ccc; text-align: left; font-weight: bold; font-size: 10px; text-transform: uppercase; color: #333; }
    .data-table td { padding: 6px 8px; border: 1px solid #ccc; }
    .ref-line { border-bottom: 1px solid #ccc; min-height: 20px; padding: 3px 0; margin: 3px 0; }
    .signature-line { border-bottom: 1px solid #333; width: 200px; margin-top: 30px; display: inline-block; }
    .rating-box { display: inline-block; width: 22px; height: 22px; border: 1px solid #999; text-align: center; line-height: 22px; margin: 0 2px; font-size: 10px; }
  `;

  // ── PAGE 1: PERSONAL DATA ───────────────────────────
  const page1 = `
  <div class="page">
    <div class="header">
      <div>
        <h1>ENERGIZE</h1>
        <div class="subtitle">Employment Application Form</div>
      </div>
      <div style="text-align:right;font-size:11px;">
        <div><strong>REF: HR:</strong> ___________</div>
        <div style="margin-top:4px;font-size:10px;">Confidential</div>
      </div>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
      <div style="flex:1;">
        <div class="section-title">Personal Data</div>
      </div>
      <div style="margin-left:16px;">${photoHtml}</div>
    </div>

    <table class="field-table">
      <tr><td class="label">Position Applied For</td><td class="value">${v('position')}</td><td class="label">Source</td><td class="value">${v('source')}</td></tr>
      <tr><td class="label">Surname</td><td class="value">${v('surname')}</td><td class="label">First Name</td><td class="value">${v('firstName')}</td></tr>
      <tr><td class="label">Middle Name</td><td class="value" colspan="3">${v('middleName')}</td></tr>
      <tr><td class="label">Address for Communication</td><td class="value" colspan="3">${v('communicationAddress')}</td></tr>
      <tr><td class="label">Permanent Address</td><td class="value" colspan="3">${v('permanentAddress')}</td></tr>
      <tr>
        <td class="label">Tel (Res)</td><td class="value">${v('telRes')}</td>
        <td class="label">Office</td><td class="value">${v('telOffice')}</td>
      </tr>
      <tr>
        <td class="label">Cell</td><td class="value">${v('cell')}</td>
        <td class="label">Email</td><td class="value">${v('email')}</td>
      </tr>
    </table>

    <div class="section-title">Emergency Contact</div>
    <table class="field-table">
      <tr><td class="label">Name</td><td class="value">${v('emergencyName')}</td><td class="label">Phone</td><td class="value">${v('emergencyPhone')}</td></tr>
      <tr><td class="label">Address</td><td class="value" colspan="3">${v('emergencyAddress')}</td></tr>
    </table>

    <table class="field-table">
      <tr><td class="label">Aadhaar No</td><td class="value">${v('aadhaarNo')}</td><td class="label">PAN No</td><td class="value">${v('panNo')}</td></tr>
      <tr>
        <td class="label">Date of Birth</td><td class="value">${v('dob')}</td>
        <td class="label">Place of Birth</td><td class="value">${v('placeOfBirth')}</td>
      </tr>
      <tr>
        <td class="label">Nationality</td><td class="value">${v('nationality')}</td>
        <td class="label">Marital Status</td><td class="value">${v('maritalStatus')}</td>
      </tr>
      <tr>
        <td class="label">No. of Children</td><td class="value">${v('numberOfChildren')}</td>
        <td class="label">Age of Children</td><td class="value">${v('ageOfChildren')}</td>
      </tr>
    </table>

    <table class="field-table">
      <tr><td class="label">Father's Name</td><td class="value">${v('fatherName')}</td><td class="label">Occupation</td><td class="value">${v('fatherOccupation')}</td></tr>
      <tr><td class="label">Spouse Name</td><td class="value">${v('spouseName')}</td><td class="label">Occupation</td><td class="value">${v('spouseOccupation')}</td></tr>
      <tr><td class="label">Spouse Qualification</td><td class="value" colspan="3">${v('spouseQualification')}</td></tr>
    </table>

    <table class="field-table">
      <tr><td class="label">Relative in Company</td><td class="value" colspan="3">${v('relativeInCompany')}</td></tr>
      <tr><td class="label">Previously Employed Here</td><td class="value">${v('previouslyEmployed')}</td><td class="label">Previous Interview</td><td class="value">${v('previousInterview')}</td></tr>
      <tr><td class="label">Health History</td><td class="value" colspan="3">${v('healthHistory')}</td></tr>
    </table>

    <table class="field-table">
      <tr>
        <td class="label">Identification Mark</td><td class="value">${v('identificationMark')}</td>
        <td class="label">Height</td><td class="value">${v('height')}</td>
      </tr>
      <tr>
        <td class="label">Weight</td><td class="value">${v('weight')}</td>
        <td class="label">Blood Group</td><td class="value">${v('bloodGroup')}</td>
      </tr>
      <tr><td class="label">Hobbies / Extracurricular</td><td class="value" colspan="3">${v('hobbies')}</td></tr>
    </table>

    <div class="section-title">Languages Known</div>
    <table class="data-table">
      <thead><tr><th>Language</th><th>Speak</th><th>Read</th><th>Write</th></tr></thead>
      <tbody>${langRows()}</tbody>
    </table>
  </div>`;

  // ── PAGE 2: EDUCATION & EMPLOYMENT ──────────────────
  const page2 = `
  <div class="page">
    <div class="header">
      <div><h1>ENERGIZE</h1><div class="subtitle">Employment Application Form</div></div>
      <div style="text-align:right;font-size:11px;">Page 2</div>
    </div>

    <div class="section-title">Educational Qualifications</div>
    <table class="data-table">
      <thead><tr><th>Examination</th><th>Institute / Board / University</th><th>Year</th><th>Main Subjects</th><th>Percentage</th></tr></thead>
      <tbody>${eduRows()}</tbody>
    </table>

    <table class="field-table">
      <tr><td class="label">Other Academic Achievements</td><td class="value" colspan="3">${v('academicAchievements')}</td></tr>
      <tr><td class="label">Professional Memberships</td><td class="value" colspan="3">${v('professionalMemberships')}</td></tr>
    </table>

    <div class="section-title">Practical Training / Internships</div>
    <table class="data-table">
      <thead><tr><th>Organisation</th><th>From</th><th>To</th><th>Details</th></tr></thead>
      <tbody>${trainRows()}</tbody>
    </table>

    <div class="section-title">Employment Details (begin with present employer)</div>
    <table class="data-table">
      <thead><tr><th style="width:20px;"></th><th>Organisation</th><th>From (MM/YY)</th><th>To (MM/YY)</th><th>Designation</th><th>Last Drawn Salary</th><th>Reasons for Seeking Change</th></tr></thead>
      <tbody>${empRows()}</tbody>
    </table>

    <table class="field-table">
      <tr><td class="label">Total Experience (in years)</td><td class="value">${v('totalExperience')}</td></tr>
    </table>
  </div>`;

  // ── PAGE 3: COMPENSATION & REFERENCES ───────────────
  const page3 = `
  <div class="page">
    <div class="header">
      <div><h1>ENERGIZE</h1><div class="subtitle">Employment Application Form</div></div>
      <div style="text-align:right;font-size:11px;">Page 3</div>
    </div>

    <div class="section-title">Present Emoluments</div>
    <table class="field-table">
      <tr><td class="label">Basic</td><td class="value">${v('salBasic')}</td><td class="label">Lunch</td><td class="value">${v('salLunch')}</td></tr>
      <tr><td class="label">DA</td><td class="value">${v('salDA')}</td><td class="label">Entertainment</td><td class="value">${v('salEntertainment')}</td></tr>
      <tr><td class="label">HRA</td><td class="value">${v('salHRA')}</td><td class="label">Furnishing</td><td class="value">${v('salFurnishing')}</td></tr>
      <tr><td class="label">Conveyance</td><td class="value">${v('salConveyance')}</td><td class="label">Other</td><td class="value">${v('salOther')}</td></tr>
      <tr><td class="label">Education</td><td class="value">${v('salEducation')}</td><td class="label">LTA</td><td class="value">${v('salLTA')}</td></tr>
      <tr><td class="label">Medical</td><td class="value">${v('salMedical')}</td><td class="label">PF (Monthly)</td><td class="value">${v('salPF')}</td></tr>
      <tr><td class="label">Superannuation</td><td class="value">${v('salSuperannuation')}</td><td class="label"></td><td class="value"></td></tr>
      <tr style="background:#e8f5e9;"><td class="label" style="background:#e8f5e9;"><strong>GROSS (Rs.)</strong></td><td class="value"><strong>${v('salGross')}</strong></td><td class="label" style="background:#e8f5e9;"><strong>Annual CTC (Rs.)</strong></td><td class="value"><strong>${v('salAnnualCTC')}</strong></td></tr>
    </table>

    <table class="field-table">
      <tr><td class="label">Other Non-Quantifiable Perks</td><td class="value" colspan="3">${v('otherPerks')}</td></tr>
      <tr><td class="label">Expected Salary &amp; Perks</td><td class="value" colspan="3">${v('expectedSalary')}</td></tr>
      <tr><td class="label">If Selected, When Can You Join?</td><td class="value" colspan="3">${v('joiningDate')}</td></tr>
      <tr><td class="label">Any Other Relevant Information</td><td class="value" colspan="3">${v('additionalInfo')}</td></tr>
    </table>

    <div class="section-title">References</div>
    <table class="field-table">
      <tr><td class="label">(a) Name</td><td class="value">${v('refAName')}</td><td class="label">Contact</td><td class="value">${v('refAContact')}</td></tr>
      <tr><td class="label">(b) Name</td><td class="value">${v('refBName')}</td><td class="label">Contact</td><td class="value">${v('refBContact')}</td></tr>
      <tr><td class="label">Prior Approval for References</td><td class="value" colspan="3">${v('priorApproval')}</td></tr>
    </table>

    <div style="margin-top:18px;padding:14px;border:1px solid #ccc;background:#fafafa;">
      <p style="font-size:11px;line-height:1.6;margin-bottom:10px;">
        <strong>Declaration:</strong> I certify that the particulars given above, to the best of my knowledge and belief, are correct.
      </p>
      <div style="display:flex;justify-content:space-between;margin-top:20px;">
        <div>
          <div style="font-weight:bold;font-size:10px;color:#666;">Date</div>
          <div style="border-bottom:1px solid #333;width:160px;min-height:20px;padding-top:4px;">${v('declarationDate')}</div>
        </div>
        <div>
          <div style="font-weight:bold;font-size:10px;color:#666;">Signature</div>
          <div style="border-bottom:1px solid #333;width:200px;min-height:20px;padding-top:4px;">${v('signatureName')}</div>
        </div>
      </div>
    </div>
  </div>`;

  // ── PAGE 4: OFFICE USE ONLY ─────────────────────────
  const ratingScale = `
    <span style="font-size:10px;margin-right:4px;">L</span>
    <span class="rating-box">1</span>
    <span class="rating-box">2</span>
    <span class="rating-box">3</span>
    <span class="rating-box">4</span>
    <span class="rating-box">5</span>
    <span class="rating-box">6</span>
    <span style="font-size:10px;margin-left:4px;">H</span>
  `;

  const page4 = `
  <div class="page">
    <div class="header">
      <div><h1>ENERGIZE</h1><div class="subtitle">Employment Application Form</div></div>
      <div style="text-align:right;font-size:11px;">Page 4</div>
    </div>

    <div class="section-title">For Office Use Only — Interview Panel Remarks</div>

    <table class="field-table" style="margin-top:10px;">
      <tr><td class="label" style="width:40%;">Job Knowledge</td><td class="value">${ratingScale}</td></tr>
      <tr><td class="label">Analytical Ability</td><td class="value">${ratingScale}</td></tr>
      <tr><td class="label">General Awareness</td><td class="value">${ratingScale}</td></tr>
      <tr><td class="label">Communication Skills</td><td class="value">${ratingScale}</td></tr>
      <tr><td class="label">Attitude</td><td class="value">${ratingScale}</td></tr>
      <tr><td class="label">Appearance / Personality</td><td class="value">${ratingScale}</td></tr>
    </table>

    <table class="field-table" style="margin-top:10px;">
      <tr>
        <td class="label">Recommendation</td>
        <td class="value">
          <span style="margin-right:24px;">☐ Recommended</span>
          <span>☐ Not Recommended</span>
        </td>
      </tr>
    </table>

    <div style="display:flex;justify-content:space-between;margin:18px 0;">
      <div style="text-align:center;"><div class="signature-line"></div><div style="font-size:10px;color:#666;margin-top:4px;">Signature 1</div></div>
      <div style="text-align:center;"><div class="signature-line"></div><div style="font-size:10px;color:#666;margin-top:4px;">Signature 2</div></div>
      <div style="text-align:center;"><div class="signature-line"></div><div style="font-size:10px;color:#666;margin-top:4px;">Signature 3</div></div>
    </div>

    <div class="section-title">Management Approval</div>
    <table class="field-table">
      <tr><td class="label">Comments</td><td class="value" style="min-height:50px;">&nbsp;</td></tr>
      <tr>
        <td class="label">Decision</td>
        <td class="value">
          <span style="margin-right:24px;">☐ Suitable</span>
          <span>☐ Not Suitable</span>
        </td>
      </tr>
    </table>

    <div class="section-title">HRD Remarks</div>
    <table class="field-table">
      <tr><td class="value" style="min-height:60px;">&nbsp;</td></tr>
    </table>

    <div class="section-title">Offer Details</div>
    <table class="field-table">
      <tr><td class="label">Designation</td><td class="value">&nbsp;</td><td class="label">Level</td><td class="value">&nbsp;</td></tr>
      <tr><td class="label">Department</td><td class="value">&nbsp;</td><td class="label">Location</td><td class="value">&nbsp;</td></tr>
      <tr><td class="label">CTC</td><td class="value">&nbsp;</td><td class="label">Date of Joining</td><td class="value">&nbsp;</td></tr>
    </table>

    <div style="display:flex;justify-content:space-between;margin-top:24px;">
      <div>
        <div class="signature-line"></div>
        <div style="font-size:10px;color:#666;margin-top:4px;">Signature</div>
      </div>
      <div>
        <div class="signature-line"></div>
        <div style="font-size:10px;color:#666;margin-top:4px;">Date</div>
      </div>
    </div>
  </div>`;

  // ── Final HTML ───────────────────────────────────────
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>${styles}</style>
</head>
<body>
  ${page1}
  ${page2}
  ${page3}
  ${page4}
</body>
</html>`;
}

module.exports = { buildTemplate };
