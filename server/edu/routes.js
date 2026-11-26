import express from 'express';
import crypto from 'crypto';
import multer from 'multer';
import { eduStore } from './store.js';
import {
  assertEduPermission,
  assertInstitutionAndDepartmentAccess,
  canViewSensitiveEduDocument,
  createEduAuditEntry,
} from './access.js';
import { EDU_CHECKLIST_SECTIONS, transitionEduDocStatus } from './templates.js';
import { generateEduChecklist } from './rules.js';
import { detectMimeFromMagicBytes, scanMalwareStub } from '../cooperative/engine.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

function getActor(req) {
  return {
    userId: String(req.headers['x-user-id'] || 'edu-admin-1'),
    institutionId: String(req.headers['x-institution-id'] || 'inst-eng'),
    departmentId: req.headers['x-department-id'] ? String(req.headers['x-department-id']) : null,
    section: req.headers['x-clearance-section'] ? String(req.headers['x-clearance-section']) : null,
    role: String(req.headers['x-user-role'] || 'INSTITUTION_ADMIN'),
  };
}

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

export function checkEduReadability(buffer) {
  if (!buffer || buffer.length < 200) {
    return { readable: false, reason: 'Scan appears blank, blurry, or cut off (file too small).' };
  }
  return { readable: true, reason: null };
}

