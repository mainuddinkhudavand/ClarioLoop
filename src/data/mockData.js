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
