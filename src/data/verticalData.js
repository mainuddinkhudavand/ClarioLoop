// ==========================================
// CLARIOLOOP MULTI-VERTICAL MASTER REPOSITORY
// 1. Finance & CA Practice (Tax Audit, GST, ROC, Payroll)
// 2. Cooperative Banking & Societies (PACS, UCB, DCCB, Pigmy, Loans)
// 3. Education & Admissions (Schools, PU, Degree, Engineering, Universities)
// 4. Insurance & Claims (LIC, Life, Health, Motor, General, Claims, Renewals)
// ==========================================

export const VERTICAL_DEFINITIONS = [
  {
    id: 'ca',
    name: 'CA & Tax Audit',
    shortName: 'CA Practice',
    tagline: 'Tax Audit 44AB, GST, ITR & Statutory Compliance',
    badge: 'Finance & Tax',
    themeColor: 'indigo',
    accentColor: '#4f46e5',
    icon: 'Building2',
    counterpartLabel: 'Client'
  },
  {
    id: 'cooperative',
    name: 'Cooperative Banking & Societies',
    shortName: 'Co-op Banking',
    tagline: 'Credit Societies, PACS, Urban Banks, Pigmy & Loans',
    badge: 'Banking & PACS',
    themeColor: 'emerald',
    accentColor: '#059669',
    icon: 'Landmark',
    counterpartLabel: 'Member / Depositor'
  },
  {
    id: 'education',
    name: 'Education & Admissions',
    shortName: 'Education Edu',
    tagline: 'Schools, Colleges, Universities, NAAC & Scholarships',
    badge: 'Campus & Academic',
    themeColor: 'blue',
    accentColor: '#2563eb',
    icon: 'GraduationCap',
    counterpartLabel: 'Student / Applicant'
  },
  {
    id: 'insurance',
    name: 'Insurance & Claims',
    shortName: 'Insurance Pro',
    tagline: 'LIC, Life, Health, Motor, Claims & IRDAI Renewals',
    badge: 'Insurance & Claims',
    themeColor: 'purple',
    accentColor: '#7c3aed',
    icon: 'ShieldCheck',
    counterpartLabel: 'Policyholder / Insured'
  }
];

