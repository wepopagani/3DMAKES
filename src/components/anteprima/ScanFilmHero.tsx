import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useGoToContact, useMediaQuery } from "./hooks";
import { PressLink } from "./primitives";
import ScanFilm from "./ScanFilm";
import { HERO_FILM_CHAPTERS } from "./heroFilmData";
import "./ScanFilm.css";

const SERVICES = ["scansione", "progettazione", "fdm", "cnc", "laser"];
const LABELS = ["Scansione 3D", "Progettazione CAD", "Stampa 3D", "Fresatura CNC", "Marcatura laser"];

/** Full production story. CNC is introduced as an alternative to the printed route. */
export default function ScanFilmHero() {
  const { t } = useTranslation();
  const reduce = Boolean(useReducedMotion());
  const desktop = useMediaQuery("(min-width: 1024px)");
  const scrollDriven = desktop && !reduce;
  const track = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [active, setActive] = useState(0);
  const goToContact = useGoToContact();
  const onTimeChange = useCallback((seconds: number) => {
    let next = 0;
    HERO_FILM_CHAPTERS.forEach((chapter, index) => { if (seconds >= chapter.start + (index === 3 ? .325 : index > 0 ? .175 : 0)) next = index; });
    setActive(current => current === next ? current : next);
  }, []);
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
      progress.current = Math.max(0, Math.min(1, (p - .025) / .93));
      frame = 0;
    };
    const update = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [scrollDriven]);
  const chapter = HERO_FILM_CHAPTERS[active];
  return <section ref={track} className={`scan-film-hero ${scrollDriven ? "is-scroll-driven" : ""}`}>
    <div className="scan-film-stage"><div className="container-custom scan-film-layout">
      <div className="scan-film-copy"><p className="scan-film-eyebrow">{t("hero.lab.chapters." + chapter.chapter + ".eyebrow")}</p>
        <h1>{t("hero.lab.line1")}<span>{t("hero.lab.line2")}</span></h1>
        <div className="scan-film-chapter-copy" aria-live="off">
          <h2>{active === 3 ? "Un’alternativa: lavorato dal pieno." : t("hero.lab.chapters." + chapter.chapter + ".title")}</h2>
          <p className="scan-film-subtitle">{t("hero.lab.chapters." + chapter.chapter + ".body")}</p>
        </div>
        <PressLink to="/#contact" variant="accent" size="lg" arrow onClick={event => { event.preventDefault(); goToContact(); }}>{t("hero.lab.primary")}</PressLink>
        <Link className="scan-film-link" to={`/services/${SERVICES[active]}?motion=video`}>{LABELS[active]} ↗</Link>
      </div>
      <div className="scan-film-visual"><ScanFilm key={scrollDriven ? "scroll" : "once"} mode={scrollDriven ? "scrub" : "once"} media="/media/hero/full-journey" progressRef={progress} onTimeChange={onTimeChange} alt="Dall’oggetto alla scansione e al CAD: stampa 3D oppure fresatura CNC, seguita da marcatura laser" />
        <div className="scan-film-chapters" aria-label="Capitoli del processo">{LABELS.map((label, index) => <Link key={label} to={`/services/${SERVICES[index]}?motion=video`} aria-current={index === active ? "step" : undefined}><span>0{index + 1}</span>{label}</Link>)}</div>
        <p className="scan-film-route-note">{active === 3 ? "PERCORSO ALTERNATIVO ALLA STAMPA 3D" : active === 4 ? "PERSONALIZZAZIONE DEL PEZZO METALLICO" : "DALL’OGGETTO AL MODELLO, DAL MODELLO ALLA PRODUZIONE"}</p>
      </div>
    </div>{scrollDriven && <div className="scan-film-scroll">SCORRI PER ESPLORARE LE TECNOLOGIE <span>↓</span></div>}</div>
  </section>;
}
