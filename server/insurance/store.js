import { generateCaseChecklist } from './rules.js';
import { createAuditEntry } from './access.js';

const AGENCY_ID = 'ag-1';

const CUSTOMER_TYPES = [
  'INDIVIDUAL',
  'SALARIED',
  'BUSINESS_PROPRIETOR',
  'SELF_EMPLOYED_PROF',
  'COMPANY_PARTNERSHIP',
  'NRI',
  'CORPORATE_GROUP',
];

export const insuranceStore = {
  agency: {
    id: AGENCY_ID,
    name: 'Trivita Insurance Distribution & Advisory Pvt Ltd',
    licenceCode: 'IRDAI/IMF/2021/0842',
    teams: [
      { id: 'team-north', name: 'North Retail & Life Team' },
      { id: 'team-south', name: 'South Health & Motor Team' },
    ],
    aiAssistEnabled: false, // OFF by default per compliance rule
    retentionYears: 8,
    deletionPolicy: 'CONFIGURABLE_SECURE_PURGE_WITH_LEGAL_HOLD',
  },

  insurers: [
    {
      id: 'insurer-lic',
      name: 'Life Insurance Corporation of India (LIC)',
      code: 'LIC',
      overrides: {
        LIFE_18: { requirement: 'MANDATORY', title: 'LIC Agent Confidential Report (ACR / MHR)' },
      },
    },
    {
      id: 'insurer-hdfc',
      name: 'HDFC ERGO General Insurance',
      code: 'HDFC_ERGO',
      overrides: {
        KYC_03: { requirement: 'OPTIONAL', title: 'Aadhaar (Optional — PAN / DL / Passport accepted)' },
      },
    },
    {
      id: 'insurer-star',
      name: 'Star Health & Allied Insurance',
      code: 'STAR_HEALTH',
      overrides: {
        HLT_04: { requirement: 'MANDATORY', title: 'Star Health Signed PED & Tele-MER Declaration' },
      },
    },
  ],

  products: [
    { id: 'prd-1', insurerId: 'insurer-lic', category: 'LIFE', code: 'LIC_JEEVAN_UMANG', name: 'LIC Jeevan Umang (Whole Life)', enabled: true },
    { id: 'prd-2', insurerId: 'insurer-lic', category: 'LIFE', code: 'LIC_TECH_TERM', name: 'LIC Tech Term Plan', enabled: true },
    { id: 'prd-3', insurerId: 'insurer-star', category: 'HEALTH', code: 'STAR_COMPREHENSIVE', name: 'Star Comprehensive Health', enabled: true },
    { id: 'prd-4', insurerId: 'insurer-hdfc', category: 'MOTOR', code: 'HDFC_MOTOR_COMP', name: 'HDFC ERGO Motor Comprehensive', enabled: true },
    { id: 'prd-5', insurerId: 'insurer-hdfc', category: 'GENERAL', code: 'HDFC_FIRE_LAGHU', name: 'Bharat Laghu Udyam Suraksha (Fire)', enabled: true },
    { id: 'prd-6', insurerId: 'insurer-hdfc', category: 'GENERAL', code: 'HDFC_MARINE_LEGACY', name: 'Legacy Marine Hull (Disabled)', enabled: false },
  ],

  clients: Array.from({ length: 20 }, (_, i) => {
    const n = i + 1;
    const cType = CUSTOMER_TYPES[i % CUSTOMER_TYPES.length];
    const teamId = i % 2 === 0 ? 'team-north' : 'team-south';
    return {
      id: `cli-${n}`,
      agencyId: AGENCY_ID,
      teamId,
      clientCode: `CL-${2000 + n}`,
      fullName: cType === 'CORPORATE_GROUP' ? `Apex Tech Logistics Ltd #${n}` : `Insured Client ${n}`,
      fatherOrSpouseName: `Guardian / Spouse ${n}`,
      dob: `198${n % 9}-04-${String((n % 28) + 1).padStart(2, '0')}`,
      gender: n % 2 === 0 ? 'Female' : 'Male',
      mobile: `+9198100${10000 + n}`,
      email: `client${n}@example.in`,
      residentialAddress: `Block ${n}, Indiranagar, Bengaluru`,
      permanentAddress: `Block ${n}, Indiranagar, Bengaluru`,
      occupation: cType === 'SALARIED' ? 'Software Engineer' : cType === 'NRI' ? 'Overseas Consultant' : 'Business Owner',
      incomeRange: n % 3 === 0 ? '₹15L–₹25L' : '₹8L–₹15L',
      maritalStatus: n % 2 === 0 ? 'Married' : 'Single',
      preferredLanguage: n % 3 === 0 ? 'Hindi' : n % 5 === 0 ? 'Kannada' : 'English',
      preferredChannel: n % 4 === 0 ? 'EMAIL' : 'WHATSAPP',
      customerType: cType,
      consent: {
        version: 'v1.2',
        consentedAt: new Date(Date.now() - n * 86400000).toISOString(),
        purpose: 'INSURANCE_DOCUMENT_COLLECTION_AND_SERVICING',
        channel: 'DIGITAL_CONSENT',
        optOutChannels: n === 18 ? ['SMS'] : [],
      },
    };
  }),

  cases: [],
  requests: [],
  documents: [],
  notificationLogs: [],
  auditEvents: [],
};