// ==========================================
// 1. COOPERATIVE BANKING & SOCIETY OPERATIONS
// Master Checklist from ClarioLoop Cooperative PDF (18 pages)
// Target: Member-based Credit Societies, PACS, Urban Cooperative Banks (UCB), DCCB
// ==========================================
export const cooperativeMasterChecklist = [
  {
    code: 'M1',
    title: 'Member Registration and KYC',
    description: 'Personal KYC, membership shares, nominee details, and institutional member constitutional documents.',
    items: [
      { name: 'Membership / account opening application', defaultTag: 'Mandatory', category: 'Membership', acceptedTypes: 'PDF' },
      { name: 'Member/customer full name and member ID', defaultTag: 'Mandatory', category: 'Identity', acceptedTypes: 'PDF, JPG' },
      { name: "Father's / spouse's name, where collected", defaultTag: 'Conditional', category: 'Identity', acceptedTypes: 'PDF' },
      { name: 'Date of birth / incorporation date proof', defaultTag: 'Mandatory', category: 'Identity', acceptedTypes: 'PDF, JPG' },
      { name: 'Residential / registered address proof', defaultTag: 'Mandatory', category: 'Address', acceptedTypes: 'PDF, JPG' },
      { name: 'Mobile number and email address verification', defaultTag: 'Mandatory', category: 'Contact', acceptedTypes: 'SMS OTP, Email' },
      { name: 'Photograph of member', defaultTag: 'Mandatory', category: 'Photo', acceptedTypes: 'JPG, PNG' },
      { name: 'PAN or Form 60, as applicable', defaultTag: 'Mandatory', category: 'Tax ID', acceptedTypes: 'PDF, JPG' },
      { name: 'Officially valid KYC identity document (OVD)', defaultTag: 'Mandatory', category: 'KYC', acceptedTypes: 'PDF, JPG' },
      { name: 'Occupation / nature of business details', defaultTag: 'Conditional', category: 'Profile', acceptedTypes: 'PDF' },
      { name: 'Nominee details and nomination form', defaultTag: 'Mandatory', category: 'Nomination', acceptedTypes: 'PDF' },
      { name: 'Bank account details and supporting evidence', defaultTag: 'Conditional', category: 'Banking', acceptedTypes: 'PDF, JPG' },
      { name: 'Introducer details, if required by bye-laws', defaultTag: 'Conditional', category: 'Governance', acceptedTypes: 'PDF' },
      { name: 'Share capital subscription & member share details', defaultTag: 'Mandatory', category: 'Share Capital', acceptedTypes: 'PDF' },
      { name: 'Membership approval and resolution reference', defaultTag: 'Mandatory', category: 'Board Approval', acceptedTypes: 'PDF' },
      { name: 'Member number / customer ID generation record', defaultTag: 'Mandatory', category: 'Core Registry', acceptedTypes: 'System Record' },
      { name: 'Passbook or account documentation issuance acknowledgement', defaultTag: 'Mandatory', category: 'Passbook', acceptedTypes: 'PDF, Signed Slip' },
      { name: 'Required consent, declarations and privacy notices', defaultTag: 'Mandatory', category: 'Compliance', acceptedTypes: 'PDF' },
      // Institutional additions
      { name: 'Business registration / constitutional documents (For Institutional Members)', defaultTag: 'Conditional', category: 'Institutional', acceptedTypes: 'PDF' },
      { name: 'Partnership deed / LLP agreement / Trust deed', defaultTag: 'Conditional', category: 'Institutional', acceptedTypes: 'PDF' },
      { name: 'Certificate of incorporation and MOA/AOA for companies', defaultTag: 'Conditional', category: 'Institutional', acceptedTypes: 'PDF' },
      { name: 'Authorised signatory details and board/partner authorisation', defaultTag: 'Conditional', category: 'Institutional', acceptedTypes: 'PDF' },
      { name: 'Beneficial ownership declaration', defaultTag: 'Conditional', category: 'Institutional', acceptedTypes: 'PDF' },
      { name: 'Business address and nature-of-business evidence', defaultTag: 'Conditional', category: 'Institutional', acceptedTypes: 'PDF' }
    ]
  },
  {
    code: 'M2',
    title: 'Deposit and Savings Products Setup',
    description: 'Pigmy / daily deposits, Recurring Deposits (RD), Fixed Deposits (FD), Thrift, and Savings schemes.',
    items: [
      { name: 'Product / scheme code and approved name', defaultTag: 'Mandatory', category: 'Scheme Definition', acceptedTypes: 'System Code' },
      { name: 'Member ID and deposit account number linkage', defaultTag: 'Mandatory', category: 'Account Record', acceptedTypes: 'System ID' },
      { name: 'Opening date and linked branch record', defaultTag: 'Mandatory', category: 'Branch Operations', acceptedTypes: 'System Date' },
      { name: 'Deposit amount, daily contribution and limits', defaultTag: 'Mandatory', category: 'Contribution Terms', acceptedTypes: 'Schedule' },
      { name: 'Contribution frequency and collection calendar', defaultTag: 'Mandatory', category: 'Calendar', acceptedTypes: 'Schedule' },
      { name: 'Interest rate, calculation method and effective dates', defaultTag: 'Mandatory', category: 'Interest Terms', acceptedTypes: 'PDF, Schedule' },
      { name: 'Maturity date and maturity instructions', defaultTag: 'Mandatory', category: 'Maturity Terms', acceptedTypes: 'Standing Instructions' },
      { name: 'Nominee details and percentage allocation', defaultTag: 'Mandatory', category: 'Nomination', acceptedTypes: 'Nomination Form' },
      { name: 'Withdrawal and premature closure rules disclosure', defaultTag: 'Mandatory', category: 'Scheme Bye-Laws', acceptedTypes: 'PDF' },
      { name: 'Tax treatment and reporting flags (TDS / Form 15G/15H)', defaultTag: 'Conditional', category: 'Taxation', acceptedTypes: 'PDF' },
      { name: 'Passbook / FD deposit certificate generation', defaultTag: 'Mandatory', category: 'Certificate', acceptedTypes: 'PDF, Security Slip' },
      { name: 'Maker-checker approval and audit reference', defaultTag: 'Mandatory', category: 'Audit Trail', acceptedTypes: 'System Audit' }
    ]
  },
  {
    code: 'M3',
    title: 'Pigmy / Daily Deposit & Field Collections',
    description: 'Field agent collections, daily sheets, receipt sequence control, cash-in-hand, and branch remittance.',
    items: [
      { name: 'Pigmy account number and scheme code', defaultTag: 'Mandatory', category: 'Pigmy Account', acceptedTypes: 'System ID' },
      { name: 'Member ID, member name and contact details', defaultTag: 'Mandatory', category: 'Member Info', acceptedTypes: 'Master Registry' },
      { name: 'Opening date and collection start date', defaultTag: 'Mandatory', category: 'Collection Terms', acceptedTypes: 'Date' },
      { name: 'Daily deposit agreed contribution (e.g. ₹100/day)', defaultTag: 'Mandatory', category: 'Contribution', acceptedTypes: 'Ledger' },
      { name: 'Target tenure / maturity date (e.g. 365 days / ₹36,500)', defaultTag: 'Mandatory', category: 'Maturity Target', acceptedTypes: 'Schedule' },
      { name: 'Assigned agent ID, branch and collection route/territory', defaultTag: 'Mandatory', category: 'Agent Mapping', acceptedTypes: 'Agent Route' },
      { name: 'Daily collection entries with date, amount & receipt #', defaultTag: 'Mandatory', category: 'Daily Collections', acceptedTypes: 'Collection Log' },
      { name: 'Missed collection dates and follow-up status', defaultTag: 'Conditional', category: 'Arrears', acceptedTypes: 'Alert Log' },
      { name: 'Total amount collected and current daily balance', defaultTag: 'Mandatory', category: 'Passbook Balance', acceptedTypes: 'Ledger' },
      { name: 'Agent cash remittance and branch deposit reconciliation status', defaultTag: 'Mandatory', category: 'Remittance', acceptedTypes: 'Cash Scroll' },
      { name: 'Agent registration, identity and authorization status', defaultTag: 'Mandatory', category: 'Agent Controls', acceptedTypes: 'Agent Master' },
      { name: 'Daily collection sheet and receipt sequence control', defaultTag: 'Mandatory', category: 'Agent Controls', acceptedTypes: 'Sequence Sheet' },
      { name: 'Cash-in-hand and unremitted cash escalation alert', defaultTag: 'Mandatory', category: 'Risk Control', acceptedTypes: 'Audit Alert' },
      { name: 'Agent commission calculation under approved policy', defaultTag: 'Mandatory', category: 'Agent Controls', acceptedTypes: 'Commission Ledger' }
    ]
  },
  {
    code: 'M4',
    title: 'Loan Products & Repayment Management',
    description: 'Loan sanction, disbursement, repayment schedules, penal charges, and guarantor security.',
    items: [
      { name: 'Loan application number and member ID', defaultTag: 'Mandatory', category: 'Loan File', acceptedTypes: 'Application Form' },
      { name: 'Loan product (Agricultural, Gold, Personal, MSME, Housing)', defaultTag: 'Mandatory', category: 'Product Type', acceptedTypes: 'Product Code' },
      { name: 'Applied, sanctioned and disbursed amount records', defaultTag: 'Mandatory', category: 'Sanction', acceptedTypes: 'Sanction Order' },
      { name: 'Interest rate, calculation basis (Reducing/Flat) & period', defaultTag: 'Mandatory', category: 'Interest Terms', acceptedTypes: 'Schedule' },
      { name: 'Repayment frequency, instalment amount and due dates', defaultTag: 'Mandatory', category: 'Repayment Schedule', acceptedTypes: 'EMI Table' },
      { name: 'Principal outstanding and interest outstanding balances', defaultTag: 'Mandatory', category: 'Ledger Balance', acceptedTypes: 'System Ledger' },
      { name: 'Amount collected, overdue amount and Days Past Due (DPD)', defaultTag: 'Mandatory', category: 'Overdue Tracking', acceptedTypes: 'NPA Aging' },
      { name: 'Guarantor, collateral and security pledge details', defaultTag: 'Mandatory', category: 'Security Details', acceptedTypes: 'Pledge Document' },
      { name: 'Sanction authority and board/committee approval record', defaultTag: 'Mandatory', category: 'Board Approval', acceptedTypes: 'Resolution PDF' },
      { name: 'Executed loan agreement and demand promissory note', defaultTag: 'Mandatory', category: 'Legal Contracts', acceptedTypes: 'Signed Contract' },
      { name: 'Closure, settlement, release and No Objection Certificate (NOC)', defaultTag: 'Conditional', category: 'Loan Closure', acceptedTypes: 'NOC PDF' }
    ]
  },
  {
    code: 'M5',
    title: 'Loan-Wise Document Dossier',
    description: 'Category-specific dossiers for Crop Loans, Gold Loans, Personal Loans, MSME, and Housing Loans.',
    items: [
      // Agricultural / Crop Loan
      { name: 'Agricultural land ownership record (RTC / Pahani / 7/12)', defaultTag: 'Mandatory', category: 'Agri Loan', acceptedTypes: 'RTC Extract PDF' },
      { name: 'Mutation extract and land survey number details', defaultTag: 'Mandatory', category: 'Agri Loan', acceptedTypes: 'Mutation PDF' },
      { name: 'Crop / cultivation certificate and cropping pattern', defaultTag: 'Mandatory', category: 'Agri Loan', acceptedTypes: 'Agri Dept Cert' },
      { name: 'Existing crop loan and liability declaration (No Dues)', defaultTag: 'Mandatory', category: 'Agri Loan', acceptedTypes: 'Declaration PDF' },
      // Gold Loan
      { name: 'Gold appraisal and valuation report by certified appraiser', defaultTag: 'Mandatory', category: 'Gold Loan', acceptedTypes: 'Valuation Report' },
      { name: 'Gross weight, net weight, purity (karats) and item details', defaultTag: 'Mandatory', category: 'Gold Loan', acceptedTypes: 'Appraisal Sheet' },
      { name: 'Pledge acknowledgement and safe custody locker record', defaultTag: 'Mandatory', category: 'Gold Loan', acceptedTypes: 'Custody Slip' },
      // Personal / MSME Loan
      { name: 'Salary slips / Income tax returns / Udyam registration', defaultTag: 'Mandatory', category: 'Personal & MSME', acceptedTypes: 'Income Proof' },
      { name: 'Bank statement of operative account (Last 6-12 months)', defaultTag: 'Mandatory', category: 'Personal & MSME', acceptedTypes: 'PDF Statement' },
      { name: 'Guarantor KYC, consent and financial capability proof', defaultTag: 'Mandatory', category: 'Personal & MSME', acceptedTypes: 'Guarantor Dossier' },
      // Housing Loan
      { name: 'Sale deed and 30-year title chain documents', defaultTag: 'Mandatory', category: 'Housing Loan', acceptedTypes: 'Title Deed PDF' },
      { name: 'Encumbrance Certificate (EC Form 15) and Khata extract', defaultTag: 'Mandatory', category: 'Housing Loan', acceptedTypes: 'EC PDF' },
      { name: 'Approved building plan and property valuation report', defaultTag: 'Mandatory', category: 'Housing Loan', acceptedTypes: 'Valuation PDF' },
      { name: 'Legal scrutiny opinion from panel advocate', defaultTag: 'Mandatory', category: 'Housing Loan', acceptedTypes: 'Legal Search PDF' }
    ]
  },
  {
    code: 'M6',
    title: 'Accounting, Cash & Governance Records',
    description: 'Cash book closing, BRS, agent reconciliation, board minutes, and regulatory compliance reports.',
    items: [
      { name: 'Daily cash book closing, denomination summary & physical count', defaultTag: 'Mandatory', category: 'Cash Management', acceptedTypes: 'Cash Scroll' },
      { name: 'Bank reconciliation statements (BRS) with DCCB/Apex bank', defaultTag: 'Mandatory', category: 'Bank Recon', acceptedTypes: 'XLSX, PDF' },
      { name: 'Agent cash collections, remittances and pending balance approval', defaultTag: 'Mandatory', category: 'Agent Recon', acceptedTypes: 'Recon Statement' },
      { name: 'Trial balance and product-wise deposit & loan sub-ledgers', defaultTag: 'Mandatory', category: 'Accounts', acceptedTypes: 'Trial Balance' },
      { name: 'Overdue / NPA classification reports and provisioning workings', defaultTag: 'Mandatory', category: 'NPA Reporting', acceptedTypes: 'NPA Aging Table' },
      { name: 'Board / committee meeting calendar, quorum and minutes register', defaultTag: 'Mandatory', category: 'Governance', acceptedTypes: 'Minutes Book PDF' },
      { name: 'Statutory audit observation replies and Action-Taken Reports (ATR)', defaultTag: 'Mandatory', category: 'Audit Compliance', acceptedTypes: 'ATR Document' },
      { name: 'PACS-specific PDS / Agricultural input stock register (if operated)', defaultTag: 'Conditional', category: 'PACS Activities', acceptedTypes: 'Stock Register' }
    ]
  }
];

