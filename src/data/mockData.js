// Multi-Tenant CA Practices Database (Firm Isolation)
export const mockFirms = [
  {
    id: 'firm-1',
    name: 'Apex & Partners Chartered Accountants',
    partnerName: 'CA Rajesh Sharma (FCA, DISA)',
    city: 'Mumbai, Maharashtra',
    icaiNumber: 'FRN 102938W',
    email: 'contact@apexca.in',
    phone: '+91 98200 45890',
    brandingColor: '#4f46e5',
    logoInitials: 'AP',
    subscription: {
      plan: 'PROFESSIONAL',
      clientLimit: 30,
      status: 'TRIAL',
      trialDaysRemaining: 11
    },
    clients: [
      {
        id: 'c1',
        businessName: 'NexGen Digital Solutions Pvt Ltd',
        contactPerson: 'Suresh Kumar',
        email: 'accounts@nexgendigital.io',
        phone: '+91 98765 43210',
        entityType: 'Private Limited',
        gstin: '27AABCN8492K1Z9',
        pan: 'AABCN8492K',
        assignedStaff: 'Pooja V. (Article Assistant)',
        missingCount: 3
      },
      {
        id: 'c2',
        businessName: 'Vanguard Logistics & Freight LLP',
        contactPerson: 'Amitabh Sen',
        email: 'finance@vanguardlogistics.in',
        phone: '+91 99112 33445',
        entityType: 'LLP',
        gstin: '07AAEFV9012M1Z2',
        pan: 'AAEFV9012M',
        assignedStaff: 'Rohan Mehta',
        missingCount: 0
      },
      {
        id: 'c3',
        businessName: 'Zenith Retail Supermart',
        contactPerson: 'Kailash Patel',
        email: 'kailash@zenithretail.com',
        phone: '+91 98450 67890',
        entityType: 'Proprietorship',
        gstin: '24AAPKZ3301L1Z8',
        pan: 'AAPKZ3301L',
        assignedStaff: 'Pooja V.',
        missingCount: 2
      }
    ],
    requests: [
      {
        id: 'req-apex-1',
        firmId: 'firm-1',
        clientName: 'NexGen Digital Solutions Pvt Ltd',
        clientEmail: 'accounts@nexgendigital.io',
        clientPhone: '+91 98765 43210',
        title: 'November 2026 Monthly Bookkeeping & GST Records',
        period: 'November 2026',
        dueDate: '2026-11-28',
        secureToken: 'nexgen-nov2026-demo-token',
        status: 'PARTIALLY_SUBMITTED',
        remindersSent: 2,
        items: [
          {
            id: 'i1',
            title: 'HDFC Current Account Bank Statement (PDF)',
            description: 'Complete 30-day statement with closing balance',
            category: 'Banking & Finance',
            isRequired: true,
            status: 'SUBMITTED',
            uploadedFile: {
              name: 'HDFC_Statement_01Nov_30Nov_2026.pdf',
              size: '482 KB',
              aiExtracted: {
                type: 'Bank Account Statement',
                amount: 'Closing Bal: ₹ 4,82,900',
                confidence: 98
              }
            }
          },
          {
            id: 'i2',
            title: 'Sales Register & Tax Invoices (B2B & B2C)',
            category: 'Accounting & Bookkeeping',
            isRequired: true,
            status: 'PENDING'
          },
          {
            id: 'i3',
            title: 'Vendor Purchase Invoices & Expenses',
            category: 'Accounting & Bookkeeping',
            isRequired: true,
            status: 'PENDING'
          },
          {
            id: 'i4',
            title: 'GSTR-3B Previous Month Filed Challan',
            category: 'GST & Indirect Tax',
            isRequired: true,
            status: 'PENDING'
          }
        ]
      },
      {
        id: 'req-apex-2',
        firmId: 'firm-1',
        clientName: 'Vanguard Logistics & Freight LLP',
        clientEmail: 'finance@vanguardlogistics.in',
        clientPhone: '+91 99112 33445',
        title: 'Q3 FY26 Advance Tax & TDS Working Data',
        period: 'Q3 FY 2026-27',
        dueDate: '2026-12-05',
        secureToken: 'vanguard-q3-demo-token',
        status: 'COMPLETE',
        remindersSent: 1,
        items: [
          {
            id: 'i21',
            title: 'Trial Balance & Profit/Loss Statement',
            category: 'Audit & Assurance',
            isRequired: true,
            status: 'SUBMITTED',
            uploadedFile: {
              name: 'Trial_Balance_Q3_Vanguard.xlsx',
              size: '128 KB',
              aiExtracted: {
                type: 'Trial Balance Ledger',
                amount: '₹ 1,48,20,000',
                confidence: 96
              }
            }
          }
        ]
      }
    ]
  },
  {
    id: 'firm-2',
    name: 'Kothari & Mehta Tax Advisory LLP',
    partnerName: 'CA Bhavin Kothari (FCA, LLB)',
    city: 'Ahmedabad, Gujarat',
    icaiNumber: 'FRN 124890S',
    email: 'info@kotharimehta.com',
    phone: '+91 97240 55667',
    brandingColor: '#059669',
    logoInitials: 'KM',
    subscription: {
      plan: 'BUSINESS',
      clientLimit: 100,
      status: 'ACTIVE',
      trialDaysRemaining: 0
    },
    clients: [
      {
        id: 'c201',
        businessName: 'Sabarmati Cotton Mills Ltd',
        contactPerson: 'Deepak Shah',
        email: 'accounts@sabarmaticotton.in',
        phone: '+91 98250 88990',
        entityType: 'Private Limited',
        gstin: '24AAECS4491J1Z3',
        pan: 'AAECS4491J',
        assignedStaff: 'Ketan Parikh',
        missingCount: 2
      },
      {
        id: 'c202',
        businessName: 'Shree Krishna Chemical Industries',
        contactPerson: 'Govindbhai Patel',
        email: 'krishnachemicals@gmail.com',
        phone: '+91 98980 11223',
        entityType: 'Partnership',
        gstin: '24AABCS9912K1Z8',
        pan: 'AABCS9912K',
        assignedStaff: 'Ketan Parikh',
        missingCount: 1
      }
    ],
    requests: [
      {
        id: 'req-km-1',
        firmId: 'firm-2',
        clientName: 'Sabarmati Cotton Mills Ltd',
        clientEmail: 'accounts@sabarmaticotton.in',
        clientPhone: '+91 98250 88990',
        title: 'GSTR-9 & 9C Annual Reconciliation Records',
        period: 'FY 2025-26',
        dueDate: '2026-12-15',
        secureToken: 'sabarmati-annual-token',
        status: 'PARTIALLY_SUBMITTED',
        remindersSent: 3,
        items: [
          {
            id: 'km1',
            title: 'Audited Financial Statements with Notes',
            category: 'Audit & Assurance',
            isRequired: true,
            status: 'SUBMITTED',
            uploadedFile: {
              name: 'Audited_FS_FY26_Sabarmati.pdf',
              size: '1.4 MB',
              aiExtracted: {
                type: 'Audited Financial Statement',
                amount: 'Turnover: ₹ 14.8 Cr',
                confidence: 99
              }
            }
          },
          {
            id: 'km2',
            title: 'GSTR-2B vs Books ITC Reconciliation Statement',
            category: 'GST & Indirect Tax',
            isRequired: true,
            status: 'PENDING'
          },
          {
            id: 'km3',
            title: 'E-Way Bill Inward vs Outward Match Report',
            category: 'GST & Indirect Tax',
            isRequired: true,
            status: 'PENDING'
          }
        ]
      }
    ]
  },
  {
    id: 'firm-3',
    name: 'Singhania & Co. Corporate Auditors',
    partnerName: 'CA Ananya Singhania (ACA, CS)',
    city: 'New Delhi, Delhi NCR',
    icaiNumber: 'FRN 059281N',
    email: 'ananya@singhaniaca.com',
    phone: '+91 98110 99887',
    brandingColor: '#0284c7',
    logoInitials: 'SC',
    subscription: {
      plan: 'STARTER',
      clientLimit: 10,
      status: 'TRIAL',
      trialDaysRemaining: 8
    },
    clients: [
      {
        id: 'c301',
        businessName: 'Delhi Robotics & AI Hardware Pvt Ltd',
        contactPerson: 'Arun Verma',
        email: 'finance@delhirobotics.tech',
        phone: '+91 99100 44556',
        entityType: 'Private Limited',
        gstin: '07AABCD8821P1Z4',
        pan: 'AABCD8821P',
        assignedStaff: 'Priyanka Sharma',
        missingCount: 1
      }
    ],
    requests: [
      {
        id: 'req-sc-1',
        firmId: 'firm-3',
        clientName: 'Delhi Robotics & AI Hardware Pvt Ltd',
        clientEmail: 'finance@delhirobotics.tech',
        clientPhone: '+91 99100 44556',
        title: 'ROC Filing - MGT-7 & AOC-4 Board Resolutions',
        period: 'FY 2026',
        dueDate: '2026-11-30',
        secureToken: 'delhi-robotics-roc-token',
        status: 'PARTIALLY_SUBMITTED',
        remindersSent: 1,
        items: [
          {
            id: 'sc1',
            title: 'Directors Report & Board Meeting Minutes',
            category: 'Company & Corporate Compliance',
            isRequired: true,
            status: 'SUBMITTED',
            uploadedFile: {
              name: 'Board_Minutes_AGM_2026.pdf',
              size: '620 KB',
              aiExtracted: {
                type: 'Board Minutes Resolution',
                amount: 'N/A',
                confidence: 97
              }
            }
          },
          {
            id: 'sc2',
            title: 'Form AOC-4 Financial Certification Signature',
            category: 'Company & Corporate Compliance',
            isRequired: true,
            status: 'PENDING'
          }
        ]
      }
    ]
  }
];

