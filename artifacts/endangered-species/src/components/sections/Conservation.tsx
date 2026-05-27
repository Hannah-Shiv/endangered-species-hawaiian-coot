// ─── Conservation & Solutions ─────────────────────────────────────────────────
// Full interactive Conservation page:
//   • Hover-reveal org cards with stats
//   • Animated progress bars + counters (scroll-triggered)
//   • Conservation dashboard with sparklines
//   • SVG Hawaii wetland map with clickable location markers
//   • Before/After restoration slider (drag to reveal)
//   • "You Can Help" action section
//   • Quote footer
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { TrendingUp, Droplets, AlertTriangle, ExternalLink, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Palette ─────────────────────────────────────────────────────────────────
const GOLD = "rgba(212,175,55,1)";
const GOLD_DIM = "rgba(212,175,55,0.65)";
const RED = "rgba(200,30,10,0.9)";
const CARD_BG = "rgba(28,12,4,0.96)";
const BORDER = "rgba(212,175,55,0.42)";

// ─── Org data ─────────────────────────────────────────────────────────────────
const ORGS = [
  {
    id: "usfws",
    name: "U.S. Fish & Wildlife Service",
    desc: "Manages critical National Wildlife Refuges including James Campbell, Kealia Pond, and Hanalei — the strongholds of coot recovery.",
    url: "https://www.fws.gov",
    stats: [{ label: "Founded", value: "1940" }, { label: "Refuges Managed", value: "568+" }, { label: "Staff", value: "9,000+" }],
    icon: "🦅",
    testId: "link-usfws",
  },
  {
    id: "dofaw",
    name: "Hawaii DOFAW",
    desc: "The Division of Forestry and Wildlife conducts biannual statewide waterbird surveys to track population trends.",
    url: "https://dlnr.hawaii.gov/dofaw",
    stats: [{ label: "Surveys", value: "2× Yearly" }, { label: "Monitoring Sites", value: "50+" }],
    icon: "🌿",
    testId: "link-dofaw",
  },
  {
    id: "hwf",
    name: "Hawaii Wildlife Fund",
    desc: "A non-profit dedicated to native wildlife protection through education, research, and community action.",
    url: "https://www.wildhawaii.org",
    stats: [{ label: "Projects Funded", value: "120+" }, { label: "Students Reached", value: "25,000+" }],
    icon: "🌺",
    testId: "link-hwf",
  },
  {
    id: "tnc",
    name: "The Nature Conservancy Hawaii",
    desc: "Works on landscape-level conservation protecting watersheds that feed coastal wetland ecosystems.",
    url: "https://www.nature.org/en-us/about-us/where-we-work/united-states/hawaii/",
    stats: [{ label: "Acres Protected", value: "200,000+" }, { label: "Projects", value: "60+" }],
    icon: "🏔",
    testId: "link-tnc",
  },
];

// ─── Progress data ────────────────────────────────────────────────────────────
const PROGRESS_BARS = [
  { label: "Population Goal (5,000 birds)", sub: "Current Estimate: ~3,200 birds", pct: 64, suffix: "% Achieved", icon: "🐦" },
  { label: "Wetland Restoration Target", sub: "Target: Restore 10,000 acres", pct: 45, suffix: "% Restored", icon: "💧" },
  { label: "Predator Control Coverage", sub: "Target: 100% of key habitats", pct: 60, suffix: "% of Key Sites", icon: "🛡" },
];

// ─── Dashboard trend data ─────────────────────────────────────────────────────
const TRENDS = [
  { label: "Population Trend", status: "Increasing", detail: "+120 birds from last year", color: "#4ade80", Icon: TrendingUp, data: [30,38,35,42,40,48,52,58,55,62,66,70] },
  { label: "Wetland Health", status: "Moderate", detail: "Ongoing restoration in 5 major sites", color: GOLD, Icon: Droplets, data: [50,48,52,49,53,51,54,52,56,53,57,55] },
  { label: "Invasive Predators", status: "Ongoing Threat", detail: "Feral cats & mongooses present", color: RED, Icon: AlertTriangle, data: [70,68,72,65,69,66,63,67,64,62,65,63] },
];

// ─── Hawaii map locations ──────────────────────────────────────────────────────
const LOCATIONS = [
  { id: "hanalei",  name: "Hanalei NWR",          island: "Kauaʻi", cx: 85,  cy: 50, pop: "~500",   habitat: "917",   threat: "Medium", recovery: 58 },
  { id: "campbell", name: "James Campbell NWR",    island: "Oʻahu",  cx: 216, cy: 70, pop: "~1,450", habitat: "2,150", threat: "Medium", recovery: 68 },
  { id: "kealia",   name: "Kealia Pond NWR",       island: "Maui",   cx: 362, cy: 100, pop: "~700",  habitat: "700",   threat: "Low",    recovery: 55 },
];

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const total = 90;
    const tick = () => {
      frame++;
      setVal(Math.round((frame / total) * target));
      if (frame < total) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── Sparkline ────────────────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const W = 110; const H = 36;
  const min = Math.min(...data); const max = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / (max - min + 0.001)) * H;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg width={W} height={H} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Animated Progress Bar ────────────────────────────────────────────────────
function ProgressBar({ label, sub, pct, suffix, icon }: { label: string; sub: string; pct: number; suffix: string; icon: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          <div>
            <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.92)", margin: 0 }}>{label}</p>
            <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0, marginTop: 2 }}>{sub}</p>
          </div>
        </div>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: GOLD, margin: 0, whiteSpace: "nowrap", paddingLeft: 12 }}>
          <AnimatedCounter target={pct} />{suffix}
        </p>
      </div>
      {/* Track */}
      <div style={{ height: 10, borderRadius: 999, background: "rgba(255,255,255,0.08)", overflow: "hidden", position: "relative" }}>
        {/* Goal marker at 100% */}
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : { width: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{
            height: "100%", borderRadius: 999,
            background: `linear-gradient(90deg, ${RED}, ${GOLD})`,
            boxShadow: `0 0 12px rgba(212,175,55,0.5)`,
            position: "absolute", left: 0, top: 0,
          }}
        />
        {/* Dotted goal line */}
        <div style={{ position: "absolute", right: 0, top: -4, bottom: -4, width: 2, borderLeft: `2px dashed rgba(255,255,255,0.25)` }} />
      </div>
    </div>
  );
}

