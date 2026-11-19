import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReducedMotion } from "framer-motion";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}

export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");

/** Avvia gli ingressi quando il sipario iniziale ha scoperto la pagina. */
export function usePageUncovered() {
  const [uncovered, setUncovered] = useState(
    () => !document.documentElement.hasAttribute("data-site-intro")
  );

  useEffect(() => {
    const reveal = () => setUncovered(true);
    window.addEventListener("3dmakes:intro-complete", reveal);
    if (!document.documentElement.hasAttribute("data-site-intro")) reveal();
    return () => window.removeEventListener("3dmakes:intro-complete", reveal);
  }, []);

  return uncovered;
}

export const IntroContext = createContext(true);
export const useIntroReady = () => useContext(IntroContext);

/** Scorre fino all'elemento lasciando libera l'altezza della navbar sticky. */
export function scrollToElement(element: HTMLElement, reduce: boolean) {
  const header = document.querySelector("header");
  const offset = (header?.getBoundingClientRect().height ?? 72) + 8;
  const top = element.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: reduce ? "instant" : "smooth" });
}

/**
 * Porta al modulo contatti. Le pagine interne non lo contengono: si apre la
 * homepage e si scorre appena il modulo esiste, con una correzione finale
 * perché le immagini sopra possono ancora spostarlo.
 */
export function useGoToContact() {
  const navigate = useNavigate();
  const reduce = Boolean(useReducedMotion());

  return useCallback(() => {
    const here = document.getElementById("contact");
    if (here) {
      scrollToElement(here, reduce);
      return;
    }
    navigate("/#contact");
    const startedAt = performance.now();
    const timer = window.setInterval(() => {
      const section = document.getElementById("contact");
      if (!section) {
        if (performance.now() - startedAt > 6000) window.clearInterval(timer);
        return;
      }
      window.clearInterval(timer);
      scrollToElement(section, reduce);
      window.setTimeout(() => {
        const header = document.querySelector("header");
        const drift = section.getBoundingClientRect().top - ((header?.getBoundingClientRect().height ?? 72) + 8);
        if (Math.abs(drift) > 48) scrollToElement(section, reduce);
      }, 1000);
    }, 100);
  }, [navigate, reduce]);
}
