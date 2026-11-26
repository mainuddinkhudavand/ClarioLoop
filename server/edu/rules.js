import { EDU_CHECKLIST_SECTIONS } from './templates.js';

export function evaluateEduConditionFlags(ctx) {
  return {
    IS_COUNSELLING_OR_ALLOTMENT: ['COUNSELLING', 'ALLOTMENT'].includes(ctx.admissionRoute),
    IS_MINOR: Boolean(ctx.isMinor),
    REQUIRES_12TH: ['UG_DEGREE', 'ENGINEERING'].includes(ctx.programmeLevel) && ctx.admissionRoute !== 'LATERAL_ENTRY',
    IS_LATERAL_ENTRY: ctx.admissionRoute === 'LATERAL_ENTRY',
    IS_POSTGRADUATE: ctx.programmeLevel === 'POSTGRADUATE' || ctx.admissionRoute === 'POSTGRADUATE',
    IS_ENTRANCE_ROUTE: ['COUNSELLING', 'ENTRANCE', 'LATERAL_ENTRY', 'POSTGRADUATE'].includes(ctx.admissionRoute),
    IS_INTER_BOARD_OR_UNIV: Boolean(ctx.isInterBoardOrUniversity),
    HAS_QUOTA_CLAIM: Boolean(ctx.claimsReservationOrQuota),
    HAS_STUDY_GAP: Boolean(ctx.hasStudyGap),
    CLAIMS_RESERVATION_OR_CONCESSION: Boolean(ctx.claimsReservationOrQuota),
    CLAIMS_DISABILITY_SUPPORT: Boolean(ctx.claimsDisabilitySupport),
    HAS_SPECIAL_QUOTA: Boolean(ctx.hasSpecialQuota),
    IS_SCHOLARSHIP_APPLICANT: Boolean(ctx.isScholarshipApplicant),
    IS_SCHOLARSHIP_AND_HOSTEL: Boolean(ctx.isScholarshipApplicant) && Boolean(ctx.optsHostel),
    OPTS_HOSTEL: Boolean(ctx.optsHostel),
    OPTS_TRANSPORT: Boolean(ctx.optsTransport),
  };
}

/**
 * Generates an Edu checklist for a student based on programme, route, category, and benefit opts.
 * Institution overrides always take precedence.
 */
export function generateEduChecklist({
  institutionOverrides = {},
  lifecycleStage = 'ADMITTED',
  studentContext = {},
}) {
  const flags = evaluateEduConditionFlags(studentContext);
  const sections = [
    EDU_CHECKLIST_SECTIONS.A,
    EDU_CHECKLIST_SECTIONS.B,
    EDU_CHECKLIST_SECTIONS.C,
    EDU_CHECKLIST_SECTIONS.D,
    EDU_CHECKLIST_SECTIONS.E,
    EDU_CHECKLIST_SECTIONS.F,
  ];

  if (lifecycleStage === 'CONTINUING') sections.push(EDU_CHECKLIST_SECTIONS.G);
  if (lifecycleStage === 'PLACEMENT') sections.push(EDU_CHECKLIST_SECTIONS.H);
  if (['EXITING', 'ALUMNI'].includes(lifecycleStage)) sections.push(EDU_CHECKLIST_SECTIONS.I);
  sections.push(EDU_CHECKLIST_SECTIONS.J);

  const items = [];
  for (const sec of sections) {
    for (const tplItem of sec.items) {
      if (tplItem.conditionKey && !flags[tplItem.conditionKey]) {
        continue;
      }
      const override = institutionOverrides[tplItem.code];
      const tag = override?.tag || tplItem.tag;
      if (tag === 'HIDDEN') continue;

      items.push({
        code: tplItem.code,
        sectionCode: sec.code,
        sectionName: sec.name,
        title: override?.title || tplItem.title,
        tag,
        sensitive: Boolean(tplItem.sensitive),
        scholarshipOnly: Boolean(tplItem.scholarshipOnly),
        status: 'NOT_REQUESTED',
        fileVersions: [],
      });
    }
  }
  return items;
}
