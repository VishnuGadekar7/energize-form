const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // Personal Data
  Role: { type: String },
  Location: { type: String },
  AvailableDate: { type: String },
  DesiredSalary: { type: String },
  Name: { type: String },
  EmailId: { type: String },
  PhNO: { type: String },
  AltPhNo: { type: String },
  GovtIdType: { type: String },
  GovtIdNo: { type: String },
  ContactPersonName: { type: String },
  ContactPersonNo: { type: String },
  CurrentAddress: { type: String },
  PermanentAddress: { type: String },
  City: { type: String },
  State: { type: String },
  PinCode: { type: String },

  // Education
  Education: [{
    Level: { type: String },
    SchoolCityState: { type: String },
    NoOfYears: { type: String },
    DidYouGraduate: { type: String },
    SubjectsStudied: { type: String }
  }],

  // Employment
  Employment: [{
    DateMonthYear: { type: String },
    NameAndAddress: { type: String },
    SalaryUponLeaving: { type: String },
    Position: { type: String },
    ReasonForLeaving: { type: String }
  }],

  // Special Skills
  SpecialSkills: { type: String },

  // References
  References: [{
    Name: { type: String },
    PhoneBus: { type: String },
    YearsAcquainted: { type: String },
    Title: { type: String },
    CompanyName: { type: String }
  }],
  
  // Others
  HaveYouBeenConvicted: { type: String },
  ConvictionDetails: { type: String },
  ApplicantSignatureDate: { type: String },
  
  // File Path for Photograph
  PhotographPath: { type: String },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);