// Seed mixed-status cases across Proposal, Servicing, Renewal, and Claims (Life/Health/Motor)
function seedCases() {
  const sampleSpecs = [
    {
      id: 'case-1',
      clientId: 'cli-2',
      insurerId: 'insurer-lic',
      productId: 'prd-1',
      category: 'LIFE',
      purpose: 'PROPOSAL',
      referenceNumber: 'PROP-LIC-2026-001',
      agentId: 'agent-1',
      teamId: 'team-north',
      caseContext: { nomineeIsMinor: true, medicalRequired: true },
    },
    {
      id: 'case-2',
      clientId: 'cli-3',
      insurerId: 'insurer-star',
      productId: 'prd-3',
      category: 'HEALTH',
      purpose: 'CLAIM',
      referenceNumber: 'CLM-STAR-2026-104',
      claimNumber: 'CLM-STAR-2026-104',
      intimationDate: '2026-11-18',
      insurerDecision: 'PENDING_INSURER_REVIEW',
      agentId: 'agent-2',
      teamId: 'team-south',
      caseContext: { claimVariant: 'CASHLESS', isAccidentalInjury: false },
    },
    {
      id: 'case-3',
      clientId: 'cli-4',
      insurerId: 'insurer-hdfc',
      productId: 'prd-4',
      category: 'MOTOR',
      purpose: 'RENEWAL',
      referenceNumber: 'REN-HDFC-2026-209',
      renewalDueDate: '2026-12-05',
      premiumReceiptStatus: 'PENDING_RECEIPT_UPLOAD',
      agentId: 'agent-2',
      teamId: 'team-south',
      caseContext: { isCommercialVehicle: true, isFinancedVehicle: true },
    },
    {
      id: 'case-4',
      clientId: 'cli-1',
      insurerId: 'insurer-lic',
      productId: 'prd-2',
      category: 'LIFE',
      purpose: 'POLICY_SERVICING',
      referenceNumber: 'SRV-LIC-2026-312',
      agentId: 'agent-1',
      teamId: 'team-north',
      caseContext: { servicingType: 'NOMINEE_CHANGE', nomineeIsMinor: false },
    },
    {
      id: 'case-5',
      clientId: 'cli-5',
      insurerId: 'insurer-hdfc',
      productId: 'prd-4',
      category: 'MOTOR',
      purpose: 'CLAIM',
      referenceNumber: 'CLM-HDFC-2026-415',
      claimNumber: 'CLM-HDFC-2026-415',
      intimationDate: '2026-11-20',
      insurerDecision: 'QUERY_RAISED_BY_INSURER',
      agentId: 'agent-2',
      teamId: 'team-south',
      caseContext: { isCommercialVehicle: false, isFinancedVehicle: true, isMajorOrTheft: true },
    },
  ];

  const statusCycle = [
    'VERIFIED',
    'UNDER_REVIEW',
    'RECEIVED',
    'REQUESTED',
    'REJECTED_RESUBMISSION_REQUIRED',
    'NOT_REQUESTED',
  ];

  for (const spec of sampleSpecs) {
    const client = insuranceStore.clients.find((c) => c.id === spec.clientId);
    const insurer = insuranceStore.insurers.find((ins) => ins.id === spec.insurerId);
    const items = generateCaseChecklist({
      insurerOverrides: insurer?.overrides || {},
      category: spec.category,
      purpose: spec.purpose,
      customerType: client.customerType,
      caseContext: spec.caseContext,
    }).map((it, idx) => ({
      ...it,
      id: `${spec.id}-item-${idx + 1}`,
      caseId: spec.id,
      clientId: client.id,
      status: statusCycle[idx % statusCycle.length],
      requestDate: '2026-11-20',
      dueDate: '2026-11-28',
      uploadDate: idx % 6 < 3 ? '2026-11-22' : null,
      reviewer: idx % 6 === 0 ? 'rev-1' : null,
      reviewDate: idx % 6 === 0 ? '2026-11-23' : null,
      rejectionReason: idx % 6 === 4 ? 'Document image is blurry; please upload a clear scan.' : null,
      resubmissionNote: idx % 6 === 4 ? 'Ensure all four corners of the document are visible.' : null,
      expiryDate: it.code.includes('PUC') ? '2027-05-01' : null,
      consentRef: client.consent.version,
    }));

    insuranceStore.cases.push({
      ...spec,
      agencyId: AGENCY_ID,
      insurerAdditionalDocs:
        spec.purpose === 'CLAIM'
          ? [
              {
                id: `${spec.id}-add-1`,
                title: 'Insurer Query: Treating Doctor Clarification Note',
                reason: 'Requested by insurer TPA for date-of-admission verification',
                requestedAt: '2026-11-22',
                status: 'REQUESTED',
              },
            ]
          : [],
      timeline: [
        { date: '2026-11-20', event: `Case created (${spec.purpose})` },
        { date: '2026-11-21', event: 'Initial document request sent to client' },
      ],
      items,
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    });
  }

  insuranceStore.auditEvents.push(
    createAuditEntry({
      agencyId: AGENCY_ID,
      actorUserId: 'platform-seed',
      action: 'INSURANCE_SEED_INITIALIZED',
      recordType: 'AGENCY',
      recordId: AGENCY_ID,
      afterValue: { insurers: 3, clients: 20, cases: insuranceStore.cases.length },
      reason: 'Sample dataset initialized for ClarioLoop Insurance',
    })
  );
}

seedCases();