// Convenience export for active defaults
export const mockClients = mockFirms[0].clients;
export const mockRequests = mockFirms.flatMap(f => f.requests || []);
export const mockFirm = mockFirms[0];

export const complianceDeadlines = [
  { name: 'GSTR-3B (Turnover > 5 Cr)', date: '20th of every month', status: 'Priority' },
  { name: 'TDS / TCS Deposit (Challan 281)', date: '7th of every month', status: 'Upcoming' },
  { name: 'Advance Tax (3rd Instalment 75%)', date: '15th December 2026', status: 'Scheduled' },
  { name: 'GSTR-1 Outward Supplies', date: '11th of every month', status: 'Filed' }
];

export const subscriptionTiers = [
  {
    id: 'STARTER',
    name: 'Starter',
    priceINR: '₹999',
    period: 'per month',
    clientCapacity: 'Up to 10 clients',
    idealFor: 'Solo CAs & Independent Practitioners',
    features: [
      'Up to 10 active corporate clients',
      'Unlimited document requests & templates',
      'Automated email reminders',
      'Custom-branded client upload portal',
      'Basic AI document classifier',
      'Android PWA & mobile camera support'
    ],
    recommended: false
  },
  {
    id: 'PROFESSIONAL',
    name: 'Professional',
    priceINR: '₹1,999',
    period: 'per month',
    clientCapacity: 'Up to 30 clients',
    idealFor: 'Growing CA Practices & Tax Consultants',
    features: [
      'Up to 30 active corporate clients',
      'Multi-staff access (up to 3 team members)',
      'Automated WhatsApp + Email reminders',
      'Groq AI entity extraction (Invoice #, Date, GSTIN)',
      'Missing document detector',
      'Recurring monthly bookkeeping checklists',
      'Audit log & Excel export'
    ],
    recommended: true
  },
  {
    id: 'BUSINESS',
    name: 'Business',
    priceINR: '₹3,999',
    period: 'per month',
    clientCapacity: 'Up to 100 clients',
    idealFor: 'Mid-sized Audit & Advisory Partnerships',
    features: [
      'Up to 100 active corporate clients',
      'Unlimited staff & article assistants',
      'Advanced AI validation & mismatch flags',
      'Custom firm branding & domain link',
      'Compliance calendar alerts',
      'Priority WhatsApp API delivery',
      'Dedicated phone & chat support'
    ],
    recommended: false
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    priceINR: '₹7,999',
    period: 'per month',
    clientCapacity: 'Up to 300+ clients',
    idealFor: 'Large Corporate Audit & Advisory Firms',
    features: [
      'Up to 300+ clients',
      'Custom ERP/Tally integration sync',
      'Multi-branch office management',
      'Custom SLA & dedicated account manager',
      'Unlimited AI doc reads & bulk ZIP exports'
    ],
    recommended: false
  }
];