// ==========================================
// 2. EDUCATION & ADMISSIONS (CLARIOLOOP EDU)
// Master Checklist from ClarioLoop Edu PDF (6 pages)
// Target: Schools, PU Colleges, Degree Colleges, Engineering Colleges, Universities
// ==========================================
export const educationMasterChecklist = [
  {
    code: 'ED-A',
    title: 'Admission Application and Identity',
    description: 'Application form, photo, identity proof, address, date of birth, and parent/guardian consent.',
    items: [
      { name: 'Completed admission/application form with application number', defaultTag: 'Mandatory', category: 'Admission Form', acceptedTypes: 'PDF' },
      { name: 'Recent passport-size photograph of student', defaultTag: 'Mandatory', category: 'Student Photo', acceptedTypes: 'JPG, PNG' },
      { name: 'Accepted identity proof as per applicable admission rules', defaultTag: 'Mandatory', category: 'Identity', acceptedTypes: 'PDF, JPG' },
      { name: 'Current address and contact details; parent/guardian contact', defaultTag: 'Mandatory', category: 'Address', acceptedTypes: 'PDF, JPG' },
      { name: 'Date-of-birth proof (Birth Certificate or 10th marks card)', defaultTag: 'Mandatory', category: 'DOB Proof', acceptedTypes: 'PDF, JPG' },
      { name: 'Student declaration / code of conduct acknowledgement', defaultTag: 'Mandatory', category: 'Undertaking', acceptedTypes: 'PDF' },
      { name: 'Parent / guardian consent for minor students', defaultTag: 'Conditional', category: 'Consent', acceptedTypes: 'PDF' }
    ]
  },
  {
    code: 'ED-B',
    title: 'Previous Academic Qualifications',
    description: 'Class 10/SSLC, Class 12/PUC, Diploma, Degree marks cards, TC, Migration, and Rank scorecards.',
    items: [
      { name: 'Class 10 / SSLC marks card or equivalent certificate', defaultTag: 'Mandatory', category: 'Secondary School', acceptedTypes: 'PDF, JPG' },
      { name: 'Class 12 / PUC marks card or equivalent certificate', defaultTag: 'Mandatory', category: 'Higher Secondary', acceptedTypes: 'PDF, JPG' },
      { name: 'Diploma marks cards and diploma certificate (Lateral Entry)', defaultTag: 'Conditional', category: 'Diploma', acceptedTypes: 'PDF' },
      { name: 'Degree marks cards and provisional degree certificate (PG Entry)', defaultTag: 'Conditional', category: 'Degree', acceptedTypes: 'PDF' },
      { name: 'Transfer Certificate (TC) from previous institution', defaultTag: 'Mandatory', category: 'Transfer', acceptedTypes: 'Original Scan PDF' },
      { name: 'Migration Certificate (For Inter-board / Inter-university students)', defaultTag: 'Conditional', category: 'Migration', acceptedTypes: 'Original Scan PDF' },
      { name: 'Study certificate / Character & bonafide certificate', defaultTag: 'Mandatory', category: 'Bonafide', acceptedTypes: 'PDF' },
      { name: 'Eligibility / equivalence certificate from affiliating university', defaultTag: 'Conditional', category: 'Equivalence', acceptedTypes: 'PDF' },
      { name: 'Entrance examination scorecard / rank card (CET, JEE, NEET, PGCET)', defaultTag: 'Conditional', category: 'Rank Card', acceptedTypes: 'PDF' },
      { name: 'Counselling / seat allotment / admission order copy', defaultTag: 'Mandatory', category: 'Allotment', acceptedTypes: 'PDF' }
    ]
  },
  {
    code: 'ED-C',
    title: 'Reservation, Category and Fee Concessions',
    description: 'Caste certificates, Income certificates, Rural/Kannada medium/371(J), Domicile, and Disability proof.',
    items: [
      { name: 'Caste / category certificate issued by competent authority (Tahsildar)', defaultTag: 'Conditional', category: 'Caste Verification', acceptedTypes: 'PDF' },
      { name: 'Income certificate for scholarship / fee concession entitlement', defaultTag: 'Conditional', category: 'Income Proof', acceptedTypes: 'PDF' },
      { name: 'Rural / Kannada medium / Article 371(J) Hyderabad-Karnataka cert', defaultTag: 'Conditional', category: 'Special Category', acceptedTypes: 'PDF' },
      { name: 'Domicile / residence certificate', defaultTag: 'Conditional', category: 'Domicile', acceptedTypes: 'PDF' },
      { name: 'Disability certificate from medical board, where support sought', defaultTag: 'Conditional', category: 'Disability Support', acceptedTypes: 'PDF' },
      { name: 'Ex-servicemen / defence / sports priority quota certificate', defaultTag: 'Conditional', category: 'Quota Proof', acceptedTypes: 'PDF' },
      { name: 'Fee concession approval or supporting institutional orders', defaultTag: 'Conditional', category: 'Concession', acceptedTypes: 'PDF' }
    ]
  },
  {
    code: 'ED-D',
    title: 'Scholarship and Government Benefit Documents',
    description: 'Scholarship application ack, student bank passbook, Aadhaar DBT seeding, and marks progression.',
    items: [
      { name: 'Scholarship application acknowledgement / SSP or NSP scheme ref', defaultTag: 'Conditional', category: 'Scholarship Portal', acceptedTypes: 'Ack Slip PDF' },
      { name: "Student bank account proof in student's own name (Passbook / Cheque)", defaultTag: 'Conditional', category: 'Bank Account', acceptedTypes: 'PDF, JPG' },
      { name: 'Aadhaar-seeding / NPCI Direct Benefit Transfer (DBT) evidence', defaultTag: 'Conditional', category: 'DBT Seeding', acceptedTypes: 'NPCI Status Screenshot' },
      { name: 'Income and category certificates valid for the current academic year', defaultTag: 'Conditional', category: 'Validity Proof', acceptedTypes: 'Govt Certificate' },
      { name: 'Previous-year marks card / promotion evidence for renewal', defaultTag: 'Conditional', category: 'Renewal Criteria', acceptedTypes: 'Marks Card PDF' },
      { name: 'Hostel certificate / fee receipt for hostel allowance claims', defaultTag: 'Conditional', category: 'Hostel Allowance', acceptedTypes: 'PDF' }
    ]
  },
  {
    code: 'ED-E',
    title: 'Fees, Enrolment and Institutional Forms',
    description: 'Admission fee receipt, Anti-ragging undertaking, university registration, handbook, and hostel forms.',
    items: [
      { name: 'Admission fee receipt / payment transaction acknowledgement', defaultTag: 'Mandatory', category: 'Fee Payment', acceptedTypes: 'Receipt PDF' },
      { name: 'Fee structure acknowledgement / instalment payment undertaking', defaultTag: 'Conditional', category: 'Fee Schedule', acceptedTypes: 'Signed Undertaking' },
      { name: 'University registration / enrolment form and acknowledgement', defaultTag: 'Mandatory', category: 'University Records', acceptedTypes: 'PDF' },
      { name: 'Anti-ragging undertaking by student and parent/guardian (UGC)', defaultTag: 'Mandatory', category: 'UGC Compliance', acceptedTypes: 'Affidavit PDF' },
      { name: 'Student handbook / campus discipline rules acknowledgement', defaultTag: 'Mandatory', category: 'Campus Rules', acceptedTypes: 'Signed Form' },
      { name: 'Library, laboratory, computer & research facility declarations', defaultTag: 'Mandatory', category: 'Campus Facilities', acceptedTypes: 'Declaration Form' },
      { name: 'Hostel application and undertaking (If opting for hostel)', defaultTag: 'Conditional', category: 'Hostel', acceptedTypes: 'PDF' },
      { name: 'Transport application and bus route details (If opting for bus)', defaultTag: 'Conditional', category: 'Transport', acceptedTypes: 'PDF' }
    ]
  },
  {
    code: 'ED-F',
    title: 'Continuing Students, Career & Staff Verification',
    description: 'Semester exams, internship offers, NBA/NAAC course files, and 9-point staff verification checks.',
    items: [
      { name: 'Current semester registration / examination application ack', defaultTag: 'Conditional', category: 'Semester Exam', acceptedTypes: 'Exam Form' },
      { name: 'Previous semester marks card / result record and backlog status', defaultTag: 'Conditional', category: 'Academic Progress', acceptedTypes: 'Marks Sheet' },
      { name: 'Updated student CV / placement registration and consent', defaultTag: 'Conditional', category: 'Placements', acceptedTypes: 'PDF' },
      { name: 'Internship offer letter, joining report and completion certificate', defaultTag: 'Conditional', category: 'Internship', acceptedTypes: 'Company Letter' },
      { name: 'Placement offer / joining confirmation', defaultTag: 'Conditional', category: 'Placements', acceptedTypes: 'Offer Letter' },
      { name: 'No-dues clearance from library, labs, hostel and finance sections', defaultTag: 'Conditional', category: 'Exit Clearance', acceptedTypes: 'Clearance Form' },
      { name: 'Final marks card / provisional degree dispatch acknowledgement', defaultTag: 'Conditional', category: 'Degree Dispatch', acceptedTypes: 'Dispatch Slip' },
      { name: 'Staff verification: Student identity, originals returned log & closure', defaultTag: 'Mandatory', category: 'Staff Audit', acceptedTypes: 'Inspection Log' }
    ]
  }
];

