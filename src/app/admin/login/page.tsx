"use client";

import { useActionState } from "react";
import Link from "next/link";
import { authenticate } from "./actions";

const inputCls =
  "w-full rounded-md border border-hairline bg-white px-3 py-2.5 text-[14px] outline-none focus:border-blue focus:ring-2 focus:ring-blue/20";

export default function AdminLoginPage() {
  const [error, action, pending] = useActionState(authenticate, undefined);

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <form action={action} className="w-full max-w-md rounded-2xl border border-hairline bg-white p-8">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-2 font-display text-2xl">Sign in</h1>
        <p className="mt-2 text-[14px] text-muted-foreground">Invite-only access for Aponchuk Workflow Systems.</p>
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">Email</span>
            <input className={inputCls} type="email" name="email" required autoComplete="email" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">Password</span>
            <input className={inputCls} type="password" name="password" required autoComplete="current-password" />
          </label>
        </div>
        {error ? <p className="mt-4 text-[13px] text-destructive">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-md bg-blue py-2.5 text-[14px] font-medium text-white disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
        <p className="mt-4 text-center text-[13px]">
          <Link href="/admin/forgot-password" className="text-blue hover:underline">
            Forgot password
          </Link>
        </p>
      </form>
    </div>
  );
}