// ─── Image Lightbox ───────────────────────────────────────────────────────────
function LightboxModal({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "rgba(0,0,0,0.92)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "zoom-out", padding: 32,
      }}
    >
      <motion.img
        src={src} alt={alt}
        initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.88, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: "90vw", maxHeight: "85vh", borderRadius: 14, objectFit: "contain", boxShadow: "0 0 80px rgba(0,0,0,0.8)" }}
      />
      <button
        onClick={onClose}
        style={{ position: "fixed", top: 24, right: 28, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "50%", width: 40, height: 40, color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
      >✕</button>
    </motion.div>
  );
}

// ─── Org Card ─────────────────────────────────────────────────────────────────
function OrgCard({ org, delay }: { org: typeof ORGS[0]; delay: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 14,
        border: `1px solid ${hovered ? "rgba(212,175,55,0.55)" : BORDER}`,
        background: CARD_BG,
        padding: "22px 24px 18px",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
        boxShadow: hovered ? "0 8px 32px rgba(212,175,55,0.14)" : "none",
        display: "flex", flexDirection: "column", gap: 10,
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Icon circle */}
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: `rgba(212,175,55,0.14)`, border: `1px solid rgba(212,175,55,0.55)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, boxShadow: "0 0 14px rgba(212,175,55,0.15)" }}>
            {org.icon}
          </div>
          <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 18, fontWeight: 800, color: "rgba(255,255,255,0.95)", margin: 0, lineHeight: 1.3 }}>{org.name}</p>
        </div>
        <a href={org.url} target="_blank" rel="noreferrer" data-testid={org.testId} style={{ color: GOLD_DIM, flexShrink: 0, paddingTop: 2 }}>
          <ExternalLink size={18} />
        </a>
      </div>

      {/* Description */}
      <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.62)", margin: 0, lineHeight: 1.6 }}>{org.desc}</p>

      {/* Stats — slide in on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 8, borderTop: `1px solid ${BORDER}` }}>
              {org.stats.map(s => (
                <div key={s.label} style={{ background: "rgba(212,175,55,0.07)", border: `1px solid rgba(212,175,55,0.2)`, borderRadius: 8, padding: "5px 12px" }}>
                  <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0, letterSpacing: "0.06em" }}>{s.label.toUpperCase()}</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: GOLD, margin: 0 }}>{s.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visit button */}
      <a href={org.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
        <div style={{
          marginTop: 4, padding: "10px 0", textAlign: "center", borderRadius: 8,
          border: `1px solid rgba(212,175,55,0.65)`, background: "rgba(212,175,55,0.1)",
          fontFamily: "'Josefin Sans', sans-serif", fontSize: 14, fontWeight: 800,
          letterSpacing: "0.12em", color: GOLD, cursor: "pointer",
          transition: "background 0.2s, box-shadow 0.2s",
          boxShadow: "0 0 12px rgba(212,175,55,0.12)",
        }}>
          ✦ VISIT WEBSITE ✦
        </div>
      </a>
    </motion.div>
  );
}

// ─── Hawaii SVG Map ────────────────────────────────────────────────────────────
function HawaiiMap({ selected, onSelect }: { selected: string | null; onSelect: (id: string | null) => void }) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg viewBox="0 0 520 200" style={{ width: "100%", height: "auto" }}>
        {/* Ocean background */}
        <rect width="520" height="200" fill="rgba(2,18,30,0.0)" />

        {/* ── Islands (simplified ellipses) ── */}
        {/* Ni'ihau */}
        <ellipse cx="28" cy="70" rx="9" ry="13" fill="rgba(30,60,30,0.7)" stroke="rgba(212,175,55,0.2)" strokeWidth="0.8"/>
        {/* Kaua'i */}
        <ellipse cx="78" cy="65" rx="22" ry="20" fill="rgba(30,65,30,0.75)" stroke="rgba(212,175,55,0.25)" strokeWidth="0.8"/>
        {/* O'ahu */}
        <ellipse cx="206" cy="85" rx="28" ry="20" fill="rgba(30,65,30,0.75)" stroke="rgba(212,175,55,0.25)" strokeWidth="0.8"/>
        {/* Moloka'i */}
        <ellipse cx="282" cy="92" rx="27" ry="11" fill="rgba(30,65,30,0.7)" stroke="rgba(212,175,55,0.2)" strokeWidth="0.8"/>
        {/* Lāna'i */}
        <ellipse cx="295" cy="122" rx="13" ry="11" fill="rgba(30,65,30,0.7)" stroke="rgba(212,175,55,0.2)" strokeWidth="0.8"/>
        {/* Maui */}
        <ellipse cx="352" cy="105" rx="36" ry="26" fill="rgba(30,65,30,0.75)" stroke="rgba(212,175,55,0.25)" strokeWidth="0.8"/>
        {/* Kaho'olawe */}
        <ellipse cx="358" cy="148" rx="11" ry="9" fill="rgba(30,65,30,0.6)" stroke="rgba(212,175,55,0.15)" strokeWidth="0.8"/>
        {/* Big Island */}
        <ellipse cx="468" cy="138" rx="62" ry="56" fill="rgba(30,65,30,0.75)" stroke="rgba(212,175,55,0.25)" strokeWidth="0.8"/>

        {/* Compass rose */}
        <text x="30" y="170" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="sans-serif">N ↑</text>

        {/* ── Clickable location markers ── */}
        {LOCATIONS.map(loc => {
          const isSelected = selected === loc.id;
          return (
            <g key={loc.id} onClick={() => onSelect(isSelected ? null : loc.id)} style={{ cursor: "pointer" }}>
              {/* Pulse ring */}
              {isSelected && (
                <circle cx={loc.cx} cy={loc.cy} r={14} fill="none" stroke={GOLD} strokeWidth={1} opacity={0.5}>
                  <animate attributeName="r" values="12;20;12" dur="2s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite"/>
                </circle>
              )}
              {/* Marker pin */}
              <circle cx={loc.cx} cy={loc.cy} r={7} fill={isSelected ? GOLD : "rgba(200,30,10,0.85)"} stroke="rgba(0,0,0,0.5)" strokeWidth={1}/>
              <circle cx={loc.cx} cy={loc.cy} r={3} fill="rgba(255,255,255,0.9)"/>
              {/* Label */}
              <text x={loc.cx + 10} y={loc.cy - 8} fill="rgba(255,255,255,0.85)" fontSize="8.5" fontFamily="'Josefin Sans', sans-serif" fontWeight="700">{loc.name}</text>
              <text x={loc.cx + 10} y={loc.cy + 2} fill="rgba(212,175,55,0.7)" fontSize="7.5" fontFamily="'Josefin Sans', sans-serif">{loc.island}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Before/After Slider ──────────────────────────────────────────────────────
function BeforeAfterSlider() {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getPos = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setPos(pct);
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => { if (dragging) getPos(e.clientX); }, [dragging, getPos]);
  const onMouseUp = useCallback(() => setDragging(false), []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, onMouseMove, onMouseUp]);

  return (
    <div
      ref={containerRef}
      onMouseDown={(e) => { setDragging(true); getPos(e.clientX); }}
      onTouchMove={(e) => getPos(e.touches[0].clientX)}
      style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: 12, overflow: "hidden", cursor: "ew-resize", userSelect: "none" }}
    >
      {/* BEFORE image */}
      <img src="/wetland-before.png" alt="Before restoration" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />

      {/* AFTER image — clipped to right of slider */}
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${pos}%)`, transition: dragging ? "none" : "clip-path 0.05s" }}>
        <img src="/wetland-after.png" alt="After restoration" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Divider line */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 2, background: "rgba(255,255,255,0.9)", transform: "translateX(-50%)", zIndex: 5 }} />

      {/* Handle */}
      <div style={{
        position: "absolute", top: "50%", left: `${pos}%`,
        transform: "translate(-50%, -50%)",
        width: 38, height: 38, borderRadius: "50%",
        background: "rgba(0,0,0,0.75)", border: "2px solid rgba(255,255,255,0.9)",
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 4, zIndex: 6, color: "white",
      }}>
        <ChevronLeft size={12} />
        <ChevronRight size={12} />
      </div>

      {/* BEFORE label — fades out as slider sweeps left past it */}
      <div style={{
        position: "absolute", bottom: 16, left: 16, zIndex: 7,
        opacity: Math.min(1, Math.max(0, (pos - 8) / 18)),
        transition: "opacity 0.1s",
        pointerEvents: "none",
      }}>
        <div style={{
          background: "rgba(120,30,10,0.88)",
          border: "2px solid rgba(220,80,50,0.9)",
          padding: "7px 18px", borderRadius: 8,
          fontFamily: "'Josefin Sans', sans-serif",
          fontSize: 15, fontWeight: 900,
          color: "#fff", letterSpacing: "0.18em",
          textShadow: "0 1px 8px rgba(0,0,0,0.8)",
          boxShadow: "0 2px 16px rgba(0,0,0,0.5)",
        }}>
          ✕ BEFORE
        </div>
      </div>

      {/* AFTER label — fades out as slider sweeps right past it */}
      <div style={{
        position: "absolute", bottom: 16, right: 16, zIndex: 7,
        opacity: Math.min(1, Math.max(0, (92 - pos) / 18)),
        transition: "opacity 0.1s",
        pointerEvents: "none",
      }}>
        <div style={{
          background: "rgba(10,80,40,0.88)",
          border: "2px solid rgba(60,180,80,0.9)",
          padding: "7px 18px", borderRadius: 8,
          fontFamily: "'Josefin Sans', sans-serif",
          fontSize: 15, fontWeight: 900,
          color: "#fff", letterSpacing: "0.18em",
          textShadow: "0 1px 8px rgba(0,0,0,0.8)",
          boxShadow: "0 2px 16px rgba(0,0,0,0.5)",
        }}>
          ✓ AFTER
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function Conservation() {
  const [selectedLoc, setSelectedLoc] = useState<string | null>("campbell");
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const locData = LOCATIONS.find(l => l.id === selectedLoc);

  return (
    <>
    {/* Lightbox */}
    <AnimatePresence>
      {lightbox && <LightboxModal src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}
    </AnimatePresence>

    <div className="w-full min-h-screen pt-24 pb-16 px-6 md:px-12 bg-background overflow-y-auto">
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h1 className="text-6xl mb-3" style={{ fontFamily: "'Playfair Display', serif", color: GOLD, letterSpacing: "0.04em" }}>
              Conservation &amp; Solutions
            </h1>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 20, color: "rgba(212,175,55,0.88)", margin: "0 auto 20px" }}>
              Protecting the Hawaiian Coot requires constant vigilance: managing water, eliminating predators, and protecting land.
            </p>
            {/* Why It Matters + Last Updated — centered below subtitle */}
            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ borderRadius: 10, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "10px 18px", maxWidth: 300 }}>
                <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, letterSpacing: "0.12em", color: GOLD, fontWeight: 700, margin: "0 0 3px" }}>WHY IT MATTERS</p>
                <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.5 }}>
                  The Hawaiian Coot is an ʻAlala Nui — a unique part of Hawaiʻi's natural heritage.
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 999, border: `1px solid ${BORDER}`, background: CARD_BG, alignSelf: "center" }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80" }} />
                <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.55)", margin: 0 }}>Last Updated: May 20, 2024</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Org Cards — 2×2 grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
          {ORGS.map((org, i) => <OrgCard key={org.id} org={org} delay={i * 0.1} />)}
        </div>

        <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: "rgba(212,175,55,0.65)", textAlign: "center", letterSpacing: "0.1em", marginBottom: 28 }}>
          ✦ Hover over a card to learn more ✦
        </p>

        {/* ── Progress Metrics + Conservation Dashboard ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>

          {/* Progress bars */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
            style={{ borderRadius: 14, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "24px 28px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(212,175,55,0.15)", border: `1px solid rgba(212,175,55,0.55)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 12px rgba(212,175,55,0.18)" }}>
                <TrendingUp size={18} color={GOLD} />
              </div>
              <div>
                <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 14, fontWeight: 800, color: GOLD, margin: 0, letterSpacing: "0.08em", textShadow: "0 0 18px rgba(212,175,55,0.35)" }}>RECOVERY PROGRESS METRICS</p>
                <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.55)", margin: 0 }}>Our progress toward a stable future for the Hawaiian Coot.</p>
              </div>
            </div>
            {PROGRESS_BARS.map(p => <ProgressBar key={p.label} label={p.label} sub={p.sub} pct={p.pct} suffix={p.suffix} icon={p.icon} />)}
            <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.25)", margin: 0, fontStyle: "italic" }}>
              Progress updates automatically as new data becomes available.
            </p>
          </motion.div>

          {/* Conservation Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.7 }}
            style={{ borderRadius: 14, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "24px 28px" }}
          >
            <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 14, fontWeight: 800, color: GOLD, margin: "0 0 18px", letterSpacing: "0.08em", textShadow: "0 0 18px rgba(212,175,55,0.35)" }}>✦ CONSERVATION DASHBOARD</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {TRENDS.map(t => (
                <div key={t.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", borderRadius: 10, border: `1px solid rgba(212,175,55,0.18)`, background: "rgba(212,175,55,0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <t.Icon size={20} color={t.color} />
                    <div>
                      <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0, letterSpacing: "0.06em" }}>{t.label.toUpperCase()}</p>
                      <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 18, fontWeight: 700, color: t.color, margin: "2px 0 0" }}>{t.status}</p>
                      <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.42)", margin: 0, marginTop: 2 }}>{t.detail}</p>
                    </div>
                  </div>
                  <Sparkline data={t.data} color={t.color} />
                </div>
              ))}
            </div>
            <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.25)", margin: "14px 0 0", textAlign: "right" }}>
              Data Source: DOFAW, USFWS, TNC
            </p>
          </motion.div>
        </div>

        {/* ── Hawaii Map + Location Popup ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}
        >
          {/* Map panel */}
          <div style={{ borderRadius: 14, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "20px 22px" }}>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 14, fontWeight: 800, color: GOLD, margin: "0 0 4px", letterSpacing: "0.08em", textShadow: "0 0 18px rgba(212,175,55,0.35)" }}>
                <MapPin size={14} style={{ display: "inline", marginRight: 6, verticalAlign: "middle", color: GOLD }} />
                HAWAIʻI WETLAND STRONGHOLDS
              </p>
              <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.55)", margin: 0 }}>Click a location on the map to explore details.</p>
            </div>
            <HawaiiMap selected={selectedLoc} onSelect={setSelectedLoc} />
          </div>

          {/* Location info popup */}
          <AnimatePresence mode="wait">
            {locData ? (
              <motion.div
                key={locData.id}
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.35 }}
                style={{ borderRadius: 14, border: `1px solid rgba(212,175,55,0.35)`, background: "rgba(28,8,4,0.98)", padding: "22px 24px", display: "flex", flexDirection: "column", gap: 14 }}
              >
                {/* Header */}
                <div>
                  <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, color: GOLD_DIM, letterSpacing: "0.12em", margin: "0 0 4px" }}>{locData.island.toUpperCase()} · NATIONAL WILDLIFE REFUGE</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "rgba(255,255,255,0.97)", margin: 0 }}>{locData.name}</p>
                </div>

                {/* Stats row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { label: "Population", value: locData.pop, sub: "birds" },
                    { label: "Habitat", value: locData.habitat, sub: "acres" },
                    { label: "Threat Level", value: locData.threat, sub: "" },
                  ].map(s => (
                    <div key={s.label} style={{ padding: "10px 14px", borderRadius: 10, border: `1px solid ${BORDER}`, background: "rgba(212,175,55,0.04)" }}>
                      <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.35)", margin: "0 0 2px", letterSpacing: "0.08em" }}>{s.label.toUpperCase()}</p>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: GOLD, margin: 0 }}>{s.value}</p>
                      {s.sub && <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.3)", margin: 0 }}>{s.sub}</p>}
                    </div>
                  ))}
                  {/* Recovery progress */}
                  <div style={{ padding: "10px 14px", borderRadius: 10, border: `1px solid ${BORDER}`, background: "rgba(212,175,55,0.04)" }}>
                    <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.35)", margin: "0 0 6px", letterSpacing: "0.08em" }}>RECOVERY</p>
                    <div style={{ height: 6, borderRadius: 999, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${locData.recovery}%`, background: `linear-gradient(90deg, ${RED}, ${GOLD})`, borderRadius: 999 }} />
                    </div>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: GOLD, margin: "4px 0 0" }}>{locData.recovery}%</p>
                  </div>
                </div>

                {/* James Campbell refuge photos — click or hover to expand */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { src: "/campbell-habitat.png", alt: "James Campbell NWR habitat" },
                    { src: "/campbell-coot.png",    alt: "Hawaiian Coot at James Campbell NWR" },
                  ].map(img => (
                    <div
                      key={img.src}
                      onClick={() => setLightbox(img)}
                      style={{ aspectRatio: "4/3", borderRadius: 8, overflow: "hidden", cursor: "zoom-in", position: "relative" }}
                      className="group"
                    >
                      <img
                        src={img.src} alt={img.alt}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.3s ease" }}
                        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
                        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                      />
                      {/* Zoom hint overlay */}
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s", pointerEvents: "none" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.28)")}
                      >
                        <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 22, opacity: 0, transition: "opacity 0.2s" }}>🔍</span>
                      </div>
                    </div>
                  ))}
                </div>

                <a href="https://www.fws.gov/refuge/james-campbell" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                  <div style={{ padding: "10px 0", textAlign: "center", borderRadius: 8, background: RED, fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.95)", cursor: "pointer" }}>
                    VIEW FULL REPORT ↗
                  </div>
                </a>
              </motion.div>
            ) : (
              <motion.div
                key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ borderRadius: 14, border: `1px solid ${BORDER}`, background: CARD_BG, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>Select a location on the map</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Before/After Slider + You Can Help ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 36 }}
        >
          {/* Slider */}
          <div style={{ borderRadius: 14, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "20px 22px" }}>
            <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 14, fontWeight: 800, color: GOLD, margin: "0 0 4px", letterSpacing: "0.08em", textShadow: "0 0 18px rgba(212,175,55,0.35)" }}>✦ RESTORATION IN ACTION</p>
            <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.55)", margin: "0 0 14px" }}>Drag to see the difference conservation makes.</p>
            <BeforeAfterSlider />
          </div>

          {/* You Can Help */}
          <div style={{ borderRadius: 14, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "20px 22px" }}>
            <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 14, fontWeight: 800, color: GOLD, margin: "0 0 4px", letterSpacing: "0.08em", textShadow: "0 0 18px rgba(212,175,55,0.35)" }}>✦ YOU CAN HELP</p>
            <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.55)", margin: "0 0 20px" }}>Every action counts toward protecting Hawaii's wetlands.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { icon: "❤️", label: "Donate", desc: "Support habitat restoration and research." },
                { icon: "🤝", label: "Volunteer", desc: "Join local cleanups and monitoring programs." },
                { icon: "📢", label: "Spread Awareness", desc: "Share knowledge and inspire others to care." },
                { icon: "🔭", label: "Report Sightings", desc: "Help track coot populations in your area." },
              ].map(item => (
                <div key={item.label} style={{ padding: "16px 14px", borderRadius: 10, border: `1px solid rgba(212,175,55,0.42)`, background: "rgba(212,175,55,0.1)", display: "flex", flexDirection: "column", gap: 6, alignItems: "center", textAlign: "center", boxShadow: "0 0 14px rgba(212,175,55,0.06)" }}>
                  <span style={{ fontSize: 28 }}>{item.icon}</span>
                  <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 14, fontWeight: 800, color: GOLD, margin: 0, textShadow: "0 0 10px rgba(212,175,55,0.4)" }}>{item.label}</p>
                  <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Quote footer ── */}
        <motion.blockquote
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 1 }}
          style={{ textAlign: "center", padding: "28px 40px", borderTop: `1px solid ${BORDER}`, margin: 0 }}
        >
          <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "clamp(17px, 1.6vw, 23px)", color: "rgba(255,255,255,0.82)", lineHeight: 1.6 }}>
            "When we protect wetlands, we protect life. Together, we can secure a future for the Hawaiian Coot."
          </span>
        </motion.blockquote>

      </div>
    </div>
    </>
  );
}