// ==========================================
// 3. INSURANCE & CLAIMS (CLARIOLOOP INSURANCE)
// Master Checklist from ClarioLoop Insurance PDF (19 pages)
// Target: Insurance Agents, Agencies, Brokers, Surveyors, TPAs
// ==========================================
export const insuranceMasterChecklist = [
  {
    code: 'INS-1',
    title: 'Customer KYC & Proposal Intake',
    description: 'Proposer personal profile, OVD identity proof, address, PAN/Form 60, bank proof, and privacy consent.',
    items: [
      { name: 'Full legal name and basic customer information form', defaultTag: 'Mandatory', category: 'Customer Info', acceptedTypes: 'Proposal Form' },
      { name: 'PAN card or Form 60, as applicable', defaultTag: 'Mandatory', category: 'Tax ID', acceptedTypes: 'PDF, JPG' },
      { name: 'Aadhaar or accepted officially valid identity document (OVD)', defaultTag: 'Mandatory', category: 'Identity', acceptedTypes: 'PDF, JPG' },
      { name: 'Accepted address proof (Utility bill, Passport, Voter ID, DL)', defaultTag: 'Mandatory', category: 'Address', acceptedTypes: 'PDF, JPG' },
      { name: 'Recent passport-size photograph of proposer & insured members', defaultTag: 'Mandatory', category: 'Photo', acceptedTypes: 'JPG, PNG' },
      { name: 'Bank passbook / cancelled cheque / bank account proof for ECS/NEFT', defaultTag: 'Mandatory', category: 'Payout Mandate', acceptedTypes: 'PDF, JPG' },
      { name: 'Annual income / income evidence (Salary slips, Form 16, ITR)', defaultTag: 'Conditional', category: 'Financial Underwriting', acceptedTypes: 'PDF' },
      { name: 'Customer declaration and KYC verification consent', defaultTag: 'Mandatory', category: 'IRDAI Consent', acceptedTypes: 'Signed Consent' }
    ]
  },
  {
    code: 'INS-2',
    title: 'Life Insurance / LIC Proposal Documents',
    description: 'Life proposal form, age proof, medical history declarations, nominee KYC, and premium acknowledgement.',
    items: [
      { name: 'Life insurance proposal form and health declaration', defaultTag: 'Mandatory', category: 'Proposal Form', acceptedTypes: 'Signed Proposal' },
      { name: 'Age / date of birth proof (School certificate, Passport, PAN)', defaultTag: 'Mandatory', category: 'Age Proof', acceptedTypes: 'PDF, JPG' },
      { name: 'Income proof (Salary slip, Form 16, 3-Yr ITR, Audited financials)', defaultTag: 'Mandatory', category: 'Financials', acceptedTypes: 'PDF' },
      { name: 'Medical examination reports & pathology tests (MER, ECG, TMT, HbA1c)', defaultTag: 'Conditional', category: 'Medical Tests', acceptedTypes: 'Diagnostic PDF' },
      { name: 'Medical history and lifestyle declarations (Smoking, Alcohol, Habits)', defaultTag: 'Mandatory', category: 'Underwriting', acceptedTypes: 'Declaration Form' },
      { name: 'Existing life insurance policy details (Total Sum Assured in force)', defaultTag: 'Conditional', category: 'Existing Cover', acceptedTypes: 'Policy Schedule' },
      { name: 'Nominee details, relationship proof and nominee KYC', defaultTag: 'Mandatory', category: 'Nomination', acceptedTypes: 'Nominee KYC' },
      { name: 'Guardian details and consent where nominee is a minor', defaultTag: 'Conditional', category: 'Nomination', acceptedTypes: 'Guardian Consent' },
      { name: 'Premium payment acknowledgement and e-Receipt', defaultTag: 'Mandatory', category: 'Premium', acceptedTypes: 'Payment Voucher' },
      { name: 'Policy bond / e-Policy schedule and Customer Information Sheet (CIS)', defaultTag: 'Mandatory', category: 'Policy Issuance', acceptedTypes: 'Policy Bond PDF' }
    ]
  },
  {
    code: 'INS-3',
    title: 'Health Insurance Proposal Documents',
    description: 'Health proposal, member details, pre-existing diseases (PED), medical test reports, and portability continuity.',
    items: [
      { name: 'Health insurance proposal form with member roster', defaultTag: 'Mandatory', category: 'Proposal Form', acceptedTypes: 'Proposal PDF' },
      { name: 'Age proof and photo for every insured family member', defaultTag: 'Mandatory', category: 'Member Records', acceptedTypes: 'PDF, JPG' },
      { name: 'Medical history & pre-existing disease (PED) declarations', defaultTag: 'Mandatory', category: 'PED Declaration', acceptedTypes: 'Signed Form' },
      { name: 'Current medication and past surgical treatment records', defaultTag: 'Conditional', category: 'Medical Records', acceptedTypes: 'Doctor Summary' },
      { name: 'Pre-policy medical test reports, if required by age/sum insured grid', defaultTag: 'Conditional', category: 'Medical Tests', acceptedTypes: 'Lab Report PDF' },
      { name: 'Previous health insurance policy schedule (For Portability / Continuity)', defaultTag: 'Conditional', category: 'Portability', acceptedTypes: 'Previous Policy' },
      { name: 'Previous claim history details and TPA settlement records', defaultTag: 'Conditional', category: 'Claim History', acceptedTypes: 'Settlement Letter' },
      { name: 'Premium payment acknowledgement and Policy Schedule with CIS', defaultTag: 'Mandatory', category: 'Policy Issuance', acceptedTypes: 'Policy PDF' }
    ]
  },
  {
    code: 'INS-4',
    title: 'Motor Insurance Documents',
    description: 'Vehicle Registration Certificate (RC), Driving Licence, previous policy, vehicle photos, and NCB proof.',
    items: [
      { name: 'Vehicle Registration Certificate (RC book / smart card)', defaultTag: 'Mandatory', category: 'Vehicle Identity', acceptedTypes: 'PDF, JPG' },
      { name: 'Vehicle owner / proposer KYC documents', defaultTag: 'Mandatory', category: 'Owner KYC', acceptedTypes: 'PDF, JPG' },
      { name: 'Driving licence of owner / regular driver', defaultTag: 'Mandatory', category: 'DL Proof', acceptedTypes: 'PDF, JPG' },
      { name: 'Previous motor insurance policy schedule (For Renewal / Transfer)', defaultTag: 'Conditional', category: 'Renewal', acceptedTypes: 'Policy PDF' },
      { name: 'Vehicle photographs (4 sides, windshield, engine, chassis punch)', defaultTag: 'Conditional', category: 'Break-in Inspection', acceptedTypes: 'Geo-tagged Photos' },
      { name: 'New vehicle purchase invoice and delivery challan (For Brand New Vehicle)', defaultTag: 'Conditional', category: 'New Vehicle', acceptedTypes: 'Invoice PDF' },
      { name: 'No Claim Bonus (NCB) declaration / reserving letter', defaultTag: 'Conditional', category: 'NCB Proof', acceptedTypes: 'NCB Letter' },
      { name: 'Vehicle inspection / break-in survey report', defaultTag: 'Conditional', category: 'Inspection', acceptedTypes: 'Surveyor Report' },
      { name: 'Hypothecation / financier details (HPA bank agreement)', defaultTag: 'Conditional', category: 'Financier', acceptedTypes: 'Bank Loan Letter' }
    ]
  },
  {
    code: 'INS-5',
    title: 'Claims Management Desk',
    description: 'Dossiers for Life Death Claims, Cashless/Reimbursement Health Claims, and Motor Damage Claims.',
    items: [
      // Life Death Claim
      { name: 'Insurer-prescribed death claim form and policy bond', defaultTag: 'Mandatory', category: 'Life Death Claim', acceptedTypes: 'Claim Form PDF' },
      { name: 'Death certificate issued by Municipal Corporation / Registrar', defaultTag: 'Mandatory', category: 'Life Death Claim', acceptedTypes: 'Official Death Cert' },
      { name: 'Claimant / nominee KYC and bank account payment mandate', defaultTag: 'Mandatory', category: 'Life Death Claim', acceptedTypes: 'KYC & Cheque' },
      { name: 'Hospital records, indoor case papers, treating doctor certificate', defaultTag: 'Conditional', category: 'Life Death Claim', acceptedTypes: 'Hospital Case File' },
      { name: 'FIR / police investigation report / post-mortem report (For Accidental Death)', defaultTag: 'Conditional', category: 'Life Death Claim', acceptedTypes: 'Police FIR PDF' },
      // Health Reimbursement Claim
      { name: 'Hospital admission record and discharge summary with clinical history', defaultTag: 'Mandatory', category: 'Health Claim', acceptedTypes: 'Discharge Summary' },
      { name: 'Final itemised hospital bill with payment receipts and paid stamp', defaultTag: 'Mandatory', category: 'Health Claim', acceptedTypes: 'Hospital Bills' },
      { name: 'Doctor prescriptions, pharmacy bills and diagnostic / imaging reports', defaultTag: 'Mandatory', category: 'Health Claim', acceptedTypes: 'Prescriptions & Labs' },
      { name: 'Implant invoices, stickers and barcode tags (Where surgical implant used)', defaultTag: 'Conditional', category: 'Health Claim', acceptedTypes: 'Implant Invoices' },
      // Motor Damage Claim
      { name: 'Motor claim form with accident date, time and spot details', defaultTag: 'Mandatory', category: 'Motor Claim', acceptedTypes: 'Claim Form' },
      { name: 'Accident spot photographs and video evidence', defaultTag: 'Mandatory', category: 'Motor Claim', acceptedTypes: 'Photos / Videos' },
      { name: 'Repair estimate from authorized workshop / garage', defaultTag: 'Mandatory', category: 'Motor Claim', acceptedTypes: 'Garage Estimate' },
      { name: 'Surveyor inspection report and loss assessment voucher', defaultTag: 'Mandatory', category: 'Motor Claim', acceptedTypes: 'Surveyor Report' },
      { name: 'Final repair tax invoice and customer payment receipt', defaultTag: 'Mandatory', category: 'Motor Claim', acceptedTypes: 'Final Garage Bill' }
    ]
  },
  {
    code: 'INS-6',
    title: 'Policy Servicing, Renewals & Corporate Group Insurance',
    description: 'Maturity claims, nominee change, policy revival, premium reminders, and group employee census.',
    items: [
      { name: 'Maturity / survival benefit discharge form and original policy bond', defaultTag: 'Conditional', category: 'Servicing', acceptedTypes: 'Discharge Form' },
      { name: 'Policyholder service request form (Nominee change, Address update)', defaultTag: 'Conditional', category: 'Servicing', acceptedTypes: 'Service Request' },
      { name: 'Policy revival request and good health declaration', defaultTag: 'Conditional', category: 'Servicing', acceptedTypes: 'Revival Form' },
      { name: 'Policy renewal notice, premium quotation and payment confirmation', defaultTag: 'Mandatory', category: 'Renewals', acceptedTypes: 'Renewal Notice' },
      { name: 'Corporate entity certificate of incorporation, PAN & GST (For Group Policies)', defaultTag: 'Conditional', category: 'Corporate Group', acceptedTypes: 'Company KYC' },
      { name: 'Employee / member census schedule for Group Mediclaim & Term Life', defaultTag: 'Conditional', category: 'Corporate Group', acceptedTypes: 'Excel Census' },
      { name: 'Asset register and property schedule (For Fire & Commercial Packages)', defaultTag: 'Conditional', category: 'General Insurance', acceptedTypes: 'Asset Schedule' }
    ]
  }
];

