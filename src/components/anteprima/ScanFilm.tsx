import { useCallback, useEffect, useRef, useState, type MutableRefObject } from "react";
import { useReducedMotion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";
import "./ScanFilm.css";

const DEFAULT_MEDIA = "/media/hero/object-to-scan";
/** One approved clip. Scrub mode follows a normalized playhead; once mode holds its last frame. */
export default function ScanFilm({ progressRef, mode = "once", media = DEFAULT_MEDIA, alt = "Un componente metallico viene digitalizzato in una nuvola di punti blu", onTimeChange }: {
  media?: string;
  alt?: string;
  onTimeChange?: (seconds: number) => void;
  progressRef?: MutableRefObject<number>;
  mode?: "scrub" | "once";
}) {
  const reduce = Boolean(useReducedMotion());
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [ready, setReady] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [inView, setInView] = useState(false);
  const [loadMedia, setLoadMedia] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const pause = useCallback(() => { video.current?.pause(); setPlaying(false); }, []);
  const play = useCallback(async () => {
    const element = video.current;
    if (!element || failed) return;
    try {
      if (element.ended) element.currentTime = 0;
      await element.play();
      setEnded(false);
    } catch { setPlaying(false); }
  }, [failed]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting) setLoadMedia(true);
    }, { threshold: .2, rootMargin: "80px" });
    if (root.current) observer.observe(root.current);
    const updateVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", updateVisibility); };
  }, []);
  useEffect(() => {
    if (!inView || !pageVisible || reduce) {
      pause();
      return;
    }
    if (mode === "once" && ready && !userPaused.current && !ended) void play();
  }, [ready, mode, reduce, play, pause, inView, pageVisible, ended]);
  useEffect(() => {
    if (mode !== "scrub" || !ready || reduce || failed || !inView || !pageVisible) return;
    const element = video.current;
    if (!element) return;
    let frame = 0;
    const tick = () => {
      if (!element.seeking) {
        const progress = Math.max(0, Math.min(1, progressRef?.current ?? 0));
        const target = progress * Math.max(0, element.duration - .05);
        if (Math.abs(element.currentTime - target) > .025) element.currentTime = target;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [mode, ready, reduce, progressRef, failed, inView, pageVisible]);

  const togglePlayback = () => {
    userPaused.current = playing;
    if (playing) pause();
    else void play();
  };

  return <div ref={root} className={`scan-film ${mode === "scrub" ? "scan-film--scrub" : ""}`}>
    <img src={`${media}-poster.jpg`} alt={alt} width={1916} height={1080} decoding="async" className="scan-film-poster" />
    <video ref={video} src={!reduce && loadMedia && !failed ? `${media}.mp4` : undefined} muted playsInline preload="metadata" aria-hidden="true" tabIndex={-1}
      className={hasFrame && !failed && !reduce ? "scan-film-video is-ready" : "scan-film-video"}
      onLoadedMetadata={() => setReady(true)} onLoadedData={() => setHasFrame(true)}
      onError={() => { setFailed(true); pause(); }}
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
      onTimeUpdate={event => onTimeChange?.(event.currentTarget.currentTime)}
      onEnded={() => { setPlaying(false); setEnded(true); }} />
    {mode === "once" && !reduce && !failed && <button type="button" className="scan-film-control" onClick={togglePlayback} aria-label={playing ? "Metti in pausa il video" : ended ? "Riguarda la trasformazione" : "Riproduci il video"}>
      {playing ? <Pause size={14} /> : ended ? <RotateCcw size={14} /> : <Play size={14} />}<span>{playing ? "Pausa" : ended ? "Riguarda" : "Riproduci"}</span>
    </button>}
  </div>;
}
