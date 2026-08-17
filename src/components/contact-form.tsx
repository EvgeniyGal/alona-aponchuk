"use client";

import { useState } from "react";
import { CheckCircle2, Mail, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { PageHero, Section } from "@/components/page-shell";

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
  const t = useTranslations("contact");
  const common = useTranslations("common");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const orgTypes = t.raw("orgTypes") as string[];
  const problems = t.raw("problems") as string[];

  if (submitted) {
    return (
      <>
        <PageHero eyebrow={t("receivedEyebrow")} title={t("receivedTitle")} />
        <Section>
          <div className="rounded-2xl border border-teal/40 bg-teal-soft/40 p-8 max-w-2xl">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-teal mt-1" />
              <div>
                <h2 className="font-display text-xl text-graphite">{t("nextSteps")}</h2>
                <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed">
                  {t("receivedBody")}{" "}
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
                  {t("submitAnother")}
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
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
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
                  throw new Error(json.error || t("error"));
                }
                setSubmitted(true);
              } catch (err) {
                setError(
                  err instanceof Error
                    ? err.message
                    : t("error"),
                );
              } finally {
                setBusy(false);
              }
            }}
            className="space-y-10"
            noValidate
          >
            <fieldset className="space-y-4">
              <legend className="eyebrow">{t("contactLegend")}</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t("fullName")} required>
                  <input required className={inputCls} type="text" name="name" autoComplete="name" />
                </Field>
                <Field label={t("organization")} required>
                  <input required className={inputCls} type="text" name="organization" autoComplete="organization" />
                </Field>
                <Field label={t("email")} required>
                  <input required className={inputCls} type="email" name="email" autoComplete="email" />
                </Field>
                <Field label={t("phone")}>
                  <input className={inputCls} type="tel" name="phone" autoComplete="tel" />
                </Field>
                <Field label={t("website")}>
                  <input className={inputCls} type="url" name="website" placeholder="https://" />
                </Field>
                <Field label={t("role")}>
                  <input className={inputCls} type="text" name="role" autoComplete="organization-title" />
                </Field>
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="eyebrow">{t("orgLegend")}</legend>
              <Field label={t("orgType")} required>
                <select required className={inputCls} name="orgType" defaultValue="">
                  <option value="" disabled>
                    {t("selectOne")}
                  </option>
                  {orgTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </Field>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="eyebrow">{t("systemsLegend")}</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t("crm")}>
                  <input className={inputCls} name="crm" placeholder={t("crmPh")} />
                </Field>
                <Field label={t("scheduling")}>
                  <input className={inputCls} name="scheduling" placeholder={t("schedulingPh")} />
                </Field>
                <Field label={t("ai")}>
                  <input className={inputCls} name="ai" placeholder={t("aiPh")} />
                </Field>
                <Field label={t("forms")}>
                  <input className={inputCls} name="forms" placeholder={t("formsPh")} />
                </Field>
                <Field label={t("messaging")}>
                  <input className={inputCls} name="messaging" placeholder={t("messagingPh")} />
                </Field>
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="eyebrow">{t("problemLegend")}</legend>
              <Field label={t("problem")} required>
                <select required className={inputCls} name="problem" defaultValue="">
                  <option value="" disabled>
                    {t("selectOne")}
                  </option>
                  {problems.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </Field>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="eyebrow">{t("volumeLegend")}</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t("leads")}>
                  <input className={inputCls} name="leads" type="number" min="0" />
                </Field>
                <Field label={t("consults")}>
                  <input className={inputCls} name="consults" type="number" min="0" />
                </Field>
                <Field label={t("clients")}>
                  <input className={inputCls} name="clients" type="number" min="0" />
                </Field>
                <Field label={t("staff")}>
                  <input className={inputCls} name="staff" type="number" min="0" />
                </Field>
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="eyebrow">{t("diagnosticLegend")}</legend>
              <Field label={t("lost")}>
                <textarea className={inputCls} rows={3} name="lost" />
              </Field>
              <Field label={t("followup")}>
                <textarea className={inputCls} rows={2} name="followup" />
              </Field>
              <Field label={t("afterForm")}>
                <textarea className={inputCls} rows={3} name="afterForm" />
              </Field>
              <Field label={t("improve")}>
                <textarea className={inputCls} rows={3} name="improve" />
              </Field>
            </fieldset>

            <div className="flex flex-col gap-4">
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                {t("consent")}
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
                {busy ? common("sending") : t("submit")}
              </button>
            </div>
          </form>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-hairline bg-white p-6">
              <div className="eyebrow">{t("direct")}</div>
              <ul className="mt-4 space-y-3 text-[14px] text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Mail size={16} className="mt-0.5 text-blue shrink-0" />
                  <a href="mailto:info@aponchukworkflow.com" className="hover:text-blue break-all">
                    info@aponchukworkflow.com
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 text-blue shrink-0" />
                  <span>{t("location")}</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-hairline bg-ivory/60 p-6">
              <div className="eyebrow">{t("nextEyebrow")}</div>
              <ol className="mt-4 space-y-3 text-[13.5px] text-muted-foreground list-decimal list-inside marker:text-blue">
                <li>{t("next1")}</li>
                <li>{t("next2")}</li>
                <li>{t("next3")}</li>
              </ol>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