// ==========================================
// DEDICATED VERTICAL SUBSCRIPTION TIERS
// ==========================================

export const VERTICAL_SUBSCRIPTIONS = {
  ca: [
    {
      id: 'STARTER',
      name: 'Starter Tier',
      priceINR: '₹999',
      period: 'per month',
      capacity: 'Up to 10 active corporate clients',
      idealFor: 'Solo CAs & Tax Practitioners',
      features: [
        'Up to 10 active corporate clients',
        'Modules A–F master statutory checklists',
        'Automated email reminders',
        'Client upload link with mobile camera snapping',
        'Basic AI document classifier',
        'Single staff user access'
      ],
      recommended: false
    },
    {
      id: 'PROFESSIONAL',
      name: 'Professional Practice',
      priceINR: '₹1,999',
      period: 'per month',
      capacity: 'Up to 30 active corporate clients',
      idealFor: 'Mid-sized CA Practices & Audit Desks',
      features: [
        'Up to 30 active corporate clients',
        'Multi-staff access (up to 3 article assistants)',
        'Stop-on-upload WhatsApp + Email reminders',
        'Groq AI OCR invoice reader & GSTIN extraction',
        'Form 3CD tax audit schedules & missing doc detection',
        'Audit slip exports (JSON, CSV, TXT)'
      ],
      recommended: true
    },
    {
      id: 'BUSINESS',
      name: 'Business Partnership',
      priceINR: '₹3,999',
      period: 'per month',
      capacity: 'Up to 100 active corporate clients',
      idealFor: 'Large Audit & Advisory Partnerships',
      features: [
        'Up to 100 active corporate clients',
        'Unlimited article assistants & staff logins',
        'Client Acquisition CRM pipeline included',
        'Custom firm branding, domain & logo watermarking',
        'Priority WhatsApp API throughput',
        'Dedicated compliance account manager'
      ],
      recommended: false
    }
  ],

  cooperative: [
    {
      id: 'COOP_STARTER',
      name: 'Society Starter',
      priceINR: '₹1,499',
      period: 'per month',
      capacity: 'Up to 500 active members',
      idealFor: 'Member-based Credit Societies & Small PACS',
      features: [
        'Up to 500 active member profiles',
        'Daily Pigmy collection sheet & digital passbook',
        'Member KYC and nominee registration engine',
        'Cash-in-hand & daily branch scroll tracking',
        'SMS collection confirmation alerts',
        'Offline receipt numbering control'
      ],
      recommended: false
    },
    {
      id: 'COOP_PRO',
      name: 'PACS & Urban Co-op Pro',
      priceINR: '₹2,999',
      period: 'per month',
      capacity: 'Up to 2,500 active members',
      idealFor: 'PACS, Urban Cooperative Banks & Rural Societies',
      features: [
        'Up to 2,500 active member accounts',
        'Mobile field agent routes with GPS territory control',
        'Loan document verification (Crop, Gold, MSME, Housing)',
        'AI land record & gold appraisal certificate validator',
        'Automated overdue loan & RD maturity reminders',
        'Registrar & Board resolution registers'
      ],
      recommended: true
    },
    {
      id: 'COOP_ENTERPRISE',
      name: 'DCCB & Apex Enterprise',
      priceINR: '₹5,999',
      period: 'per month',
      capacity: 'Unlimited members • Multi-Branch',
      idealFor: 'District Central Banks & Multi-Branch Societies',
      features: [
        'Unlimited members across unlimited branches',
        'Core Banking System (CBS) / Mandated ERP API bridge',
        'Centralized agent remittance reconciliation',
        'Maker-checker approval controls for loan sanctions',
        'Statutory audit observation & Action-Taken Reports (ATR)',
        '24/7 dedicated support & regulatory training'
      ],
      recommended: false
    }
  ],

  education: [
    {
      id: 'EDU_BASIC',
      name: 'Campus Basic',
      priceINR: '₹1,299',
      period: 'per month',
      capacity: 'Up to 500 students / year',
      idealFor: 'Schools, PU Colleges & Coaching Institutes',
      features: [
        'Up to 500 student admission dossiers',
        'Mobile student document intake portal',
        '10th/12th marks cards & TC collection',
        'Automated pending document SMS/WhatsApp nudges',
        'Fee receipt payment tracking',
        'Parent/guardian consent declarations'
      ],
      recommended: false
    },
    {
      id: 'EDU_PRO',
      name: 'College & Institute Pro',
      priceINR: '₹2,499',
      period: 'per month',
      capacity: 'Up to 2,500 students / year',
      idealFor: 'Engineering, Degree & Autonomous Colleges',
      features: [
        'Up to 2,500 enrolled students across all streams',
        'Caste, Income & Category concession verification',
        'Scholarship portal & DBT Aadhaar-seeding tracker',
        'UGC Anti-ragging undertakings & digital affidavits',
        'NBA / NAAC accreditation course file documentation',
        'Staff verification desk with originals return log'
      ],
      recommended: true
    },
    {
      id: 'EDU_ENTERPRISE',
      name: 'University Enterprise',
      priceINR: '₹4,999',
      period: 'per month',
      capacity: 'Unlimited students • Multi-Campus',
      idealFor: 'Universities, Medical & Multi-Faculty Institutions',
      features: [
        'Unlimited students across all colleges & campuses',
        'University registration & examination hall-ticket files',
        'Campus placement & recruiter profile distribution consent',
        'No-dues exit clearance & degree certificate dispatch logs',
        'Bulk student data import/export (ERP integration)',
        'Dedicated implementation specialist'
      ],
      recommended: false
    }
  ],

  insurance: [
    {
      id: 'INS_SOLO',
      name: 'Agent Solo',
      priceINR: '₹799',
      period: 'per month',
      capacity: 'Up to 50 active policyholders',
      idealFor: 'Independent Insurance Agents & POSP Advisors',
      features: [
        'Up to 50 active policyholders',
        'Digital customer KYC & photo intake link',
        'Life / LIC proposal checklist generator',
        'Motor RC, DL & previous policy reader',
        'Automated renewal due reminders (WhatsApp & SMS)',
        'Mobile camera document scanner'
      ],
      recommended: false
    },
    {
      id: 'INS_PRO',
      name: 'Agency & Broker Pro',
      priceINR: '₹1,799',
      period: 'per month',
      capacity: 'Up to 250 active policyholders',
      idealFor: 'Insurance Agencies, Brokerages & Surveyors',
      features: [
        'Up to 250 active policyholders',
        'Multi-line checklists: Life, Health, Motor & General',
        'End-to-end Claims Desk (Death, Health bills, Motor damage)',
        'Cashless TPA pre-auth & hospital bill dossier maker',
        'Pre-existing disease (PED) & lifestyle declaration tracker',
        'Multi-agent sub-code performance reporting'
      ],
      recommended: true
    },
    {
      id: 'INS_ENTERPRISE',
      name: 'Corporate Brokerage',
      priceINR: '₹3,499',
      period: 'per month',
      capacity: 'Unlimited policyholders • Group Schemes',
      idealFor: 'Corporate Insurance Brokers & National Distribution',
      features: [
        'Unlimited policyholders & corporate clients',
        'Group Mediclaim & Term Life employee census manager',
        'Surveyor loss assessment & garage quote workflows',
        'IRDAI regulatory compliance & KYC audit trail',
        'Custom agency branding & white-label policyholder portal',
        'Priority API support & dedicated claims hotline'
      ],
      recommended: false
    }
  ]
};