router.get('/config', (req, res) => {
  try {
    const actor = getActor(req);
    const inst = eduStore.institutions.find((i) => i.id === actor.institutionId) || eduStore.institutions[0];
    res.json({
      institution: inst,
      institutions: eduStore.institutions,
      sections: Object.values(EDU_CHECKLIST_SECTIONS),
    });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

router.patch('/config/ai', (req, res) => {
  try {
    const actor = getActor(req);
    assertEduPermission(actor, 'ai:configure');
    const inst = eduStore.institutions.find((i) => i.id === actor.institutionId);
    if (!inst) return res.status(404).json({ error: 'Institution not found' });
    const before = { aiAssistEnabled: inst.aiAssistEnabled };
    inst.aiAssistEnabled = Boolean(req.body.enabled);
    eduStore.auditEvents.unshift(
      createEduAuditEntry({
        institutionId: inst.id,
        actorUserId: actor.userId,
        action: 'EDU_AI_ASSIST_TOGGLED',
        recordType: 'INSTITUTION',
        recordId: inst.id,
        beforeValue: before,
        afterValue: { aiAssistEnabled: inst.aiAssistEnabled },
        reason: req.body.reason || 'Institution AI preference updated',
      })
    );
    res.json({ aiAssistEnabled: inst.aiAssistEnabled });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

router.get('/students', (req, res) => {
  try {
    const actor = getActor(req);
    assertEduPermission(actor, 'student:read');
    const allowSensitive = canViewSensitiveEduDocument(actor);

    const students = eduStore.students
      .filter((s) => {
        try {
          assertInstitutionAndDepartmentAccess(actor, s.institutionId, s.departmentId);
          return true;
        } catch {
          return false;
        }
      })
      .map((s) => ({
        ...s,
        items: s.items.map((it) =>
          it.sensitive && !allowSensitive
            ? { ...it, fileVersions: [], sensitiveRedacted: true }
            : it
        ),
      }));

    res.json({ students });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

// Dynamic Checklist Preview / Generation for Student Context
router.post('/students/:id/generate-checklist', (req, res) => {
  try {
    const actor = getActor(req);
    assertEduPermission(actor, 'checklist:generate');
    const student = eduStore.students.find((s) => s.id === req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const inst = eduStore.institutions.find((i) => i.id === student.institutionId);
    const updatedCtx = { ...student.studentContext, ...(req.body.studentContext || {}) };
    student.studentContext = updatedCtx;
    const generated = generateEduChecklist({
      institutionOverrides: inst?.overrides || {},
      lifecycleStage: req.body.lifecycleStage || student.lifecycleStage,
      studentContext: updatedCtx,
    });

    student.items = generated.map((it, idx) => ({
      ...it,
      id: `${student.id}-dyn-${idx + 1}`,
      studentId: student.id,
      institutionId: student.institutionId,
      departmentId: student.departmentId,
    }));

    eduStore.auditEvents.unshift(
      createEduAuditEntry({
        institutionId: student.institutionId,
        departmentId: student.departmentId,
        actorUserId: actor.userId,
        action: 'CHECKLIST_REGENERATED',
        recordType: 'STUDENT',
        recordId: student.id,
        afterValue: { itemCount: student.items.length, studentContext: updatedCtx },
      })
    );

    res.json({ items: student.items });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Continuing Students: Carry forward valid held documents, flag expired/prior-year docs
router.post('/students/:id/continuing', (req, res) => {
  try {
    const actor = getActor(req);
    assertEduPermission(actor, 'continuing:initiate');
    const student = eduStore.students.find((s) => s.id === req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const carriedForward = student.items.filter((i) => i.status === 'VERIFIED').map((i) => i.code);
    const renewalItems = generateEduChecklist({
      lifecycleStage: 'CONTINUING',
      studentContext: student.studentContext,
    }).filter((i) => i.sectionCode === 'SEC_G');

    student.lifecycleStage = 'CONTINUING';
    for (const rItem of renewalItems) {
      if (!student.items.some((x) => x.code === rItem.code)) {
        student.items.push({
          ...rItem,
          id: `${student.id}-${rItem.code}`,
          studentId: student.id,
          institutionId: student.institutionId,
          departmentId: student.departmentId,
          status: 'REQUESTED',
        });
      }
    }

    eduStore.auditEvents.unshift(
      createEduAuditEntry({
        institutionId: student.institutionId,
        departmentId: student.departmentId,
        actorUserId: actor.userId,
        action: 'CONTINUING_UPDATE_INITIATED',
        recordType: 'STUDENT',
        recordId: student.id,
        afterValue: { carriedForwardCount: carriedForward.length },
      })
    );

    res.json({ carriedForwardCount: carriedForward.length, items: student.items });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

// Placement Profile Sharing: NEVER shared without per-recipient named consent
router.post('/students/:id/placement-share', (req, res) => {
  try {
    const actor = getActor(req);
    assertEduPermission(actor, 'placement:share_with_consent');
    const student = eduStore.students.find((s) => s.id === req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const recipientName = String(req.body.recipientName || '').trim();
    const consent = (student.placementConsents || []).find(
      (c) => c.recipientName.toLowerCase() === recipientName.toLowerCase() && c.granted
    );
    if (!consent) {
      return res.status(403).json({
        error: `Consent required: student has not granted placement sharing consent for "${recipientName}".`,
      });
    }

    eduStore.auditEvents.unshift(
      createEduAuditEntry({
        institutionId: student.institutionId,
        departmentId: student.departmentId,
        actorUserId: actor.userId,
        action: 'PLACEMENT_PROFILE_SHARED',
        recordType: 'STUDENT',
        recordId: student.id,
        afterValue: { recipientName, consentGrantedAt: consent.grantedAt },
      })
    );

    res.json({ shared: true, recipientName });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

// Section No-Dues Clearance (Each section marks ONLY its own clearance)
router.post('/students/:id/nodues', (req, res) => {
  try {
    const actor = getActor(req);
    const { section, status } = req.body;
    const student = eduStore.students.find((s) => s.id === req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    if (actor.role === 'SECTION_CLEARANCE_STAFF') {
      assertEduPermission(actor, 'nodues:section_own');
      if (actor.section !== section) {
        return res.status(403).json({
          error: `Section isolation: ${actor.section} staff cannot update ${section} clearance.`,
        });
      }
    } else if (actor.role === 'ACCOUNTS_STAFF') {
      assertEduPermission(actor, 'nodues:accounts');
      if (section !== 'accounts') {
        return res.status(403).json({ error: 'Accounts staff can only mark accounts clearance.' });
      }
    } else {
      assertEduPermission(actor, 'institution:manage');
    }

    const before = student.noDues[section];
    student.noDues[section] = status;
    eduStore.auditEvents.unshift(
      createEduAuditEntry({
        institutionId: student.institutionId,
        actorUserId: actor.userId,
        action: 'NO_DUES_UPDATED',
        recordType: 'STUDENT',
        recordId: student.id,
        beforeValue: { section, status: before },
        afterValue: { section, status },
      })
    );
    res.json({ noDues: student.noDues });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

// Secure Upload Link + Walk-in Mode + Versioned Uploads
router.post('/requests', (req, res) => {
  try {
    const actor = getActor(req);
    assertEduPermission(actor, 'request:send');
    const { studentId, itemIds = [] } = req.body;
    const student = eduStore.students.find((s) => s.id === studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const rawToken = crypto.randomBytes(20).toString('base64url');
    const tokenHash = sha256(Buffer.from(rawToken));
    const expiresAt = new Date(Date.now() + 72 * 3600 * 1000).toISOString();

    for (const id of itemIds) {
      const it = student.items.find((x) => x.id === id);
      if (it && it.status === 'NOT_REQUESTED') {
        it.status = 'REQUESTED';
      }
    }

    const reqRec = {
      id: `edu-req-${Date.now()}`,
      institutionId: student.institutionId,
      studentId: student.id,
      tokenHash,
      expiresAt,
      itemIds,
    };
    eduStore.requests.push(reqRec);
    eduStore.auditEvents.unshift(
      createEduAuditEntry({
        institutionId: student.institutionId,
        departmentId: student.departmentId,
        actorUserId: actor.userId,
        action: 'EDU_UPLOAD_LINK_SENT',
        recordType: 'DOCUMENT_REQUEST',
        recordId: reqRec.id,
        afterValue: { studentId: student.id, itemCount: itemIds.length },
      })
    );
    res.status(201).json({ request: reqRec, uploadToken: rawToken });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/upload/:token', (req, res) => {
  const tokenHash = sha256(Buffer.from(req.params.token));
  const found = eduStore.requests.find((r) => r.tokenHash === tokenHash);
  if (!found) return res.status(404).json({ error: 'Invalid upload link' });
  if (new Date(found.expiresAt).getTime() < Date.now()) {
    return res.status(410).json({ error: 'Upload link expired' });
  }
  const student = eduStore.students.find((s) => s.id === found.studentId);
  const items = (student?.items || []).filter((i) => found.itemIds.includes(i.id));
  res.json({
    studentName: student?.fullName,
    applicationNumber: student?.applicationNumber,
    dataNotice: student?.consent,
    expiresAt: found.expiresAt,
    items,
  });
});

router.post('/upload/:token', upload.single('file'), (req, res) => {
  try {
    const tokenHash = sha256(Buffer.from(req.params.token));
    const found = eduStore.requests.find((r) => r.tokenHash === tokenHash);
    if (!found) return res.status(404).json({ error: 'Invalid upload link' });
    if (!req.file) return res.status(400).json({ error: 'File is required' });

    const mimeType = detectMimeFromMagicBytes(req.file.buffer);
    if (!mimeType) return res.status(400).json({ error: 'Only PDF, JPG, and PNG files are allowed' });
    if (scanMalwareStub(req.file.buffer) === 'INFECTED') {
      return res.status(400).json({ error: 'Blocked: malware scan failed' });
    }
    const readability = checkEduReadability(req.file.buffer);
    if (!readability.readable) return res.status(400).json({ error: readability.reason });

    const fileHash = sha256(req.file.buffer);
    const dup = eduStore.documents.find(
      (d) => d.studentId === found.studentId && d.sha256Hash === fileHash
    );
    if (dup) return res.status(409).json({ error: `Duplicate file detected (${dup.filename})` });

    const student = eduStore.students.find((s) => s.id === found.studentId);
    const item = student?.items.find((i) => i.id === String(req.body.itemId || found.itemIds[0]));
    if (!item) return res.status(404).json({ error: 'Checklist item not found' });

    transitionEduDocStatus({
      fromStatus: item.status,
      toStatus: 'RECEIVED',
      actorUserId: found.studentId,
      reason: 'Student portal upload',
    });
    item.status = 'UNDER_REVIEW';
    item.fileVersions.push({
      version: item.fileVersions.length + 1,
      filename: req.file.originalname,
      sha256Hash: fileHash,
      uploadedAt: new Date().toISOString(),
    });

    const doc = {
      id: `edu-doc-${Date.now()}`,
      institutionId: found.institutionId,
      studentId: found.studentId,
      itemId: item.id,
      filename: req.file.originalname,
      sha256Hash: fileHash,
    };
    eduStore.documents.push(doc);
    eduStore.auditEvents.unshift(
      createEduAuditEntry({
        institutionId: found.institutionId,
        actorUserId: found.studentId,
        action: 'STUDENT_DOCUMENT_UPLOADED',
        recordType: 'DOCUMENT',
        recordId: doc.id,
        afterValue: { filename: doc.filename, version: item.fileVersions.length },
      })
    );

    res.status(201).json({ document: doc, status: item.status });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Authorised Review & Checklist Closure (Requires Section J checks)
router.post('/review', (req, res) => {
  try {
    const actor = getActor(req);
    assertEduPermission(actor, 'review:decide');
    const { studentId, itemId, decision, reason } = req.body;
    const student = eduStore.students.find((s) => s.id === studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const item = student.items.find((i) => i.id === itemId);
    if (!item) return res.status(404).json({ error: 'Checklist item not found' });

    const tr = transitionEduDocStatus({
      fromStatus: item.status,
      toStatus: decision,
      actorUserId: actor.userId,
      reason,
    });
    item.status = tr.toStatus;
    item.rejectionReason = decision === 'REJECTED_RESUBMISSION_REQUIRED' ? tr.reason : null;

    eduStore.auditEvents.unshift(
      createEduAuditEntry({
        institutionId: student.institutionId,
        departmentId: student.departmentId,
        actorUserId: actor.userId,
        action: `EDU_REVIEW_${tr.toStatus}`,
        recordType: 'CHECKLIST_ITEM',
        recordId: item.id,
        beforeValue: { status: tr.fromStatus },
        afterValue: { status: tr.toStatus },
        reason: tr.reason,
      })
    );
    res.json({ item });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/students/:id/close', (req, res) => {
  try {
    const actor = getActor(req);
    assertEduPermission(actor, 'checklist:close');
    const student = eduStore.students.find((s) => s.id === req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const sectionJ = student.items.filter((i) => i.sectionCode === 'SEC_J');
    const incompleteJ = sectionJ.filter((i) => !['VERIFIED', 'NOT_APPLICABLE'].includes(i.status));
    if (incompleteJ.length > 0) {
      return res.status(400).json({
        error: `Cannot close checklist: ${incompleteJ.length} Section J staff verification check(s) remain incomplete.`,
      });
    }

    student.checklistClosed = true;
    student.closedBy = actor.userId;
    student.closedAt = new Date().toISOString();
    eduStore.auditEvents.unshift(
      createEduAuditEntry({
        institutionId: student.institutionId,
        departmentId: student.departmentId,
        actorUserId: actor.userId,
        action: 'CHECKLIST_CLOSED',
        recordType: 'STUDENT',
        recordId: student.id,
        afterValue: { closedBy: actor.userId, closedAt: student.closedAt },
      })
    );
    res.json({ checklistClosed: true, closedBy: actor.userId, closedAt: student.closedAt });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

// Logged CSV Export
router.get('/reports/export', (req, res) => {
  try {
    const actor = getActor(req);
    assertEduPermission(actor, 'report:export');
    const type = String(req.query.type || 'pending_docs');

    eduStore.auditEvents.unshift(
      createEduAuditEntry({
        institutionId: actor.institutionId,
        actorUserId: actor.userId,
        action: 'EDU_REPORT_EXPORTED',
        recordType: 'REPORT',
        recordId: type,
        reason: 'Authorised staff report export',
      })
    );

    const lines = ['AppNumber,FullName,Programme,Stage,Section,DocumentTitle,Tag,Status'];
    for (const s of eduStore.students) {
      for (const it of s.items) {
        lines.push(`${s.applicationNumber},"${s.fullName}","${s.programme}",${s.lifecycleStage},${it.sectionCode},"${it.title}",${it.tag},${it.status}`);
      }
    }
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="clarioloop_edu_${type}.csv"`);
    res.send(lines.join('\n'));
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

router.get('/audit', (req, res) => {
  try {
    const actor = getActor(req);
    assertEduPermission(actor, 'audit:read');
    res.json({ auditEvents: eduStore.auditEvents });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

export default router;
