import { type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { IntroContext, usePageUncovered } from "./hooks";
import PreviewNavbar from "./PreviewNavbar";

/** Cornice delle pagine pubbliche restyling: navbar dell'anteprima, footer e WhatsApp di sempre. */
export default function PageShell({ children }: { children: ReactNode }) {
  const uncovered = usePageUncovered();

  return (
    <MotionConfig reducedMotion="user">
      <IntroContext.Provider value={uncovered}>
        <div className="flex min-h-screen flex-col bg-white">
          <PreviewNavbar />
          <main className="flex-grow overflow-x-clip">{children}</main>
          <Footer />
          <WhatsAppButton />
        </div>
      </IntroContext.Provider>
    </MotionConfig>
  );
}
