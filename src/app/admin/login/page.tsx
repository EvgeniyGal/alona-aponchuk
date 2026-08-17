"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { authenticate } from "./actions";

const inputCls =
  "w-full rounded-md border border-hairline bg-white px-3 py-2.5 text-[14px] outline-none focus:border-blue focus:ring-2 focus:ring-blue/20";

export default function AdminLoginPage() {
  const t = useTranslations("admin");
  const [error, action, pending] = useActionState(authenticate, undefined);

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <form action={action} className="w-full max-w-md rounded-2xl border border-hairline bg-white p-8">
        <p className="eyebrow">{t("login.eyebrow")}</p>
        <h1 className="mt-2 font-display text-2xl">{t("login.title")}</h1>
        <p className="mt-2 text-[14px] text-muted-foreground">{t("login.lead")}</p>
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">{t("login.email")}</span>
            <input className={inputCls} type="email" name="email" required autoComplete="email" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">{t("login.password")}</span>
            <input className={inputCls} type="password" name="password" required autoComplete="current-password" />
          </label>
        </div>
        {error ? <p className="mt-4 text-[13px] text-destructive">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-md bg-blue py-2.5 text-[14px] font-medium text-white disabled:opacity-60"
        >
          {pending ? t("login.pending") : t("login.submit")}
        </button>
        <p className="mt-4 text-center text-[13px]">
          <Link href="/admin/forgot-password" className="text-blue hover:underline">
            {t("login.forgot")}
          </Link>
        </p>
      </form>
    </div>
  );
}
