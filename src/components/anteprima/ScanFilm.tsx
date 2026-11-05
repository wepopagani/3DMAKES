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
  const played = useRef(false);
  const visible = useRef(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [inView, setInView] = useState(false);
  const pause = useCallback(() => { video.current?.pause(); setPlaying(false); }, []);
  const play = useCallback(async () => {
    const element = video.current;
    if (!element || failed) return;
    try {
      if (element.ended) element.currentTime = 0;
      await element.play();
      setPlaying(true); setEnded(false); played.current = true;
    } catch { setPlaying(false); }
  }, [failed]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      if (entry.isIntersecting) setInView(true);
      else pause();
    }, { threshold: .2, rootMargin: "80px" });
    if (root.current) observer.observe(root.current);
    const hide = () => { if (document.hidden) pause(); };
    document.addEventListener("visibilitychange", hide);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", hide); };
  }, [pause]);
  useEffect(() => {
    if (mode === "once" && ready && inView && visible.current && !reduce && !played.current && !document.hidden) void play();
  }, [ready, mode, reduce, play, inView]);
  useEffect(() => { if (reduce) pause(); }, [reduce, pause]);
  useEffect(() => {
    if (mode !== "scrub" || !ready || reduce || failed) return;
    const element = video.current;
    if (!element) return;
    let frame = 0;
    const tick = () => {
      if (visible.current && !document.hidden && !element.seeking) {
        const progress = Math.max(0, Math.min(1, progressRef?.current ?? 0));
        const target = progress * Math.max(0, element.duration - .05);
        if (Math.abs(element.currentTime - target) > .025) element.currentTime = target;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [mode, ready, reduce, progressRef, failed]);

  return <div ref={root} className={`scan-film ${mode === "scrub" ? "scan-film--scrub" : ""}`}>
    <img src={`${media}-poster.jpg`} alt={alt} width={1916} height={1080} className="scan-film-poster" />
    <video ref={video} src={!reduce && inView && !failed ? `${media}.mp4` : undefined} muted playsInline preload="auto" aria-hidden="true" tabIndex={-1}
      className={ready && !failed && !reduce ? "scan-film-video is-ready" : "scan-film-video"}
      onLoadedData={() => setReady(true)} onError={() => { setFailed(true); pause(); }}
      onTimeUpdate={event => onTimeChange?.(event.currentTarget.currentTime)}
      onEnded={() => { setPlaying(false); setEnded(true); }} />
    {mode === "once" && !reduce && !failed && <button type="button" className="scan-film-control" onClick={() => playing ? pause() : void play()} aria-label={playing ? "Metti in pausa il video" : ended ? "Riguarda la trasformazione" : "Riproduci il video"}>
      {playing ? <Pause size={14} /> : ended ? <RotateCcw size={14} /> : <Play size={14} />}<span>{playing ? "Pausa" : ended ? "Riguarda" : "Riproduci"}</span>
    </button>}
  </div>;
}
