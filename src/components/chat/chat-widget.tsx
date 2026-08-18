"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  chatFetchHeaders,
  clearCache,
  getOrCreateVisitorId,
  readCache,
  serializeMessage,
  writeCache,
} from "@/lib/chat/client-storage";
import { cn } from "@/lib/utils";
import type { ChatMessageUi } from "@/lib/db/schema";

type ChatMessage = {
  id: string;
  role: string;
  content: string;
  ui: ChatMessageUi | null;
  createdAt: string | Date;
};

type Incoming =
  | { type: "cta"; value: string }
  | { type: "select"; step: string; value: string }
  | { type: "multi_done"; step: string; values: string[] }
  | { type: "text"; value: string };

function optionLabel(option: { label: string; compactLabel?: string }) {
  if (typeof window === "undefined") return option.label;
  return window.innerWidth < 640 && option.compactLabel ? option.compactLabel : option.label;
}

function LeadForm({
  disabled,
  onSubmit,
}: {
  disabled?: boolean;
  onSubmit: (payload: Record<string, string | boolean>) => Promise<void>;
}) {
  const t = useTranslations("chat");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="mt-3 space-y-2"
      onSubmit={async (event) => {
        event.preventDefault();
        if (busy || disabled) return;
        setBusy(true);
        setError(null);
        const form = new FormData(event.currentTarget);
        try {
          await onSubmit({
            fullName: String(form.get("fullName") || ""),
            organizationName: String(form.get("organizationName") || ""),
            workEmail: String(form.get("workEmail") || ""),
            phone: String(form.get("phone") || ""),
            website: String(form.get("website") || ""),
            roleTitle: String(form.get("roleTitle") || ""),
            consent: form.get("consent") === "on",
          });
        } catch (err) {
          setError(err instanceof Error ? err.message : t("leadSubmitError"));
        } finally {
          setBusy(false);
        }
      }}
    >
      {(
        [
          ["fullName", t("fullName"), "text", true],
          ["organizationName", t("organizationName"), "text", true],
          ["workEmail", t("workEmail"), "email", true],
          ["phone", t("phone"), "tel", false],
          ["website", t("website"), "text", false],
          ["roleTitle", t("roleTitle"), "text", false],
        ] as const
      ).map(([name, label, type, required]) => (
        <label key={String(name)} className="block">
          <span className="mb-1 block text-[11px] font-medium text-graphite/80">
            {label}
            {required ? " *" : ""}
          </span>
          <input
            name={String(name)}
            type={String(type)}
            required={Boolean(required)}
            disabled={disabled}
            className="w-full rounded-md border border-hairline bg-white px-2.5 py-2 text-[13px] text-graphite outline-none focus:border-blue focus:ring-2 focus:ring-blue/20"
          />
        </label>
      ))}
      <label className="flex items-start gap-2 pt-1 text-[12px] text-muted-foreground">
        <input type="checkbox" name="consent" required disabled={disabled} className="mt-0.5" />
        <span>{t("consent")}</span>
      </label>
      {error ? <p className="text-[12px] text-destructive">{error}</p> : null}
      <button
        type="submit"
        disabled={busy || disabled}
        className="inline-flex rounded-md bg-blue px-3 py-2 text-[13px] font-medium text-white hover:bg-blue/90 disabled:opacity-60"
      >
        {busy ? t("sending") : t("sendToAlona")}
      </button>
    </form>
  );
}

