import test from 'node:test';
import assert from 'node:assert/strict';
import { EDU_CHECKLIST_SECTIONS, transitionEduDocStatus } from './templates.js';
import { generateEduChecklist } from './rules.js';
import {
  assertEduPermission,
  assertInstitutionAndDepartmentAccess,
  canViewSensitiveEduDocument,
} from './access.js';
import { eduStore } from './store.js';
import { checkEduReadability } from './routes.js';

test('Edu Sections A-J match exact item counts and Aadhaar is not required by default', () => {
  assert.equal(EDU_CHECKLIST_SECTIONS.A.items.length, 7);
  assert.equal(EDU_CHECKLIST_SECTIONS.B.items.length, 10);
  assert.equal(EDU_CHECKLIST_SECTIONS.C.items.length, 7);
  assert.equal(EDU_CHECKLIST_SECTIONS.D.items.length, 7);
  assert.equal(EDU_CHECKLIST_SECTIONS.E.items.length, 8);
  assert.equal(EDU_CHECKLIST_SECTIONS.F.items.length, 5);
  assert.equal(EDU_CHECKLIST_SECTIONS.G.items.length, 7);
  assert.equal(EDU_CHECKLIST_SECTIONS.H.items.length, 6);
  assert.equal(EDU_CHECKLIST_SECTIONS.I.items.length, 5);
  assert.equal(EDU_CHECKLIST_SECTIONS.J.items.length, 9);

  const aadhaarIdItem = EDU_CHECKLIST_SECTIONS.A.items.find((i) => i.code === 'A_05');
  assert.equal(aadhaarIdItem?.tag, 'OPTIONAL');
});

test('conditional rules add/remove hostel, lateral entry, minor, and scholarship items', () => {
  const base = generateEduChecklist({
    lifecycleStage: 'ADMITTED',
    studentContext: { programmeLevel: 'ENGINEERING', admissionRoute: 'REGULAR' },
  });
  const lateralHostelMinor = generateEduChecklist({
    lifecycleStage: 'ADMITTED',
    studentContext: {
      programmeLevel: 'ENGINEERING',
      admissionRoute: 'LATERAL_ENTRY',
      isMinor: true,
      optsHostel: true,
      isScholarshipApplicant: true,
    },
  });

  assert.ok(lateralHostelMinor.some((i) => i.code === 'B_03')); // Diploma docs
  assert.ok(lateralHostelMinor.some((i) => i.code === 'A_06')); // Parent/guardian minor consent
  assert.ok(lateralHostelMinor.some((i) => i.code === 'E_05')); // Hostel form
  assert.ok(lateralHostelMinor.some((i) => i.code === 'D_01')); // Scholarship
  assert.ok(!base.some((i) => i.code === 'B_03'));
  assert.ok(!base.some((i) => i.code === 'E_05'));
});

test('sensitive data access, department isolation, and status transition rules hold', () => {
  assert.equal(canViewSensitiveEduDocument({ role: 'PLACEMENT_OFFICER' }), false);
  assert.equal(canViewSensitiveEduDocument({ role: 'VERIFIER' }), true);
  assert.throws(
    () =>
      assertInstitutionAndDepartmentAccess(
        { role: 'DEPARTMENT_STAFF', institutionId: 'inst-eng', departmentId: 'dept-cse' },
        'inst-eng',
        'dept-ece'
      ),
    /Department isolation violation/
  );
  assert.throws(() => assertEduPermission({ role: 'AUDITOR' }, 'checklist:close'), /Forbidden/);

  assert.throws(() => {
    transitionEduDocStatus({
      fromStatus: 'UNDER_REVIEW',
      toStatus: 'REJECTED_RESUBMISSION_REQUIRED',
      actorUserId: 'ver-1',
      reason: ' ',
    });
  }, /Reason is mandatory/);
});

test('seed data includes 2 institutions, 30 students, and readability check rejects blank scans', () => {
  assert.equal(eduStore.institutions.length, 2);
  assert.equal(eduStore.students.length, 30);
  assert.equal(checkEduReadability(Buffer.from('blank')).readable, false);
});
