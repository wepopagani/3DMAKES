import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface MediaClipProps {
  src: string;
  poster: string;
  label: string;
  className?: string;
  fit?: "cover" | "contain";
}

export default function MediaClip({ src, poster, label, className, fit = "cover" }: MediaClipProps) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const playButton = useRef<HTMLButtonElement>(null);
  const transferFocus = useRef(false);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.pause();
    });
    observer.observe(video);
    const pauseWhenHidden = () => {
      if (document.hidden) video.pause();
    };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", pauseWhenHidden);
      video.pause();
      if (video.hasAttribute("src")) {
        video.removeAttribute("src");
        video.load();
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (started && transferFocus.current) {
      videoRef.current?.focus({ preventScroll: true });
      transferFocus.current = false;
    }
  }, [started]);

  const play = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (!video.hasAttribute("src")) video.src = src;
    try {
      await video.play();
      if (!video.isConnected) return;
      transferFocus.current = document.activeElement === playButton.current;
      setStarted(true);
    } catch {
      if (video.error) setFailed(true);
    }
  };

  const mediaClass = cn("absolute inset-0 h-full w-full", fit === "cover" ? "object-cover" : "object-contain");

  return (
    <div className={cn("relative isolate overflow-hidden bg-[#101c30]", className)}>
      {(!started || failed) && (
        <img src={poster} alt={label} className={mediaClass} loading="lazy" decoding="async" />
      )}
      <video
        ref={videoRef}
        className={cn(mediaClass, (!started || failed) && "invisible")}
        aria-label={label}
        tabIndex={started && !failed ? 0 : -1}
        muted
        playsInline
        preload="none"
        controls={started && !failed}
        onError={() => setFailed(true)}
      />
      {failed ? (
        <p role="status" className="absolute inset-x-3 bottom-3 rounded-lg bg-[#101c30]/90 px-3 py-2 text-sm text-white">
          {t("siteMedia.unavailable")}
        </p>
      ) : !started ? (
        <button
          ref={playButton}
          type="button"
          onClick={() => void play()}
          className="absolute inset-0 grid place-items-center bg-black/10 text-white transition-colors hover:bg-black/30 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
          aria-label={t("siteMedia.playNamed", { title: label })}
        >
          <span className="grid size-16 place-items-center rounded-full border border-white/70 bg-[#101c30]/85 shadow-lg sm:size-20">
            <Play aria-hidden size={26} className="ml-1 fill-current" />
          </span>
        </button>
      ) : null}
    </div>
  );
}
