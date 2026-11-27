import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  CheckCircle2,
  UploadCloud,
  Download,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  User,
  LayoutDashboard,
  CheckSquare,
  FileSearch,
  Award,
  Briefcase,
  DoorOpen,
  BookOpen,
  BarChart3,
  Settings,
  ShieldAlert,
  XCircle,
  Ban,
  Printer,
  Lock,
} from 'lucide-react';
import { mockEducationalInstitutions } from '../data/verticalData';
import AIAssistantModal from './AIAssistantModal';
import PortalSidebar from './PortalSidebar';

const SECTIONS_META = [
  { code: 'A', name: 'A. Admission Application & Identity', count: 7 },
  { code: 'B', name: 'B. Previous Academic Qualification', count: 10 },
  { code: 'C', name: 'C. Reservation, Category & Fee Concession', count: 7 },
  { code: 'D', name: 'D. Scholarship & Government Benefit', count: 7 },
  { code: 'E', name: 'E. Fees, Enrolment & Institutional Forms', count: 8 },
  { code: 'F', name: 'F. Health, Safety & Support Information', count: 5 },
  { code: 'G', name: 'G. Continuing Students (Sem / Annual Update)', count: 7 },
  { code: 'H', name: 'H. Internship, Placement & Career Services', count: 6 },
  { code: 'I', name: 'I. Completion, Transfer or Exit', count: 5 },
  { code: 'J', name: 'J. Staff Verification & Closure (Staff Check)', count: 9 },
];

const INITIAL_STUDENTS = Array.from({ length: 30 }, (_, idx) => {
  const n = idx + 1;
  const isSchool = n > 20;
  const stages = ['APPLICANT', 'ADMITTED', 'CONTINUING', 'PLACEMENT', 'EXITING', 'ALUMNI'];
  const routes = ['REGULAR', 'LATERAL_ENTRY', 'POSTGRADUATE', 'COUNSELLING', 'MANAGEMENT_QUOTA'];
  const stage = stages[idx % stages.length];
  const route = isSchool ? 'REGULAR' : routes[idx % routes.length];
  return {
    id: `stu-${n}`,
    usn: `${isSchool ? 'SCH' : 'USN'}-2026-${100 + n}`,
    name: `Student Demo ${n}`,
    institution: isSchool ? 'Sahyadri Public School' : 'RV Institute of Engineering',
    programme: isSchool ? 'PU Science / High School' : 'B.E. Computer Science',
    department: isSchool ? 'High School' : idx % 2 === 0 ? 'CSE' : 'ECE',
    stage,
    route,
    isMinor: isSchool || n % 6 === 0,
    optsHostel: !isSchool && n % 3 === 0,
    isScholarship: n % 2 === 0,
    placementConsentInfosys: n % 2 === 0,
    noDues: {
      library: stage === 'ALUMNI' ? 'CLEARED' : 'PENDING',
      laboratory: stage === 'ALUMNI' ? 'CLEARED' : 'PENDING',
      hostel: !isSchool && n % 3 === 0 ? 'PENDING' : 'NOT_APPLICABLE',
      transport: n % 4 === 0 ? 'PENDING' : 'NOT_APPLICABLE',
      accounts: stage === 'ALUMNI' ? 'CLEARED' : 'PENDING',
    },
    checklistClosed: stage === 'ALUMNI',
    items: [
      { id: `${n}-1`, title: 'Completed Admission Form', tag: 'CORE', status: 'VERIFIED', sensitive: false },
      { id: `${n}-2`, title: 'Class 10 Marks Card', tag: 'CORE', status: 'UNDER_REVIEW', sensitive: false },
      ...(route === 'LATERAL_ENTRY'
        ? [{ id: `${n}-lat`, title: 'Diploma Marks Cards (Lateral Entry)', tag: 'CONDITIONAL', status: 'REQUESTED', sensitive: false }]
        : []),
      ...(n % 2 === 0
        ? [{ id: `${n}-sch`, title: 'Scholarship Bank & DBT Aadhaar-Seeding (Sensitive)', tag: 'CONDITIONAL', status: 'UNDER_REVIEW', sensitive: true }]
        : []),
      ...(!isSchool && n % 3 === 0
        ? [{ id: `${n}-hos`, title: 'Hostel Admission & Local Guardian Form', tag: 'CONDITIONAL', status: 'REQUESTED', sensitive: false }]
        : []),
      { id: `${n}-j1`, title: 'Staff Check: Identity & Academic Route Verified', tag: 'STAFF_CHECK', status: stage === 'ALUMNI' ? 'VERIFIED' : 'NOT_REQUESTED', sensitive: false },
    ],
  };
});