// ==========================================
// MOCK TENANTS FOR MULTI-VERTICAL OPERATIONS
// ==========================================

export const mockCooperativeSocieties = [
  {
    id: 'coop-1',
    name: 'Sahyadri Urban Co-operative Credit Society Ltd',
    registrationNumber: 'REG/RCS/PUN/2012/8492',
    leadOfficial: 'Shri Vasantrao Kulkarni (Chairman)',
    city: 'Pune, Maharashtra',
    type: 'Urban Cooperative Credit Society',
    brandingColor: '#059669',
    membersCount: 1420,
    pigmyAgentsCount: 8,
    activeLoansCount: 384,
    subscription: { plan: 'COOP_PRO', status: 'ACTIVE' },
    summary: 'A premier cooperative credit society operating 3 urban branches with daily pigmy collection and gold loan services.'
  },
  {
    id: 'coop-2',
    name: 'Kisan Vikas Primary Agricultural Credit Society (PACS)',
    registrationNumber: 'DRCS/MND/PACS/1998/104',
    leadOfficial: 'Shri Ningappa Gowda (President)',
    city: 'Mandya, Karnataka',
    type: 'PACS (Primary Agricultural Credit Society)',
    brandingColor: '#16a34a',
    membersCount: 850,
    pigmyAgentsCount: 4,
    activeLoansCount: 620,
    subscription: { plan: 'COOP_STARTER', status: 'ACTIVE' },
    summary: 'Mandya taluk agricultural credit society managing seasonal crop loans, fertilizer distribution, and member savings.'
  }
];

