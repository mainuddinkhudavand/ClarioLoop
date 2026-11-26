import crypto from 'crypto';

export const INSURANCE_ROLES = [
  'CLIENT_POLICYHOLDER',
  'AGENT_RM',
  'AUTHORISED_REVIEWER',
  'AGENCY_ADMIN',
  'AUDITOR',
  'INSURER_INTEGRATION_USER',
  'PLATFORM_ADMIN',
];

const ROLE_PERMISSIONS = {
  CLIENT_POLICYHOLDER: ['own_records:read', 'upload:submit'],
  AGENT_RM: [
    'client:read',
    'client:write',
    'case:create',
    'request:send',
    'document:view_standard',
    'notification:send',
    'report:view',
    'ai:suggest',
  ],
  AUTHORISED_REVIEWER: [
    'client:read',
    'document:view_standard',
    'document:view_sensitive', // Medical & sensitive health docs
    'review:decide',
    'report:view',
    'ai:suggest',
  ],
  AGENCY_ADMIN: [
    'agency:manage',
    'template:manage',
    'product:manage',
    'client:read',
    'client:write',
    'case:create',
    'request:send',
    'document:view_standard',
    'document:view_sensitive',
    'review:decide',
    'notification:manage',
    'report:view',
    'report:export',
    'audit:read',
    'ai:configure',
    'ai:suggest',
  ],
  AUDITOR: [
    'client:read',
    'document:view_standard',
    'report:view',
    'audit:read',
  ],
  INSURER_INTEGRATION_USER: [
    // Placeholder limited to approved insurer workflows only
    'insurer_workflow:read',
  ],
  PLATFORM_ADMIN: [
    'agency:manage',
    'template:manage',
    'product:manage',
    'client:read',
    'client:write',
    'case:create',
    'request:send',
    'document:view_standard',
    'document:view_sensitive',
    'review:decide',
    'notification:manage',
    'report:view',
    'report:export',
    'audit:read',
    'ai:configure',
    'ai:suggest',
  ],
};

export function hasInsurancePermission(role, permission) {
  return (ROLE_PERMISSIONS[role] || []).includes(permission);
}

export function assertInsurancePermission(actor, permission) {
  if (!actor || !hasInsurancePermission(actor.role, permission)) {
    throw new Error(`Forbidden: role ${actor?.role || 'UNKNOWN'} lacks permission ${permission}`);
  }
}

export function assertAgencyAndTeamAccess(actor, targetAgencyId, targetTeamId = null) {
  if (actor.role !== 'PLATFORM_ADMIN' && actor.agencyId !== targetAgencyId) {
    throw new Error('Agency isolation violation: cross-agency access denied');
  }
  if (
    targetTeamId &&
    actor.role === 'AGENT_RM' &&
    actor.teamId &&
    actor.teamId !== targetTeamId
  ) {
    throw new Error('Team isolation violation: cross-team access denied');
  }
}

export function canViewMedicalDocument(actor) {
  return hasInsurancePermission(actor?.role, 'document:view_sensitive');
}

export function createAuditEntry({
  agencyId,
  teamId = null,
  actorUserId,
  action,
  recordType,
  recordId,
  beforeValue = null,
  afterValue = null,
  reason = null,
  ip = '127.0.0.1',
}) {
  if (!agencyId || !action || !recordType || !recordId) {
    throw new Error('Audit entry requires agencyId, action, recordType, and recordId');
  }
  return {
    id: `ins-aud-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
    agencyId,
    teamId,
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
