import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useGoToContact, useMediaQuery } from "./hooks";
import { PressLink } from "./primitives";
import ScanFilm from "./ScanFilm";
import "./ScanFilm.css";

export default function ScanFilmHero() {
  const { t } = useTranslation();
  const reduce = Boolean(useReducedMotion());
  const desktop = useMediaQuery("(min-width: 1024px)");
  const scrollDriven = desktop && !reduce;
  const track = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [digital, setDigital] = useState(false);
  const goToContact = useGoToContact();
  useEffect(() => {
    if (!scrollDriven) return;
    const element = track.current;
    if (!element) return;
    let frame = 0;
    const measure = () => {
      const stage = element.firstElementChild as HTMLElement;
      const header = document.querySelector("header")?.getBoundingClientRect().height ?? 72;
      const travel = Math.max(1, element.offsetHeight - stage.offsetHeight);
      const p = Math.max(0, Math.min(1, (header - element.getBoundingClientRect().top) / travel));
      // Leave a short rest at the start and end so both states can be read.
      progress.current = Math.max(0, Math.min(1, (p - .08) / .78));
      setDigital(progress.current > .62);
      frame = 0;
    };
    const update = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [scrollDriven]);
  return <section ref={track} className={`scan-film-hero ${scrollDriven ? "is-scroll-driven" : ""}`}>
    <div className="scan-film-stage"><div className="container-custom scan-film-layout">
      <div className="scan-film-copy"><p className="scan-film-eyebrow">{t("hero.lab.chapters.scan.eyebrow")}</p>
        <h1>{t("hero.lab.line1")}<span>{t("hero.lab.line2")}</span></h1>
        <p className="scan-film-subtitle">{t("hero.lab.subtitle")}</p>
        <PressLink to="/#contact" variant="accent" size="lg" arrow onClick={event => { event.preventDefault(); goToContact(); }}>{t("hero.lab.primary")}</PressLink>
        <Link className="scan-film-link" to="/services/scansione?motion=video">{t("hero.lab.modes.scan")} ↗</Link>
      </div>
      <div className="scan-film-visual"><ScanFilm key={scrollDriven ? "scroll" : "once"} mode={scrollDriven ? "scrub" : "once"} progressRef={progress} />
        <div className="scan-film-caption"><span className="scan-film-dot" /><span>{t("hero.lab.chapters.scan.title")}</span><span className="scan-film-state">{scrollDriven ? digital ? "02 / DIGITALE" : "01 / MATERIA" : "MATERIA → DIGITALE"}</span></div>
      </div>
    </div>{scrollDriven && <div className="scan-film-scroll">SCORRI PER DIGITALIZZARE <span>↓</span></div>}</div>
  </section>;
}
