"use client";

import { useActionState } from "react";
import { inviteUser } from "./actions";

export function InviteUserForm() {
  const [message, action, pending] = useActionState(inviteUser, undefined);
  return (
    <form action={action} className="mt-6 flex flex-wrap gap-3">
      <input
        className="min-w-64 flex-1 rounded-md border border-hairline px-3 py-2.5 text-[14px]"
        type="email"
        name="email"
        placeholder="new-admin@email.com"
        required
      />
      <button type="submit" disabled={pending} className="rounded-md bg-blue px-4 py-2.5 text-[14px] font-medium text-white">
        {pending ? "Sending…" : "Send invite"}
      </button>
      {message ? <p className="w-full text-[13px] text-blue">{message}</p> : null}
    </form>
  );
}
