import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import PageShell from "./PageShell";
import PreviewNavbar from "./PreviewNavbar";

/** Pannello bianco usato in area clienti e amministrazione. */
export const accountPanel =
  "rounded-[1.75rem] border border-white/80 bg-white shadow-[0_18px_50px_-32px_rgba(26,42,74,0.55)]";

export const fieldClass =
  "h-12 rounded-2xl border-brand-blue/15 bg-[#F7F4F0] px-4 text-base text-brand-blue shadow-none placeholder:text-brand-blue/35 focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-0 md:text-sm";

export const areaClass =
  "min-h-28 rounded-2xl border-brand-blue/15 bg-[#F7F4F0] px-4 py-3 text-brand-blue shadow-none placeholder:text-brand-blue/35 focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-0";

export const labelClass = "text-sm font-medium text-brand-blue";

export const primaryButtonClass =
  "h-12 rounded-full bg-brand-blue px-6 text-base font-semibold text-white hover:bg-brand-blue/90";

export const quietButtonClass =
  "h-11 rounded-full border-brand-blue/15 bg-white px-5 text-brand-blue hover:bg-[#F7F4F0]";

export const textLinkClass = "font-semibold text-brand-accent transition-colors hover:text-brand-blue";

/** Area di lavoro: navbar del restyling, fondo beige, footer. Senza WhatsApp. */
export function AccountShell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen flex-col bg-[#E5DDD3]">
        <PreviewNavbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </MotionConfig>
  );
}

export function WorkspaceHeader({
  eyebrow,
  title,
  subtitle,
  onBack,
  backLabel,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        {onBack && backLabel ? (
          <button
            type="button"
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue/70 transition-colors hover:text-brand-accent"
          >
            <ArrowLeft aria-hidden className="h-4 w-4" />
            {backLabel}
          </button>
        ) : null}
        {eyebrow ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">{eyebrow}</p>
        ) : null}
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-brand-blue md:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-2xl text-brand-blue/70">{subtitle}</p> : null}
      </div>
      {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
    </div>
  );
}

export function AuthBusy() {
  return (
    <PageShell>
      <div className="flex min-h-[70vh] items-center justify-center bg-[#E5DDD3]" aria-busy="true">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-brand-blue/15 border-b-brand-accent" />
      </div>
    </PageShell>
  );
}

export function AuthFrame({
  title,
  lede,
  children,
  wide,
}: {
  title: string;
  lede?: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <PageShell>
      <section className="bg-[#E5DDD3] py-12 md:py-20">
        <div className={cn("container-custom", wide ? "max-w-xl" : "max-w-md")}>
          <div className={cn(accountPanel, "p-6 md:p-10")}>
            <h1 className="text-center font-display text-3xl font-extrabold tracking-tight text-brand-blue md:text-4xl">
              {title}
            </h1>
            {lede ? <div className="mt-3 text-center text-sm text-brand-blue/70">{lede}</div> : null}
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export function AuthOr({ label }: { label: string }) {
  return (
    <div className="relative py-1">
      <div className="absolute inset-0 flex items-center" aria-hidden>
        <div className="w-full border-t border-brand-blue/10" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand-blue/45">{label}</span>
      </div>
    </div>
  );
}

export function GoogleGlyph() {
  return (
    <svg aria-hidden className="h-5 w-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
