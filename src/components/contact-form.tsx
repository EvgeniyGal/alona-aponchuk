"use client";

import { useState } from "react";
import { CheckCircle2, Mail, MapPin } from "lucide-react";
import { PageHero, Section } from "@/components/page-shell";

const orgTypes = [
  "Medical Practice",
  "Wellness Center",
  "Medspa",
  "Therapy Practice",
  "Rehabilitation Center",
  "Aesthetics Clinic",
  "Integrative Health Organization",
  "Other",
];

const problems = [
  "Intake",
  "Scheduling",
  "Follow-up",
  "Retention",
  "Chatbot",
  "Staff workload",
  "CRM inconsistency",
  "Other",
];

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-graphite mb-1.5">
        {label} {required && <span className="text-gold">*</span>}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-md border border-hairline bg-white px-3 py-2.5 text-[14px] text-graphite outline-none focus:border-blue focus:ring-2 focus:ring-blue/20 transition";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (submitted) {
    return (
      <>
        <PageHero eyebrow="Received" title="Thank you — your request has been submitted." />
        <Section>
          <div className="rounded-2xl border border-teal/40 bg-teal-soft/40 p-8 max-w-2xl">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-teal mt-1" />
              <div>
                <h2 className="font-display text-xl text-graphite">Next steps</h2>
                <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed">
                  I will review your submission and reach out to schedule a diagnostic call.
                  If your request is time-sensitive, please email me directly at{" "}
                  <a href="mailto:info@aponchukworkflow.com" className="text-blue hover:underline">
                    info@aponchukworkflow.com
                  </a>
                  .
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setError(null);
                  }}
                  className="mt-6 inline-flex items-center rounded-md border border-hairline bg-white px-4 py-2.5 text-[13.5px] font-medium text-graphite hover:bg-muted"
                >
                  Submit another request
                </button>
              </div>
            </div>
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Request Workflow Audit"
        title="Tell me about your organization and current workflow."
        lead="This diagnostic form takes about 5 minutes. All fields help me scope the audit accurately — the more context you share, the more useful the first call will be."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (busy) return;
              setError(null);
              setBusy(true);
              const formEl = e.currentTarget;
              const fd = new FormData(formEl);
              const data = Object.fromEntries(fd.entries()) as Record<string, string>;
              try {
                const res = await fetch("/api/contact", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(data),
                });
                const json = (await res.json()) as { ok?: boolean; error?: string };
                if (!res.ok || !json.ok) {
                  throw new Error(json.error || "Something went wrong. Please email info@aponchukworkflow.com directly.");
                }
                setSubmitted(true);
              } catch (err) {
                setError(
                  err instanceof Error
                    ? err.message
                    : "Something went wrong. Please email info@aponchukworkflow.com directly.",
                );
              } finally {
                setBusy(false);
              }
            }}
            className="space-y-10"
            noValidate
          >
            <fieldset className="space-y-4">
              <legend className="eyebrow">Contact</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name" required>
                  <input required className={inputCls} type="text" name="name" autoComplete="name" />
                </Field>
                <Field label="Organization" required>
                  <input required className={inputCls} type="text" name="organization" autoComplete="organization" />
                </Field>
                <Field label="Email" required>
                  <input required className={inputCls} type="email" name="email" autoComplete="email" />
                </Field>
                <Field label="Phone">
                  <input className={inputCls} type="tel" name="phone" autoComplete="tel" />
                </Field>
                <Field label="Website">
                  <input className={inputCls} type="url" name="website" placeholder="https://" />
                </Field>
                <Field label="Role / Title">
                  <input className={inputCls} type="text" name="role" autoComplete="organization-title" />
                </Field>
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="eyebrow">Organization</legend>
              <Field label="Organization type" required>
                <select required className={inputCls} name="orgType" defaultValue="">
                  <option value="" disabled>
                    Select one…
                  </option>
                  {orgTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="eyebrow">Current Systems</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="CRM platform">
                  <input className={inputCls} name="crm" placeholder="e.g., HubSpot, Salesforce, Keap" />
                </Field>
                <Field label="Scheduling tool">
                  <input className={inputCls} name="scheduling" placeholder="e.g., Calendly, Jane, SimplePractice" />
                </Field>
                <Field label="Chatbot or AI use">
                  <input className={inputCls} name="ai" placeholder="e.g., Intercom, custom GPT, none" />
                </Field>
                <Field label="Website forms">
                  <input className={inputCls} name="forms" placeholder="e.g., Typeform, Gravity Forms" />
                </Field>
                <Field label="Messaging channels">
                  <input className={inputCls} name="messaging" placeholder="e.g., SMS, WhatsApp, email" />
                </Field>
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="eyebrow">Main Problem</legend>
              <Field label="Primary problem area" required>
                <select required className={inputCls} name="problem" defaultValue="">
                  <option value="" disabled>
                    Select one…
                  </option>
                  {problems.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </Field>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="eyebrow">Volume Indicators</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Approximate monthly leads">
                  <input className={inputCls} name="leads" type="number" min="0" />
                </Field>
                <Field label="Approximate monthly consultations">
                  <input className={inputCls} name="consults" type="number" min="0" />
                </Field>
                <Field label="Approximate monthly clients or patients">
                  <input className={inputCls} name="clients" type="number" min="0" />
                </Field>
                <Field label="Number of staff involved">
                  <input className={inputCls} name="staff" type="number" min="0" />
                </Field>
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="eyebrow">Diagnostic Questions</legend>
              <Field label="Where do clients most often get lost?">
                <textarea className={inputCls} rows={3} name="lost" />
              </Field>
              <Field label="Who currently handles follow-up?">
                <textarea className={inputCls} rows={2} name="followup" />
              </Field>
              <Field label="What happens after a client submits a form?">
                <textarea className={inputCls} rows={3} name="afterForm" />
              </Field>
              <Field label="What would a more reliable workflow improve for the organization?">
                <textarea className={inputCls} rows={3} name="improve" />
              </Field>
            </fieldset>

            <div className="flex flex-col gap-4">
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                By submitting this form you consent to being contacted regarding your inquiry.
                Please do not include protected health information (PHI) or identifying patient
                data in this form.
              </p>
              {error && (
                <div className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-[13.5px] text-destructive">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={busy}
                className="self-start inline-flex items-center rounded-md bg-blue px-6 py-3 text-[14.5px] font-medium text-white hover:bg-blue/90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {busy ? "Sending…" : "Request Workflow Audit"}
              </button>
            </div>
          </form>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-hairline bg-white p-6">
              <div className="eyebrow">Direct Contact</div>
              <ul className="mt-4 space-y-3 text-[14px] text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Mail size={16} className="mt-0.5 text-blue shrink-0" />
                  <a href="mailto:info@aponchukworkflow.com" className="hover:text-blue break-all">
                    info@aponchukworkflow.com
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 text-blue shrink-0" />
                  <span>Sarasota, Florida. Remote consulting across the United States.</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-hairline bg-ivory/60 p-6">
              <div className="eyebrow">What Happens Next</div>
              <ol className="mt-4 space-y-3 text-[13.5px] text-muted-foreground list-decimal list-inside marker:text-blue">
                <li>I review your submission within a few business days.</li>
                <li>We schedule a diagnostic call to clarify scope.</li>
                <li>You receive a written Workflow Audit proposal.</li>
              </ol>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