// ==========================================
// 7 CORE PILLAR FEATURES (From ClarioLoop Blueprint)
// ==========================================
export const coreFeatures = [
  {
    id: 'doc-collection',
    title: 'Document Collection',
    tagline: 'Passwordless client upload link',
    description: 'Instant, secure client portal link requiring zero app downloads or passwords. Mobile-first camera document snapping.',
    icon: 'UploadCloud',
    badge: 'Core Engine',
    color: 'indigo'
  },
  {
    id: 'ai-classification',
    title: 'AI Classification',
    tagline: 'Groq LLaMA-3.3-70B OCR & Vision',
    description: 'Auto-detects document category, extracts invoice number, date, GSTIN, and gross amounts with 98%+ precision.',
    icon: 'Cpu',
    badge: 'AI Powered',
    color: 'purple'
  },
  {
    id: 'missing-doc-detection',
    title: 'Missing Document Detection',
    tagline: 'Zero compliance loopholes',
    description: 'Instantly identifies missing monthly bills, unfiled bank statements, or missing KYC files across all client accounts.',
    icon: 'FileSearch',
    badge: 'Automated',
    color: 'rose'
  },
  {
    id: 'automated-reminders',
    title: 'Automated Reminders',
    tagline: 'Multi-channel WhatsApp & Email',
    description: 'Polite, automated follow-ups scheduled until submission. Automatically halts reminders the second the client uploads.',
    icon: 'BellRing',
    badge: 'Smart Nudge',
    color: 'blue'
  },
  {
    id: 'deadline-tracking',
    title: 'Deadline Tracking',
    tagline: 'Statutory compliance calendar',
    description: 'Dynamic countdowns for GSTR-1, GSTR-3B, Advance Tax, TDS, and internal corporate approval milestones.',
    icon: 'Calendar',
    badge: 'Timelines',
    color: 'amber'
  },
  {
    id: 'secure-compliant',
    title: 'Secure & Compliant',
    tagline: '256-bit bank grade encryption',
    description: 'Strict multi-tenant cryptographic isolation, ISO/IEC 27001 standard security, and full tamper-proof audit trails.',
    icon: 'ShieldCheck',
    badge: 'Encrypted',
    color: 'emerald'
  },
  {
    id: 'workflow-dashboard',
    title: 'Workflow Dashboard',
    tagline: 'Real-time practice intelligence',
    description: 'Live KPI gauges, 82% completion rates, collected vs missing ratios, and cross-department team assignment view.',
    icon: 'BarChart3',
    badge: 'Analytics',
    color: 'cyan'
  }
];