function MessageBody({
  message,
  isLast,
  busy,
  onAction,
  onLead,
}: {
  message: ChatMessage;
  isLast: boolean;
  busy: boolean;
  onAction: (payload: Incoming) => void;
  onLead: (payload: Record<string, string | boolean>) => Promise<void>;
}) {
  const t = useTranslations("chat");
  const ui = message.ui;
  const [selected, setSelected] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const interactive = isLast && !busy && message.role === "assistant";

  if (message.role === "user") {
    return (
      <div className="ml-8 rounded-2xl rounded-br-md bg-blue px-3.5 py-2.5 text-[13.5px] leading-relaxed text-white">
        {message.content}
      </div>
    );
  }

  return (
    <div className="mr-6 rounded-2xl rounded-bl-md border border-hairline bg-white px-3.5 py-2.5 text-[13.5px] leading-relaxed text-graphite">
      <p className="whitespace-pre-wrap">{message.content}</p>
      {ui?.kind === "welcome_ctas" || ui?.kind === "followup_ctas" || ui?.kind === "buttons" ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(ui.options ?? [])
            .filter((option) => option.value !== "pass_to_alona")
            .map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={!interactive}
              onClick={() => {
                if (ui.kind === "buttons" && ui.step) {
                  onAction({ type: "select", step: ui.step, value: option.value });
                } else {
                  onAction({ type: "cta", value: option.value });
                }
              }}
              className="rounded-full border border-hairline bg-ivory px-3 py-1.5 text-[12.5px] font-medium text-graphite hover:border-blue hover:text-blue disabled:opacity-50"
            >
              {optionLabel(option)}
            </button>
          ))}
        </div>
      ) : null}
      {ui?.kind === "multi_buttons" ? (
        <div className="mt-3 space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {(ui.options ?? []).map((option) => {
              const on = selected.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={!interactive}
                  onClick={() => {
                    setSelected((current) => {
                      if (current.includes(option.value)) return current.filter((value) => value !== option.value);
                      if (current.length >= 3) return current;
                      return [...current, option.value];
                    });
                  }}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[12.5px] font-medium disabled:opacity-50",
                    on ? "border-blue bg-blue text-white" : "border-hairline bg-ivory text-graphite hover:border-blue",
                  )}
                >
                  {optionLabel(option)}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            disabled={!interactive || selected.length === 0}
            onClick={() => ui.step && onAction({ type: "multi_done", step: ui.step, values: selected })}
            className="rounded-md bg-blue px-3 py-1.5 text-[12.5px] font-medium text-white disabled:opacity-50"
          >
            {t("continue")}
          </button>
        </div>
      ) : null}
      {ui?.kind === "text_input" ? (
        <div className="mt-3 space-y-2">
          {ui.options && ui.options.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {ui.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  disabled={!interactive}
                  onClick={() => onAction({ type: "text", value: option.label })}
                  className="rounded-full border border-hairline bg-ivory px-2.5 py-1 text-[12px] text-graphite hover:border-blue disabled:opacity-50"
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}
          <div className="flex gap-2">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={ui.placeholder || t("typeAnswer")}
              disabled={!interactive}
              inputMode={ui.inputMode === "numeric" ? "numeric" : "text"}
              className="min-w-0 flex-1 rounded-md border border-hairline px-2.5 py-2 text-[13px] outline-none focus:border-blue"
            />
            <button
              type="button"
              disabled={!interactive || !draft.trim()}
              onClick={() => onAction({ type: "text", value: draft.trim() })}
              className="rounded-md bg-blue px-3 py-2 text-white disabled:opacity-50"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      ) : null}
      {ui?.kind === "lead_form" ? <LeadForm disabled={!interactive} onSubmit={onLead} /> : null}
    </div>
  );
}

