export const HERO_FILM_CHAPTERS = [
  { chapter: "scan", label: "scan", slug: "object-to-scan", service: "scansione" },
  { chapter: "reverse", label: "cad", slug: "scan-to-cad", service: "progettazione" },
  { chapter: "print", label: "print", slug: "cad-to-print", service: "fdm" },
  { chapter: "cnc", label: "cnc", slug: "cnc-pocket", service: "cnc" },
  { chapter: "laser", label: "laser", slug: "laser-mark", service: "laser" },
] as const;
