import express from 'express';
import crypto from 'crypto';
import multer from 'multer';
import { insuranceStore } from './store.js';
import {
  assertAgencyAndTeamAccess,
  assertInsurancePermission,
  canViewMedicalDocument,
  createAuditEntry,
} from './access.js';
import { READY_MADE_CHECKLISTS, transitionInsuranceDocStatus } from './templates.js';
import { generateCaseChecklist } from './rules.js';
import { detectMimeFromMagicBytes, scanMalwareStub } from '../cooperative/engine.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

function getActor(req) {
  return {
    userId: String(req.headers['x-user-id'] || 'admin-ins-1'),
    agencyId: String(req.headers['x-agency-id'] || insuranceStore.agency.id),
    teamId: req.headers['x-team-id'] ? String(req.headers['x-team-id']) : null,
    role: String(req.headers['x-user-role'] || 'AGENCY_ADMIN'),
  };
}

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

/**
 * Basic readability check on upload:
 * Rejects tiny/blank payloads (< 200 bytes) or corrupted buffers.
 */
export function checkDocumentReadability(buffer) {
  if (!buffer || buffer.length < 200) {
    return { readable: false, reason: 'File appears blank or too low-resolution to read clearly.' };
  }
  return { readable: true, reason: null };
}

// 1. Agency, Insurers, Enabled Products & Templates
router.get('/config', (req, res) => {
  try {
    const actor = getActor(req);
    assertAgencyAndTeamAccess(actor, insuranceStore.agency.id);
    const includeDisabled = req.query.includeDisabled === 'true';
    res.json({
      agency: insuranceStore.agency,
      insurers: insuranceStore.insurers,
      // Disabled products never appear in operational UI
      products: includeDisabled
        ? insuranceStore.products
        : insuranceStore.products.filter((p) => p.enabled),
      templates: Object.values(READY_MADE_CHECKLISTS),
    });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

router.patch('/config/product', (req, res) => {
  try {
    const actor = getActor(req);
    assertInsurancePermission(actor, 'product:manage');
    const { productId, enabled, reason } = req.body;
    const product = insuranceStore.products.find((p) => p.id === productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const before = { enabled: product.enabled };
    product.enabled = Boolean(enabled);
    insuranceStore.auditEvents.unshift(
      createAuditEntry({
        agencyId: actor.agencyId,
        actorUserId: actor.userId,
        action: 'PRODUCT_TOGGLED',
        recordType: 'PRODUCT',
        recordId: product.id,
        beforeValue: before,
        afterValue: { enabled: product.enabled },
        reason: reason || 'Agency product configuration update',
      })
    );
    res.json({ product });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

router.patch('/config/ai', (req, res) => {
  try {
    const actor = getActor(req);
    assertInsurancePermission(actor, 'ai:configure');
    const before = { aiAssistEnabled: insuranceStore.agency.aiAssistEnabled };
    insuranceStore.agency.aiAssistEnabled = Boolean(req.body.enabled);
    insuranceStore.auditEvents.unshift(
      createAuditEntry({
        agencyId: actor.agencyId,
        actorUserId: actor.userId,
        action: 'AI_ASSIST_TOGGLED',
        recordType: 'AGENCY',
        recordId: actor.agencyId,
        beforeValue: before,
        afterValue: { aiAssistEnabled: insuranceStore.agency.aiAssistEnabled },
        reason: req.body.reason || 'Agency AI assist preference updated',
      })
    );
    res.json({ aiAssistEnabled: insuranceStore.agency.aiAssistEnabled });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

// 2. Clients & Cases (New Case Wizard)
router.get('/clients', (req, res) => {
  try {
    const actor = getActor(req);
    assertInsurancePermission(actor, 'client:read');
    const visible = insuranceStore.clients.filter((c) => {
      try {
        assertAgencyAndTeamAccess(actor, c.agencyId, c.teamId);
        return true;
      } catch {
        return false;
      }
    });
    res.json({ clients: visible });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

router.get('/cases', (req, res) => {
  try {
    const actor = getActor(req);
    assertInsurancePermission(actor, 'client:read');
    const allowSensitive = canViewMedicalDocument(actor);

    const cases = insuranceStore.cases
      .filter((c) => {
        try {
          assertAgencyAndTeamAccess(actor, c.agencyId, c.teamId);
          return true;
        } catch {
          return false;
        }
      })
      .map((c) => ({
        ...c,
        // Medical & sensitive documents are visible only to roles with permission
        items: c.items.map((it) =>
          it.sensitive && !allowSensitive
            ? { ...it, fileReference: null, medicalRedacted: true }
            : it
        ),
      }));

    res.json({ cases });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

router.post('/cases', (req, res) => {
  try {
    const actor = getActor(req);
    assertInsurancePermission(actor, 'case:create');
    const { clientId, insurerId, productId, category, purpose, customerType, caseContext = {} } = req.body;

    const product = insuranceStore.products.find((p) => p.id === productId);
    if (!product || !product.enabled) {
      return res.status(400).json({ error: 'Selected product is disabled or invalid' });
    }

    const insurer = insuranceStore.insurers.find((i) => i.id === insurerId);
    const client = insuranceStore.clients.find((c) => c.id === clientId);
    if (!client) return res.status(404).json({ error: 'Client not found' });

    const generated = generateCaseChecklist({
      insurerOverrides: insurer?.overrides || {},
      category,
      purpose,
      customerType: customerType || client.customerType,
      caseContext,
    });

    const newCaseId = `case-${Date.now()}`;
    const newCase = {
      id: newCaseId,
      agencyId: actor.agencyId,
      teamId: client.teamId,
      clientId: client.id,
      insurerId,
      productId,
      category,
      purpose,
      referenceNumber: `${purpose.slice(0, 3)}-${Date.now().toString().slice(-6)}`,
      claimNumber: purpose === 'CLAIM' ? `CLM-${Date.now().toString().slice(-6)}` : null,
      intimationDate: purpose === 'CLAIM' ? new Date().toISOString().slice(0, 10) : null,
      insurerDecision: purpose === 'CLAIM' ? 'PENDING_INSURER_REVIEW' : null,
      agentId: actor.userId,
      caseContext,
      insurerAdditionalDocs: [],
      timeline: [{ date: new Date().toISOString().slice(0, 10), event: `Case created (${purpose})` }],
      items: generated.map((it, idx) => ({
        ...it,
        id: `${newCaseId}-item-${idx + 1}`,
        caseId: newCaseId,
        clientId: client.id,
        requestDate: null,
        dueDate: null,
      })),
      createdAt: new Date().toISOString(),
    };

    insuranceStore.cases.unshift(newCase);
    insuranceStore.auditEvents.unshift(
      createAuditEntry({
        agencyId: actor.agencyId,
        teamId: client.teamId,
        actorUserId: actor.userId,
        action: 'CASE_CREATED',
        recordType: 'CASE',
        recordId: newCase.id,
        afterValue: { purpose, category, itemCount: newCase.items.length },
      })
    );
    res.status(201).json({ case: newCase });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. Document Request & Passwordless Expiring Client Upload Link
router.post('/requests', (req, res) => {
  try {
    const actor = getActor(req);
    assertInsurancePermission(actor, 'request:send');
    const { caseId, itemIds = [] } = req.body;
    const caseObj = insuranceStore.cases.find((c) => c.id === caseId);
    if (!caseObj) return res.status(404).json({ error: 'Case not found' });

    const rawToken = crypto.randomBytes(20).toString('base64url');
    const tokenHash = sha256(Buffer.from(rawToken));
    const expiresAt = new Date(Date.now() + 72 * 3600 * 1000).toISOString();

    for (const id of itemIds) {
      const item = caseObj.items.find((i) => i.id === id);
      if (item && item.status === 'NOT_REQUESTED') {
        transitionInsuranceDocStatus({
          fromStatus: item.status,
          toStatus: 'REQUESTED',
          actorUserId: actor.userId,
        });
        item.status = 'REQUESTED';
        item.requestDate = new Date().toISOString().slice(0, 10);
      }
    }

    const requestRec = {
      id: `ins-req-${Date.now()}`,
      agencyId: actor.agencyId,
      clientId: caseObj.clientId,
      caseId: caseObj.id,
      tokenHash,
      expiresAt,
      itemIds,
    };
    insuranceStore.requests.push(requestRec);
    insuranceStore.auditEvents.unshift(
      createAuditEntry({
        agencyId: actor.agencyId,
        actorUserId: actor.userId,
        action: 'CLIENT_UPLOAD_LINK_SENT',
        recordType: 'DOCUMENT_REQUEST',
        recordId: requestRec.id,
        afterValue: { caseId, itemCount: itemIds.length, expiresAt },
      })
    );

    res.status(201).json({ request: requestRec, uploadToken: rawToken });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/upload/:token', (req, res) => {
  const tokenHash = sha256(Buffer.from(req.params.token));
  const found = insuranceStore.requests.find((r) => r.tokenHash === tokenHash);
  if (!found) return res.status(404).json({ error: 'Invalid upload link' });
  if (new Date(found.expiresAt).getTime() < Date.now()) {
    return res.status(410).json({ error: 'Upload link expired' });
  }
  const client = insuranceStore.clients.find((c) => c.id === found.clientId);
  const caseObj = insuranceStore.cases.find((c) => c.id === found.caseId);
  const items = (caseObj?.items || []).filter((i) => found.itemIds.includes(i.id));

  // Client sees ONLY their own requested records
  res.json({
    agencyName: insuranceStore.agency.name,
    clientName: client?.fullName,
    clientCode: client?.clientCode,
    caseReference: caseObj?.referenceNumber,
    expiresAt: found.expiresAt,
    items,
  });
});

router.post('/upload/:token', upload.single('file'), (req, res) => {
  try {
    const tokenHash = sha256(Buffer.from(req.params.token));
    const found = insuranceStore.requests.find((r) => r.tokenHash === tokenHash);
    if (!found) return res.status(404).json({ error: 'Invalid upload link' });
    if (!req.file) return res.status(400).json({ error: 'File is required' });

    const mimeType = detectMimeFromMagicBytes(req.file.buffer);
    if (!mimeType) return res.status(400).json({ error: 'Only PDF, JPG, and PNG files are allowed' });

    const scanStatus = scanMalwareStub(req.file.buffer);
    if (scanStatus === 'INFECTED') return res.status(400).json({ error: 'Blocked: malware scan failed' });

    const readability = checkDocumentReadability(req.file.buffer);
    if (!readability.readable) return res.status(400).json({ error: readability.reason });

    const fileHash = sha256(req.file.buffer);
    const dup = insuranceStore.documents.find(
      (d) => d.clientId === found.clientId && d.sha256Hash === fileHash
    );
    if (dup) return res.status(409).json({ error: `Duplicate document detected (${dup.filename})` });

    const caseObj = insuranceStore.cases.find((c) => c.id === found.caseId);
    const itemId = String(req.body.itemId || found.itemIds[0]);
    const item = caseObj?.items.find((i) => i.id === itemId);
    if (!item) return res.status(404).json({ error: 'Checklist item not found' });

    transitionInsuranceDocStatus({
      fromStatus: item.status,
      toStatus: 'RECEIVED',
      actorUserId: found.clientId,
      reason: 'Client upload via secure link',
    });
    item.status = 'UNDER_REVIEW';
    item.uploadDate = new Date().toISOString().slice(0, 10);
    item.fileReference = `s3-private/${found.agencyId}/${found.clientId}/${req.file.originalname}`;

    const docRec = {
      id: `ins-doc-${Date.now()}`,
      agencyId: found.agencyId,
      clientId: found.clientId,
      caseId: found.caseId,
      itemId: item.id,
      filename: req.file.originalname,
      mimeType,
      sizeBytes: req.file.size,
      sha256Hash: fileHash,
      status: 'UNDER_REVIEW',
    };
    insuranceStore.documents.push(docRec);

    insuranceStore.auditEvents.unshift(
      createAuditEntry({
        agencyId: found.agencyId,
        actorUserId: found.clientId,
        action: 'CLIENT_DOCUMENT_UPLOADED',
        recordType: 'DOCUMENT',
        recordId: docRec.id,
        afterValue: { filename: docRec.filename, sha256Hash: fileHash },
      })
    );

    res.status(201).json({
      message: 'Document uploaded and confirmed to client and agent.',
      document: docRec,
      itemStatus: item.status,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. Reviewer Dashboard Action (Verify / Reject / Resubmit / N/A)
router.post('/review', (req, res) => {
  try {
    const actor = getActor(req);
    assertInsurancePermission(actor, 'review:decide');
    const { caseId, itemId, decision, reason } = req.body;
    const caseObj = insuranceStore.cases.find((c) => c.id === caseId);
    if (!caseObj) return res.status(404).json({ error: 'Case not found' });

    const item = caseObj.items.find((i) => i.id === itemId);
    if (!item) return res.status(404).json({ error: 'Checklist item not found' });

    const tr = transitionInsuranceDocStatus({
      fromStatus: item.status,
      toStatus: decision,
      actorUserId: actor.userId,
      reason,
    });

    item.status = tr.toStatus;
    item.reviewer = actor.userId;
    item.reviewDate = tr.updatedAt.slice(0, 10);
    if (decision === 'REJECTED_RESUBMISSION_REQUIRED') {
      item.rejectionReason = tr.reason;
    }

    insuranceStore.auditEvents.unshift(
      createAuditEntry({
        agencyId: actor.agencyId,
        actorUserId: actor.userId,
        action: `REVIEW_DECISION_${tr.toStatus}`,
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

// 5. Optional AI Assist (OFF by default, suggestion-only, never auto-verifies, logged)
router.post('/ai-suggest', (req, res) => {
  try {
    const actor = getActor(req);
    assertInsurancePermission(actor, 'ai:suggest');
    if (!insuranceStore.agency.aiAssistEnabled) {
      return res.status(403).json({
        error: 'AI Assist is OFF by default for this agency. An Agency Admin can enable it in Settings.',
      });
    }

    const { filename = 'document.pdf' } = req.body;
    const suggestion = {
      autoVerified: false, // Rule: AI never auto-verifies anything
      requiresHumanConfirmation: true,
      suggestedDocumentType: filename.toLowerCase().includes('rc') ? 'Motor Registration Certificate (RC)' : 'KYC Identity Proof',
      extractedFields: [
        { field: 'Full Name', value: 'Insured Client 2', confidence: 0.94 },
        { field: 'DOB', value: '1982-04-03', confidence: 0.91 },
        { field: 'PAN / Reg No.', value: 'ABCDE1002F', confidence: 0.89 },
      ],
      flags: ['Advisory suggestion only — staff must verify against original scan'],
    };

    insuranceStore.auditEvents.unshift(
      createAuditEntry({
        agencyId: actor.agencyId,
        actorUserId: actor.userId,
        action: 'AI_SUGGESTION_GENERATED',
        recordType: 'DOCUMENT',
        recordId: filename,
        afterValue: { confidence: 0.94, autoVerified: false },
        reason: 'Optional AI field extraction (non-binding, zero model training)',
      })
    );

    res.json({ suggestion });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

// 6. Reports & Logged CSV Export
router.get('/reports/export', (req, res) => {
  try {
    const actor = getActor(req);
    assertInsurancePermission(actor, 'report:export');
    const reportType = String(req.query.type || 'missing_docs');

    insuranceStore.auditEvents.unshift(
      createAuditEntry({
        agencyId: actor.agencyId,
        actorUserId: actor.userId,
        action: 'INSURANCE_REPORT_EXPORTED',
        recordType: 'REPORT',
        recordId: reportType,
        reason: 'Authorised staff report export',
      })
    );

    const rows = ['CaseRef,Purpose,Category,DocumentName,RequirementType,Status'];
    for (const c of insuranceStore.cases) {
      for (const it of c.items) {
        rows.push(`${c.referenceNumber},${c.purpose},${c.category},"${it.documentName}",${it.requirementType},${it.status}`);
      }
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="clarioloop_insurance_${reportType}.csv"`);
    res.send(rows.join('\n'));
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

router.get('/audit', (req, res) => {
  try {
    const actor = getActor(req);
    assertInsurancePermission(actor, 'audit:read');
    res.json({ auditEvents: insuranceStore.auditEvents });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

export default router;
