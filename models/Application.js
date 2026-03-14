const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // Step 1: Personal Data
  position: String,
  source: String,
  surname: String,
  firstName: String,
  middleName: String,
  communicationAddress: String,
  permanentAddress: String,
  telRes: String,
  telOffice: String,
  cell: String,
  email: String,
  emergencyName: String,
  emergencyRelation: String,
  emergencyPhone: String,
  emergencyAddress: String,
  aadhaarNo: String,
  panNo: String,
  dob: String,
  placeOfBirth: String,
  nationality: String,
  maritalStatus: String,
  numberOfChildren: Number,
  ageOfChildren: String,
  bloodGroup: String,
  identificationMark: String,
  height: String,
  weight: String,
  fatherName: String,
  fatherOccupation: String,
  spouseName: String,
  spouseOccupation: String,
  spouseQualification: String,
  relativeInCompany: String,
  previouslyEmployed: String,
  previousInterview: String,
  healthHistory: String,
  hobbies: String,

  // Step 2: Education & Training
  languages: [Object], // [{language, speak, read, write}]
  education: [Object], // [{exam, institute, year, subjects, percentage}]
  academicAchievements: String,
  professionalMemberships: String,
  training: [Object], // [{organisation, from, to, details}]

  // Step 3: Employment
  employment: [Object], // [{organisation, designation, from, to, salary, reason}]
  totalExperience: String,

  // Step 4: Compensation
  salBasic: String,
  salLunch: String,
  salDA: String,
  salEntertainment: String,
  salHRA: String,
  salFurnishing: String,
  salConveyance: String,
  salOther: String,
  salEducation: String,
  salLTA: String,
  salMedical: String,
  salPF: String,
  salSuperannuation: String,
  salGross: String,
  salAnnualCTC: String,
  otherPerks: String,
  expectedSalary: String,
  joiningDate: String,
  additionalInfo: String,

  // Step 5: References & Declaration
  refAName: String,
  refAContact: String,
  refBName: String,
  refBContact: String,
  priorApproval: String,
  declarationDate: String,
  signatureName: String,

  // File Path
  PhotographPath: String,

  createdAt: { type: Date, default: Date.now }
}, { strict: false });

module.exports = mongoose.model('Application', applicationSchema);
