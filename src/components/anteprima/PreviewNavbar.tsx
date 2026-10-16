import { useEffect, useState, type MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  type Variants,
} from "framer-motion";
import { ArrowRight, Menu, User, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/firebase/AuthContext";
import LanguageSelector from "@/components/LanguageSelector";
import { cn } from "@/lib/utils";
import { useGoToContact, useMediaQuery } from "./hooks";
import { PressLink } from "./primitives";

const menuItemVariants: Variants = {
  hidden: { opacity: 0, x: -14 },
  shown: { opacity: 1, x: 0, transition: { duration: 0.28, ease: "easeOut" } },
};

const PreviewNavbar = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const reduce = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const { pathname } = useLocation();
  const goToContactSection = useGoToContact();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const { scrollY, scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 160, damping: 30, restDelta: 0.001 });

  useMotionValueEvent(scrollY, "change", (latest) => setScrolled(latest > 12));

  useEffect(() => {
    if (isDesktop) setOpen(false);
  }, [isDesktop]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const clientAreaPath = currentUser ? "/dashboard" : "/login";

  // Stesse voci della Navbar pubblica: Mission solo nel menu mobile.
  const desktopItems = [
    { name: t("nav.about"), to: "/about" },
    { name: t("nav.services"), to: "/services" },
    { name: t("nav.faq"), to: "/faq" },
    { name: t("nav.blog"), to: "/blog" },
    { name: t("nav.courses"), to: "/iscrizione-corsi" },
  ];
  const mobileItems = [
    { name: t("nav.about"), to: "/about" },
    { name: t("nav.mission"), to: "/mission" },
    { name: t("nav.services"), to: "/services" },
    { name: t("nav.faq"), to: "/faq" },
    { name: t("nav.blog"), to: "/blog" },
    { name: t("nav.courses"), to: "/iscrizione-corsi" },
  ];

  const goToContact = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setOpen(false);
    goToContactSection();
  };

  const isCurrent = (to: string) => pathname === to || pathname.startsWith(`${to}/`);

  const desktopLinkClass =
    "relative block whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium text-brand-blue transition-colors hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent xl:px-3";
  const mobileLinkClass =
    "flex items-center justify-between border-b border-brand-blue/5 py-3.5 text-lg font-semibold text-brand-blue transition-colors hover:text-brand-accent";

  const pill = (key: string) =>
    hovered === key ? (
      <motion.span
        layoutId="anteprima-nav-pill"
        className="absolute inset-0 rounded-full bg-brand-blue/[0.07]"
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
      />
    ) : null;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-[background-color,box-shadow,border-color] duration-300",
        scrolled || open
          ? "border-brand-blue/10 bg-white/90 shadow-[0_10px_30px_-18px_rgba(26,42,74,0.45)] backdrop-blur-md"
          : "border-transparent bg-[#E5DDD3]/85 backdrop-blur-sm"
      )}
    >
      <div className="container-custom flex h-16 items-center gap-4 md:h-[72px]">
        <Link to="/" className="flex shrink-0 items-center" onClick={() => setOpen(false)}>
          <motion.img
            src="/logo.png"
            alt="Logo 3DMAKES — stampa 3D professionale Lugano"
            className="h-7 w-auto max-w-[150px] object-contain md:h-9 md:max-w-[190px]"
            style={{ originX: 0 }}
            animate={{ scale: scrolled ? 0.92 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          />
        </Link>

        <nav className="hidden min-w-0 flex-1 justify-center xl:flex" onMouseLeave={() => setHovered(null)}>
          <ul className="flex items-center gap-1">
            {desktopItems.map((item) => {
              const current = isCurrent(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    aria-current={current ? "page" : undefined}
                    className={cn(desktopLinkClass, current && "text-brand-accent")}
                    onMouseEnter={() => setHovered(item.to)}
                    onFocus={() => setHovered(item.to)}
                    onBlur={() => setHovered(null)}
                  >
                    {pill(item.to)}
                    <span className="relative">{item.name}</span>
                    {current ? (
                      <span aria-hidden className="absolute inset-x-3.5 bottom-0.5 h-0.5 rounded-full bg-brand-accent" />
                    ) : null}
                  </Link>
                </li>
              );
            })}
            <li>
              <a
                href="#contact"
                className={desktopLinkClass}
                onClick={goToContact}
                onMouseEnter={() => setHovered("contact")}
                onFocus={() => setHovered("contact")}
                onBlur={() => setHovered(null)}
              >
                {pill("contact")}
                <span className="relative">{t("nav.contact")}</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="ml-auto hidden shrink-0 items-center gap-2 xl:flex">
          <LanguageSelector />
          <PressLink to="/calculator" variant="outlineDark" className="h-10 shrink-0 whitespace-nowrap px-4 text-sm">
            {t("nav.requestQuote")}
          </PressLink>
          <PressLink to={clientAreaPath} variant="primary" className="h-10 shrink-0 whitespace-nowrap px-4 text-sm">
            <User aria-hidden className="h-4 w-4" />
            {t("nav.clientArea")}
          </PressLink>
        </div>

        <div className="ml-auto flex items-center gap-2 xl:hidden">
          <div className="scale-90">
            <LanguageSelector />
          </div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.86 }}
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="anteprima-menu"
            aria-label="Menu"
            className="flex h-10 w-10 items-center justify-center rounded-full text-brand-blue transition-colors hover:bg-brand-blue/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={open ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.16 }}
                className="flex"
              >
                {open ? <X size={24} /> : <Menu size={24} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-brand-accent"
        style={{ scaleX: reduce ? scrollYProgress : smoothProgress }}
      />

      <AnimatePresence>
        {open ? (
          <motion.div
            id="anteprima-menu"
            key="menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute inset-x-0 top-full max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-brand-blue/10 bg-white shadow-xl xl:hidden"
          >
            <motion.ul
              className="container-custom py-3"
              initial="hidden"
              animate="shown"
              variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.04, delayChildren: 0.04 } } }}
            >
              {mobileItems.map((item) => (
                <motion.li key={item.to} variants={menuItemVariants}>
                  <Link
                    to={item.to}
                    aria-current={isCurrent(item.to) ? "page" : undefined}
                    className={cn(mobileLinkClass, isCurrent(item.to) && "text-brand-accent")}
                    onClick={() => setOpen(false)}
                  >
                    {item.name}
                    <ArrowRight aria-hidden className="h-4 w-4 text-brand-accent" />
                  </Link>
                </motion.li>
              ))}
              <motion.li variants={menuItemVariants}>
                <a href="#contact" className={mobileLinkClass} onClick={goToContact}>
                  {t("nav.contact")}
                  <ArrowRight aria-hidden className="h-4 w-4 text-brand-accent" />
                </a>
              </motion.li>
            </motion.ul>
            <div className="container-custom grid gap-3 pb-5 pt-1 sm:grid-cols-2">
              <PressLink to="/calculator" variant="outlineDark" onClick={() => setOpen(false)}>
                {t("nav.requestQuote")}
              </PressLink>
              <PressLink to={clientAreaPath} variant="primary" onClick={() => setOpen(false)}>
                <User aria-hidden className="h-4 w-4" />
                {t("nav.clientArea")}
              </PressLink>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
};

export default PreviewNavbar;
