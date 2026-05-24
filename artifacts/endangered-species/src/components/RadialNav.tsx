import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import cootPortrait from "@assets/image_1779576736888.png";
import { sections } from "@/lib/sections";

interface RadialNavProps {
  activeSection: string | null;
  onSelect: (section: string | null) => void;
}

// Signal arcs component — radiating bezier curves with pulsing dots (adapted from dome-nav)
function SignalArcs() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [arcs, setArcs] = useState<Array<{d: string; opacity: number; dots: Array<{cx: number; cy: number; delay: number}>}>>([]);

  useEffect(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const cx = W / 2;
    const cy = H / 2;

    function qb(t: number, x0: number, y0: number, cpx: number, cpy: number, x1: number, y1: number) {
      const m = 1 - t;
      return { x: m*m*x0 + 2*m*t*cpx + t*t*x1, y: m*m*y0 + 2*m*t*cpy + t*t*y1 };
    }

    const newArcs: typeof arcs = [];

    function addArc(ox: number, oy: number, cpx: number, cpy: number, ex: number, ey: number, opacity: number, dotTs: [number, number][]) {
      const dots = dotTs.map(([t, delay]) => {
        const pt = qb(t, ox, oy, cpx, cpy, ex, ey);
        return { cx: pt.x, cy: pt.y, delay };
      });
      newArcs.push({ d: "M "+ox+","+oy+" Q "+cpx+","+cpy+" "+ex+","+ey, opacity, dots });
    }

    // Left arcs from center-left
    const lx = cx - 60, ly = cy;
    addArc(lx,ly, lx*0.5,ly-100,    20,cy-200,  0.22, [[0.3,0],[0.65,0.5]]);
    addArc(lx,ly, lx*0.3,ly,         0,cy,       0.28, [[0.28,0.1],[0.6,0.5],[0.88,0.9]]);
    addArc(lx,ly, lx*0.4,ly+100,    20,cy+200,  0.20, [[0.32,0.3],[0.68,0.8]]);
    addArc(lx,ly, lx*0.2,ly-150,     0,0,        0.16, [[0.4,0.4],[0.76,0.9]]);
    addArc(lx,ly, lx*0.3,ly+150,     0,H,        0.14, [[0.5,1.1]]);

    // Right arcs from center-right
    const rx = cx + 60, ry = cy;
    const rw = W - rx;
    addArc(rx,ry, rx+rw*0.5,ry-100,  W-20,cy-200, 0.22, [[0.3,0.1],[0.65,0.6]]);
    addArc(rx,ry, rx+rw*0.3,ry,       W,cy,        0.28, [[0.28,0.2],[0.6,0.6],[0.88,1.0]]);
    addArc(rx,ry, rx+rw*0.4,ry+100,  W-20,cy+200, 0.20, [[0.32,0.4],[0.68,0.9]]);
    addArc(rx,ry, rx+rw*0.2,ry-150,   W,0,         0.16, [[0.4,0.5],[0.76,1.0]]);
    addArc(rx,ry, rx+rw*0.3,ry+150,   W,H,         0.14, [[0.5,1.2]]);

    setArcs(newArcs);
  }, []);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <filter id="dot-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {arcs.map((arc, i) => (
        <g key={i}>
          <path d={arc.d} stroke={"rgba(212,175,55,"+arc.opacity+")"} strokeWidth="1.2" fill="none"/>
          {arc.dots.map((dot, j) => (
            <circle
              key={j}
              cx={dot.cx}
              cy={dot.cy}
              r="3"
              fill="rgba(255,185,45,0.9)"
              filter="url(#dot-glow)"
              style={{
                animation: "dotPulse 2.4s ease-in-out infinite",
                animationDelay: dot.delay + "s"
              }}
            />
          ))}
        </g>
      ))}
      <style>{".dotPulse-keyframes { animation: dotPulse 2.4s ease-in-out infinite; } @keyframes dotPulse { 0%,100%{opacity:0.45} 50%{opacity:1} }"}</style>
    </svg>
  );
}

export function RadialNav({ activeSection, onSelect }: RadialNavProps) {
  const [isMini, setIsMini] = useState(false);

  useEffect(() => {
    setIsMini(activeSection !== null);
  }, [activeSection]);

  if (isMini) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-14 h-14 bg-card/80 backdrop-blur border-accent/50 hover:bg-primary/20 hover:scale-110 transition-all shadow-lg"
          onClick={() => onSelect(null)}
          data-testid="button-back-to-nav"
        >
          <X className="w-6 h-6 text-accent" />
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden"
      style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.04) 0%, rgba(3,5,14,0.98) 65%)" }}
    >
      {/* Signal arcs background */}
      <SignalArcs />

      {/* Outer decorative ring */}
      <div className="absolute w-[520px] h-[520px] md:w-[700px] md:h-[700px] rounded-full border border-accent/10 pointer-events-none" />
      <div className="absolute w-[420px] h-[420px] md:w-[580px] md:h-[580px] rounded-full border border-primary/15 pointer-events-none" />

      <div className="relative w-full max-w-4xl aspect-square max-h-[90vh] flex items-center justify-center">

        {/* Center coot portrait */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "backOut" }}
          className="absolute z-10 w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden"
          style={{
            border: "3px solid rgba(212,175,55,0.7)",
            boxShadow: "0 0 0 1px rgba(193,18,31,0.4), 0 0 30px rgba(212,175,55,0.3), 0 0 60px rgba(212,175,55,0.15)"
          }}
        >
          <img
            src={cootPortrait}
            alt="Hawaiian Coot"
            className="w-full h-full object-cover object-top"
            style={{ filter: "brightness(1.2) saturate(1.5) contrast(1.05)" }}
          />
        </motion.div>

        {/* Radial section buttons */}
        {sections.map((section, i) => {
          const angle = (i * (360 / sections.length)) * (Math.PI / 180) - Math.PI / 2;
          const leftPct = (50 + Math.cos(angle) * 37).toFixed(3) + "%";
          const topPct  = (50 + Math.sin(angle) * 37).toFixed(3) + "%";

          return (
            <div
              key={section}
              className="absolute"
              style={{ left: leftPct, top: topPct, transform: "translate(-50%, -50%)" }}
            >
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="w-28 h-28 md:w-36 md:h-36 flex items-center justify-center text-center p-3 rounded-full cursor-pointer"
                style={{
                  background: "rgba(3,5,14,0.92)",
                  border: "2px solid rgba(193,18,31,0.8)",
                  color: "rgba(212,175,55,0.9)",
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: "clamp(9px,1.1vw,11px)",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
                whileHover={{
                  scale: 1.12,
                  backgroundColor: "rgba(193,18,31,0.9)",
                  borderColor: "rgba(212,175,55,0.9)",
                  color: "#ffffff",
                }}
                onClick={() => onSelect(section)}
                data-testid={"button-nav-" + section.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
              >
                <span className="leading-tight drop-shadow-md">
                  {section}
                </span>
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* Bottom label */}
      <div
        className="absolute bottom-8 text-center"
        style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(212,175,55,0.5)" }}
      >
        SELECT A SECTION TO EXPLORE
      </div>
    </motion.div>
  );
}