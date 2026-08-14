import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png.asset.json";

const nav = [
  { to: "/", label: "Home" },
  { to: "/mission", label: "Mission" },
  { to: "/method", label: "Method" },
  { to: "/services", label: "Services" },
  { to: "/case-stories", label: "Case Stories" },
  { to: "/responsible-ai", label: "Responsible AI" },
  { to: "/research", label: "Research" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-ivory/90 backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between gap-6">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src={logo.url}
            alt="Alona Aponchuk — Aponchuk Workflow Systems LLC"
            className="h-12 w-12 shrink-0 object-contain"
          />
          <span className="font-display text-[15.5px] font-semibold leading-tight text-graphite hidden sm:block">
            Alona Aponchuk
            <span className="block text-[11.5px] font-normal text-muted-foreground">
              Aponchuk Workflow Systems LLC
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-[14px] text-graphite/80 hover:text-blue transition-colors"
              activeProps={{ className: "text-blue font-medium" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            className="hidden md:inline-flex items-center rounded-md bg-blue px-4 py-2.5 text-[13.5px] font-medium text-white hover:bg-blue/90 transition-colors"
          >
            Request Workflow Audit
          </Link>
          <button
            aria-label="Toggle menu"
            className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-md border border-hairline text-graphite"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-hairline bg-ivory">
          <div className="container-page py-3 flex flex-col">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="py-3 text-[15px] text-graphite border-b border-hairline last:border-b-0"
                onClick={() => setOpen(false)}
                activeProps={{ className: "text-blue font-medium" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="mt-4 mb-2 inline-flex justify-center rounded-md bg-blue px-4 py-3 text-[14px] font-medium text-white"
              onClick={() => setOpen(false)}
            >
              Request Workflow Audit
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
