import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { TemplateEntry } from "./registry";

export interface NewAssessmentLeadProps {
  header?: string;
  fullName?: string;
  organizationName?: string;
  roleTitle?: string;
  workEmail?: string;
  phone?: string;
  website?: string;
  source?: string;
  status?: string;
  organizationType?: string;
  mainProblem?: string;
  dropoffStage?: string;
  crm?: string;
  trackingMethod?: string;
  followupProcess?: string;
  aiStatus?: string;
  monthlyVolume?: string;
  primaryPriority?: string;
  diagnosticSummary?: string;
  transcript?: string;
  detailsUrl?: string;
  submittedAt?: string;
}

const LOGO_URL = "https://www.aponchukworkflow.com/logo.webp";

const main = {
  backgroundColor: "#f4f1ea",
  fontFamily: "Inter, Arial, sans-serif",
  margin: 0,
  padding: "32px 0",
};
const container = {
  backgroundColor: "#ffffff",
  maxWidth: "640px",
  margin: "0 auto",
  borderRadius: "10px",
  overflow: "hidden" as const,
  border: "1px solid #e8e4da",
};
const header = {
  backgroundColor: "#ffffff",
  padding: "28px 32px 20px",
  borderBottom: "1px solid #eeeae0",
};
const brandName = {
  fontFamily: "Manrope, Arial, sans-serif",
  color: "#1f2933",
  fontSize: "14px",
  fontWeight: 600,
  letterSpacing: "0.04em",
  margin: "12px 0 0",
};
const body = { padding: "28px 32px 8px", color: "#1f2933" };
const h1 = {
  fontFamily: "Manrope, Arial, sans-serif",
  color: "#1f2933",
  fontSize: "22px",
  lineHeight: "1.3",
  margin: "0 0 6px",
  fontWeight: 600,
};
const kicker = { color: "#5a6472", fontSize: "13px", margin: "0 0 20px" };
const sectionTitle = {
  fontFamily: "Manrope, Arial, sans-serif",
  color: "#3b6b5a",
  fontSize: "12px",
  fontWeight: 700,
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  margin: "24px 0 10px",
  paddingBottom: "6px",
  borderBottom: "1px solid #eeeae0",
};
const label = {
  color: "#5a6472",
  fontSize: "11px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "12px 0 2px",
  fontWeight: 600,
};
const value = {
  color: "#1f2933",
  fontSize: "14px",
  lineHeight: "1.55",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};
const footer = {
  color: "#5a6472",
  fontSize: "12px",
  padding: "20px 32px 28px",
  borderTop: "1px solid #eeeae0",
  backgroundColor: "#faf8f3",
};
const link = { color: "#3b6b5a", textDecoration: "none" };

const Field = ({ k, v }: { k: string; v?: string }) => {
  if (!v) return null;
  return (
    <>
      <Text style={label}>{k}</Text>
      <Text style={value}>{v}</Text>
    </>
  );
};

const Email = (props: NewAssessmentLeadProps) => {
  const title = props.header || "New Workflow Assessment Lead";
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>
        {title} — {props.organizationName || props.fullName || "New lead"}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src={LOGO_URL}
              alt="Aponchuk Workflow Systems LLC"
              width="56"
              height="56"
              style={{ display: "block", borderRadius: "8px" }}
            />
            <Text style={brandName}>APONCHUK WORKFLOW SYSTEMS LLC</Text>
          </Section>
          <Section style={body}>
            <Heading style={h1}>{title}</Heading>
            <Text style={kicker}>
              {props.source === "contact_form" ? "Submitted via contact form" : "Submitted via website assistant"}{" "}
              {props.submittedAt ? `· ${props.submittedAt}` : ""}
            </Text>
            <Text style={sectionTitle}>Contact Details</Text>
            <Field k="Name" v={props.fullName} />
            <Field k="Organization" v={props.organizationName} />
            <Field k="Role" v={props.roleTitle} />
            <Field k="Work Email" v={props.workEmail} />
            <Field k="Phone" v={props.phone} />
            <Field k="Website" v={props.website} />
            <Text style={sectionTitle}>Assessment Data</Text>
            <Field k="Business Type" v={props.organizationType} />
            <Field k="Main Problem" v={props.mainProblem} />
            <Field k="Drop-off Stage" v={props.dropoffStage} />
            <Field k="CRM / EHR System" v={props.crm} />
            <Field k="Tracking / Scheduling Setup" v={props.trackingMethod} />
            <Field k="Follow-up Process" v={props.followupProcess} />
            <Field k="Existing Chatbot / AI Status" v={props.aiStatus} />
            <Field k="Monthly Lead Volume" v={props.monthlyVolume} />
            <Field k="Immediate Goals" v={props.primaryPriority} />
            <Text style={sectionTitle}>System Outputs</Text>
            <Field k="Lead Status" v={props.status} />
            <Field k="Short AI Summary" v={props.diagnosticSummary} />
            <Field k="Conversation Transcript" v={props.transcript} />
            {props.detailsUrl ? (
              <Text style={{ margin: "20px 0 0" }}>
                <Link href={props.detailsUrl} style={link}>
                  Open lead details
                </Link>
              </Text>
            ) : null}
            <Hr style={{ borderColor: "#eeeae0", margin: "28px 0 0" }} />
          </Section>
          <Section style={footer}>
            <Text style={{ margin: 0 }}>
              Reply to reach {props.fullName || "the sender"}
              {props.workEmail ? (
                <>
                  {" "}
                  at{" "}
                  <Link href={`mailto:${props.workEmail}`} style={link}>
                    {props.workEmail}
                  </Link>
                </>
              ) : null}
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export const template = {
  component: Email,
  subject: (data: Record<string, unknown>) =>
    `${String(data.header || "New Workflow Assessment Lead")} – ${String(data.organizationName || data.fullName || "New lead")}`,
  displayName: "New Assessment Lead",
  to: "info@aponchukworkflow.com",
} satisfies TemplateEntry;