export function ChatWidget() {
  const t = useTranslations("chat");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [showHelpPrompt, setShowHelpPrompt] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => readCache()?.messages ?? []);
  const [mode, setMode] = useState("welcome");
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);
  const wasOpen = useRef(false);
  const sessionId = useRef<string | null>(readCache()?.sessionId ?? null);
  const visitorId = useRef("");

  const persistCache = useCallback((nextMessages: ChatMessage[], nextSessionId?: string | null) => {
    if (nextSessionId) sessionId.current = nextSessionId;
    if (!sessionId.current || !visitorId.current) return;

    writeCache({
      sessionId: sessionId.current,
      visitorId: visitorId.current,
      messages: nextMessages.map(serializeMessage),
      updatedAt: new Date().toISOString(),
    });
  }, []);

  const lastAssistantHasInput = useMemo(() => {
    const last = [...messages].reverse().find((message) => message.role === "assistant");
    return Boolean(last?.ui && last.ui.kind !== "followup_ctas" && last.ui.kind !== "welcome_ctas");
  }, [messages]);
  const inAssessment = mode === "assessment";

  useEffect(() => {
    if (inAssessment) setDraft("");
  }, [inAssessment]);

  const load = useCallback(async () => {
    visitorId.current = getOrCreateVisitorId();
    const cached = readCache();
    if (cached?.messages.length) {
      setMessages(cached.messages);
      sessionId.current = cached.sessionId;
    }

    const res = await fetch("/api/chat/session", { headers: chatFetchHeaders(visitorId.current, locale) });
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || t("loadError"));

    const serverMessages = json.messages as ChatMessage[];
    setMessages(serverMessages);
    sessionId.current = json.session.id;
    if (typeof json.session.mode === "string") setMode(json.session.mode);

    if (cached && cached.sessionId !== json.session.id) {
      clearCache();
    }
    persistCache(serverMessages, json.session.id);
  }, [persistCache, locale, t]);

  useEffect(() => {
    if (!open || loaded.current) return;
    loaded.current = true;
    load().catch(() => setError(t("loadError")));
  }, [open, load, t]);

  useEffect(() => {
    if (!loaded.current) return;
    load().catch(() => setError(t("loadError")));
  }, [locale, load, t]);

  useLayoutEffect(() => {
    if (!open) {
      wasOpen.current = false;
      return;
    }
    const el = scroller.current;
    if (!el) return;
    const justOpened = !wasOpen.current;
    wasOpen.current = true;
    el.scrollTo({ top: el.scrollHeight, behavior: justOpened ? "auto" : "smooth" });
    if (justOpened) {
      const frame = requestAnimationFrame(() => {
        el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [open, messages, busy]);

  useEffect(() => {
    if (open) {
      setShowHelpPrompt(false);
      return;
    }

    if (typeof window !== "undefined" && sessionStorage.getItem("chat-help-prompt-dismissed") === "1") {
      return;
    }

    const timer = window.setTimeout(() => setShowHelpPrompt(true), 30_000);
    return () => window.clearTimeout(timer);
  }, [open]);

  function dismissHelpPrompt() {
    setShowHelpPrompt(false);
    sessionStorage.setItem("chat-help-prompt-dismissed", "1");
  }

  function openChat() {
    setOpen(true);
    setShowHelpPrompt(false);
  }

  async function send(payload: Incoming) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...chatFetchHeaders(visitorId.current || getOrCreateVisitorId(), locale),
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || t("sendError"));
      if (typeof json.mode === "string") setMode(json.mode);
      setMessages((current) => {
        const next = [...current, ...(json.messages as ChatMessage[])];
        persistCache(next);
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("sendError"));
    } finally {
      setBusy(false);
    }
  }

  async function submitLead(payload: Record<string, string | boolean>) {
    const res = await fetch("/api/chat/lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...chatFetchHeaders(visitorId.current || getOrCreateVisitorId(), locale),
      },
      body: JSON.stringify({ ...payload, consent: payload.consent === true }),
    });
    const json = await res.json();
    if (!res.ok || !json.ok) throw new Error(json.error || t("leadSubmitError"));
    if (json.message) {
      setMessages((current) => {
        const next = [...current, json.message as ChatMessage];
        persistCache(next);
        return next;
      });
    }
  }

  return (
    <>
      <div className={cn("chat-launcher-wrap", open && "chat-launcher-wrap--open")}>
        {showHelpPrompt && !open ? (
          <div className="chat-help-prompt" role="status" aria-live="polite">
            <button
              type="button"
              className="chat-help-prompt__body"
              onClick={openChat}
            >
              <span className="chat-help-prompt__eyebrow">{t("helpEyebrow")}</span>
              <span className="chat-help-prompt__title">{t("helpTitle")}</span>
              <span className="chat-help-prompt__copy">{t("helpCopy")}</span>
            </button>
            <button
              type="button"
              aria-label={t("dismissHelp")}
              className="chat-help-prompt__close"
              onClick={dismissHelpPrompt}
            >
              <X size={14} />
            </button>
          </div>
        ) : null}
        <button
          type="button"
          aria-label={open ? t("close") : t("open")}
          aria-expanded={open}
          onClick={() => (open ? setOpen(false) : openChat())}
          className={cn("chat-launcher", open ? "chat-launcher--compact" : "chat-launcher--attention")}
        >
          <span className="chat-launcher__pulse" aria-hidden="true" />
          {open ? <X size={22} /> : <MessageCircle size={22} />}
          {!open ? <span className="chat-launcher__label">{t("help")}</span> : null}
        </button>
      </div>
      {open ? (
        <section className="chat-panel" role="dialog" aria-label={t("dialogLabel")}>
          <header className="flex items-center justify-between border-b border-hairline bg-ivory px-4 py-3">
            <div className="min-w-0 pr-2">
              <p className="font-display text-[15px] font-semibold text-graphite">{t("widgetTitle")}</p>
              <p className="text-[11.5px] text-muted-foreground">{t("widgetSubtitle")}</p>
            </div>
            <div className="flex shrink-0 items-center">
              <button type="button" aria-label={t("closeShort")} onClick={() => setOpen(false)} className="cursor-pointer text-graphite/70 hover:text-graphite">
                <X size={16} />
              </button>
            </div>
          </header>
          <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto bg-[#fbfaf6] px-3 py-3">
            {messages.map((message, index) => (
              <MessageBody
                key={message.id}
                message={message}
                isLast={index === messages.length - 1}
                busy={busy}
                onAction={(payload) => void send(payload)}
                onLead={submitLead}
              />
            ))}
            {busy ? <p className="text-[12px] text-muted-foreground">{t("thinking")}</p> : null}
            {error ? <p className="text-[12px] text-destructive">{error}</p> : null}
          </div>
          {inAssessment ? (
            <div className="shrink-0 border-t border-hairline bg-white px-3 py-3 text-center">
              <p className="text-[12.5px] leading-relaxed text-muted-foreground">{t("assessmentLocked")}</p>
              <button
                type="button"
                disabled={busy}
                onClick={() => void send({ type: "cta", value: "pause_assessment" })}
                className="mt-2.5 inline-flex cursor-pointer items-center justify-center rounded-md border border-hairline bg-ivory px-3 py-1.5 text-[12.5px] font-medium text-graphite hover:border-blue hover:text-blue disabled:opacity-50"
              >
                {t("pauseAssessment")}
              </button>
            </div>
          ) : (
            <form
              className="flex gap-2 border-t border-hairline bg-white p-3"
              onSubmit={(event) => {
                event.preventDefault();
                const value = draft.trim();
                if (!value || busy) return;
                setDraft("");
                void send({ type: "text", value });
              }}
            >
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={lastAssistantHasInput ? t("orTypePlaceholder") : t("askPlaceholder")}
                className="min-w-0 flex-1 rounded-md border border-hairline px-3 py-2 text-[13.5px] outline-none focus:border-blue"
              />
              <button
                type="submit"
                disabled={busy || !draft.trim()}
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-blue text-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={t("send")}
              >
                <Send size={16} />
              </button>
            </form>
          )}
        </section>
      ) : null}
    </>
  );
}
