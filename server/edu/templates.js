// ClarioLoop Edu: 8-State Lifecycle Engine & Ready-Made Checklists (Sections A-J)

export const EDU_DOC_STATUSES = [
  'NOT_REQUESTED',
  'REQUESTED',
  'RECEIVED',
  'UNDER_REVIEW',
  'VERIFIED',
  'REJECTED_RESUBMISSION_REQUIRED',
  'NOT_APPLICABLE',
  'CLOSED',
];

export const VALID_EDU_TRANSITIONS = {
  NOT_REQUESTED: ['REQUESTED', 'NOT_APPLICABLE'],
  REQUESTED: ['RECEIVED', 'NOT_APPLICABLE'],
  RECEIVED: ['UNDER_REVIEW', 'REJECTED_RESUBMISSION_REQUIRED', 'NOT_APPLICABLE'],
  UNDER_REVIEW: ['VERIFIED', 'REJECTED_RESUBMISSION_REQUIRED', 'NOT_APPLICABLE'],
  REJECTED_RESUBMISSION_REQUIRED: ['REQUESTED', 'RECEIVED', 'NOT_APPLICABLE'],
  VERIFIED: ['CLOSED', 'NOT_APPLICABLE'],
  NOT_APPLICABLE: ['NOT_REQUESTED', 'REQUESTED', 'CLOSED'],
  CLOSED: [],
};

export function transitionEduDocStatus({ fromStatus, toStatus, actorUserId, reason }) {
  if (!actorUserId) throw new Error('Actor userId is required');
  if (fromStatus === toStatus) throw new Error(`Already in status ${fromStatus}`);
  const allowed = VALID_EDU_TRANSITIONS[fromStatus] || [];
  if (!allowed.includes(toStatus)) {
    throw new Error(`Invalid status transition from ${fromStatus} to ${toStatus}`);
  }
  const cleanReason = reason ? String(reason).trim() : null;
  if (['REJECTED_RESUBMISSION_REQUIRED', 'NOT_APPLICABLE'].includes(toStatus) && !cleanReason) {
    throw new Error(`Reason is mandatory when setting status to ${toStatus}`);
  }
  return {
    fromStatus,
    toStatus,
    actorUserId,
    reason: cleanReason,
    updatedAt: new Date().toISOString(),
  };
}

const item = (code, title, tag, opts = {}) => ({
  code,
  title,
  tag, // 'CORE' | 'CONDITIONAL' | 'OPTIONAL' | 'STAFF_CHECK'
  sensitive: Boolean(opts.sensitive),
  conditionKey: opts.conditionKey || null,
  scholarshipOnly: Boolean(opts.scholarshipOnly),
});

