import { createContext, useCallback, useContext, useEffect, useState, type RefObject } from "react";
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

/**
 * Diventa true quando il centro della viewport mostra davvero la pagina:
 * all'apertura diretta lo splash del logo copre tutto per ~2 secondi e le
 * animazioni d'ingresso partirebbero senza che nessuno le veda.
 */
export function usePageUncovered(ref: RefObject<HTMLElement>, maxWaitMs = 3500) {
  const [uncovered, setUncovered] = useState(false);

  useEffect(() => {
    const startedAt = performance.now();
    const check = () => {
      const probe = document.elementFromPoint(
        window.innerWidth / 2,
        Math.min(window.innerHeight / 2, 240)
      );
      const visible = probe !== null && ref.current?.contains(probe);
      if (visible || performance.now() - startedAt > maxWaitMs) {
        setUncovered(true);
        return true;
      }
      return false;
    };
    if (check()) return;
    const timer = window.setInterval(() => {
      if (check()) window.clearInterval(timer);
    }, 100);
    return () => window.clearInterval(timer);
  }, [ref, maxWaitMs]);

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

/** La pagina di anteprima non deve finire nei motori di ricerca. */
export function usePreviewHead(title: string) {
  useEffect(() => {
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const created = !robots;
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    const previousRobots = robots.content;
    robots.content = "noindex,nofollow";
    document.title = title;

    return () => {
      if (created) robots?.remove();
      else if (robots) robots.content = previousRobots;
    };
  }, [title]);
}
