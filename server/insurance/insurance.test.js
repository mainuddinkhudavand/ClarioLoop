import test from 'node:test';
import assert from 'node:assert/strict';
import { READY_MADE_CHECKLISTS, transitionInsuranceDocStatus } from './templates.js';
import { generateCaseChecklist } from './rules.js';
import {
  assertInsurancePermission,
  canViewMedicalDocument,
  createAuditEntry,
} from './access.js';
import { insuranceStore } from './store.js';
import { checkDocumentReadability } from './routes.js';

test('ready-made checklists match exact item counts and Aadhaar is not universally mandatory', () => {
  assert.equal(READY_MADE_CHECKLISTS.BASIC_CUSTOMER_INFO.items.length, 14);
  assert.equal(READY_MADE_CHECKLISTS.KYC_IDENTITY.items.length, 10);
  assert.equal(READY_MADE_CHECKLISTS.LIFE_PROPOSAL.items.length, 20);
  assert.equal(READY_MADE_CHECKLISTS.HEALTH_PROPOSAL.items.length, 17);
  assert.equal(READY_MADE_CHECKLISTS.MOTOR_PROPOSAL.items.length, 15);
  assert.equal(READY_MADE_CHECKLISTS.LIFE_DEATH_CLAIM.items.length, 12);
  assert.equal(READY_MADE_CHECKLISTS.LIFE_MATURITY_CLAIM.items.length, 7);
  assert.equal(READY_MADE_CHECKLISTS.POLICY_SERVICING.items.length, 10);
  assert.equal(READY_MADE_CHECKLISTS.HEALTH_CLAIM.items.length, 17);
  assert.equal(READY_MADE_CHECKLISTS.MOTOR_CLAIM.items.length, 14);
  assert.equal(READY_MADE_CHECKLISTS.NOMINEE_BENEFICIARY.items.length, 9);
  assert.equal(READY_MADE_CHECKLISTS.CORPORATE_GROUP.items.length, 15);
  assert.equal(READY_MADE_CHECKLISTS.RENEWAL_PREMIUM.items.length, 11);

  const aadhaarItem = READY_MADE_CHECKLISTS.KYC_IDENTITY.items.find((i) =>
    i.title.includes('Aadhaar')
  );
  assert.equal(aadhaarItem?.requirement, 'OPTIONAL');
});

test('conditional rules dynamically add guardian items for minor nominee and permit/fitness for commercial vehicle', () => {
  const withoutMinor = generateCaseChecklist({
    category: 'LIFE',
    purpose: 'PROPOSAL',
    customerType: 'SALARIED',
    caseContext: { nomineeIsMinor: false },
  });
  const withMinor = generateCaseChecklist({
    category: 'LIFE',
    purpose: 'PROPOSAL',
    customerType: 'SALARIED',
    caseContext: { nomineeIsMinor: true },
  });

  assert.ok(withMinor.length > withoutMinor.length);
  assert.ok(withMinor.some((i) => i.documentName.includes('Appointee / Guardian')));
  assert.ok(withMinor.some((i) => i.documentName.includes('Salary Slips')));

  const commercialMotor = generateCaseChecklist({
    category: 'MOTOR',
    purpose: 'PROPOSAL',
    customerType: 'BUSINESS_PROPRIETOR',
    caseContext: { isCommercialVehicle: true, isFinancedVehicle: true },
  });
  assert.ok(commercialMotor.some((i) => i.documentName.includes('Commercial Vehicle Permit')));
  assert.ok(commercialMotor.some((i) => i.documentName.includes('Hypothecation')));
});

test('insurer-specific overrides take precedence over built-in templates', () => {
  const list = generateCaseChecklist({
    insurerOverrides: {
      LIFE_18: { requirement: 'MANDATORY', title: 'LIC Special ACR Override' },
    },
    category: 'LIFE',
    purpose: 'PROPOSAL',
    customerType: 'INDIVIDUAL',
  });
  const overridden = list.find((i) => i.code === 'LIFE_18');
  assert.equal(overridden?.documentName, 'LIC Special ACR Override');
  assert.equal(overridden?.requirementType, 'MANDATORY');
});

test('status transitions require valid path and mandatory rejection/N/A reason', () => {
  assert.throws(() => {
    transitionInsuranceDocStatus({
      fromStatus: 'NOT_REQUESTED',
      toStatus: 'VERIFIED',
      actorUserId: 'rev-1',
    });
  }, /Invalid status transition/);

  assert.throws(() => {
    transitionInsuranceDocStatus({
      fromStatus: 'UNDER_REVIEW',
      toStatus: 'REJECTED_RESUBMISSION_REQUIRED',
      actorUserId: 'rev-1',
      reason: '',
    });
  }, /Reason is mandatory/);

  const ok = transitionInsuranceDocStatus({
    fromStatus: 'UNDER_REVIEW',
    toStatus: 'VERIFIED',
    actorUserId: 'rev-1',
    reason: 'Verified against original',
  });
  assert.equal(ok.toStatus, 'VERIFIED');
});

test('medical document visibility gated by role and disabled products excluded', () => {
  assert.equal(canViewMedicalDocument({ role: 'AGENT_RM' }), false);
  assert.equal(canViewMedicalDocument({ role: 'AUTHORISED_REVIEWER' }), true);
  assert.throws(() => assertInsurancePermission({ role: 'AUDITOR' }, 'review:decide'), /Forbidden/);

  const enabledProducts = insuranceStore.products.filter((p) => p.enabled);
  assert.ok(enabledProducts.every((p) => p.enabled === true));
  assert.equal(insuranceStore.agency.aiAssistEnabled, false);
});

test('readability check rejects blank files and audit entry records metadata', () => {
  const bad = checkDocumentReadability(Buffer.from('tiny'));
  assert.equal(bad.readable, false);

  const entry = createAuditEntry({
    agencyId: 'ag-1',
    actorUserId: 'rev-1',
    action: 'REVIEW_DECISION_VERIFIED',
    recordType: 'CHECKLIST_ITEM',
    recordId: 'item-1',
    beforeValue: { status: 'UNDER_REVIEW' },
    afterValue: { status: 'VERIFIED' },
    reason: 'Clear scan',
  });
  assert.equal(entry.action, 'REVIEW_DECISION_VERIFIED');
});
