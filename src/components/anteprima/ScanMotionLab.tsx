import { Component, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { Pause, Play, RotateCcw, MoveHorizontal } from "lucide-react";
import { ProcessCanvas, type ProcessInput } from "./process/ProcessCanvas";
import "./ScanMotionLab.css";

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
const STAGES = [
  { label: "Acquisisci", title: "Dall’oggetto ai punti.", description: "La scansione raccoglie la forma dell’oggetto in una nuvola di punti.", value: 18 },
  { label: "Ricostruisci", title: "I dati diventano geometria.", description: "Il reverse engineering interpreta i dati per ricostruire un modello CAD.", value: 65 },
  { label: "Verifica", title: "Un modello da sviluppare.", description: "La geometria ricostruita è la base per verifiche, modifiche e produzione.", value: 100 },
];
function updateInput(input: ProcessInput, value: number) {
  if (value < 40) { input.chapter = "scan"; input.chapterT = .06 + value / 40 * .88; }
  else if (value < 85) { input.chapter = "reverse"; input.chapterT = .35 + (value - 40) / 45 * .64; }
  else { input.chapter = "done"; input.chapterT = (value - 85) / 15; }
}
export default function ScanMotionLab({ fallbackImage }: { fallbackImage: string }) {
  const reduce = Boolean(useReducedMotion());
  const [progress, setProgress] = useState(100);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; x: number; yaw: number } | null>(null);
  const input = useRef<ProcessInput>({ hover: null, chapter: "done", chapterT: 1, reduce, ready: true, pointerX: 0, pointerY: 0, freezeMotion: true });
  const id = useId();
  const stage = progress < 40 ? 0 : progress < 85 ? 1 : 2;
  const select = (value: number) => { setPlaying(false); setProgress(value); updateInput(input.current, value); };
  useEffect(() => { input.current.reduce = reduce; if (reduce) setPlaying(false); }, [reduce]);
  useEffect(() => { updateInput(input.current, progress); }, [progress]);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (root.current) observer.observe(root.current);
    const hide = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener("visibilitychange", hide);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", hide); };
  }, []);
  useEffect(() => { if (!visible) setPlaying(false); }, [visible]);
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let previous = 0;
    let value = progress >= 100 ? 0 : progress;
    const tick = (now: number) => {
      if (previous) value = Math.min(100, value + Math.min(now - previous, 50) / 100);
      previous = now;
      updateInput(input.current, value); setProgress(value);
      if (value < 100) frame = requestAnimationFrame(tick); else setPlaying(false);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // Progress is the starting value; animation advances its own local playhead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);
  const fallback = <img src={fallbackImage} alt="Scansione 3D — anteprima statica" className="scan-lab-fallback" />;
  return <div ref={root} className="scan-lab">
    <div className="scan-lab-top"><span>3DMAKES / SCANSIONE 3D</span><span>PROVA INTERATTIVA</span></div>
    <div className="scan-lab-scene" role="group" aria-label="Modello 3D dimostrativo. Trascina orizzontalmente per ruotarlo; usa i controlli per esplorare le fasi."
      onPointerDown={event => { if (event.pointerType === "mouse" && event.button !== 0) return; setPlaying(false); drag.current = { id: event.pointerId, x: event.clientX, yaw: input.current.pointerX }; event.currentTarget.setPointerCapture(event.pointerId); }}
      onPointerMove={event => { const start = drag.current; if (!start || start.id !== event.pointerId) return; input.current.pointerX = Math.max(-4, Math.min(4, start.yaw + (event.clientX - start.x) / 100)); }}
      onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
      <SceneBoundary fallback={fallback}><ProcessCanvas inputRef={input} className="scan-lab-canvas" /></SceneBoundary>
      <span className="scan-lab-hint"><MoveHorizontal size={13} aria-hidden /> Trascina per ruotare</span>
    </div>
    <div className="scan-lab-tabs" role="group" aria-label="Fasi della scansione">
      {STAGES.map((item, index) => <button key={item.label} type="button" aria-pressed={stage === index} onClick={() => select(item.value)}><small>0{index + 1}</small>{item.label}</button>)}
    </div>
    <div className="scan-lab-copy"><h2>{STAGES[stage].title}</h2><p>{STAGES[stage].description}</p></div>
    <div className="scan-lab-controls"><button type="button" aria-label={playing ? "Metti in pausa" : "Riproduci la sequenza"} onClick={() => setPlaying(!playing)}>{playing ? <Pause size={16} /> : <Play size={16} />}</button>
      <div className="scan-lab-range"><label htmlFor={id}>Esplora il processo <span>{Math.round(progress)}%</span></label><input id={id} type="range" min={0} max={100} value={progress} onChange={event => select(Number(event.target.value))} /></div>
      <button type="button" aria-label="Ripristina vista iniziale" onClick={() => { input.current.pointerX = 0; input.current.pointerY = 0; select(100); }}><RotateCcw size={16} /></button>
    </div><p className="scan-lab-note">Dimostrazione schematica del processo, non misura o simulazione metrologica.</p>
  </div>;
}
