import type { ComponentType } from "react";
import { template as workflowAuditRequest } from "./workflow-audit-request";
import { template as newAssessmentLead } from "./new-assessment-lead";
import { template as adminInvite } from "./admin-invite";
import { template as passwordReset } from "./password-reset";

export interface TemplateEntry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  subject: string | ((data: Record<string, unknown>) => string);
  displayName?: string;
  previewData?: Record<string, unknown>;
  to?: string;
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  "workflow-audit-request": workflowAuditRequest,
  "new-assessment-lead": newAssessmentLead,
  "admin-invite": adminInvite,
  "password-reset": passwordReset,
};
