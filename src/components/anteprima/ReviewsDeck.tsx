import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion, type PanInfo, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { GOOGLE_PUBLIC_REVIEW_COUNT } from "@/constants/googleBusiness";
import { cn } from "@/lib/utils";
import { PREVIEW_REVIEWS, type PreviewReview } from "./data";
import { HEADING_2, Reveal, RoundButton, SplitWords } from "./primitives";

const AUTOPLAY_MS = 6000;
const SWIPE_THRESHOLD = 110;

const topCardVariants: Variants = {
  enter: { opacity: 0.7, scale: 0.95, y: 16, rotate: 2.5, x: 0, zIndex: 2 },
  center: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotate: 0,
    x: 0,
    zIndex: 2,
    transition: { type: "spring", stiffness: 260, damping: 26 },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -360 : 360,
    rotate: direction > 0 ? -14 : 14,
    zIndex: 3,
    transition: { duration: 0.38, ease: [0.4, 0, 1, 1] },
  }),
};

function Stars({ rating, animated = false }: { rating: number; animated?: boolean }) {
  return (
    <span className="flex">
      {Array.from({ length: 5 }).map((_, index) => {
        const star = (
          <Star
            className={cn("h-4 w-4", index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300")}
          />
        );
        return animated ? (
          <motion.span
            key={index}
            className="flex"
            initial={{ scale: 0, rotate: -60 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            transition={{ type: "spring", stiffness: 500, damping: 16, delay: 0.3 + index * 0.08 }}
          >
            {star}
          </motion.span>
        ) : (
          <span key={index} className="flex">
            {star}
          </span>
        );
      })}
    </span>
  );
}

function GoogleMark() {
  return (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function ReviewCard({ review, footer }: { review: PreviewReview; footer: string }) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-brand-blue/[0.07] md:p-8">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-blue text-lg font-bold text-white">
          {review.author.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="break-words font-semibold leading-snug text-brand-blue">{review.author}</h3>
          <p className="text-sm text-brand-gray">{review.date}</p>
        </div>
        <Quote aria-hidden className="h-9 w-9 shrink-0 text-brand-accent/20" />
      </div>
      <Stars rating={review.rating} />
      <p className="mt-4 line-clamp-6 flex-grow text-base leading-relaxed text-brand-gray md:text-lg">"{review.text}"</p>
      <div className="mt-6 flex items-center border-t border-gray-100 pt-4 text-sm text-brand-gray">
        <GoogleMark />
        {footer}
      </div>
    </article>
  );
}

export default function ReviewsDeck() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const total = PREVIEW_REVIEWS.length;
  const [[index, direction], setPage] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const deckRef = useRef<HTMLDivElement>(null);
  const inView = useInView(deckRef, { margin: "-15% 0px -15% 0px" });
  const autoplay = !reduce && !interacted;

  const paginate = useCallback(
    (step: number) => setPage(([current]) => [(current + step + total) % total, step]),
    [total]
  );

  const step = (delta: number) => {
    setInteracted(true);
    paginate(delta);
  };

  const goTo = (target: number) => {
    setInteracted(true);
    setPage(([current]) => [target, target >= current ? 1 : -1]);
  };

  useEffect(() => {
    if (!autoplay || paused || !inView) return;
    const timer = window.setTimeout(() => paginate(1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [autoplay, index, inView, paginate, paused]);

  const onDragEnd = (_event: unknown, info: PanInfo) => {
    const swipe = info.offset.x + info.velocity.x * 0.25;
    if (swipe < -SWIPE_THRESHOLD) step(1);
    else if (swipe > SWIPE_THRESHOLD) step(-1);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
  };

  const footer = t("reviews.googleReview");
  const current = PREVIEW_REVIEWS[index];
  const counter = (
    <div className="flex items-center gap-3 text-sm font-semibold tabular-nums text-brand-blue">
      <span>{String(index + 1).padStart(2, "0")}</span>
      <span className="relative h-0.5 w-20 overflow-hidden rounded-full bg-brand-blue/10 md:w-24">
        <motion.span
          className="absolute inset-y-0 left-0 rounded-full bg-brand-accent"
          initial={false}
          animate={{ width: `${((index + 1) / total) * 100}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        />
      </span>
      <span className="text-brand-gray">{String(total).padStart(2, "0")}</span>
    </div>
  );
  const controls = (
    <>
      <RoundButton
        onClick={() => step(-1)}
        aria-label={t("common.previous")}
        className="border border-brand-blue/15 bg-white text-brand-blue shadow-sm hover:border-brand-accent hover:text-brand-accent"
      >
        <ChevronLeft className="h-5 w-5" />
      </RoundButton>
      <RoundButton
        onClick={() => step(1)}
        aria-label={t("common.next")}
        className="bg-brand-blue text-white shadow-lg shadow-brand-blue/20 hover:bg-brand-accent"
      >
        <ChevronRight className="h-5 w-5" />
      </RoundButton>
    </>
  );

  return (
    <section className="relative overflow-hidden bg-gray-50 py-16 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(61,157,255,0.12),transparent_70%)]"
      />
      <div className="container-custom relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="text-center lg:text-left">
          <h2 className={cn(HEADING_2, "mb-5 text-brand-blue")}>
            <SplitWords text={t("reviews.title")} />
          </h2>
          <Reveal delay={0.1} className="mb-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 lg:justify-start">
            <Stars rating={5} animated />
            <span className="text-lg font-semibold text-brand-gray">5.0 {t("reviews.ratingLabel")}</span>
            <span className="text-base font-medium text-brand-gray max-sm:basis-full">
              <span aria-hidden className="max-sm:hidden">· </span>
              {t("reviews.totalOnGoogle", { count: GOOGLE_PUBLIC_REVIEW_COUNT })}
            </span>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="body-text mx-auto max-w-xl lg:mx-0">{t("reviews.description")}</p>
          </Reveal>
          <Reveal delay={0.3} className="mt-8 hidden items-center gap-3 lg:flex">
            {controls}
            <div className="ml-3">{counter}</div>
          </Reveal>
        </div>

        <Reveal x={40} y={0} delay={0.15}>
          <div
            ref={deckRef}
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label={t("reviews.title")}
            aria-live={autoplay ? "off" : "polite"}
            onKeyDown={onKeyDown}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setPaused(true);
            }}
            onPointerLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="relative mx-auto grid max-w-xl grid-cols-1 cursor-grab select-none rounded-3xl pb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-4 active:cursor-grabbing lg:max-w-none"
          >
            {PREVIEW_REVIEWS.map((review) => (
              <div key={review.id} aria-hidden className="invisible col-start-1 row-start-1">
                <ReviewCard review={review} footer={footer} />
              </div>
            ))}
            {[2, 1].map((depth) => {
              const review = PREVIEW_REVIEWS[(index + depth) % total];
              return (
                <motion.div
                  key={review.id}
                  aria-hidden
                  className="pointer-events-none col-start-1 row-start-1"
                  initial={false}
                  animate={{
                    opacity: depth === 1 ? 0.7 : 0.35,
                    scale: 1 - depth * 0.05,
                    y: depth * 16,
                    rotate: depth === 1 ? 2.5 : -2.5,
                    zIndex: 2 - depth,
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 28 }}
                >
                  <ReviewCard review={review} footer={footer} />
                </motion.div>
              );
            })}
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={current.id}
                className="col-start-1 row-start-1"
                custom={direction}
                variants={topCardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.85}
                onDragStart={() => setInteracted(true)}
                onDragEnd={onDragEnd}
              >
                <ReviewCard review={current} footer={footer} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {PREVIEW_REVIEWS.map((review, dotIndex) => (
              <button
                key={review.id}
                type="button"
                onClick={() => goTo(dotIndex)}
                aria-label={`Vai alla recensione ${dotIndex + 1}`}
                aria-current={dotIndex === index ? "true" : undefined}
                className={cn(
                  "relative h-2 rounded-full transition-all duration-300 before:absolute before:-inset-2 before:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent",
                  dotIndex === index ? "w-8 bg-brand-blue" : "w-2 bg-gray-300 hover:bg-brand-accent/60"
                )}
              />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3 lg:hidden">
            {controls}
            <div className="ml-2">{counter}</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
