// 15 Ready-Made Editable Insurance Checklists with Exact Item Counts & Per-Insurer Overrides

export const INSURANCE_STATUSES = [
  'NOT_REQUESTED',
  'REQUESTED',
  'RECEIVED',
  'UNDER_REVIEW',
  'VERIFIED',
  'REJECTED_RESUBMISSION_REQUIRED',
  'NOT_APPLICABLE',
];

export const VALID_INSURANCE_TRANSITIONS = {
  NOT_REQUESTED: ['REQUESTED', 'NOT_APPLICABLE'],
  REQUESTED: ['RECEIVED', 'NOT_APPLICABLE'],
  RECEIVED: ['UNDER_REVIEW', 'REJECTED_RESUBMISSION_REQUIRED', 'NOT_APPLICABLE'],
  UNDER_REVIEW: ['VERIFIED', 'REJECTED_RESUBMISSION_REQUIRED', 'NOT_APPLICABLE'],
  REJECTED_RESUBMISSION_REQUIRED: ['REQUESTED', 'RECEIVED', 'NOT_APPLICABLE'],
  VERIFIED: ['NOT_APPLICABLE'],
  NOT_APPLICABLE: ['NOT_REQUESTED', 'REQUESTED'],
};

export function transitionInsuranceDocStatus({ fromStatus, toStatus, actorUserId, reason }) {
  if (!actorUserId) throw new Error('Actor userId is required');
  if (fromStatus === toStatus) throw new Error(`Already in status ${fromStatus}`);
  const allowed = VALID_INSURANCE_TRANSITIONS[fromStatus] || [];
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

const makeItems = (prefix, titles, defaultReq = 'MANDATORY') =>
  titles.map((t, i) => {
    const isObj = typeof t === 'object';
    return {
      code: `${prefix}_${String(i + 1).padStart(2, '0')}`,
      title: isObj ? t.title : t,
      requirement: isObj ? t.requirement : defaultReq,
      sensitive: isObj ? Boolean(t.sensitive) : false,
      conditionKey: isObj ? t.conditionKey || null : null,
    };
  });

export const READY_MADE_CHECKLISTS = {
  // 1. Basic customer information (14 items)
  BASIC_CUSTOMER_INFO: {
    code: 'TPL_BASIC_INFO',
    name: 'Basic Customer Information',
    version: 1,
    effectiveDate: '2026-01-01',
    items: makeItems('BAS', [
      'Full Legal Name (as per Officially Valid Document)',
      'Father\'s / Spouse\'s Name',
      'Date of Birth / Incorporation Date',
      'Gender (where required by insurer)',
      'Primary Mobile Number',
      'Email Address',
      'Current Residential Address',
      'Permanent Address',
      'Occupation & Nature of Work',
      'Declared Annual Income Range',
      'Marital Status',
      'Recent Passport-Size Photograph',
      'Preferred Language & Communication Channel',
      'Privacy Notice & Consent Acknowledgement',
    ]),
  },

  // 2. KYC and identity (10 items — Aadhaar NOT universally mandatory)
  KYC_IDENTITY: {
    code: 'TPL_KYC_IDENTITY',
    name: 'KYC & Identity Verification (Configurable per Insurer)',
    version: 1,
    effectiveDate: '2026-01-01',
    items: makeItems('KYC', [
      'PAN Card or Form 60 Declaration (as applicable)',
      'Officially Valid ID Proof (Passport / Voter ID / Driving Licence / Govt ID)',
      { title: 'Aadhaar Copy (Optional — only if voluntarily provided & allowed by insurer)', requirement: 'OPTIONAL' },
      'Current Address Proof (Utility Bill / Rent Agreement / Bank Passbook)',
      'Permanent Address Proof (if different from current)',
      'Age Proof Document (Birth Certificate / School Leaving / Passport)',
      'CKYC Identifier / CKYC Consent Form',
      'Cancelled Cheque / Bank Account Mandate Proof',
      { title: 'NRI Passport, Visa & PIO/OCI Proof', requirement: 'CONDITIONAL', conditionKey: 'IS_NRI' },
      { title: 'PEP / FATCA / CRS Self-Declaration', requirement: 'CONDITIONAL', conditionKey: 'HIGH_VALUE_OR_NRI' },
    ]),
  },

  // 3. Life / LIC proposal (20 items)
  LIFE_PROPOSAL: {
    code: 'TPL_LIFE_PROPOSAL',
    name: 'Life / LIC Proposal Checklist',
    version: 1,
    effectiveDate: '2026-01-01',
    items: makeItems('LIFE', [
      'Duly Filled & Signed Life Insurance Proposal Form',
      'Benefit Illustration Signed by Proposer & Agent',
      'Customer Suitability & Need Analysis Sheet (where required)',
      'Age Proof (Standard / Non-Standard per Insurer Table)',
      'Identity & Address KYC Pack',
      'PAN Card / Form 60',
      'First Premium Deposit Receipt / Payment Confirmation Proof',
      'Bank Mandate / NACH Form with Cancelled Cheque',
      { title: 'Salaried Income Proof (3 Months Salary Slips & Form 16)', requirement: 'CONDITIONAL', conditionKey: 'IS_SALARIED' },
      { title: 'Self-Employed / Business ITR (Last 3 Years) & Financials', requirement: 'CONDITIONAL', conditionKey: 'IS_BUSINESS_OR_SEP' },
      { title: 'Medical Examiner Report (MER) & Tele-Medical Summary', requirement: 'CONDITIONAL', sensitive: true, conditionKey: 'MEDICAL_REQUIRED' },
      { title: 'Pathological / ECG / Lipid / HbA1c Lab Reports', requirement: 'CONDITIONAL', sensitive: true, conditionKey: 'MEDICAL_REQUIRED' },
      'Personal Medical & Lifestyle Habits Questionnaire',
      'Family History Declaration',
      'Existing Life Insurance Policies Disclosure',
      'Nominee Details & Relationship Declaration',
      { title: 'Appointee / Guardian KYC & Consent (Minor Nominee)', requirement: 'CONDITIONAL', conditionKey: 'MINOR_NOMINEE' },
      { title: 'Moral Hazard Report (MHR) / Agent Confidential Report', requirement: 'MANDATORY' },
      { title: 'Employer / Keyman / MWP Act Addendum (if applicable)', requirement: 'OPTIONAL' },
      { title: 'NRI Special Questionnaire & Overseas Residence Proof', requirement: 'CONDITIONAL', conditionKey: 'IS_NRI' },
    ]),
  },

  // 4. Health proposal (17 items)
  HEALTH_PROPOSAL: {
    code: 'TPL_HEALTH_PROPOSAL',
    name: 'Health Insurance Proposal Checklist',
    version: 1,
    effectiveDate: '2026-01-01',
    items: makeItems('HLT', [
      'Signed Health Insurance Proposal Form',
      'Proposer & Insured Members KYC Pack',
      'Age & Relationship Proof for Family Floater Members',
      { title: 'Pre-Existing Disease (PED) & Past Hospitalisation Declaration', requirement: 'MANDATORY', sensitive: true },
      { title: 'Pre-Policy Medical Check-up (PPMC) Report', requirement: 'CONDITIONAL', sensitive: true, conditionKey: 'MEDICAL_REQUIRED' },
      { title: 'Previous Insurer Policy Copies (for Portability / Continuity)', requirement: 'CONDITIONAL', conditionKey: 'IS_PORTABILITY' },
      { title: 'Portability Form & Claim-Free Renewal History', requirement: 'CONDITIONAL', conditionKey: 'IS_PORTABILITY' },
      'Height, Weight & BMI Declaration',
      'Lifestyle Habits Disclosure (Tobacco / Alcohol)',
      { title: 'Maternity / Newborn Inclusion Records (if applicable)', requirement: 'OPTIONAL', sensitive: true },
      { title: 'Senior Citizen Co-Pay & Zone Consent Form', requirement: 'CONDITIONAL', conditionKey: 'IS_SENIOR' },
      'Nominee Name & Relationship Form',
      { title: 'Guardian / Appointee Proof (if nominee is minor)', requirement: 'CONDITIONAL', conditionKey: 'MINOR_NOMINEE' },
      'Bank Details & Cancelled Cheque (for claim refunds)',
      'Premium Payment Confirmation Receipt',
      'Tele-Underwriting Audio/OTP Consent Confirmation',
      'Preferred Hospital Network / TPA Acknowledgement',
    ]),
  },

  // 5. Motor (15 items)
  MOTOR_PROPOSAL: {
    code: 'TPL_MOTOR_PROPOSAL',
    name: 'Motor Insurance Proposal & Renewal',
    version: 1,
    effectiveDate: '2026-01-01',
    items: makeItems('MOT', [
      'Signed Motor Proposal Form',
      'Vehicle Registration Certificate (RC) Copy',
      'Previous Year Policy Copy (for Renewal / Rollover)',
      'No Claim Bonus (NCB) Declaration / Renewal Notice',
      'Owner KYC (ID & Address Proof)',
      'Valid Driving Licence of Primary Driver',
      'Pre-Inspection Photos / Video (Break-in Case)',
      'Engine Number & Chassis Number Verification Trace',
      'Ex-Showroom Invoice (New Vehicle)',
      { title: 'Hypothecation / Financer Loan Letter (if financed)', requirement: 'CONDITIONAL', conditionKey: 'IS_FINANCED_VEHICLE' },
      { title: 'Valid Pollution Under Control (PUC) Certificate', requirement: 'MANDATORY' },
      { title: 'Commercial Vehicle Permit & Road Tax Receipt', requirement: 'CONDITIONAL', conditionKey: 'IS_COMMERCIAL_VEHICLE' },
      { title: 'Vehicle Fitness Certificate (Form 38)', requirement: 'CONDITIONAL', conditionKey: 'IS_COMMERCIAL_VEHICLE' },
      'CNG / LPG Kit Endorsement in RC (if bi-fuel)',
      'IDV & Add-On Cover Selection Sheet (Zero Dep / RTI / Engine)',
    ]),
  },

  // 6. General insurance by type (8 sub-types)
  GENERAL_HOME: {
    code: 'TPL_GEN_HOME',
    name: 'General: Home & Property Insurance',
    version: 1,
    effectiveDate: '2026-01-01',
    items: makeItems('GHM', [
      'Signed Home Insurance Proposal Form',
      'Property Ownership Deed / Municipal Tax Receipt',
      'Building Valuation / Carpet Area Declaration',
      'Contents / Valuables Itemised Inventory List',
      'Premises Photographs & Security Locks Declaration',
      'Previous Policy & Loss History (3 Years)',
    ]),
  },
  GENERAL_FIRE_COMMERCIAL: {
    code: 'TPL_GEN_FIRE',
    name: 'General: Fire & Commercial Property',
    version: 1,
    effectiveDate: '2026-01-01',
    items: makeItems('GFR', [
      'Signed Fire / Bharat Sookshma / Laghu Udyam Proposal',
      'Business GST & Trade Licence',
      'Fire NOC & Hydrant / Extinguisher Inspection Proof',
      'Stock Register & Plant/Machinery Asset Schedule',
      'Risk Inspection Survey Report',
      'Previous 3 Years Claims Experience Letter',
    ]),
  },
  GENERAL_SHOP_PACKAGE: {
    code: 'TPL_GEN_SHOP',
    name: 'General: Shopkeeper Package',
    version: 1,
    effectiveDate: '2026-01-01',
    items: makeItems('GSH', [
      'Signed Shop Package Proposal Form',
      'Shop & Establishment Registration Certificate',
      'Stock Valuation & Burglary Protection Details',
      'Plate Glass / Neon Sign Measurements',
      'Employee Fidelity / Money-in-Transit Limits Sheet',
    ]),
  },
  GENERAL_MARINE: {
    code: 'TPL_GEN_MARINE',
    name: 'General: Marine / Transit Cargo',
    version: 1,
    effectiveDate: '2026-01-01',
    items: makeItems('GMR', [
      'Signed Marine Open / Specific Voyage Proposal',
      'Commercial Invoice & Packing List',
      'Bill of Lading / Airway Bill / Lorry Receipt (LR)',
      'Letter of Credit (if export/import)',
      'Packaging Type & Route Risk Declaration',
    ]),
  },
  GENERAL_TRAVEL: {
    code: 'TPL_GEN_TRAVEL',
    name: 'General: Overseas / Domestic Travel',
    version: 1,
    effectiveDate: '2026-01-01',
    items: makeItems('GTR', [
      'Signed Travel Insurance Proposal Form',
      'Valid Passport & Visa Copy',
      'Flight Ticket / Confirmed Travel Itinerary',
      { title: 'Pre-Existing Medical Declaration (Travel)', requirement: 'MANDATORY', sensitive: true },
      'University Admission Letter (for Student Travel)',
    ]),
  },
  GENERAL_PERSONAL_ACCIDENT: {
    code: 'TPL_GEN_PA',
    name: 'General: Personal Accident (PA)',
    version: 1,
    effectiveDate: '2026-01-01',
    items: makeItems('GPA', [
      'Signed PA Proposal Form & Occupation Class',
      'KYC & Age Proof',
      'Income Proof (for Capital Sum Insured justification)',
      'Nominee Details Form',
      { title: 'Guardian Proof (if nominee minor)', requirement: 'CONDITIONAL', conditionKey: 'MINOR_NOMINEE' },
    ]),
  },
  GENERAL_MACHINERY: {
    code: 'TPL_GEN_MACHINERY',
    name: 'General: Machinery / Engineering (MBD/CPM)',
    version: 1,
    effectiveDate: '2026-01-01',
    items: makeItems('GMC', [
      'Signed Engineering / Machinery Breakdown Proposal',
      'Equipment Schedule with Make, Model, Year & Serial No.',
      'Purchase Invoice / Replacement Value Proof',
      'Maintenance / AMC Contract Copy',
      'Site Location & Operator Competency Details',
    ]),
  },
  GENERAL_COMMERCIAL_VEHICLE: {
    code: 'TPL_GEN_CV',
    name: 'General: Commercial Vehicle Package',
    version: 1,
    effectiveDate: '2026-01-01',
    items: makeItems('GCV', [
      'Signed Commercial Vehicle Proposal',
      'RC Book & National / State Goods Permit',
      'Valid Fitness Certificate (Form 38)',
      'Road Tax Paid Receipt & PUC',
      'Driver Heavy Vehicle Licence & Badge',
      { title: 'Financer Hypothecation Endorsement', requirement: 'CONDITIONAL', conditionKey: 'IS_FINANCED_VEHICLE' },
    ]),
  },

  // 7. Life death claim (12 items)
  LIFE_DEATH_CLAIM: {
    code: 'TPL_LIFE_DEATH_CLAIM',
    name: 'Life Insurance Death Claim',
    version: 1,
    effectiveDate: '2026-01-01',
    items: makeItems('LDC', [
      'Claimant Statement / Death Claim Form A',
      'Original Policy Bond / Schedule',
      'Municipal Death Certificate (Attested Copy)',
      'Claimant / Nominee KYC & Relationship Proof',
      'Claimant Cancelled Cheque & NEFT Mandate',
      { title: 'Medical Attendant Certificate & Hospital Treatment Records', requirement: 'CONDITIONAL', sensitive: true, conditionKey: 'EARLY_OR_NATURAL_DEATH' },
      { title: 'Police FIR, Panchanama & Post-Mortem Report (Accidental Death)', requirement: 'CONDITIONAL', sensitive: true, conditionKey: 'ACCIDENTAL_DEATH' },
      'Employer Leave / Death Certificate (if salaried)',
      { title: 'Legal Heir / Succession Certificate (if no valid nominee)', requirement: 'CONDITIONAL', conditionKey: 'NO_NOMINEE' },
      { title: 'Guardian / Appointee Proof (if claimant is minor)', requirement: 'CONDITIONAL', conditionKey: 'MINOR_NOMINEE' },
      'Discharge Voucher Signed by Claimant',
      'Insurer Investigation / Additional Query Response Sheet',
    ]),
  },

  // 8. Life maturity / survival (7 items)
  LIFE_MATURITY_CLAIM: {
    code: 'TPL_LIFE_MATURITY',
    name: 'Life Maturity / Survival Benefit Claim',
    version: 1,
    effectiveDate: '2026-01-01',
    items: makeItems('LMC', [
      'Signed Maturity / Survival Discharge Form',
      'Original Policy Bond',
      'Policyholder KYC (ID & Address Proof)',
      'PAN Card / Form 60 (for TDS compliance)',
      'Cancelled Cheque / Bank Passbook Copy for NEFT',
      'Survival Certificate / Existence Proof (Annuity)',
      'Pending Premium / Policy Loan Clearance Confirmation',
    ]),
  },

  // 9. Policy servicing (10 items)
  POLICY_SERVICING: {
    code: 'TPL_POLICY_SERVICING',
    name: 'Policy Servicing (Nominee / Mandate / Address / Assignment / Revival / Surrender)',
    version: 1,
    effectiveDate: '2026-01-01',
    items: makeItems('SRV', [
      'Signed Policy Servicing Request Form',
      'Policyholder Identity Verification',
      'Original Policy Bond / Endorsement Copy',
      { title: 'New Nominee KYC & Relationship Proof (Nominee Change)', requirement: 'CONDITIONAL', conditionKey: 'SRV_NOMINEE_CHANGE' },
      { title: 'Guardian Declaration (if new nominee minor)', requirement: 'CONDITIONAL', conditionKey: 'MINOR_NOMINEE' },
      { title: 'Cancelled Cheque & Bank Passbook (Bank Mandate Change)', requirement: 'CONDITIONAL', conditionKey: 'SRV_BANK_CHANGE' },
      { title: 'Updated Address Proof (Address Change)', requirement: 'CONDITIONAL', conditionKey: 'SRV_ADDRESS_CHANGE' },
      { title: 'Deed of Assignment & Assignee KYC (Assignment)', requirement: 'CONDITIONAL', conditionKey: 'SRV_ASSIGNMENT' },
      { title: 'Declaration of Good Health (DGH) for Policy Revival', requirement: 'CONDITIONAL', sensitive: true, conditionKey: 'SRV_REVIVAL' },
      { title: 'Surrender / Policy Loan Discharge Voucher', requirement: 'CONDITIONAL', conditionKey: 'SRV_SURRENDER_OR_LOAN' },
    ]),
  },

  // 10. Health claim (17 items, cashless & reimbursement variants)
  HEALTH_CLAIM: {
    code: 'TPL_HEALTH_CLAIM',
    name: 'Health Insurance Claim (Cashless & Reimbursement)',
    version: 1,
    effectiveDate: '2026-01-01',
    items: makeItems('HCL', [
      'Duly Filled Health Claim Form (Part A & Part B)',
      'Health Card / Policy Copy',
      'Patient & Proposer KYC Proof',
      { title: 'Cashless Pre-Authorisation Form & Hospital Estimate', requirement: 'CONDITIONAL', sensitive: true, conditionKey: 'CLAIM_CASHLESS' },
      { title: 'Hospital Final Consolidated Bill with Break-up', requirement: 'MANDATORY', sensitive: true },
      { title: 'Original Payment Receipts (for Reimbursement)', requirement: 'CONDITIONAL', conditionKey: 'CLAIM_REIMBURSEMENT' },
      { title: 'Hospital Discharge Summary (Signed & Stamped)', requirement: 'MANDATORY', sensitive: true },
      { title: 'Indoor Case Papers (ICP) & Doctor Daily Notes', requirement: 'CONDITIONAL', sensitive: true, conditionKey: 'CLAIM_REIMBURSEMENT' },
      { title: 'Diagnostic Lab Reports, X-Ray, CT/MRI Films & Invoices', requirement: 'MANDATORY', sensitive: true },
      { title: 'Pharmacy Bills Supported by Doctor Prescriptions', requirement: 'MANDATORY', sensitive: true },
      { title: 'Implant / Stent / Prosthesis Sticker & Invoice (if surgery)', requirement: 'OPTIONAL', sensitive: true },
      { title: 'First Consultation Paper & Referral Letter', requirement: 'MANDATORY', sensitive: true },
      { title: 'Treating Doctor Certificate (for Pre/Post Hospitalisation)', requirement: 'OPTIONAL', sensitive: true },
      { title: 'Police FIR / MLC Report (if road accident / medico-legal)', requirement: 'CONDITIONAL', sensitive: true, conditionKey: 'ACCIDENTAL_INJURY' },
      { title: 'Cancelled Cheque of Proposer (for Reimbursement NEFT)', requirement: 'CONDITIONAL', conditionKey: 'CLAIM_REIMBURSEMENT' },
      { title: 'CKYC / AML Proof (for Claims > ₹1 Lakh)', requirement: 'MANDATORY' },
      'Insurer / TPA Query Clarification Letter (if raised)',
    ]),
  },

  // 11. Motor accident / damage claim (14 items)
  MOTOR_CLAIM: {
    code: 'TPL_MOTOR_CLAIM',
    name: 'Motor Accident / Damage Claim',
    version: 1,
    effectiveDate: '2026-01-01',
    items: makeItems('MCL', [
      'Signed Motor Claim Intimation & Claim Form',
      'Policy Copy & RC Book Copy',
      'Driving Licence of Person Driving at Time of Accident',
      'Spot & Workshop Damage Photographs',
      'Garage Repair Estimate',
      'Surveyor Inspection Report Reference',
      { title: 'Police FIR / Panchanama (Third-Party / Theft / Major Accident)', requirement: 'CONDITIONAL', conditionKey: 'MAJOR_OR_THEFT' },
      { title: 'Commercial Permit, Fitness & Load Challan (Commercial Vehicle)', requirement: 'CONDITIONAL', conditionKey: 'IS_COMMERCIAL_VEHICLE' },
      'Final Repair Invoice & Tax Break-up',
      'Payment Receipt (if Reimbursement) / Satisfaction Voucher (Cashless)',
      'Insured KYC & PAN (Claims > ₹1 Lakh)',
      'Bank NEFT / Cancelled Cheque (if Reimbursement)',
      { title: 'Financer NOC / Joint Discharge (Total Loss / Theft)', requirement: 'CONDITIONAL', conditionKey: 'IS_FINANCED_VEHICLE' },
      'RTO Non-Traceable Report & Keys Surrender (Theft Claim)',
    ]),
  },

  // 12. Nominee / beneficiary (9 items)
  NOMINEE_BENEFICIARY: {
    code: 'TPL_NOMINEE',
    name: 'Nominee / Beneficiary Documentation',
    version: 1,
    effectiveDate: '2026-01-01',
    items: makeItems('NOM', [
      'Nominee Full Legal Name & Date of Birth',
      'Relationship with Proposer / Policyholder',
      'Percentage Share Allocation (Total = 100%)',
      'Nominee Identity Proof (Optional at proposal, Mandatory at claim)',
      'Nominee Contact Number & Address',
      { title: 'Appointee / Guardian Full Name & Signature (Minor Nominee)', requirement: 'CONDITIONAL', conditionKey: 'MINOR_NOMINEE' },
      { title: 'Appointee KYC Proof (Minor Nominee)', requirement: 'CONDITIONAL', conditionKey: 'MINOR_NOMINEE' },
      { title: 'Appointee Relationship & Minor Consent Declaration', requirement: 'CONDITIONAL', conditionKey: 'MINOR_NOMINEE' },
      'Witness Signature on Nomination Schedule',
    ]),
  },

  // 13. Corporate / group (15 items)
  CORPORATE_GROUP: {
    code: 'TPL_CORPORATE_GROUP',
    name: 'Corporate / Group Insurance Checklist',
    version: 1,
    effectiveDate: '2026-01-01',
    items: makeItems('CRP', [
      'Signed Group Master Proposal Form',
      'Certificate of Incorporation / Partnership Deed',
      'Memorandum & Articles of Association / LLP Agreement',
      'Board Resolution Authorising Insurance & Signatories',
      'Entity PAN Card & GST Registration Certificate',
      'Authorised Signatory KYC & Specimen Signatures',
      'Beneficial Ownership (UBO) Declaration',
      'Active Employee / Member Census Sheet (Name, DOB, Gender, Sum Insured)',
      'Dependant Inclusion List & Relationship Mapping (if family floater)',
      'Previous 3 Years Group Claim Experience & Loss Ratio Report',
      'Existing Master Policy & Endorsements (if rollover)',
      'Monthly Addition / Deletion Endorsement Format Sign-off',
      'CD Account / Float Deposit Confirmation Receipt',
      'Employer-Employee Relationship Confirmation',
      'Group Privacy & Member Consent Undertaking',
    ]),
  },

  // 14. Policy renewal and premium servicing (11 items)
  RENEWAL_PREMIUM: {
    code: 'TPL_RENEWAL_PREMIUM',
    name: 'Policy Renewal & Premium Servicing',
    version: 1,
    effectiveDate: '2026-01-01',
    items: makeItems('REN', [
      'Previous Policy Schedule & Renewal Notice',
      'Renewal Consent / Confirmation from Policyholder',
      'Updated Contact, Address & Nominee Confirmation',
      'Updated Vehicle PUC / Fitness (for Motor Renewal)',
      'NCB Verification / Claim-Free Declaration',
      'Break-in Inspection Report (if lapsed > grace period)',
      { title: 'Declaration of Good Health (for Lapsed Life/Health Revival)', requirement: 'CONDITIONAL', sensitive: true, conditionKey: 'IS_LAPSED_REVIVAL' },
      'Premium Payment Receipt / UTR Confirmation Upload (Tracking Only)',
      'NACH / Auto-Debit Mandate Renewal Form',
      'Sum Insured Enhancement / Add-on Change Request',
      'Updated Risk / Asset Value Declaration (Commercial)',
    ]),
  },

  // 15. Income and financial evidence by customer type
  INCOME_FINANCIAL_EVIDENCE: {
    code: 'TPL_INCOME_FINANCIAL',
    name: 'Income & Financial Evidence (By Customer Type)',
    version: 1,
    effectiveDate: '2026-01-01',
    items: makeItems('FIN', [
      { title: 'Last 3 Months Salary Slips', requirement: 'CONDITIONAL', conditionKey: 'IS_SALARIED' },
      { title: 'Employer Form 16 / Salary Certificate', requirement: 'CONDITIONAL', conditionKey: 'IS_SALARIED' },
      { title: 'Last 3 Years Income Tax Returns (ITR-V + Computation)', requirement: 'CONDITIONAL', conditionKey: 'IS_BUSINESS_OR_SEP' },
      { title: 'Audited / CA-Certified Balance Sheet & P&L (2–3 Years)', requirement: 'CONDITIONAL', conditionKey: 'IS_BUSINESS_OR_COMPANY' },
      { title: 'Last 6–12 Months Bank Statements', requirement: 'MANDATORY' },
      { title: 'NRE / NRO Bank Statements & Overseas Employment Contract', requirement: 'CONDITIONAL', conditionKey: 'IS_NRI' },
      { title: 'Standard Income Declaration / Passbook (Non-ITR Individual)', requirement: 'CONDITIONAL', conditionKey: 'IS_INDIVIDUAL_NON_ITR' },
    ]),
  },
};
