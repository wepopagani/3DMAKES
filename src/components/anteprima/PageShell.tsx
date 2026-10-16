import { useRef, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { IntroContext, usePageUncovered } from "./hooks";
import PreviewNavbar from "./PreviewNavbar";

/** Cornice delle pagine pubbliche restyling: navbar dell'anteprima, footer e WhatsApp di sempre. */
export default function PageShell({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const uncovered = usePageUncovered(rootRef);

  return (
    <MotionConfig reducedMotion="user">
      <IntroContext.Provider value={uncovered}>
        <div ref={rootRef} className="flex min-h-screen flex-col bg-white">
          <PreviewNavbar />
          <main className="flex-grow overflow-x-clip">{children}</main>
          <Footer />
          <WhatsAppButton />
        </div>
      </IntroContext.Provider>
    </MotionConfig>
  );
}
