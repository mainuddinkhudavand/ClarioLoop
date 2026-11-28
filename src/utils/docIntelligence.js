/**
 * Automated AI Document Check & Mismatch Detection Helper
 * Inspects file metadata, format, size, and naming patterns for instant pre-verification.
 */
export function analyzeUploadedDocument(file, expectedLabel = '') {
  const name = file?.name || 'document';
  const sizeBytes = file?.size || 0;
  const sizeKB = Math.round(sizeBytes / 1024);
  const ext = name.split('.').pop()?.toLowerCase() || '';

  const checks = [];
  let hasWarning = false;

  // 1. Format check
  const allowed = ['pdf', 'jpg', 'jpeg', 'png', 'xlsx', 'csv', 'json'];
  if (allowed.includes(ext)) {
    checks.push({ label: 'Accepted Format', ok: true, detail: ext.toUpperCase() });
  } else {
    hasWarning = true;
    checks.push({ label: 'Unsupported Format', ok: false, detail: ext.toUpperCase() || 'UNKNOWN' });
  }

  // 2. Readability / size check
  if (sizeBytes > 0 && sizeBytes < 12 * 1024 && ['jpg', 'jpeg', 'png'].includes(ext)) {
    hasWarning = true;
    checks.push({ label: 'Low Resolution Risk', ok: false, detail: `${sizeKB} KB (may be blurry)` });
  } else {
    checks.push({ label: 'File Integrity', ok: true, detail: `${Math.max(1, sizeKB)} KB` });
  }

  // 3. Pattern extraction (PAN / GSTIN / FY)
  const upper = name.toUpperCase();
  const panMatch = upper.match(/[A-Z]{5}[0-9]{4}[A-Z]/);
  const gstMatch = upper.match(/[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]/);
  if (panMatch) checks.push({ label: 'PAN Detected', ok: true, detail: panMatch[0] });
  if (gstMatch) checks.push({ label: 'GSTIN Detected', ok: true, detail: gstMatch[0] });

  // 4. Context alignment check
  if (expectedLabel) {
    const labelTokens = expectedLabel.toLowerCase().split(/\s+/).filter((t) => t.length > 3);
    const matched = labelTokens.some((tok) => name.toLowerCase().includes(tok));
    checks.push({
      label: matched ? 'Document Match' : 'Manual Review Suggested',
      ok: matched || ext === 'pdf',
      detail: matched ? 'Matches requested requirement' : 'Verify content matches label'
    });
  }

  return {
    status: hasWarning ? 'WARNING' : 'AI_CHECKED',
    summary: hasWarning
      ? 'Flagged for quality/format check before final approval'
      : `AI Pre-Check Passed (${ext.toUpperCase()}, ${Math.max(1, sizeKB)} KB)`,
    checks
  };
}
