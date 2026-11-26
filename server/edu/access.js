import crypto from 'crypto';

export const EDU_ROLES = [
  'STUDENT_PARENT',
  'ADMISSION_OFFICE_STAFF',
  'DEPARTMENT_STAFF',
  'SCHOLARSHIP_OFFICER',
  'ACCOUNTS_STAFF',
  'SECTION_CLEARANCE_STAFF', // Hostel / Transport / Library (own clearance items only)
  'PLACEMENT_OFFICER',
  'VERIFIER',
  'INSTITUTION_ADMIN',
  'AUDITOR',
  'PLATFORM_ADMIN',
];

const ROLE_PERMISSIONS = {
  STUDENT_PARENT: ['own_records:read', 'upload:submit'],
  ADMISSION_OFFICE_STAFF: [
    'student:read',
    'student:write',
    'checklist:generate',
    'request:send',
    'upload:walkin',
    'document:view_standard',
    'report:view',
    'acknowledgement:print',
  ],
  DEPARTMENT_STAFF: [
    'student:read',
    'document:view_standard',
    'continuing:initiate',
    'report:view',
  ],
  SCHOLARSHIP_OFFICER: [
    'student:read',
    'document:view_standard',
    'document:view_sensitive', // Caste, income, bank/DBT for scholarship schemes
    'review:decide',
    'report:view',
  ],
  ACCOUNTS_STAFF: [
    'student:read',
    'nodues:accounts',
    'report:view',
  ],
  SECTION_CLEARANCE_STAFF: [
    // Own clearance items only (library, lab, hostel, transport)
    'nodues:section_own',
  ],
  PLACEMENT_OFFICER: [
    'student:read',
    'placement:manage',
    'placement:share_with_consent',
    'report:view',
  ],
  VERIFIER: [
    'student:read',
    'document:view_standard',
    'document:view_sensitive',
    'review:decide',
    'checklist:close',
    'report:view',
    'ai:suggest',
  ],
  INSTITUTION_ADMIN: [
    'institution:manage',
    'template:manage',
    'student:read',
    'student:write',
    'checklist:generate',
    'request:send',
    'upload:walkin',
    'document:view_standard',
    'document:view_sensitive',
    'review:decide',
    'checklist:close',
    'continuing:initiate',
    'placement:manage',
    'placement:share_with_consent',
    'nodues:accounts',
    'notification:manage',
    'report:view',
    'report:export',
    'audit:read',
    'ai:configure',
    'ai:suggest',
    'acknowledgement:print',
  ],
  AUDITOR: ['student:read', 'document:view_standard', 'report:view', 'audit:read'],
  PLATFORM_ADMIN: [
    'institution:manage',
    'template:manage',
    'student:read',
    'student:write',
    'checklist:generate',
    'request:send',
    'upload:walkin',
    'document:view_standard',
    'document:view_sensitive',
    'review:decide',
    'checklist:close',
    'continuing:initiate',
    'placement:manage',
    'placement:share_with_consent',
    'nodues:accounts',
    'notification:manage',
    'report:view',
    'report:export',
    'audit:read',
    'ai:configure',
    'ai:suggest',
    'acknowledgement:print',
  ],
};

export function hasEduPermission(role, permission) {
  return (ROLE_PERMISSIONS[role] || []).includes(permission);
}

export function assertEduPermission(actor, permission) {
  if (!actor || !hasEduPermission(actor.role, permission)) {
    throw new Error(`Forbidden: role ${actor?.role || 'UNKNOWN'} lacks permission ${permission}`);
  }
}

export function assertInstitutionAndDepartmentAccess(actor, targetInstitutionId, targetDepartmentId = null) {
  if (actor.role !== 'PLATFORM_ADMIN' && actor.institutionId !== targetInstitutionId) {
    throw new Error('Institution isolation violation: cross-institution access denied');
  }
  if (
    targetDepartmentId &&
    actor.role === 'DEPARTMENT_STAFF' &&
    actor.departmentId &&
    actor.departmentId !== targetDepartmentId
  ) {
    throw new Error('Department isolation violation: cross-department access denied');
  }
}

export function canViewSensitiveEduDocument(actor) {
  return hasEduPermission(actor?.role, 'document:view_sensitive');
}

export function createEduAuditEntry({
  institutionId,
  departmentId = null,
  actorUserId,
  action,
  recordType,
  recordId,
  beforeValue = null,
  afterValue = null,
  reason = null,
  ip = '127.0.0.1',
}) {
  if (!institutionId || !action || !recordType || !recordId) {
    throw new Error('Audit entry requires institutionId, action, recordType, and recordId');
  }
  return {
    id: `edu-aud-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
    institutionId,
    departmentId,
    actorUserId: actorUserId || 'SYSTEM',
    action,
    recordType,
    recordId,
    beforeValue,
    afterValue,
    reason,
    ip,
    createdAt: new Date().toISOString(),
  };
}