export const EDU_CHECKLIST_SECTIONS = {
  // A. Admission application and identity (7 items)
  A: {
    code: 'SEC_A',
    name: 'A. Admission Application and Identity',
    items: [
      item('A_01', 'Completed Admission / Application Form with Application Number', 'CORE'),
      item('A_02', 'Counselling / Seat Allotment / Admission Offer Letter', 'CONDITIONAL', { conditionKey: 'IS_COUNSELLING_OR_ALLOTMENT' }),
      item('A_03', 'Recent Passport-Size Photographs', 'CORE'),
      item('A_04', 'Date of Birth Proof (Birth Certificate / Class 10 Marks Card)', 'CORE'),
      item('A_05', 'Student Identity Proof (School/College ID, Passport, Voter ID, or Aadhaar ONLY if voluntarily/legally required)', 'OPTIONAL'),
      item('A_06', 'Parent / Guardian Identity Proof & Consent (Minor Student)', 'CONDITIONAL', { conditionKey: 'IS_MINOR' }),
      item('A_07', 'Academic Bank of Credits (ABC) / APAAR ID (where applicable)', 'OPTIONAL'),
    ],
  },

  // B. Previous academic qualification (10 items)
  B: {
    code: 'SEC_B',
    name: 'B. Previous Academic Qualification',
    items: [
      item('B_01', 'Class 10 / SSLC / Matriculation Marks Card', 'CORE'),
      item('B_02', 'Class 12 / PUC / Intermediate Marks Card', 'CONDITIONAL', { conditionKey: 'REQUIRES_12TH' }),
      item('B_03', 'Diploma Marks Cards & Provisional / Diploma Certificate', 'CONDITIONAL', { conditionKey: 'IS_LATERAL_ENTRY' }),
      item('B_04', 'Undergraduate Degree Marks Cards (All Semesters) & Provisional Degree', 'CONDITIONAL', { conditionKey: 'IS_POSTGRADUATE' }),
      item('B_05', 'Entrance Exam Score / Rank Card (CET / JEE / NEET / PGCET / GATE)', 'CONDITIONAL', { conditionKey: 'IS_ENTRANCE_ROUTE' }),
      item('B_06', 'Original Transfer Certificate (TC) / School Leaving Certificate', 'CORE'),
      item('B_07', 'Migration Certificate (Inter-Board / Inter-University Transfer)', 'CONDITIONAL', { conditionKey: 'IS_INTER_BOARD_OR_UNIV' }),
      item('B_08', 'Conduct & Character Certificate from Previous Institution', 'CORE'),
      item('B_09', 'Study / Bonafide Certificate (for Domicile / Rural / Kannada Medium Quota)', 'CONDITIONAL', { conditionKey: 'HAS_QUOTA_CLAIM' }),
      item('B_10', 'Gap Affidavit / Self-Declaration (if gap year between qualifications)', 'CONDITIONAL', { conditionKey: 'HAS_STUDY_GAP' }),
    ],
  },

  // C. Reservation, category and fee concession (7 items)
  C: {
    code: 'SEC_C',
    name: 'C. Reservation, Category and Fee Concession',
    items: [
      item('C_01', 'Valid Caste / Category Certificate (SC / ST / OBC / EWS)', 'CONDITIONAL', { sensitive: true, conditionKey: 'CLAIMS_RESERVATION_OR_CONCESSION' }),
      item('C_02', 'Non-Creamy Layer (NCL) / EWS Validity Certificate', 'CONDITIONAL', { sensitive: true, conditionKey: 'CLAIMS_RESERVATION_OR_CONCESSION' }),
      item('C_03', 'Family Annual Income Certificate from Competent Authority', 'CONDITIONAL', { sensitive: true, conditionKey: 'CLAIMS_RESERVATION_OR_CONCESSION' }),
      item('C_04', 'Disability / PwD Certificate (UDID / Medical Board — Voluntary)', 'CONDITIONAL', { sensitive: true, conditionKey: 'CLAIMS_DISABILITY_SUPPORT' }),
      item('C_05', 'Domicile / Residence / Rural / Minority Certificate', 'CONDITIONAL', { conditionKey: 'HAS_QUOTA_CLAIM' }),
      item('C_06', 'Defence / Ex-Serviceman / Freedom Fighter / Sports Quota Proof', 'CONDITIONAL', { conditionKey: 'HAS_SPECIAL_QUOTA' }),
      item('C_07', 'Fee Concession / Freeship Application Declaration', 'CONDITIONAL', { conditionKey: 'CLAIMS_RESERVATION_OR_CONCESSION' }),
    ],
  },

  // D. Scholarship and government benefit documents (7 items)
  D: {
    code: 'SEC_D',
    name: 'D. Scholarship and Government Benefit Documents',
    items: [
      item('D_01', 'Scholarship Portal Application Acknowledgement (SSP / NSP)', 'CONDITIONAL', { conditionKey: 'IS_SCHOLARSHIP_APPLICANT', scholarshipOnly: true }),
      item('D_02', 'Student Bank Account Passbook Front Page (for DBT Schemes)', 'CONDITIONAL', { sensitive: true, conditionKey: 'IS_SCHOLARSHIP_APPLICANT', scholarshipOnly: true }),
      item('D_03', 'Aadhaar-Seeding / NPCI DBT Mapper Status (Only where scheme requires)', 'CONDITIONAL', { sensitive: true, conditionKey: 'IS_SCHOLARSHIP_APPLICANT', scholarshipOnly: true }),
      item('D_04', 'Caste & Income Certificate Linked to Scholarship ID', 'CONDITIONAL', { sensitive: true, conditionKey: 'IS_SCHOLARSHIP_APPLICANT', scholarshipOnly: true }),
      item('D_05', 'Previous Year Promotion / Marks Proof (for Renewal Scholarship)', 'CONDITIONAL', { conditionKey: 'IS_SCHOLARSHIP_APPLICANT', scholarshipOnly: true }),
      item('D_06', 'Hosteller Certificate (if applying for Hostel Scholarship Add-on)', 'CONDITIONAL', { conditionKey: 'IS_SCHOLARSHIP_AND_HOSTEL', scholarshipOnly: true }),
      item('D_07', 'Self-Declaration of Non-Receipt of Duplicate Scholarship', 'CONDITIONAL', { conditionKey: 'IS_SCHOLARSHIP_APPLICANT', scholarshipOnly: true }),
    ],
  },

  // E. Fees, enrolment and institutional forms (8 items)
  E: {
    code: 'SEC_E',
    name: 'E. Fees, Enrolment and Institutional Forms',
    items: [
      item('E_01', 'Tuition & Admission Fee Payment Receipt / Challan', 'CORE'),
      item('E_02', 'University / Board Registration & Eligibility Form', 'CORE'),
      item('E_03', 'Anti-Ragging Undertaking (Student & Parent — UGC Format)', 'CORE'),
      item('E_04', 'Code of Conduct & Attendance Policy Acknowledgement', 'CORE'),
      item('E_05', 'Hostel Admission Form & Local Guardian Details', 'CONDITIONAL', { conditionKey: 'OPTS_HOSTEL' }),
      item('E_06', 'College / School Bus Transport Request & Route Form', 'CONDITIONAL', { conditionKey: 'OPTS_TRANSPORT' }),
      item('E_07', 'Library Membership & ID Card Issuance Form', 'CORE'),
      item('E_08', 'Student Privacy Notice & Data Collection Consent Record', 'CORE'),
    ],
  },

  // F. Health, safety and support information (5 items)
  F: {
    code: 'SEC_F',
    name: 'F. Health, Safety and Support Information',
    items: [
      item('F_01', 'Emergency Contact & Blood Group Information', 'CORE'),
      item('F_02', 'Physical Fitness / Medical Certificate (where required by programme)', 'OPTIONAL', { sensitive: true }),
      item('F_03', 'Voluntary Chronic Condition / Allergy Disclosure for Campus Care', 'OPTIONAL', { sensitive: true }),
      item('F_04', 'Reasonable Academic / Exam Accommodation Request (Voluntary)', 'CONDITIONAL', { sensitive: true, conditionKey: 'CLAIMS_DISABILITY_SUPPORT' }),
      item('F_05', 'Student Group Accident / Health Insurance Consent (if offered)', 'OPTIONAL'),
    ],
  },

  // G. Continuing students, semester/annual update (7 items)
  G: {
    code: 'SEC_G',
    name: 'G. Continuing Students — Semester / Annual Update',
    items: [
      item('G_01', 'Semester / Annual Registration or Exam Application Acknowledgement', 'CORE'),
      item('G_02', 'Previous Semester / Annual Marks Card', 'CORE'),
      item('G_03', 'Promotion / Carry-Over / Backlog Status Confirmation', 'CORE'),
      item('G_04', 'Updated Student & Parent Contact / Address Details', 'CORE'),
      item('G_05', 'Scholarship Renewal Documents & Attendance Certificate', 'CONDITIONAL', { conditionKey: 'IS_SCHOLARSHIP_APPLICANT', scholarshipOnly: true }),
      item('G_06', 'Current Year Tuition / Exam Fee Payment Acknowledgement', 'CORE'),
      item('G_07', 'Internship / Mini-Project / Industrial Visit Record (if applicable)', 'OPTIONAL'),
    ],
  },

  // H. Internship, placement and career services (6 items)
  H: {
    code: 'SEC_H',
    name: 'H. Internship, Placement and Career Services',
    items: [
      item('H_01', 'Placement Cell Registration & Policy Acknowledgement', 'CORE'),
      item('H_02', 'Updated Student Curriculum Vitae (CV / Resume)', 'CORE'),
      item('H_03', 'Per-Recruiter Profile Sharing Consent Record', 'CORE'),
      item('H_04', 'Internship Offer Letter / No-Objection Certificate (NOC)', 'OPTIONAL'),
      item('H_05', 'Internship / Placement Joining Report', 'OPTIONAL'),
      item('H_06', 'Internship Completion / Training Certificate', 'OPTIONAL'),
    ],
  },

  // I. Completion, transfer or exit (5 items)
  I: {
    code: 'SEC_I',
    name: 'I. Completion, Transfer or Exit',
    items: [
      item('I_01', 'Sectional No-Dues Clearance (Library, Lab, Hostel, Transport, Accounts)', 'CORE'),
      item('I_02', 'Transfer / Migration / Discontinuation Request & Approval', 'CORE'),
      item('I_03', 'Final Consolidated Marks Card / Provisional Degree Certificate Dispatch Log', 'CORE'),
      item('I_04', 'Original Documents Return Acknowledgement', 'CORE'),
      item('I_05', 'Optional Alumni Network & Contact Consent', 'OPTIONAL'),
    ],
  },

  // J. Staff verification and closure (9 items — labelled STAFF_CHECK)
  J: {
    code: 'SEC_J',
    name: 'J. Staff Verification and Closure',
    items: [
      item('J_01', 'Identity matched to admission application & photo record', 'STAFF_CHECK'),
      item('J_02', 'Academic qualifications verified against admission route & eligibility', 'STAFF_CHECK'),
      item('J_03', 'Category, income & scholarship certificates checked for validity and issuing authority', 'STAFF_CHECK'),
      item('J_04', 'All uploaded scans readable, complete and linked to right items', 'STAFF_CHECK'),
      item('J_05', 'Originals inspected and returned to student/parent (where presented)', 'STAFF_CHECK'),
      item('J_06', 'Missing or pending items listed with clear due dates', 'STAFF_CHECK'),
      item('J_07', 'Student / parent notified of pending or rejected items', 'STAFF_CHECK'),
      item('J_08', 'Printable acknowledgement generated & signed copy archived', 'STAFF_CHECK'),
      item('J_09', 'Authorised staff final review and checklist closure sign-off', 'STAFF_CHECK'),
    ],
  },
};
