import { READY_MADE_CHECKLISTS } from './templates.js';

/**
 * Evaluates conditional rules against case context and merges insurer-specific overrides.
 * Insurer-specific requirements ALWAYS take precedence over built-in templates.
 */
export function evaluateConditionFlags(caseContext) {
  return {
    MINOR_NOMINEE: Boolean(caseContext.nomineeIsMinor),
    IS_SALARIED: caseContext.customerType === 'SALARIED',
    IS_BUSINESS_OR_SEP: ['BUSINESS_PROPRIETOR', 'SELF_EMPLOYED_PROF', 'COMPANY_PARTNERSHIP'].includes(
      caseContext.customerType
    ),
    IS_BUSINESS_OR_COMPANY: ['BUSINESS_PROPRIETOR', 'COMPANY_PARTNERSHIP', 'CORPORATE_GROUP'].includes(
      caseContext.customerType
    ),
    IS_NRI: caseContext.customerType === 'NRI',
    IS_INDIVIDUAL_NON_ITR: caseContext.customerType === 'INDIVIDUAL',
    IS_COMMERCIAL_VEHICLE: Boolean(caseContext.isCommercialVehicle),
    IS_FINANCED_VEHICLE: Boolean(caseContext.isFinancedVehicle),
    CLAIM_CASHLESS: caseContext.claimVariant === 'CASHLESS',
    CLAIM_REIMBURSEMENT: caseContext.claimVariant === 'REIMBURSEMENT',
    MEDICAL_REQUIRED: Boolean(caseContext.medicalRequired),
    IS_PORTABILITY: Boolean(caseContext.isPortability),
    IS_SENIOR: Boolean(caseContext.isSeniorCitizen),
    HIGH_VALUE_OR_NRI: Boolean(caseContext.isHighValue) || caseContext.customerType === 'NRI',
    ACCIDENTAL_DEATH: caseContext.deathCause === 'ACCIDENTAL',
    EARLY_OR_NATURAL_DEATH: caseContext.deathCause !== 'ACCIDENTAL',
    NO_NOMINEE: Boolean(caseContext.noNomineeOnFile),
    ACCIDENTAL_INJURY: Boolean(caseContext.isAccidentalInjury),
    MAJOR_OR_THEFT: Boolean(caseContext.isMajorOrTheft),
    IS_LAPSED_REVIVAL: Boolean(caseContext.isLapsedRevival),
    SRV_NOMINEE_CHANGE: caseContext.servicingType === 'NOMINEE_CHANGE',
    SRV_BANK_CHANGE: caseContext.servicingType === 'BANK_MANDATE_CHANGE',
    SRV_ADDRESS_CHANGE: caseContext.servicingType === 'ADDRESS_CHANGE',
    SRV_ASSIGNMENT: caseContext.servicingType === 'ASSIGNMENT',
    SRV_REVIVAL: caseContext.servicingType === 'REVIVAL',
    SRV_SURRENDER_OR_LOAN: ['SURRENDER', 'POLICY_LOAN'].includes(caseContext.servicingType),
  };
}

export function generateCaseChecklist({
  insurerOverrides = {},
  category,
  purpose,
  customerType,
  caseContext = {},
}) {
  const flags = evaluateConditionFlags({ ...caseContext, customerType });
  const selectedTemplates = [READY_MADE_CHECKLISTS.BASIC_CUSTOMER_INFO, READY_MADE_CHECKLISTS.KYC_IDENTITY];

  if (purpose === 'PROPOSAL') {
    if (customerType === 'CORPORATE_GROUP') {
      selectedTemplates.push(READY_MADE_CHECKLISTS.CORPORATE_GROUP);
    } else if (category === 'LIFE') {
      selectedTemplates.push(READY_MADE_CHECKLISTS.LIFE_PROPOSAL, READY_MADE_CHECKLISTS.NOMINEE_BENEFICIARY);
    } else if (category === 'HEALTH') {
      selectedTemplates.push(READY_MADE_CHECKLISTS.HEALTH_PROPOSAL, READY_MADE_CHECKLISTS.NOMINEE_BENEFICIARY);
    } else if (category === 'MOTOR') {
      selectedTemplates.push(READY_MADE_CHECKLISTS.MOTOR_PROPOSAL);
    } else if (category === 'GENERAL') {
      const subMap = {
        HOME: READY_MADE_CHECKLISTS.GENERAL_HOME,
        FIRE: READY_MADE_CHECKLISTS.GENERAL_FIRE_COMMERCIAL,
        SHOP: READY_MADE_CHECKLISTS.GENERAL_SHOP_PACKAGE,
        MARINE: READY_MADE_CHECKLISTS.GENERAL_MARINE,
        TRAVEL: READY_MADE_CHECKLISTS.GENERAL_TRAVEL,
        PA: READY_MADE_CHECKLISTS.GENERAL_PERSONAL_ACCIDENT,
        MACHINERY: READY_MADE_CHECKLISTS.GENERAL_MACHINERY,
        CV: READY_MADE_CHECKLISTS.GENERAL_COMMERCIAL_VEHICLE,
      };
      selectedTemplates.push(subMap[caseContext.generalSubType] || READY_MADE_CHECKLISTS.GENERAL_HOME);
    }
    selectedTemplates.push(READY_MADE_CHECKLISTS.INCOME_FINANCIAL_EVIDENCE);
  } else if (purpose === 'POLICY_SERVICING') {
    selectedTemplates.push(READY_MADE_CHECKLISTS.POLICY_SERVICING);
    if (caseContext.servicingType === 'NOMINEE_CHANGE') {
      selectedTemplates.push(READY_MADE_CHECKLISTS.NOMINEE_BENEFICIARY);
    }
  } else if (purpose === 'RENEWAL') {
    selectedTemplates.push(READY_MADE_CHECKLISTS.RENEWAL_PREMIUM);
    if (category === 'MOTOR') {
      selectedTemplates.push(READY_MADE_CHECKLISTS.MOTOR_PROPOSAL);
    }
  } else if (purpose === 'CLAIM') {
    if (category === 'LIFE' && caseContext.claimSubType === 'MATURITY') {
      selectedTemplates.push(READY_MADE_CHECKLISTS.LIFE_MATURITY_CLAIM);
    } else if (category === 'LIFE') {
      selectedTemplates.push(READY_MADE_CHECKLISTS.LIFE_DEATH_CLAIM);
    } else if (category === 'HEALTH') {
      selectedTemplates.push(READY_MADE_CHECKLISTS.HEALTH_CLAIM);
    } else {
      selectedTemplates.push(READY_MADE_CHECKLISTS.MOTOR_CLAIM);
    }
  }

  const generatedItems = [];
  for (const tpl of selectedTemplates) {
    for (const item of tpl.items) {
      // Conditional item visibility rule: hide if conditionKey evaluates false
      if (item.conditionKey && !flags[item.conditionKey]) {
        continue;
      }

      // Insurer-specific overrides always take precedence over built-in templates
      const override = insurerOverrides[item.code];
      const finalRequirement = override?.requirement || item.requirement;
      if (finalRequirement === 'HIDDEN') continue;

      generatedItems.push({
        code: item.code,
        templateCode: tpl.code,
        documentName: override?.title || item.title,
        category: tpl.name,
        requirementType: finalRequirement === 'CONDITIONAL' ? 'CONDITIONAL' : finalRequirement,
        sensitive: Boolean(item.sensitive),
        status: 'NOT_REQUESTED',
      });
    }
  }

  return generatedItems;
}