export const mockEducationalInstitutions = [
  {
    id: 'edu-1',
    name: 'RV Institute of Technology & Autonomous University',
    aicteCode: 'AICTE-1-49201948',
    headOfInstitution: 'Dr. K. S. Venkatesh (Principal & Dean)',
    city: 'Bengaluru, Karnataka',
    type: 'Engineering & Technological Institution',
    brandingColor: '#2563eb',
    studentsCount: 2840,
    facultyCount: 190,
    subscription: { plan: 'EDU_PRO', status: 'ACTIVE' },
    summary: 'Autonomous engineering college running NAAC A++ accredited programs in Computer Science, AI, Mechanical, and Electronics.'
  },
  {
    id: 'edu-2',
    name: "St. Xavier's Pre-University & Degree College",
    affiliationCode: 'UOM-MUM-DEG-3301',
    headOfInstitution: 'Prof. Marie Fernandes (Director)',
    city: 'Mumbai, Maharashtra',
    type: 'Degree College & Pre-University',
    brandingColor: '#0284c7',
    studentsCount: 1650,
    facultyCount: 85,
    subscription: { plan: 'EDU_BASIC', status: 'ACTIVE' },
    summary: 'Centennial institution offering Science, Commerce, and Arts degrees with active state scholarship and fee concession intake.'
  }
];

