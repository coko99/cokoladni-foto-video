"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/Logo";

const LOADER_DURATION = 2200;

const loadingLabels = [
  "Fokusiramo kadar…",
  "Palimo svetlo…",
  "Čarli proverava opremu…",
  "Učitavamo uspomene…",
  "Podešavamo ekspoziciju…",
  "Tražimo savršen ugao…",
  "Hvatamo trenutak…",
  "Balansiramo belinu…",
  "Proveravamo objektiv…",
  "Emocija na prvom mestu…",
  "Priprema kamere…",
  "Svetlo pada kako treba…",
  "Detalj nikad nije slučajan…",
  "Osmeh ulazi u kadar…",
  "Filmski ton se postavlja…",
  "Proveravamo memorijsku karticu…",
  "Čarli čuva reflektor…",
  "Uhvatili smo pogled…",
  "Priprema za zlatni sat…",
  "Kompozicija u toku…",
  "Video se snima u 4K…",
  "Stabilizator je spreman…",
  "Bokeh u pozadini…",
  "Trenutak pre osmeha…",
  "Priprema dron kadra…",
  "Color grading uskoro…",
  "Priča se piše u kadru…",
  "Rezervisano za uspomenu…",
  "Svetlo se gasi — akcija…",
  "Uspomena se učitava…",
];

function shuffleLabels(labels: string[]) {
  const copy = [...labels];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function PawIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden>
      <ellipse cx="32" cy="44" rx="13" ry="11" opacity="0.85" />
      <circle cx="17" cy="26" r="6.5" />
      <circle cx="31" cy="20" r="6.5" />
      <circle cx="45" cy="26" r="6.5" />
      <circle cx="50" cy="38" r="5.5" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <rect x="8" y="22" width="48" height="30" rx="4" />
      <circle cx="32" cy="37" r="9" />
      <circle cx="32" cy="37" r="4" fill="currentColor" opacity="0.35" />
      <path d="M22 22 L27 14 H37 L42 22" strokeLinejoin="round" />
    </svg>
  );
}

function FlashIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden>
      <path d="M36 4 L14 36 H30 L26 60 L50 28 H34 L36 4 Z" opacity="0.9" />
    </svg>
  );
}

type Floater = {
  id: string;
  Icon: typeof PawIcon;
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
  path: { x: number[]; y: number[]; rotate: number[] };
};

const floaters: Floater[] = [
  {
    id: "paw-1",
    Icon: PawIcon,
    left: "18%",
    top: "28%",
    size: 22,
    duration: 5.5,
    delay: 0,
    path: { x: [0, 24, -12, 0], y: [0, -18, 12, 0], rotate: [-8, 4, -4, -8] },
  },
  {
    id: "cam-1",
    Icon: CameraIcon,
    left: "72%",
    top: "22%",
    size: 28,
    duration: 6.2,
    delay: 0.4,
    path: { x: [0, -20, 16, 0], y: [0, 14, -20, 0], rotate: [0, -6, 8, 0] },
  },
  {
    id: "paw-2",
    Icon: PawIcon,
    left: "78%",
    top: "62%",
    size: 18,
    duration: 5,
    delay: 0.8,
    path: { x: [0, -28, 10, 0], y: [0, -12, -24, 0], rotate: [10, -6, 12, 10] },
  },
  {
    id: "flash-1",
    Icon: FlashIcon,
    left: "12%",
    top: "65%",
    size: 20,
    duration: 4.8,
    delay: 0.2,
    path: { x: [0, 18, -8, 0], y: [0, -22, 8, 0], rotate: [0, 12, -8, 0] },
  },
  {
    id: "cam-2",
    Icon: CameraIcon,
    left: "52%",
    top: "12%",
    size: 24,
    duration: 7,
    delay: 1,
    path: { x: [0, 14, -18, 0], y: [0, 20, 10, 0], rotate: [-4, 8, -6, -4] },
  },
  {
    id: "paw-3",
    Icon: PawIcon,
    left: "38%",
    top: "78%",
    size: 16,
    duration: 5.8,
    delay: 0.6,
    path: { x: [0, -14, 22, 0], y: [0, -16, -8, 0], rotate: [-12, 6, -4, -12] },
  },
];

const neonFilter =
  "drop-shadow(0 0 6px rgba(101,227,255,0.55)) drop-shadow(0 0 16px rgba(101,227,255,0.25))";

