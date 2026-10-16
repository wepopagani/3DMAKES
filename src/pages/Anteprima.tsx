import { useRef } from "react";
import { MotionConfig } from "framer-motion";
import { useTranslation } from "react-i18next";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BlogBento from "@/components/anteprima/BlogBento";
import { FinalCta } from "@/components/anteprima/CtaPanels";
import { FaqSection, HowWeHelpSection } from "@/components/anteprima/HelpAndFaq";
import { IntroContext, usePageUncovered, usePreviewHead } from "@/components/anteprima/hooks";
import { AboutSection, BannerSection, HeroSection } from "@/components/anteprima/IntroSections";
import { MissionSection, TonySection } from "@/components/anteprima/MissionAndTony";
import ModelSearch from "@/components/anteprima/ModelSearch";
import PartnersStrip from "@/components/anteprima/PartnersStrip";
import PreviewNavbar from "@/components/anteprima/PreviewNavbar";
import { Reveal } from "@/components/anteprima/primitives";
import ReviewsDeck from "@/components/anteprima/ReviewsDeck";
import ServicesExplorer from "@/components/anteprima/ServicesExplorer";

/** Anteprima del restyling della homepage: stessi contenuti di Index, nuova resa grafica. */
const Anteprima = () => {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);
  const uncovered = usePageUncovered(rootRef);
  usePreviewHead(`Anteprima · ${t("seo.homeTitle")}`);

  return (
    <MotionConfig reducedMotion="user">
      <IntroContext.Provider value={uncovered}>
        <div ref={rootRef} className="flex min-h-screen flex-col bg-white">
          <PreviewNavbar />
          <main className="flex-grow">
            <BannerSection />
            <HeroSection />
            <AboutSection />
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
