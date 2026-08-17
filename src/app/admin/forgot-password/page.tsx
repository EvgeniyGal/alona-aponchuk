"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { requestPasswordReset } from "./actions";

export default function ForgotPasswordPage() {
  const t = useTranslations("admin");
  const [message, action, pending] = useActionState(requestPasswordReset, undefined);

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <form action={action} className="w-full max-w-md rounded-2xl border border-hairline bg-white p-8">
        <h1 className="font-display text-2xl">{t("forgot.title")}</h1>
        <p className="mt-2 text-[14px] text-muted-foreground">{t("forgot.lead")}</p>
        <label className="mt-6 block">
          <span className="mb-1.5 block text-[13px] font-medium">{t("forgot.email")}</span>
          <input
            className="w-full rounded-md border border-hairline px-3 py-2.5 text-[14px] outline-none focus:border-blue"
            type="email"
            name="email"
            required
          />
        </label>
        {message ? <p className="mt-4 text-[13px] text-blue">{message}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-md bg-blue py-2.5 text-[14px] font-medium text-white disabled:opacity-60"
        >
          {pending ? t("forgot.pending") : t("forgot.submit")}
        </button>
        <p className="mt-4 text-center text-[13px]">
          <Link href="/admin/login" className="text-blue hover:underline">
            {t("forgot.back")}
          </Link>
        </p>
      </form>
    </div>
  );
}
