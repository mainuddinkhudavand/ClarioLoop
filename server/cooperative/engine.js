import crypto from 'crypto';

export const CHECKLIST_STATUSES = [
  'NOT_REQUESTED',
  'REQUESTED',
  'RECEIVED',
  'UNDER_REVIEW',
  'ACCEPTED',
  'REJECTED_RESUBMISSION_REQUIRED',
  'NOT_APPLICABLE',
];

export const VALID_TRANSITIONS = {
  NOT_REQUESTED: ['REQUESTED', 'NOT_APPLICABLE'],
  REQUESTED: ['RECEIVED', 'NOT_APPLICABLE'],
  RECEIVED: ['UNDER_REVIEW', 'REJECTED_RESUBMISSION_REQUIRED', 'NOT_APPLICABLE'],
  UNDER_REVIEW: ['ACCEPTED', 'REJECTED_RESUBMISSION_REQUIRED', 'NOT_APPLICABLE'],
  REJECTED_RESUBMISSION_REQUIRED: ['REQUESTED', 'RECEIVED', 'NOT_APPLICABLE'],
  ACCEPTED: ['NOT_APPLICABLE'],
  NOT_APPLICABLE: ['NOT_REQUESTED', 'REQUESTED'],
};

const REASON_REQUIRED_TARGETS = new Set([
  'REJECTED_RESUBMISSION_REQUIRED',
  'NOT_APPLICABLE',
]);

export function validateStatusTransition({ fromStatus, toStatus, actorUserId, reason }) {
  if (!actorUserId) {
    throw new Error('Transition requires an authenticated actorUserId');
  }
  if (fromStatus === toStatus) {
    throw new Error(`Invalid transition: item is already in status ${fromStatus}`);
  }
  const allowed = VALID_TRANSITIONS[fromStatus] || [];
  if (!allowed.includes(toStatus)) {
    throw new Error(`Invalid status transition from ${fromStatus} to ${toStatus}`);
  }
  const cleanReason = reason ? String(reason).trim() : null;
  if (REASON_REQUIRED_TARGETS.has(toStatus) && !cleanReason) {
    throw new Error(`A mandatory reason is required when setting status to ${toStatus}`);
  }
  return {
    fromStatus,
    toStatus,
    actorUserId,
    reason: cleanReason,
    transitionedAt: new Date().toISOString(),
  };
}

export function calculateChecklistCompleteness(items) {
  const applicable = items.filter(
    (item) => item.requirement !== 'NOT_APPLICABLE' && item.status !== 'NOT_APPLICABLE'
  );
  if (applicable.length === 0) return 100;
  const accepted = applicable.filter((item) => item.status === 'ACCEPTED').length;
  return Math.round((accepted / applicable.length) * 100);
}

// RBAC & Tenant/Branch Segregation
const INSTITUTION_WIDE_ROLES = new Set([
  'SUPER_ADMIN',
  'INSTITUTION_ADMIN',
  'APPROVER_CHECKER',
  'AUDITOR',
]);

export function assertTenantAndBranchAccess(actor, targetTenantId, targetBranchId = null) {
  if (actor.role !== 'SUPER_ADMIN' && actor.tenantId !== targetTenantId) {
    throw new Error('Tenant isolation violation: cross-institution access denied');
  }
  if (
    targetBranchId &&
    !INSTITUTION_WIDE_ROLES.has(actor.role) &&
    actor.branchId !== targetBranchId
  ) {
    throw new Error('Branch isolation violation: cross-branch access denied');
  }
}

export function assertMakerCheckerValid(makerId, checker) {
  if (!['APPROVER_CHECKER', 'SUPER_ADMIN', 'INSTITUTION_ADMIN'].includes(checker.role)) {
    throw new Error(`Forbidden: role ${checker.role} cannot approve maker-checker actions`);
  }
  if (makerId === checker.userId) {
    throw new Error('Maker-checker violation: maker cannot approve their own request');
  }
}

// Upload security: magic-byte MIME detection, size limit, SHA-256, malware hook
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export function detectMimeFromMagicBytes(buffer) {
  if (!buffer || buffer.length < 4) return null;
  if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
    return 'application/pdf';
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return 'image/png';
  }
  return null;
}

export function scanMalwareStub(buffer) {
  const preview = buffer.subarray(0, 128).toString('utf8');
  if (preview.includes('X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*')) {
    return 'INFECTED';
  }
  return 'CLEAN';
}

export function validateUploadedBuffer(buffer) {
  if (!buffer || buffer.length === 0) throw new Error('Uploaded file is empty');
  if (buffer.length > MAX_UPLOAD_BYTES) throw new Error('File exceeds 10 MB limit');
  const mimeType = detectMimeFromMagicBytes(buffer);
  if (!mimeType) throw new Error('Only PDF, JPG, and PNG files are allowed');
  const malwareScanStatus = scanMalwareStub(buffer);
  if (malwareScanStatus === 'INFECTED') throw new Error('Upload blocked: failed malware scan');
  const sha256Hash = crypto.createHash('sha256').update(buffer).digest('hex');
  return { mimeType, sizeBytes: buffer.length, sha256Hash, malwareScanStatus };
}

export function sha256Hex(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export function generateUploadToken() {
  const rawToken = crypto.randomBytes(24).toString('base64url');
  return { rawToken, tokenHash: sha256Hex(rawToken) };
}
