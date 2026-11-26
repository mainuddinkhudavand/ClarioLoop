import { generateEduChecklist } from './rules.js';
import { createEduAuditEntry } from './access.js';

const LIFECYCLE_STAGES = [
  'APPLICANT',
  'ADMITTED',
  'CONTINUING',
  'PLACEMENT',
  'EXITING',
  'ALUMNI',
];

const ADMISSION_ROUTES = [
  'REGULAR',
  'LATERAL_ENTRY',
  'POSTGRADUATE',
  'COUNSELLING',
  'MANAGEMENT_QUOTA',
];

export const eduStore = {
  institutions: [
    {
      id: 'inst-eng',
      name: 'RV Institute of Engineering & Technology',
      type: 'ENGINEERING_COLLEGE',
      academicYear: '2026-27',
      aiAssistEnabled: false, // OFF by default
      retentionYears: 10,
      departments: [
        { id: 'dept-cse', name: 'Computer Science & Engineering' },
        { id: 'dept-ece', name: 'Electronics & Communication' },
        { id: 'dept-mech', name: 'Mechanical Engineering' },
      ],
      programmes: ['B.E. CSE', 'B.E. ECE', 'B.E. Mechanical', 'M.Tech CSE'],
      overrides: {},
    },
    {
      id: 'inst-sch',
      name: 'Sahyadri Public School & PU College',
      type: 'SCHOOL',
      academicYear: '2026-27',
      aiAssistEnabled: false,
      retentionYears: 8,
      departments: [
        { id: 'dept-pri', name: 'Primary Wing (1-5)' },
        { id: 'dept-mid', name: 'Middle School (6-8)' },
        { id: 'dept-high', name: 'High School & PU (9-12)' },
      ],
      programmes: ['Class 1–5', 'Class 6–8', 'Class 9–10', 'PU Science'],
      overrides: {},
    },
  ],

  students: [],
  requests: [],
  documents: [],
  auditEvents: [],
};

function seedEduStudents() {
  const statusCycle = [
    'VERIFIED',
    'UNDER_REVIEW',
    'RECEIVED',
    'REQUESTED',
    'REJECTED_RESUBMISSION_REQUIRED',
    'NOT_REQUESTED',
  ];

  const eng = eduStore.institutions[0];
  const sch = eduStore.institutions[1];

  for (let i = 1; i <= 30; i++) {
    const isSchool = i > 20;
    const inst = isSchool ? sch : eng;
    const dept = inst.departments[(i - 1) % inst.departments.length];
    const stage = LIFECYCLE_STAGES[(i - 1) % LIFECYCLE_STAGES.length];
    const route = isSchool ? 'REGULAR' : ADMISSION_ROUTES[(i - 1) % ADMISSION_ROUTES.length];
    const isMinor = isSchool || i % 6 === 0;
    const isLateral = route === 'LATERAL_ENTRY';
    const optsHostel = !isSchool && i % 3 === 0;
    const optsTransport = i % 4 === 0;
    const isScholarshipApplicant = i % 2 === 0;

    const studentContext = {
      programmeLevel: isSchool ? 'SCHOOL' : route === 'POSTGRADUATE' ? 'POSTGRADUATE' : 'ENGINEERING',
      admissionRoute: route,
      isMinor,
      isInterBoardOrUniversity: i % 5 === 0,
      claimsReservationOrQuota: isScholarshipApplicant,
      isScholarshipApplicant,
      optsHostel,
      optsTransport,
      claimsDisabilitySupport: i === 7,
    };

    const checklistItems = generateEduChecklist({
      institutionOverrides: inst.overrides,
      lifecycleStage: stage,
      studentContext,
    }).map((it, idx) => ({
      ...it,
      id: `stu-${i}-item-${idx + 1}`,
      studentId: `stu-${i}`,
      institutionId: inst.id,
      departmentId: dept.id,
      status:
        it.tag === 'STAFF_CHECK'
          ? stage === 'ALUMNI'
            ? 'VERIFIED'
            : 'NOT_REQUESTED'
          : stage === 'ALUMNI'
          ? 'CLOSED'
          : statusCycle[(i + idx) % statusCycle.length],
      rejectionReason:
        statusCycle[(i + idx) % statusCycle.length] === 'REJECTED_RESUBMISSION_REQUIRED'
          ? 'Edges of marks card are cut off; please re-upload full scan.'
          : null,
      retentionDate: stage === 'ALUMNI' ? '2036-06-30' : '2031-06-30',
    }));

    eduStore.students.push({
      id: `stu-${i}`,
      institutionId: inst.id,
      departmentId: dept.id,
      applicationNumber: `${isSchool ? 'SCH' : 'USN'}-2026-${100 + i}`,
      fullName: `Student Demo ${i}`,
      programme: inst.programmes[i % inst.programmes.length],
      departmentName: dept.name,
      semester: isSchool ? `Grade ${(i % 10) + 1}` : `Sem ${((i - 1) % 8) + 1}`,
      academicYear: '2026-27',
      admissionRoute: route,
      admissionCategory: isScholarshipApplicant ? 'Category / Concession' : 'General Merit',
      lifecycleStage: stage,
      mobile: `+9198440${10000 + i}`,
      email: `student${i}@edu.example.in`,
      parentContact: `+9198441${10000 + i}`,
      emergencyContact: `+9198442${10000 + i}`,
      studentContext,
      consent: {
        version: 'v1.1',
        consentedAt: new Date(Date.now() - i * 86400000).toISOString(),
        purpose: 'ACADEMIC_ADMISSION_AND_LIFECYCLE_VERIFICATION',
        whoCanAccess: 'Authorised Institution Staff & Section Officers',
        retentionPeriod: `${inst.retentionYears} years`,
        optOutChannels: i === 29 ? ['SMS'] : [],
      },
      placementConsents: [
        { recipientName: 'Infosys Campus Recruitment', granted: i % 2 === 0, grantedAt: '2026-11-01' },
      ],
      noDues: {
        library: stage === 'ALUMNI' ? 'CLEARED' : 'PENDING',
        laboratory: stage === 'ALUMNI' ? 'CLEARED' : 'PENDING',
        hostel: optsHostel ? 'PENDING' : 'NOT_APPLICABLE',
        transport: optsTransport ? 'PENDING' : 'NOT_APPLICABLE',
        accounts: stage === 'ALUMNI' ? 'CLEARED' : 'PENDING',
      },
      checklistClosed: stage === 'ALUMNI',
      closedBy: stage === 'ALUMNI' ? 'verifier-1' : null,
      closedAt: stage === 'ALUMNI' ? '2026-11-15T10:00:00Z' : null,
      items: checklistItems,
    });
  }

  eduStore.auditEvents.push(
    createEduAuditEntry({
      institutionId: 'inst-eng',
      actorUserId: 'platform-seed',
      action: 'EDU_SEED_INITIALIZED',
      recordType: 'INSTITUTION',
      recordId: 'inst-eng',
      afterValue: { institutions: 2, students: 30 },
      reason: 'Seeded 1 Engineering College, 1 School, 3 departments each, and 30 students',
    })
  );
}

seedEduStudents();