export const mockInsuranceAgencies = [
  {
    id: 'ins-1',
    name: 'Suraksha Insurance Advisory & Corporate Brokers',
    irdaiNumber: 'IRDAI/DB-849/2021',
    principalOfficer: 'Sunil Mathur (Licenced Broker)',
    city: 'Mumbai, Maharashtra',
    type: 'Direct Insurance Broker (Life & General)',
    brandingColor: '#7c3aed',
    activeClientsCount: 940,
    claimsProcessedCount: 215,
    subscription: { plan: 'INS_PRO', status: 'ACTIVE' },
    summary: 'Full-service insurance advisory managing LIC policies, family health covers, commercial fire, and cashless fleet motor insurance.'
  },
  {
    id: 'ins-2',
    name: 'Pratham General Insurance & LIC Advisory',
    irdaiNumber: 'POSP-AGT-LIC-99201',
    principalOfficer: 'Meera Deshpande (Senior Advisor)',
    city: 'Pune, Maharashtra',
    type: 'Composite Insurance Agency',
    brandingColor: '#9333ea',
    activeClientsCount: 450,
    claimsProcessedCount: 88,
    subscription: { plan: 'INS_SOLO', status: 'ACTIVE' },
    summary: 'Pune-based agency offering personalized term life insurance, mediclaim hospitalization assistance, and motor accident claim liaison.'
  }
];
