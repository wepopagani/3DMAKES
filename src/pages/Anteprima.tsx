import { lazy, Suspense } from "react";

const ScanFilmHero = lazy(() => import("@/components/anteprima/ScanFilmHero"));
import { MotionConfig } from "framer-motion";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BlogBento from "@/components/anteprima/BlogBento";
import { FinalCta } from "@/components/anteprima/CtaPanels";
import { FaqSection, HowWeHelpSection } from "@/components/anteprima/HelpAndFaq";
import { IntroContext, usePageUncovered } from "@/components/anteprima/hooks";
import { AboutSection, BannerSection } from "@/components/anteprima/IntroSections";
import { MissionSection, TonySection } from "@/components/anteprima/MissionAndTony";
import ModelSearch from "@/components/anteprima/ModelSearch";
import PartnersStrip from "@/components/anteprima/PartnersStrip";
import PreviewNavbar from "@/components/anteprima/PreviewNavbar";
import { Reveal } from "@/components/anteprima/primitives";
import ReviewsDeck from "@/components/anteprima/ReviewsDeck";
import ServicesExplorer from "@/components/anteprima/ServicesExplorer";
import WorkshopShowcase from "@/components/anteprima/WorkshopShowcase";

/** Homepage pubblica. */
const Anteprima = () => {
  const uncovered = usePageUncovered();

  return (
    <MotionConfig reducedMotion="user">
      <IntroContext.Provider value={uncovered}>
        <div className="flex min-h-screen flex-col bg-white">
          <PreviewNavbar />
          <main className="flex-grow">
            <BannerSection />
            <Suspense fallback={<div className="min-h-[70vh] bg-[#101c30]" />}><ScanFilmHero /></Suspense>
            <AboutSection />
            <WorkshopShowcase />
            <ReviewsDeck />
            <ServicesExplorer />
            <HowWeHelpSection />
            <FaqSection />
            <MissionSection />
            <TonySection />
            <ModelSearch />
            <BlogBento />
            <PartnersStrip />
            {/* Solo dissolvenza: con un transform lo scroll verso #contact atterrerebbe spostato. */}
            <Reveal y={0}>
              <ContactForm />
            </Reveal>
            <FinalCta />
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </IntroContext.Provider>
    </MotionConfig>
  );
};

export default Anteprima;
