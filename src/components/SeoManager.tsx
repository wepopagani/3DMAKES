import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getBlogPosts } from "@/data/blogContent";

const CANONICAL_BASE_URL = "https://3dmakes.ch";

/**
 * SPA SEO helper:
 * aggiorna canonical/og:url quando ci troviamo sulle pagine del blog.
 *
 * Nota: in un'app SPA l'HTML iniziale è sempre quello di `index.html`;
 * quindi questa correzione viene fatta via JS al cambio route.
 */
export default function SeoManager() {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const pathname = location.pathname;
    const isBlogRoute = pathname === "/blog" || pathname.startsWith("/blog/");

    const canonicalUrl = `${CANONICAL_BASE_URL}${pathname}`;

    const canonicalLinks = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]'));

    // Se per qualche motivo ne esistono più di una, aggiorniamo tutte e ne lasciamo solo una.
    canonicalLinks.forEach((link) => {
      link.href = canonicalUrl;
    });
    if (canonicalLinks.length > 1) {
      canonicalLinks.slice(1).forEach((link) => link.remove());
    }

    const ogUrlMeta = document.querySelector<HTMLMetaElement>(
      'meta[property="og:url"]'
    );
    if (ogUrlMeta) ogUrlMeta.content = canonicalUrl;

    const ensureMetaTag = (selector: string, create: () => HTMLElement) => {
      const existing = document.querySelector(selector);
      if (existing) return existing as HTMLElement;
      const el = create();
      document.head.appendChild(el);
      return el;
    };

    const setMetaContent = (selector: string, content: string, create?: () => HTMLElement) => {
      const el = create ? ensureMetaTag(selector, create) : (document.querySelector(selector) as HTMLElement | null);
      if (!el) return;
      if (el instanceof HTMLMetaElement) el.content = content;
    };

    const setDescription = (content: string) => {
      setMetaContent('meta[name="description"]', content, () => {
        const m = document.createElement("meta");
        m.name = "description";
        return m;
      });
    };

    const setOgTitle = (content: string) => {
      setMetaContent('meta[property="og:title"]', content, () => {
        const m = document.createElement("meta");
        m.setAttribute("property", "og:title");
        return m;
      });
    };

    const setOgDescription = (content: string) => {
      setMetaContent('meta[property="og:description"]', content, () => {
        const m = document.createElement("meta");
        m.setAttribute("property", "og:description");
        return m;
      });
    };

    const setTwitterTitle = (content: string) => {
      setMetaContent('meta[name="twitter:title"]', content, () => {
        const m = document.createElement("meta");
        m.name = "twitter:title";
        return m;
      });
    };

    const setTwitterDescription = (content: string) => {
      setMetaContent('meta[name="twitter:description"]', content, () => {
        const m = document.createElement("meta");
        m.name = "twitter:description";
        return m;
      });
    };

    const setAll = (title: string, description: string) => {
      document.title = title;
      setDescription(description);
      setOgTitle(title);
      setOgDescription(description);
      setTwitterTitle(title);
      setTwitterDescription(description);
    };

    const upsertJsonLd = (scriptId: string, json: unknown) => {
      const jsonStr = JSON.stringify(json);
      const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (existing) {
        existing.textContent = jsonStr;
        return;
      }
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      script.textContent = jsonStr;
      document.head.appendChild(script);
    };

    const removeJsonLd = (scriptId: string) => {
      const existing = document.getElementById(scriptId);
      existing?.remove();
    };

    const isServicesRoute = pathname === "/services" || pathname.startsWith("/services/");

    if (isServicesRoute) {
      const serviceDefs: Array<{
        translationKey: string;
        slug: string;
        serviceType: string;
      }> = [
        { translationKey: "fdm", slug: "fdm", serviceType: "3D Printing" },
        { translationKey: "cff", slug: "cff", serviceType: "3D Printing" },
        { translationKey: "sla", slug: "sla", serviceType: "3D Printing" },
        { translationKey: "polyjet", slug: "polyjet", serviceType: "3D Printing" },
        { translationKey: "laser", slug: "laser", serviceType: "Laser Cutting" },
        { translationKey: "largePrint", slug: "riparazione-stampanti", serviceType: "3D Printing Repair" },
        { translationKey: "scanning", slug: "scansione", serviceType: "3D Scanning" },
        { translationKey: "prototyping", slug: "prototipazione", serviceType: "Rapid Prototyping" },
        { translationKey: "lsam", slug: "lsam", serviceType: "3D Printing" },
        { translationKey: "mjf", slug: "mjf", serviceType: "3D Printing" },
        { translationKey: "slm", slug: "slm", serviceType: "3D Printing" },
        { translationKey: "sls", slug: "sls", serviceType: "3D Printing" },
      ];

      const serviceGraph = serviceDefs
        .map((def) => {
          const title = t(`services.${def.translationKey}.title`);
          const description = t(`services.${def.translationKey}.description`);

          if (!title || !description || title === `services.${def.translationKey}.title`) return null;

          const serviceUrl = `${CANONICAL_BASE_URL}/services/${def.slug}`;

          return {
            "@type": "Service",
            "@id": `${serviceUrl}#service`,
            name: title,
            description,
            serviceType: def.serviceType,
            provider: {
              "@type": "Organization",
              name: "3DMAKES",
            },
            areaServed: ["Lugano", "Ticino"],
          };
        })
        .filter(Boolean);

      upsertJsonLd("service-schema-jsonld", {
        "@context": "https://schema.org",
        "@graph": serviceGraph,
      });
    } else {
      removeJsonLd("service-schema-jsonld");
    }

    // --- Route-based Title/Description ---
    if (pathname.startsWith("/services/")) {
      const serviceId = pathname.split("/")[2] ?? "";

      const resolveServiceKey = () => {
        // Alias per supportare gli URL “puliti” usati nelle nuove pagine:
        // /services/laser => services.laser.*
        // /services/riparazione-stampanti => services.largePrint.*
        if (serviceId === "laser") return "laser";
        if (serviceId === "incisione-laser") return "laser";
        if (serviceId === "riparazione-stampanti") return "largePrint";
        if (serviceId === "riparazione-stampanti-3d") return "largePrint";
        if (serviceId === "prototipazione") return "prototyping";
        if (serviceId === "scansione") return "scanning";
        return serviceId;
      };

      const key = resolveServiceKey();

      const title = t(`services.${key}.title`);
      const description = t(`services.${key}.description`);

      if (title && description) {
        setAll(`${title} | 3DMAKES Lugano`, description);
        return;
      }
    }

    if (pathname === "/services") {
      setAll(
        "Servizi Stampa 3D | FDM, SLA, Scansione, Laser | 3DMAKES Lugano",
        "Servizi di stampa 3D professionale: FDM, SLA, scansione 3D, taglio/incisione laser e prototipazione rapida a Lugano (Ticino) e Lombardia."
      );
      return;
    }

    if (pathname === "/about") {
      setAll(
        `Chi Siamo | 3DMAKES Lugano`,
        "Scopri 3DMAKES: il team, la mission e l’esperienza nella stampa 3D professionale, prototipazione rapida e produzione di qualità."
      );
      return;
    }

    if (pathname === "/blog") {
      setAll(
        `${t("blog.title")} | 3DMAKES`,
        `${t("blog.subtitle")}`
      );
      return;
    }

    if (pathname.startsWith("/blog/")) {
      const id = pathname.split("/")[2] ?? "";
      const posts = getBlogPosts();
      const post = posts.find((p) => p.id === id);
      if (post) {
        setAll(`${post.title} | Blog 3DMAKES`, post.excerpt);
      } else {
        setAll(`${t("blog.title")} | 3DMAKES`, `${t("blog.subtitle")}`);
      }
      return;
    }

    if (pathname === "/") {
      setAll(
        "3DMAKES | Servizi di Stampa 3D Professionale a Lugano, Ticino e Lombardia",
        "Servizi di stampa 3D di alta qualità a Lugano, Ticino e Lombardia. Prototipazione rapida, modellazione 3D e produzione con tecnologie FDM e SLA."
      );
      return;
    }
  }, [location.pathname, i18n.language, t]);

  return null;
}

