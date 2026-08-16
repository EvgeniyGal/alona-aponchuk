"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { resetPassword } from "./actions";

function ResetForm() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [error, action, pending] = useActionState(resetPassword, undefined);

  return (
    <form action={action} className="w-full max-w-md rounded-2xl border border-hairline bg-white p-8">
      <h1 className="font-display text-2xl">Choose a new password</h1>
      <input type="hidden" name="token" value={token} />
      <label className="mt-6 block">
        <span className="mb-1.5 block text-[13px] font-medium">New password</span>
        <input
          className="w-full rounded-md border border-hairline px-3 py-2.5 text-[14px] outline-none focus:border-blue"
          type="password"
          name="password"
          minLength={10}
          required
        />
      </label>
      {error ? <p className="mt-4 text-[13px] text-destructive">{error}</p> : null}
      <button
        type="submit"
        disabled={pending || !token}
        className="mt-6 w-full rounded-md bg-blue py-2.5 text-[14px] font-medium text-white disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <Suspense>
        <ResetForm />
      </Suspense>
    </div>
  );
}