export default function EducationPortal({
  onBack,
  onOpenSubscribe,
  initialRole = 'admin',
  currentUser,
  onOpenAuth,
  onOpenProfile,
}) {
  const activeInst = mockEducationalInstitutions[0];
  const [viewRole, setViewRole] = useState(initialRole); // 'admin' | 'student'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [staffRole, setStaffRole] = useState('INSTITUTION_ADMIN'); // INSTITUTION_ADMIN | VERIFIER | SCHOLARSHIP_OFFICER | PLACEMENT_OFFICER | SECTION_CLEARANCE_STAFF | AUDITOR
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [aiAssistEnabled, setAiAssistEnabled] = useState(false); // OFF by default
  const [isAIClassifierOpen, setIsAIClassifierOpen] = useState(false);
  const [reviewReason, setReviewReason] = useState('');
  const [statusMsg, setStatusMsg] = useState(null);
  const [ackStudent, setAckStudent] = useState(null);

  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'edu-aud-1',
      action: 'EDU_SEED_INITIALIZED',
      actor: 'SYSTEM',
      record: 'inst-eng / inst-sch',
      reason: 'Seeded 1 Engineering College, 1 School, 3 departments, 30 students across 6 lifecycle stages',
      time: new Date().toLocaleString('en-IN'),
    },
  ]);

  React.useEffect(() => {
    if (initialRole) setViewRole(initialRole);
  }, [initialRole]);

  const logAudit = (action, record, reason = '') => {
    setAuditLogs((prev) => [
      {
        id: `edu-aud-${Date.now()}`,
        action,
        actor: staffRole,
        record,
        reason: reason || 'Authorised institution action',
        time: new Date().toLocaleString('en-IN'),
      },
      ...prev,
    ]);
  };

  const allowSensitive = ['INSTITUTION_ADMIN', 'VERIFIER', 'SCHOLARSHIP_OFFICER'].includes(staffRole);

  const reviewQueue = students.flatMap((s) =>
    s.items
      .filter((it) => it.status === 'UNDER_REVIEW')
      .map((it) => ({ ...it, studentId: s.id, studentName: s.name, usn: s.usn, programme: s.programme }))
  );

  const handleReviewDecision = (studentId, itemId, decision) => {
    if (['REJECTED_RESUBMISSION_REQUIRED', 'NOT_APPLICABLE'].includes(decision) && !reviewReason.trim()) {
      setStatusMsg('Mandatory reason required for Reject / Not Applicable.');
      return;
    }
    setStudents((prev) =>
      prev.map((s) =>
        s.id !== studentId
          ? s
          : {
              ...s,
              items: s.items.map((it) =>
                it.id !== itemId ? it : { ...it, status: decision, reason: reviewReason.trim() || null }
              ),
            }
      )
    );
    logAudit(`EDU_REVIEW_${decision}`, `${studentId}/${itemId}`, reviewReason.trim() || 'Verified by staff');
    setReviewReason('');
    setStatusMsg(`Recorded ${decision.replace(/_/g, ' ')} and logged in Audit Log.`);
  };

  const handleToggleRuleDemo = (studentId, field) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const nextVal = !s[field];
        const nextRoute = field === 'isLateral' ? (nextVal ? 'LATERAL_ENTRY' : 'REGULAR') : s.route;
        const updatedItems = [...s.items];
        if (field === 'optsHostel') {
          if (nextVal && !updatedItems.some((i) => i.title.includes('Hostel'))) {
            updatedItems.push({ id: `${s.id}-hos-dyn`, title: 'Hostel Admission & Local Guardian Form', tag: 'CONDITIONAL', status: 'REQUESTED', sensitive: false });
          } else if (!nextVal) {
            return { ...s, optsHostel: false, items: updatedItems.filter((i) => !i.title.includes('Hostel')) };
          }
        }
        return { ...s, [field]: nextVal, route: nextRoute, items: updatedItems };
      })
    );
    logAudit('CONDITIONAL_RULE_UPDATED', studentId, `Toggled ${field}`);
    setStatusMsg(`Updated ${field} for ${studentId}; conditional checklist items updated.`);
  };

  const handleStudentUpload = (studentId, itemId, file) => {
    if (!file) return;
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
      setStatusMsg('Upload rejected: only PDF, JPG, and PNG files are allowed.');
      return;
    }
    if (file.size < 200) {
      setStatusMsg('Readability check failed: file appears blank or unreadable.');
      return;
    }
    setStudents((prev) =>
      prev.map((s) =>
        s.id !== studentId
          ? s
          : {
              ...s,
              items: s.items.map((it) => (it.id === itemId ? { ...it, status: 'UNDER_REVIEW', reason: null } : it)),
            }
      )
    );
    logAudit('STUDENT_PORTAL_UPLOAD', `${studentId}/${itemId}`, `Uploaded ${file.name}`);
    setStatusMsg(`Uploaded "${file.name}" securely. Awaiting verifier review.`);
  };

  const handleExportCsv = (reportName) => {
    const lines = ['USN,StudentName,Institution,Programme,Stage,Route,Document,Tag,Status'];
    for (const s of students) {
      for (const it of s.items) {
        lines.push(`${s.usn},"${s.name}","${s.institution}","${s.programme}",${s.stage},${s.route},"${it.title}",${it.tag},${it.status}`);
      }
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ClarioLoop_Edu_${reportName}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    logAudit('EDU_REPORT_EXPORTED', reportName, 'Logged CSV report export');
    setStatusMsg(`Exported ${reportName} CSV and logged export in Audit Log.`);
  };

  const portalStudent = students[0];
  const portalDone = portalStudent.items.filter((i) => ['VERIFIED', 'UNDER_REVIEW', 'CLOSED'].includes(i.status)).length;
  const portalPct = Math.round((portalDone / Math.max(portalStudent.items.length, 1)) * 100);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <main className="w-full">
        {statusMsg && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center justify-between">
            <span>{statusMsg}</span>
            <button onClick={() => setStatusMsg(null)} className="font-bold text-emerald-700 ml-3">Dismiss</button>
          </div>
        )}

        {viewRole === 'student' ? (
          /* ================= STUDENT / PARENT SECURE LINK VIEW ================= */
          <div className="max-w-xl mx-auto px-4 pt-6 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                    Secure Student / Parent Link
                  </span>
                  <h2 className="text-base font-black text-slate-900 mt-1">
                    {portalStudent.name} ({portalStudent.usn})
                  </h2>
                  <p className="text-xs text-slate-500">
                    {portalStudent.institution} • {portalStudent.programme}
                  </p>
                </div>
                <span className="text-xs font-extrabold text-blue-700">{portalPct}%</span>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all" style={{ width: `${portalPct}%` }} />
              </div>

              {/* Privacy & Purpose Notice */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                <strong>Data Notice:</strong> Collected solely for academic verification. Accessible only to authorised staff. Retained per institution policy (10 years). Scans only — originals are never kept by the system.
              </div>
            </div>

            {portalStudent.items
              .filter((i) => i.tag !== 'STAFF_CHECK')
              .map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2.5 shadow-2xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</h3>
                      <span className="text-[10px] font-bold text-slate-400">{item.tag}</span>
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {item.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {['REQUESTED', 'NOT_REQUESTED', 'REJECTED_RESUBMISSION_REQUIRED'].includes(item.status) && (
                    <label className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/40 hover:bg-blue-50 text-blue-800 text-xs font-bold cursor-pointer">
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload PDF / JPG / PNG</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => handleStudentUpload(portalStudent.id, item.id, e.target.files?.[0])}
                      />
                    </label>
                  )}
                </div>
              ))}
          </div>
        ) : (
          /* ================= STAFF WORKSPACE WITH LEFT SIDEBAR ================= */
          <div className="flex flex-col md:flex-row bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <PortalSidebar
              title="RV Institute & Campus"
              subtitle="Admissions & Compliance"
              initials="ED"
              accent="blue"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              currentUser={currentUser}
              onBack={onBack}
              items={[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'students', label: 'Students', icon: Users },
                { id: 'checklists', label: 'Checklists', icon: CheckSquare },
                { id: 'review', label: 'Review Queue', icon: FileSearch },
                { id: 'scholarships', label: 'Scholarships', icon: Award },
                { id: 'placements', label: 'Placements', icon: Briefcase },
                { id: 'exit', label: 'Exit / No-Dues', icon: DoorOpen },
                { id: 'templates', label: 'Templates', icon: BookOpen },
                { id: 'reports', label: 'Reports', icon: BarChart3 },
                { id: 'settings', label: 'Settings', icon: Settings },
                { id: 'audit', label: 'Audit Log', icon: ShieldAlert }
              ]}
            />
            <div className="flex-1 min-w-0 p-4 sm:p-6 bg-slate-50/50 space-y-5">

            {/* DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Campus Document Workflow Dashboard</h2>
                    <p className="text-xs text-slate-500">
                      Role: <strong>{staffRole}</strong> • Sensitive Docs Visible: {allowSensitive ? 'Yes' : 'Hidden'}
                    </p>
                  </div>
                  <select
                    value={staffRole}
                    onChange={(e) => setStaffRole(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                  >
                    <option value="INSTITUTION_ADMIN">Institution Admin</option>
                    <option value="VERIFIER">Verifier</option>
                    <option value="SCHOLARSHIP_OFFICER">Scholarship Officer</option>
                    <option value="PLACEMENT_OFFICER">Placement Officer (Sensitive Hidden)</option>
                    <option value="AUDITOR">Auditor (Read-Only)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-white rounded-2xl border border-slate-200 p-4">
                    <div className="text-xs text-slate-500 font-bold">Total Students</div>
                    <div className="text-2xl font-black mt-1">{students.length}</div>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 p-4">
                    <div className="text-xs text-slate-500 font-bold">Awaiting Review</div>
                    <div className="text-2xl font-black text-blue-700 mt-1">{reviewQueue.length}</div>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 p-4">
                    <div className="text-xs text-slate-500 font-bold">Checklist Sections</div>
                    <div className="text-2xl font-black mt-1">10 (A–J)</div>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 p-4">
                    <div className="text-xs text-slate-500 font-bold">Closed Alumni</div>
                    <div className="text-2xl font-black mt-1">{students.filter((s) => s.checklistClosed).length}</div>
                  </div>
                </div>
              </div>
            )}

            {/* STUDENTS & CONDITIONAL RULES DEMO */}
            {activeTab === 'students' && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 font-extrabold text-sm">
                  30 Seeded Students (Engineering College + School • 6 Lifecycle Stages)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                      <tr>
                        <th className="py-3 px-4">USN / App #</th>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Institution</th>
                        <th className="py-3 px-4">Stage / Route</th>
                        <th className="py-3 px-4">Conditional Toggles</th>
                        <th className="py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students.slice(0, 12).map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-mono font-bold">{s.usn}</td>
                          <td className="py-3 px-4 font-semibold">{s.name}</td>
                          <td className="py-3 px-4">{s.institution}</td>
                          <td className="py-3 px-4">
                            {s.stage} • {s.route}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleRuleDemo(s.id, 'optsHostel')}
                              className={`px-2 py-1 rounded text-[10px] font-bold border ${
                                s.optsHostel ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                              }`}
                            >
                              Hostel: {s.optsHostel ? 'ON' : 'OFF'}
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => setAckStudent(s)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold inline-flex items-center gap-1"
                            >
                              <Printer className="w-3 h-3" /> Ack
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CHECKLISTS */}
            {activeTab === 'checklists' && (
              <div className="space-y-3">
                {students.slice(0, 5).map((s) => (
                  <div key={s.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-extrabold">
                        {s.usn} — {s.name} ({s.stage})
                      </div>
                      <span className="text-xs font-bold text-blue-700">{s.items.length} items</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {s.items.map((it) => (
                        <div key={it.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                          <span className="truncate">
                            {it.sensitive && !allowSensitive ? '🔒 [Sensitive Record Hidden]' : it.title}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 shrink-0">
                            {it.tag} • {it.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* REVIEW QUEUE */}
            {activeTab === 'review' && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 text-xs space-y-2">
                  <label className="font-bold block">Verification / Rejection / N/A Reason (Mandatory for Reject & N/A)</label>
                  <input
                    value={reviewReason}
                    onChange={(e) => setReviewReason(e.target.value)}
                    placeholder="Enter plain-language reason..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
                {reviewQueue.slice(0, 10).map((it) => (
                  <div key={it.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-extrabold">
                        {it.sensitive && !allowSensitive ? '🔒 [Restricted Sensitive Scholarship/Bank Record]' : it.title}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {it.usn} • {it.studentName} • {it.programme}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs flex-wrap">
                      <button
                        onClick={() => handleReviewDecision(it.studentId, it.id, 'VERIFIED')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verify
                      </button>
                      <button
                        onClick={() => handleReviewDecision(it.studentId, it.id, 'REJECTED_RESUBMISSION_REQUIRED')}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                      <button
                        onClick={() => handleReviewDecision(it.studentId, it.id, 'NOT_APPLICABLE')}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center gap-1"
                      >
                        <Ban className="w-3.5 h-3.5" /> N/A
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SCHOLARSHIPS */}
            {activeTab === 'scholarships' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-xs">
                <h2 className="text-sm font-extrabold">Scholarship & DBT Document Tracker</h2>
                <p className="text-slate-500">
                  Bank passbook & Aadhaar-seeding/DBT items appear ONLY for scholarship applicants where the scheme requires them. Platform does not decide eligibility.
                </p>
                {students
                  .filter((s) => s.isScholarship)
                  .slice(0, 6)
                  .map((s) => (
                    <div key={s.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span>
                        <strong>{s.usn}</strong> — {s.name}
                      </span>
                      <span className="font-bold text-blue-700">
                        {allowSensitive ? 'DBT / Caste / Income Accessible' : '🔒 Restricted to Scholarship/Verifier Role'}
                      </span>
                    </div>
                  ))}
              </div>
            )}

            {/* PLACEMENTS */}
            {activeTab === 'placements' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-xs">
                <h2 className="text-sm font-extrabold">Placement & Career Services (Per-Recipient Consent Enforced)</h2>
                <p className="text-slate-500">
                  Student CV and profile are never shared with any named recruiter unless explicit consent is recorded for that recipient.
                </p>
                {students.slice(0, 6).map((s) => (
                  <div key={s.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span>
                      <strong>{s.usn}</strong> — {s.name}
                    </span>
                    <button
                      onClick={() => {
                        if (!s.placementConsentInfosys) {
                          setStatusMsg(`Blocked: ${s.name} has NOT granted consent for Infosys Campus Recruitment.`);
                          return;
                        }
                        logAudit('PLACEMENT_SHARED', s.usn, 'Shared with Infosys (consent verified)');
                        setStatusMsg(`Profile shared with Infosys Campus Recruitment for ${s.name}.`);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold ${
                        s.placementConsentInfosys ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {s.placementConsentInfosys ? 'Share w/ Infosys (Consented)' : 'Blocked (No Consent)'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* EXIT / NO-DUES */}
            {activeTab === 'exit' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-xs">
                <h2 className="text-sm font-extrabold">Exit & Section-by-Section No-Dues Clearance</h2>
                <p className="text-slate-500">
                  Library, Laboratory, Hostel, Transport, and Accounts each mark their own clearance. Retention/deletion dates are set at exit.
                </p>
                {students
                  .filter((s) => ['EXITING', 'ALUMNI'].includes(s.stage))
                  .slice(0, 6)
                  .map((s) => (
                    <div key={s.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="font-extrabold">
                        {s.usn} — {s.name} ({s.stage})
                      </div>
                      <div className="flex flex-wrap gap-2 text-[11px]">
                        {Object.entries(s.noDues).map(([sec, val]) => (
                          <span key={sec} className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold">
                            {sec.toUpperCase()}: {val}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* TEMPLATES */}
            {activeTab === 'templates' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {SECTIONS_META.map((sec) => (
                  <div key={sec.code} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1">
                    <div className="text-xs font-extrabold text-slate-900">{sec.name}</div>
                    <div className="text-[11px] text-slate-500">Configurable checklist items</div>
                  </div>
                ))}
              </div>
            )}

            {/* REPORTS */}
            {activeTab === 'reports' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  'Pending Documents by Department & Programme',
                  'Missing Items & Due Dates',
                  'Checklist Completion Rate & Turnaround Time',
                  'Scholarship Document Status & Expiring Certificates',
                  'No-Dues Status & Audit Evidence Index',
                ].map((r) => (
                  <div key={r} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900">{r}</span>
                    <button
                      onClick={() => handleExportCsv(r.replace(/\s+/g, '_').toLowerCase())}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-1 shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" /> CSV (Logged)
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-950">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Important Notice:</strong> This is a configurable operational checklist, not a universal list of legally mandatory documents. Validate requirements against the current admission notification, affiliating university or board rules, scholarship scheme conditions, regulator directions and your institution&apos;s approved policies.
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between text-xs">
                  <div>
                    <h3 className="text-sm font-extrabold">Optional AI Assistance (Suggestion-Only)</h3>
                    <p className="text-slate-500 mt-0.5">
                      Off by default. Staff confirm every value; AI never verifies, accepts, rejects, or ranks anything, and never trains on student documents.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setAiAssistEnabled(!aiAssistEnabled);
                      logAudit('EDU_AI_ASSIST_TOGGLED', activeInst.id, `Set ${!aiAssistEnabled}`);
                    }}
                    className={`px-4 py-2 rounded-xl font-bold shrink-0 ${
                      aiAssistEnabled ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {aiAssistEnabled ? 'Enabled (Advisory)' : 'OFF (Default)'}
                  </button>
                </div>
              </div>
            )}

            {/* AUDIT LOG */}
            {activeTab === 'audit' && (
              <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
                <div className="p-4 font-extrabold text-sm bg-slate-50 rounded-t-2xl">
                  Permanent Edu Audit Log ({auditLogs.length} events)
                </div>
                {auditLogs.map((a) => (
                  <div key={a.id} className="p-3.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <span className="font-mono font-bold text-blue-700">{a.action}</span> •{' '}
                      <span className="font-semibold">{a.record}</span>
                      <div className="text-[11px] text-slate-500">
                        Actor: {a.actor} • Reason: {a.reason}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{a.time}</span>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        )}
      </main>

      {/* PRINTABLE ACKNOWLEDGEMENT MODAL */}
      {ackStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 text-xs shadow-2xl">
            <h3 className="text-base font-black text-slate-900">Student / Parent Document Acknowledgement</h3>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div><strong>Student:</strong> {ackStudent.name} ({ackStudent.usn})</div>
              <div><strong>Institution:</strong> {ackStudent.institution} — {ackStudent.programme}</div>
              <div><strong>Declaration:</strong> I/we confirm that uploaded scans match original documents presented and are accurate. Originals were inspected and returned.</div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 text-[11px] text-slate-500">
              <div className="border-t border-slate-300 pt-1">Student / Parent Signature & Date</div>
              <div className="border-t border-slate-300 pt-1">Received & Verified By (Staff Sign)</div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => window.print()} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold">
                Print Form
              </button>
              <button onClick={() => setAckStudent(null)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <AIAssistantModal isOpen={isAIClassifierOpen} onClose={() => setIsAIClassifierOpen(false)} />
    </div>
  );
}