// ==========================================
// 10 INDUSTRY WORKFLOWS (Who Can Use ClarioLoop?)
// ==========================================
export const industryWorkflows = [
  {
    id: 'finance-accounting',
    name: 'Finance & Accounting',
    subtext: '(CA, Tax, Audit)',
    category: 'Finance',
    icon: 'Calculator',
    color: 'bg-blue-500',
    lightBg: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    activeRequests: 48,
    completionRate: 86,
    description: 'Automate monthly GST, TDS, advance tax, bank reconciliation statements, and audit working papers from clients.',
    sampleChecklist: [
      'Bank Current Account Statement (30 Days)',
      'Sales Register & Outward Tax Invoices',
      'Vendor Purchase Invoices & Expenses',
      'GSTR-3B Previous Month Filed Challan',
      'TDS Challan Form 26QB / 27EQ'
    ]
  },
  {
    id: 'hr-recruitment',
    name: 'HR & Recruitment',
    subtext: '(Onboarding, KYC)',
    category: 'Human Resources',
    icon: 'Users',
    color: 'bg-purple-500',
    lightBg: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    activeRequests: 34,
    completionRate: 91,
    description: 'Streamline candidate onboarding, background verification, KYC documents, and employee separation paperwork.',
    sampleChecklist: [
      'Government ID (Aadhaar / Passport / Voter ID)',
      'PAN Card Copy',
      'Highest Educational Degree & Marksheets',
      'Relieving Letter from Previous Employer',
      'Last 3 Months Salary Slips & Form 16'
    ]
  },
  {
    id: 'legal-compliance',
    name: 'Legal & Compliance',
    subtext: '(Law Firms, CS)',
    category: 'Legal',
    icon: 'Scale',
    color: 'bg-emerald-500',
    lightBg: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    activeRequests: 22,
    completionRate: 78,
    description: 'Collect director KYC, board resolutions, trademark filings, lease agreements, and corporate MCA compliance records.',
    sampleChecklist: [
      'Director Identification Number (DIN) Verification',
      'Certified Board Resolution Copy',
      'Memorandum & Articles of Association (MOA/AOA)',
      'Executed Non-Disclosure Agreement (NDA)',
      'Trademark / IP Filing Authorization Document'
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    subtext: '(Hospitals, Clinics, Insurance)',
    category: 'Healthcare',
    icon: 'Cross',
    color: 'bg-teal-500',
    lightBg: 'bg-teal-50',
    textColor: 'text-teal-700',
    borderColor: 'border-teal-200',
    activeRequests: 29,
    completionRate: 84,
    description: 'HIPAA-compliant document collection for patient intake, medical history, pre-authorization, and insurance TPA claims.',
    sampleChecklist: [
      'Patient Photo Identity & Address Proof',
      'Doctor Consultation Prescription & Case Summary',
      'Diagnostic Lab Reports & Radiology Scans',
      'Insurance TPA Pre-Authorization Form',
      'Itemized Hospital Bill & Pharmacy Receipts'
    ]
  },
  {
    id: 'education',
    name: 'Education',
    subtext: '(Schools, Colleges, Universities)',
    category: 'Education',
    icon: 'GraduationCap',
    color: 'bg-sky-500',
    lightBg: 'bg-sky-50',
    textColor: 'text-sky-700',
    borderColor: 'border-sky-200',
    activeRequests: 18,
    completionRate: 95,
    description: 'Collect student admission applications, scholarship paperwork, fee receipts, transfer certificates, and verification proofs.',
    sampleChecklist: [
      'Birth Certificate & Nationality Proof',
      'Previous Class / Semester Marksheet',
      'School Leaving / Transfer Certificate (TC)',
      'Migration Certificate (If inter-state/board)',
      'Income Certificate (For Scholarship Application)'
    ]
  },
  {
    id: 'real-estate-construction',
    name: 'Real Estate & Construction',
    subtext: '(Projects, Approvals)',
    category: 'Construction',
    icon: 'Building',
    color: 'bg-indigo-500',
    lightBg: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200',
    activeRequests: 15,
    completionRate: 72,
    description: 'Collect site sanction approvals, architect certificates, title deeds, contractor bills, and RERA compliance filings.',
    sampleChecklist: [
      'Municipal Sanctioned Building Plan',
      'RERA Project Registration Certificate',
      'Architect Completion Stage Certificate',
      'Contractor Measurement Sheet & RA Bill',
      'Title Search Report & 30-Year Encumbrance Proof'
    ]
  },
  {
    id: 'insurance-banking',
    name: 'Insurance & Banking',
    subtext: '(KYC, Claims, Loans)',
    category: 'Banking',
    icon: 'Umbrella',
    color: 'bg-violet-500',
    lightBg: 'bg-violet-50',
    textColor: 'text-violet-700',
    borderColor: 'border-violet-200',
    activeRequests: 42,
    completionRate: 89,
    description: 'Automate loan documentation, credit underwriting dossiers, CIBIL check records, and claim settlement proofs.',
    sampleChecklist: [
      'Borrower KYC (Aadhaar & PAN)',
      'Last 3 Years ITR with Computation of Income',
      'Last 6 Months Bank Account Statement',
      'Property Chain Documents & Title Deed',
      'CIBIL Credit Score Verification Consent'
    ]
  },
  {
    id: 'manufacturing-industrial',
    name: 'Manufacturing & Industrial',
    subtext: '(Suppliers, QA, Compliance)',
    category: 'Industrial',
    icon: 'Factory',
    color: 'bg-amber-500',
    lightBg: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    activeRequests: 19,
    completionRate: 81,
    description: 'Collect vendor quality audit certificates, ISO compliance, Raw Material Test Certificates (MTC), and pollution board NOCs.',
    sampleChecklist: [
      'Factory License & Pollution Control Board NOC',
      'ISO 9001 / 14001 Quality Certification',
      'Raw Material Mill Test Certificate (MTC)',
      'Vendor Safety Audit & EHS Declaration',
      'Calibration Certificate for Testing Equipment'
    ]
  },
  {
    id: 'logistics-supply-chain',
    name: 'Logistics & Supply Chain',
    subtext: '(Vendors, Shipments)',
    category: 'Logistics',
    icon: 'Truck',
    color: 'bg-blue-600',
    lightBg: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    activeRequests: 27,
    completionRate: 87,
    description: 'Automate transport documents, customs clearances, Bill of Lading, Proof of Delivery (POD), and fleet fitness papers.',
    sampleChecklist: [
      'Consignment Note / Lorry Receipt (LR)',
      'E-Way Bill Generation Copy',
      'Signed Customer Proof of Delivery (POD)',
      'Commercial Shipping Invoice & Packing List',
      'Vehicle Fitness & Commercial Insurance Policy'
    ]
  },
  {
    id: 'professional-services',
    name: 'Professional Services',
    subtext: '(IPR, Consulting, Agencies)',
    category: 'Consulting',
    icon: 'Handshake',
    color: 'bg-fuchsia-500',
    lightBg: 'bg-fuchsia-50',
    textColor: 'text-fuchsia-700',
    borderColor: 'border-fuchsia-200',
    activeRequests: 21,
    completionRate: 90,
    description: 'Collect client project briefs, signed scope of work (SOW), milestone delivery sign-offs, and agency vendor invoices.',
    sampleChecklist: [
      'Executed Master Services Agreement (MSA)',
      'Signed Statement of Work (SOW) Scope',
      'Client Brand Assets & Content Brief',
      'Milestone Deliverable Acceptance Sign-Off',
      'Sub-consultant Tax Invoice & Timesheet'
    ]
  }
];

// ==========================================
// REPOSITORY: ALL COLLECTED DOCUMENTS
// ==========================================
export const mockAllDocuments = [
  {
    id: 'doc-1',
    name: 'HDFC_Statement_01Nov_30Nov_2026.pdf',
    clientName: 'NexGen Digital Solutions Pvt Ltd',
    industry: 'Finance & Accounting',
    category: 'Banking & Finance',
    status: 'VERIFIED',
    uploadedAt: '2026-11-20 14:32',
    size: '482 KB',
    aiConfidence: 98,
    extractedSummary: 'Current Account Statement • Closing Balance: ₹4,82,900'
  },
  {
    id: 'doc-2',
    name: 'Tax_Invoice_AIC_0849.pdf',
    clientName: 'NexGen Digital Solutions Pvt Ltd',
    industry: 'Finance & Accounting',
    category: 'Accounting & Bookkeeping',
    status: 'VERIFIED',
    uploadedAt: '2026-11-21 10:15',
    size: '340 KB',
    aiConfidence: 99,
    extractedSummary: 'B2B Tax Invoice • Acme Components • ₹88,500.00 • GST: 27AABCA1234M1Z5'
  },
  {
    id: 'doc-3',
    name: 'Audited_FS_FY26_Sabarmati.pdf',
    clientName: 'Sabarmati Cotton Mills Ltd',
    industry: 'Finance & Accounting',
    category: 'Audit & Assurance',
    status: 'VERIFIED',
    uploadedAt: '2026-11-22 16:45',
    size: '1.4 MB',
    aiConfidence: 99,
    extractedSummary: 'Financial Statement FY26 • Turnover: ₹14.8 Cr • Clean Audit Opinion'
  },
  {
    id: 'doc-4',
    name: 'Employee_Aadhaar_PAN_Dossier.pdf',
    clientName: 'Rahul Verma (Senior Dev)',
    industry: 'HR & Recruitment',
    category: 'Onboarding & KYC',
    status: 'VERIFIED',
    uploadedAt: '2026-11-23 09:20',
    size: '890 KB',
    aiConfidence: 97,
    extractedSummary: 'Govt KYC ID Verified • Aadhaar match with PAN database'
  },
  {
    id: 'doc-5',
    name: 'Signed_Board_Resolution_MCA.pdf',
    clientName: 'Apex Capital Advisors',
    industry: 'Legal & Compliance',
    category: 'Corporate Secretarial',
    status: 'COLLECTED',
    uploadedAt: '2026-11-23 11:05',
    size: '620 KB',
    aiConfidence: 94,
    extractedSummary: 'Board Resolution for Bank Signatory Change • Stamped & Executed'
  },
  {
    id: 'doc-6',
    name: 'TPA_PreAuth_ApolloHospital.pdf',
    clientName: 'Smt. Sharda Patel',
    industry: 'Healthcare',
    category: 'Medical & Insurance',
    status: 'COLLECTED',
    uploadedAt: '2026-11-23 15:40',
    size: '1.1 MB',
    aiConfidence: 95,
    extractedSummary: 'Cashless Pre-Auth Request • Surgery Estimate: ₹1,45,000'
  },
  {
    id: 'doc-7',
    name: 'Consignment_LR_EWay_Vanguard.pdf',
    clientName: 'Vanguard Logistics & Freight LLP',
    industry: 'Logistics & Supply Chain',
    category: 'Transport & E-Way',
    status: 'VERIFIED',
    uploadedAt: '2026-11-24 08:50',
    size: '512 KB',
    aiConfidence: 98,
    extractedSummary: 'E-Way Bill 241098234892 • Transporter LR Signed • Valid till 26-Nov'
  },
  {
    id: 'doc-8',
    name: 'Pending: GSTR-3B October Challan',
    clientName: 'NexGen Digital Solutions Pvt Ltd',
    industry: 'Finance & Accounting',
    category: 'GST & Indirect Tax',
    status: 'MISSING',
    uploadedAt: 'Not uploaded',
    size: '0 KB',
    aiConfidence: 0,
    extractedSummary: 'Missing Document • Automated reminder scheduled for today 5:00 PM'
  },
  {
    id: 'doc-9',
    name: 'Pending: Relieving Letter Previous Employer',
    clientName: 'Priya Sharma (Tech Lead)',
    industry: 'HR & Recruitment',
    category: 'Onboarding & KYC',
    status: 'MISSING',
    uploadedAt: 'Not uploaded',
    size: '0 KB',
    aiConfidence: 0,
    extractedSummary: 'Missing Document • WhatsApp prompt sent to candidate'
  },
  {
    id: 'doc-10',
    name: 'Pending: Vendor ISO 9001 Certificate',
    clientName: 'Shree Krishna Chemical Industries',
    industry: 'Manufacturing & Industrial',
    category: 'Industrial & QA',
    status: 'DUE_SOON',
    uploadedAt: 'Awaiting',
    size: '0 KB',
    aiConfidence: 0,
    extractedSummary: 'Due in 3 days • QA compliance requirement before PO release'
  }
];
