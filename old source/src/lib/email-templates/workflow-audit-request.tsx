import * as React from 'react'
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
} from '@react-email/components'
import type { TemplateEntry } from './registry'

export interface WorkflowAuditRequestProps {
  name?: string
  organization?: string
  email?: string
  phone?: string
  website?: string
  role?: string
  orgType?: string
  crm?: string
  scheduling?: string
  ai?: string
  forms?: string
  messaging?: string
  problem?: string
  leads?: string
  consults?: string
  clients?: string
  staff?: string
  lost?: string
  followup?: string
  afterForm?: string
  improve?: string
}

const LOGO_URL =
  'https://www.aponchukworkflow.com/__l5e/assets-v1/740418f7-0b52-4419-b668-9b92bc34f412/logo.png'

const main = {
  backgroundColor: '#f4f1ea',
  fontFamily: 'Inter, Arial, sans-serif',
  margin: 0,
  padding: '32px 0',
}
const container = {
  backgroundColor: '#ffffff',
  maxWidth: '640px',
  margin: '0 auto',
  borderRadius: '10px',
  overflow: 'hidden' as const,
  border: '1px solid #e8e4da',
}
const header = {
  backgroundColor: '#ffffff',
  padding: '28px 32px 20px',
  borderBottom: '1px solid #eeeae0',
  textAlign: 'left' as const,
}
const brandName = {
  fontFamily: 'Manrope, Arial, sans-serif',
  color: '#1f2933',
  fontSize: '14px',
  fontWeight: 600,
  letterSpacing: '0.04em',
  margin: '12px 0 0',
}
const body = { padding: '28px 32px 8px', color: '#1f2933' }
const h1 = {
  fontFamily: 'Manrope, Arial, sans-serif',
  color: '#1f2933',
  fontSize: '22px',
  lineHeight: '1.3',
  margin: '0 0 6px',
  fontWeight: 600,
}
const kicker = {
  color: '#5a6472',
  fontSize: '13px',
  margin: '0 0 20px',
}
const sectionTitle = {
  fontFamily: 'Manrope, Arial, sans-serif',
  color: '#3b6b5a',
  fontSize: '12px',
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  margin: '24px 0 10px',
  paddingBottom: '6px',
  borderBottom: '1px solid #eeeae0',
}
const label = {
  color: '#5a6472',
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  margin: '12px 0 2px',
  fontWeight: 600,
}
const value = {
  color: '#1f2933',
  fontSize: '14px',
  lineHeight: '1.55',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
}
const footer = {
  color: '#5a6472',
  fontSize: '12px',
  padding: '20px 32px 28px',
  borderTop: '1px solid #eeeae0',
  backgroundColor: '#faf8f3',
}
const link = { color: '#3b6b5a', textDecoration: 'none' }

const Field = ({ k, v }: { k: string; v?: string }) => {
  if (!v) return null
  return (
    <>
      <Text style={label}>{k}</Text>
      <Text style={value}>{v}</Text>
    </>
  )
}

const hasAny = (...vals: Array<string | undefined>) => vals.some((v) => v && v.trim().length > 0)

const Email = (props: WorkflowAuditRequestProps) => {
  const org = props.organization || 'New submission'
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>New workflow audit request from {org}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src={LOGO_URL}
              alt="Aponchuk Workflow Systems LLC"
              width="56"
              height="56"
              style={{ display: 'block', borderRadius: '8px' }}
            />
            <Text style={brandName}>APONCHUK WORKFLOW SYSTEMS LLC</Text>
          </Section>

          <Section style={body}>
            <Heading style={h1}>New Workflow Audit Request</Heading>
            <Text style={kicker}>Submitted via aponchukworkflow.com</Text>

            {hasAny(props.name, props.organization, props.email, props.phone, props.website, props.role) && (
              <>
                <Text style={sectionTitle}>Contact</Text>
                <Field k="Name" v={props.name} />
                <Field k="Organization" v={props.organization} />
                <Field k="Email" v={props.email} />
                <Field k="Phone" v={props.phone} />
                <Field k="Website" v={props.website} />
                <Field k="Role" v={props.role} />
              </>
            )}

            {hasAny(props.orgType, props.crm, props.scheduling, props.ai, props.forms, props.messaging) && (
              <>
                <Text style={sectionTitle}>Organization &amp; Stack</Text>
                <Field k="Organization type" v={props.orgType} />
                <Field k="CRM" v={props.crm} />
                <Field k="Scheduling" v={props.scheduling} />
                <Field k="AI / Chatbot" v={props.ai} />
                <Field k="Forms" v={props.forms} />
                <Field k="Messaging" v={props.messaging} />
              </>
            )}

            {hasAny(props.problem, props.leads, props.consults, props.clients, props.staff) && (
              <>
                <Text style={sectionTitle}>Current Workflow</Text>
                <Field k="Primary problem" v={props.problem} />
                <Field k="Monthly leads" v={props.leads} />
                <Field k="Monthly consultations" v={props.consults} />
                <Field k="Monthly clients" v={props.clients} />
                <Field k="Staff involved" v={props.staff} />
              </>
            )}

            {hasAny(props.lost, props.followup, props.afterForm, props.improve) && (
              <>
                <Text style={sectionTitle}>Diagnostic Notes</Text>
                <Field k="Where clients get lost" v={props.lost} />
                <Field k="Who handles follow-up" v={props.followup} />
                <Field k="After form submission" v={props.afterForm} />
                <Field k="What a better workflow would improve" v={props.improve} />
              </>
            )}

            <Hr style={{ borderColor: '#eeeae0', margin: '28px 0 0' }} />
          </Section>

          <Section style={footer}>
            <Text style={{ margin: 0 }}>
              Reply directly to this email to reach{' '}
              {props.name || 'the sender'}
              {props.email ? (
                <>
                  {' '}at{' '}
                  <Link href={`mailto:${props.email}`} style={link}>
                    {props.email}
                  </Link>
                </>
              ) : null}
              .
            </Text>
            <Text style={{ margin: '6px 0 0' }}>
              Aponchuk Workflow Systems LLC ·{' '}
              <Link href="https://www.aponchukworkflow.com" style={link}>
                aponchukworkflow.com
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    `New Workflow Audit Request – ${data.organization || data.name || 'New submission'}`,
  displayName: 'Workflow Audit Request',
  to: 'info@aponchukworkflow.com',
  previewData: {
    name: 'Jane Doe',
    organization: 'Acme Wellness',
    email: 'jane@example.com',
    phone: '+1 555 123 4567',
    role: 'Operations Director',
    orgType: 'Wellness clinic',
    crm: 'HubSpot',
    scheduling: 'Calendly',
    ai: 'None',
    problem: 'Leads getting lost between intake and consultation',
    leads: '120',
    consults: '45',
    clients: '20',
    staff: '4',
    lost: 'Between intake form and first consult booking.',
    followup: 'Front desk, manually.',
    afterForm: 'Client receives an email, then silence for 2–3 days.',
    improve: 'Faster response times and clearer handoffs.',
  } satisfies WorkflowAuditRequestProps,
} satisfies TemplateEntry
