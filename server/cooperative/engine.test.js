import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateStatusTransition,
  calculateChecklistCompleteness,
  assertTenantAndBranchAccess,
  assertMakerCheckerValid,
  validateUploadedBuffer,
} from './engine.js';
import { SEED_CHECKLIST_TEMPLATES } from './templates.js';

test('valid status transitions and mandatory reason enforcement', () => {
  const r1 = validateStatusTransition({
    fromStatus: 'NOT_REQUESTED',
    toStatus: 'REQUESTED',
    actorUserId: 'verifier-1',
  });
  assert.equal(r1.toStatus, 'REQUESTED');

  assert.throws(() => {
    validateStatusTransition({
      fromStatus: 'NOT_REQUESTED',
      toStatus: 'ACCEPTED',
      actorUserId: 'verifier-1',
    });
  }, /Invalid status transition/);

  assert.throws(() => {
    validateStatusTransition({
      fromStatus: 'UNDER_REVIEW',
      toStatus: 'REJECTED_RESUBMISSION_REQUIRED',
      actorUserId: 'verifier-1',
      reason: '   ',
    });
  }, /mandatory reason/);
});

test('completeness calculation excludes NOT_APPLICABLE items', () => {
  const pct = calculateChecklistCompleteness([
    { status: 'ACCEPTED', requirement: 'MANDATORY' },
    { status: 'ACCEPTED', requirement: 'MANDATORY' },
    { status: 'REQUESTED', requirement: 'MANDATORY' },
    { status: 'NOT_APPLICABLE', requirement: 'NOT_APPLICABLE' },
  ]);
  assert.equal(pct, 67);
});

test('tenant, branch isolation, and maker-checker four-eyes check', () => {
  const branchAVerifier = {
    userId: 'u-a',
    tenantId: 't-1',
    branchId: 'br-1',
    role: 'VERIFIER_MAKER',
  };
  assert.doesNotThrow(() => assertTenantAndBranchAccess(branchAVerifier, 't-1', 'br-1'));
  assert.throws(
    () => assertTenantAndBranchAccess(branchAVerifier, 't-1', 'br-2'),
    /Branch isolation violation/
  );
  assert.throws(
    () => assertTenantAndBranchAccess(branchAVerifier, 't-2', 'br-1'),
    /Tenant isolation violation/
  );

  const checker = { userId: 'u-c', tenantId: 't-1', branchId: null, role: 'APPROVER_CHECKER' };
  assert.throws(() => assertMakerCheckerValid('u-c', checker), /Maker-checker violation/);
  assert.doesNotThrow(() => assertMakerCheckerValid('u-a', checker));
});

test('magic-byte PDF validation and malware stub detection', () => {
  const pdfBuf = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj', 'utf8');
  const validated = validateUploadedBuffer(pdfBuf);
  assert.equal(validated.mimeType, 'application/pdf');
  assert.equal(validated.malwareScanStatus, 'CLEAN');

  const exeBuf = Buffer.from('MZ fake executable', 'utf8');
  assert.throws(() => validateUploadedBuffer(exeBuf), /Only PDF, JPG, and PNG/);
});

test('seeded templates match exact P0 item counts', () => {
  const counts = Object.fromEntries(
    SEED_CHECKLIST_TEMPLATES.map((t) => [t.code, t.items.length])
  );
  assert.deepEqual(counts, {
    TPL_MEMBER_KYC: 18,
    TPL_BUSINESS_MEMBER: 6,
    TPL_LOAN_AGRI: 11,
    TPL_LOAN_PERSONAL: 10,
    TPL_LOAN_GOLD: 8,
    TPL_LOAN_MSME: 12,
    TPL_LOAN_HOUSING: 12,
  });
});