export function Preloader() {
  const pathname = usePathname();
  const [show, setShow] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [labelIndex, setLabelIndex] = useState(0);
  const [labels, setLabels] = useState(() => shuffleLabels(loadingLabels));

  useEffect(() => {
    setLabels(shuffleLabels(loadingLabels));
    setShow(true);
    setExiting(false);
    setProgress(0);
    setLabelIndex(0);

    const start = performance.now();
    let frame: number;
    let hideTimer: ReturnType<typeof setTimeout>;

    const tick = (now: number) => {
      const p = Math.min(100, ((now - start) / LOADER_DURATION) * 100);
      setProgress(p);
      if (p < 100) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const labelTimer = setInterval(() => {
      setLabelIndex((i) => (i + 1) % loadingLabels.length);
    }, 550);

    const exitTimer = setTimeout(() => {
      setExiting(true);
      hideTimer = setTimeout(() => setShow(false), 700);
    }, LOADER_DURATION + 150);

    return () => {
      cancelAnimationFrame(frame);
      clearInterval(labelTimer);
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, [pathname]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="preloader-overlay fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#05070D]"
          initial={{ opacity: 1 }}
          animate={{ opacity: exiting ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden={exiting}
          aria-live="polite"
          aria-label="Učitavanje"
        >
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(101,227,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(101,227,255,0.7) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 45%, rgba(101,227,255,0.14), transparent 55%)",
            }}
          />

          <motion.div
            className="pointer-events-none absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
            animate={{ top: ["15%", "85%", "15%"] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ boxShadow: "0 0 20px rgba(101,227,255,0.5)" }}
          />

          {floaters.map((f) => (
            <motion.div
              key={f.id}
              className="pointer-events-none absolute text-accent/30"
              style={{
                left: f.left,
                top: f.top,
                width: f.size,
                height: f.size,
                filter: neonFilter,
              }}
              animate={{
                x: f.path.x,
                y: f.path.y,
                rotate: f.path.rotate,
                opacity: exiting ? 0 : [0.2, 0.45, 0.3],
              }}
              transition={{
                x: { duration: f.duration, repeat: Infinity, ease: "easeInOut", delay: f.delay },
                y: { duration: f.duration, repeat: Infinity, ease: "easeInOut", delay: f.delay },
                rotate: { duration: f.duration, repeat: Infinity, ease: "easeInOut", delay: f.delay },
                opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <f.Icon />
            </motion.div>
          ))}

          <motion.div
            className="relative flex flex-col items-center"
            animate={
              exiting
                ? { scale: 0.92, opacity: 0, filter: "brightness(0.4)" }
                : { scale: 1, opacity: 1, filter: "brightness(1)" }
            }
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="preloader-logo-wrap relative"
              animate={
                exiting
                  ? {
                      filter: [
                        "drop-shadow(0 0 20px rgba(101,227,255,0.8)) brightness(1.2)",
                        "drop-shadow(0 0 0 transparent) brightness(0.3)",
                      ],
                    }
                  : {
                      filter: [
                        "drop-shadow(0 0 16px rgba(101,227,255,0.6)) drop-shadow(0 0 40px rgba(101,227,255,0.35))",
                        "drop-shadow(0 0 28px rgba(101,227,255,0.95)) drop-shadow(0 0 64px rgba(101,227,255,0.55)) brightness(1.15)",
                        "drop-shadow(0 0 16px rgba(101,227,255,0.6)) drop-shadow(0 0 40px rgba(101,227,255,0.35))",
                      ],
                    }
              }
              transition={
                exiting
                  ? { duration: 0.6 }
                  : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
              }
            >
              <Logo size="hero" priority className="!h-32 !w-32 sm:!h-40 sm:!w-40" />
            </motion.div>

            <motion.p
              key={`${labelIndex}-${labels[labelIndex % labels.length]}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: exiting ? 0 : 0.85, y: 0 }}
              className="mt-8 text-xs font-medium uppercase tracking-[0.35em] text-accent/80"
            >
              {labels[labelIndex % labels.length]}
            </motion.p>
          </motion.div>

          <div className="absolute bottom-[12%] left-1/2 w-full max-w-xs -translate-x-1/2 px-8">
            <div className="mb-2 flex justify-between text-[10px] uppercase tracking-[0.25em] text-accent/50">
              <span>Učitavanje</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="preloader-track h-[3px] overflow-hidden rounded-full bg-white/8">
              <motion.div
                className="preloader-bar h-full rounded-full bg-gradient-to-r from-accent/60 via-accent to-accent/80"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
