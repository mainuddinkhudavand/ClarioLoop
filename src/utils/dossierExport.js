/**
 * Generates and downloads a clean, self-contained HTML Compliance Dossier Pack
 * with index table, timestamps, verification status, and audit summary.
 */
export function exportFullDossier({
  title = 'Compliance Document Dossier',
  entityName = 'Client Entity',
  firmName = 'ClarioLoop Workspace',
  items = []
}) {
  const generatedAt = new Date().toLocaleString('en-IN');
  const rowsHtml = items
    .map(
      (item, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td><strong>${escapeHtml(item.title || item.name || 'Document')}</strong></td>
        <td>${escapeHtml(item.category || 'General')}</td>
        <td>${escapeHtml(item.fileName || 'Pending Upload')}</td>
        <td><span class="badge ${item.status === 'VERIFIED' || item.status === 'COLLECTED' ? 'ok' : item.status === 'REJECTED' ? 'err' : 'warn'}">${escapeHtml(item.status || 'PENDING')}</span></td>
        <td>${escapeHtml(item.uploadedAt || '—')}</td>
      </tr>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${escapeHtml(title)} - ${escapeHtml(entityName)}</title>
<style>
  body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 32px; background: #f8fafc; }
  .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; max-width: 960px; margin: 0 auto; }
  h1 { margin: 0 0 6px; font-size: 22px; }
  .meta { color: #475569; font-size: 13px; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
  th { background: #f1f5f9; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: #475569; }
  .badge { padding: 3px 8px; border-radius: 999px; font-size: 11px; font-weight: 700; }
  .ok { background: #dcfce7; color: #166534; }
  .warn { background: #fef3c7; color: #92400e; }
  .err { background: #fee2e2; color: #991b1b; }
</style>
</head>
<body>
  <div class="card">
    <h1>${escapeHtml(title)}</h1>
    <div class="meta">
      <strong>Entity:</strong> ${escapeHtml(entityName)} &nbsp;|&nbsp;
      <strong>Workspace:</strong> ${escapeHtml(firmName)} &nbsp;|&nbsp;
      <strong>Generated:</strong> ${escapeHtml(generatedAt)}
    </div>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Requirement</th>
          <th>Category</th>
          <th>File</th>
          <th>Status</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
    </table>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${entityName.replace(/[^a-zA-Z0-9]/g, '_')}_Dossier.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
