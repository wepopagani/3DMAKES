import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useGoToContact } from "./hooks";
import { PressLink } from "./primitives";
import { HERO_FILM_CHAPTERS } from "./heroFilmData";
import "./ScanFilmHero.css";

type Playback = "idle" | "loading" | "playing" | "paused" | "ended" | "error";

function ChapterPlayer({ slug }: { slug: string }) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playback, setPlayback] = useState<Playback>("idle");
  const [showVideo, setShowVideo] = useState(false);
  const playing = playback === "loading" || playback === "playing";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onVisibilityChange = () => {
      if (document.hidden) video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.pause();
    });
    observer.observe(video);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      video.pause();
      if (video.hasAttribute("src")) {
        video.removeAttribute("src");
        video.load();
      }
    };
  }, []);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.pause();
      return;
    }

    if (playback === "ended") video.currentTime = 0;
    if (!video.hasAttribute("src") || playback === "error") {
      video.src = `/media/hero/playback/${slug}.mp4`;
    }
    setPlayback("loading");
    try {
      await video.play();
    } catch (error) {
      if (videoRef.current !== video || (error instanceof DOMException && error.name === "AbortError")) return;
      setPlayback("error");
      setShowVideo(false);
    }
  };

  const label = playing ? "pause" : playback === "ended" ? "replay" : playback === "error" ? "retry" : "play";
  const Icon = playing ? Pause : playback === "ended" || playback === "error" ? RotateCcw : Play;

  return (
    <div className="process-film-player">
      <img src={`/media/hero/${slug}-poster.jpg`} alt="" width={1916} height={1080} decoding="async" />
      <video
        ref={videoRef}
        aria-hidden="true"
        muted
        playsInline
        preload="none"
        className={showVideo ? "is-visible" : undefined}
        onPlaying={() => {
          setPlayback("playing");
          setShowVideo(true);
        }}
        onPause={(event) => {
          if (!event.currentTarget.ended) setPlayback((state) => state === "error" ? state : "paused");
        }}
        onEnded={() => setPlayback("ended")}
        onError={() => {
          setPlayback("error");
          setShowVideo(false);
        }}
      />
      <button type="button" className="process-film-toggle" onClick={() => void togglePlayback()}>
        <Icon aria-hidden size={16} />
        {t(`hero.lab.playback.${label}`)}
      </button>
    </div>
  );
}

export default function ScanFilmHero() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const goToContact = useGoToContact();
  const chapter = HERO_FILM_CHAPTERS[active];
  const copyKey = `hero.lab.chapters.${chapter.chapter}`;

  return (
    <section className="process-film" aria-labelledby="process-film-heading">
      <div className="container-custom process-film-layout">
        <div className="process-film-intro">
          <h1 id="process-film-heading">
            {t("hero.lab.line1")}{" "}<span>{t("hero.lab.line2")}</span>
          </h1>
          <p>{t("hero.lab.subtitle")}</p>
        </div>

        <div className="process-film-visual">
          <ChapterPlayer key={chapter.slug} slug={chapter.slug} />
          <div className="process-film-chapters" role="group" aria-label={t("hero.lab.technologies")}>
            {HERO_FILM_CHAPTERS.map((item, index) => (
              <button
                key={item.slug}
                type="button"
                aria-pressed={index === active}
                aria-controls="process-film-caption"
                onClick={() => setActive(index)}
              >
                {t(`hero.lab.phases.${item.label}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="process-film-details">
          <div className="process-film-caption" id="process-film-caption" aria-live="polite" aria-atomic="true">
            <h2>{chapter.chapter === "cnc" ? t("hero.lab.cncAlternative") : t(`${copyKey}.title`)}</h2>
            <p>{t(`${copyKey}.body`)}</p>
          </div>
          <div className="process-film-actions">
            <Link className="process-film-service" to={`/services/${chapter.service}`}>
              {t("common.discoverMore")}
              <ArrowUpRight aria-hidden size={16} />
            </Link>
            <PressLink
              to="/#contact"
              variant="accent"
              size="lg"
              arrow
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                event.preventDefault();
                goToContact();
              }}
            >
              {t("hero.lab.primary")}
            </PressLink>
          </div>
        </div>
      </div>
    </section>
  );
}
