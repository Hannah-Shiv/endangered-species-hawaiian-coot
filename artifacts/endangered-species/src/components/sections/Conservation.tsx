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
const CARD_BG = "rgba(0,0,0,0.96)";
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
  { label: "Population Trend", status: "Increasing", badge: "↑ RISING", detail: "+120 birds from last year", color: "#4ade80", Icon: TrendingUp, data: [30,38,35,42,40,48,52,58,55,62,66,70] },
  { label: "Wetland Health",   status: "Moderate",   badge: "~ STABLE", detail: "Ongoing restoration in 5 major sites", color: "rgba(212,175,55,1)", Icon: Droplets, data: [50,48,52,49,53,51,54,52,56,53,57,55] },
  { label: "Invasive Predators", status: "Active Threat", badge: "⚠ THREAT", detail: "Feral cats & mongooses present", color: "rgba(248,80,50,1)", Icon: AlertTriangle, data: [70,68,72,65,69,66,63,67,64,62,65,63] },
];

// ─── Hawaii map locations ──────────────────────────────────────────────────────
const LOCATIONS = [
  { id: "hanalei",  name: "Hanalei NWR",          island: "Kauaʻi", cx: 85,  cy: 50, pop: "~500",   habitat: "917",   threat: "Medium", recovery: 58, mapImg: "/hanalei-map.png" as string | null,
    desc: "Nestled in the lush Hanalei Valley on Kauaʻi, this refuge shelters the largest concentration of endangered waterbirds in the state, including the Hawaiian Coot, Stilt, and Moorhen." },
  { id: "campbell", name: "James Campbell NWR",    island: "Oʻahu",  cx: 216, cy: 70, pop: "~1,450", habitat: "2,150", threat: "Medium", recovery: 68, mapImg: "/campbell-map.png" as string | null,
    desc: "Located on the windward side of Oʻahu near Kahuku Point, James Campbell NWR protects critical wetland habitat and is the primary site for Hawaiian Coot population recovery efforts." },
  { id: "kealia",   name: "Kealia Pond NWR",       island: "Maui",   cx: 362, cy: 100, pop: "~700",  habitat: "700",   threat: "Low",    recovery: 55, mapImg: "/kealia-map.png" as string | null,
    desc: "One of Maui's last natural perennial wetlands, Kealia Pond provides essential wintering habitat and a protected breeding ground for Hawaiian Coots and other native waterbirds." },
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
  const W = 140; const H = 56;
  const pad = 4;
  const min = Math.min(...data); const max = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2);
    const y = pad + (H - pad * 2) - ((v - min) / (max - min + 0.001)) * (H - pad * 2);
    return { x, y };
  });
  const linePts = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  const fillPts = [
    `${pts[0].x},${H}`,
    ...pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`),
    `${last.x},${H}`,
  ].join(" ");
  const id = `sg-${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg width={W} height={H} style={{ display: "block", flexShrink: 0 }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill={`url(#${id})`} />
      <polyline points={linePts} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r={4} fill={color} />
      <circle cx={last.x} cy={last.y} r={7} fill={color} fillOpacity={0.22} />
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
        onClick={onClose}
        style={{ maxWidth: "90vw", maxHeight: "85vh", borderRadius: 14, objectFit: "contain", boxShadow: "0 0 80px rgba(0,0,0,0.8)", cursor: "zoom-out" }}
      />
      <button
        onClick={onClose}
        style={{ position: "fixed", top: 24, right: 28, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "50%", width: 40, height: 40, color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
      >✕</button>
    </motion.div>
  );
}

// ─── Carousel Modal ───────────────────────────────────────────────────────────
type CarouselPhoto = { src: string; alt: string };
function CarouselModal({ photos, startIndex, onClose }: { photos: CarouselPhoto[]; startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex);
  const prev = useCallback(() => setIdx(i => (i - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setIdx(i => (i + 1) % photos.length), [photos.length]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);
  const current = photos[idx];
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.96)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 80px" }}
    >
      {/* Close */}
      <button onClick={onClose} style={{ position: "fixed", top: 22, right: 26, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: "50%", width: 42, height: 42, color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>✕</button>

      {/* Counter */}
      <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em", margin: "0 0 14px", position: "fixed", top: 28, left: "50%", transform: "translateX(-50%)" }}>
        {idx + 1} / {photos.length}
      </p>

      {/* Main image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={current.src} alt={current.alt}
          initial={{ opacity: 0, scale: 0.96, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.96, x: -20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={e => e.stopPropagation()}
          style={{ maxWidth: "82vw", maxHeight: "78vh", borderRadius: 12, objectFit: "contain", boxShadow: "0 0 80px rgba(0,0,0,0.9)", cursor: "default" }}
        />
      </AnimatePresence>

      {/* Caption */}
      <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "16px 0 0", letterSpacing: "0.04em", textAlign: "center" }}>{current.alt}</p>

      {/* Dot strip */}
      <div style={{ display: "flex", gap: 8, marginTop: 18 }} onClick={e => e.stopPropagation()}>
        {photos.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 24 : 8, height: 8, borderRadius: 999, border: "none", cursor: "pointer", background: i === idx ? GOLD : "rgba(255,255,255,0.25)", transition: "all 0.25s", padding: 0 }} />
        ))}
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={e => { e.stopPropagation(); prev(); }}
        style={{ position: "fixed", left: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "50%", width: 52, height: 52, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)", transition: "background 0.2s" }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(212,175,55,0.25)")}
        onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
      ><ChevronLeft size={26} /></button>
      <button
        onClick={e => { e.stopPropagation(); next(); }}
        style={{ position: "fixed", right: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "50%", width: 52, height: 52, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)", transition: "background 0.2s" }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(212,175,55,0.25)")}
        onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
      ><ChevronRight size={26} /></button>
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
          background: "rgba(0,0,0,0.88)",
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
          background: "rgba(0,0,0,0.88)",
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
  const [carousel, setCarousel] = useState<{ photos: CarouselPhoto[]; index: number } | null>(null);
  const locData = LOCATIONS.find(l => l.id === selectedLoc);

  return (
    <>
    {/* Lightbox */}
    <AnimatePresence>
      {lightbox && <LightboxModal src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}
    </AnimatePresence>
    {/* Carousel */}
    <AnimatePresence>
      {carousel && <CarouselModal photos={carousel.photos} startIndex={carousel.index} onClose={() => setCarousel(null)} />}
    </AnimatePresence>

    <div className="w-full min-h-screen pb-16 bg-background overflow-y-auto">

        {/* ── Hero Header ── */}
        <div style={{ position: "relative", width: "100%", height: 320, overflow: "hidden", flexShrink: 0, paddingTop: 80 }}>
          {/* background image */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url('/conservation-hero.png')",
            backgroundSize: "cover", backgroundPosition: "center 30%",
          }} />
          {/* center-dark gradient — only middle 1/3 darkened */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 33%, rgba(0,0,0,0.80) 42%, rgba(0,0,0,0.90) 50%, rgba(0,0,0,0.80) 58%, rgba(0,0,0,0) 67%, rgba(0,0,0,0) 100%)",
          }} />
          {/* top & bottom fade to black */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.85) 100%)" }} />
          {/* content */}
          <motion.div
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}
            style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px" }}
          >
            <h1 style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "clamp(1.5rem,2.2vw,2.1rem)", fontWeight: 700, letterSpacing: "0.13em", color: GOLD, textTransform: "uppercase", margin: "0 0 10px", textShadow: "0 2px 24px rgba(0,0,0,0.7)" }}>
              Conservation &amp; Solutions
            </h1>
            <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "clamp(0.8rem,1.1vw,0.95rem)", fontWeight: 700, letterSpacing: "0.22em", color: "rgba(212,175,55,1)", textTransform: "uppercase", margin: "0 0 10px" }}>
              Hawaiian Coot · <em style={{ fontStyle: "italic", fontFamily: "'Playfair Display', serif", letterSpacing: "0.05em" }}>Fulica alai</em>
            </p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "clamp(0.85rem,1.1vw,1rem)", color: "rgba(255,255,255,0.82)", maxWidth: 560, margin: "0 0 18px", lineHeight: 1.6 }}>
              Protecting the Hawaiian Coot requires constant vigilance: managing water, eliminating predators, and protecting land.
            </p>
            {/* pill row */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 20px", borderRadius: 999, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", border: `1px solid rgba(212,175,55,0.3)` }}>
              <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                🛡 Hanalei · James Campbell · Kealia Pond · Pearl Harbor
              </span>
              <span style={{ color: "rgba(212,175,55,0.5)", margin: "0 2px" }}>|</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80" }} />
                <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Last Updated: May 20, 2024</span>
              </div>
            </div>
          </motion.div>
        </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 0", paddingLeft: "clamp(24px,3vw,48px)", paddingRight: "clamp(24px,3vw,48px)" }}>

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
            style={{ borderRadius: 14, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "24px 28px", display: "flex", flexDirection: "column" }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 14, fontWeight: 800, color: GOLD, margin: 0, letterSpacing: "0.08em", textShadow: "0 0 18px rgba(212,175,55,0.35)" }}>✦ CONSERVATION DASHBOARD</p>
              <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>2024 DATA</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {TRENDS.map(t => (
                <div
                  key={t.label}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "16px 18px 16px 0",
                    borderRadius: 12,
                    background: `linear-gradient(135deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)`,
                    borderLeft: `4px solid ${t.color}`,
                    paddingLeft: 16,
                    boxShadow: `inset 0 0 40px ${t.color}0d`,
                    position: "relative", overflow: "hidden",
                  }}
                >
                  {/* Subtle color wash behind each row */}
                  <div style={{ position: "absolute", inset: 0, background: `${t.color}09`, borderRadius: 12, pointerEvents: "none" }} />

                  {/* Icon circle */}
                  <div style={{
                    width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
                    background: `${t.color}1a`,
                    border: `1.5px solid ${t.color}55`,
                    boxShadow: `0 0 18px ${t.color}33`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative", zIndex: 1,
                  }}>
                    <t.Icon size={22} color={t.color} />
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0, position: "relative", zIndex: 1 }}>
                    <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: t.color, margin: 0, letterSpacing: "0.1em", fontWeight: 700, opacity: 0.85 }}>{t.label.toUpperCase()}</p>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: t.color, margin: "2px 0 0", lineHeight: 1.15, textShadow: `0 0 20px ${t.color}55` }}>{t.status}</p>
                    <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.82)", margin: "3px 0 0", fontWeight: 500 }}>{t.detail}</p>
                  </div>

                  {/* Sparkline + badge */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0, position: "relative", zIndex: 1 }}>
                    <span style={{
                      fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, fontWeight: 800,
                      letterSpacing: "0.1em", padding: "3px 10px", borderRadius: 999,
                      background: `${t.color}22`, border: `1px solid ${t.color}66`,
                      color: t.color,
                    }}>{t.badge}</span>
                    <Sparkline data={t.data} color={t.color} />
                  </div>
                </div>
              ))}
            </div>

            <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.22)", margin: "14px 0 0", textAlign: "right", letterSpacing: "0.06em" }}>
              SOURCE: DOFAW · USFWS · TNC
            </p>
          </motion.div>
        </div>

        {/* ── Wetland Strongholds Map ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}
          style={{ marginBottom: 28, borderRadius: 16, border: `1px solid ${BORDER}`, background: CARD_BG, overflow: "hidden" }}
        >
          {/* ── Cinematic section header ── */}
          <div style={{
            padding: "26px 30px 22px",
            background: "linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(0,0,0,0) 55%)",
            borderBottom: `1px solid rgba(212,175,55,0.18)`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(212,175,55,0.14)", border: `1.5px solid rgba(212,175,55,0.5)`, boxShadow: "0 0 20px rgba(212,175,55,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <MapPin size={17} color={GOLD} />
              </div>
              <div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: GOLD, margin: 0, textShadow: "0 0 24px rgba(212,175,55,0.45)", letterSpacing: "0.02em" }}>
                  Hawaiʻi Wetland Strongholds
                </p>
                <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "3px 0 0", letterSpacing: "0.06em" }}>
                  Three national wildlife refuges protect the coots most vital habitat
                </p>
              </div>
            </div>
            <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em", flexShrink: 0 }}>3 REFUGES · USFWS</span>
          </div>

          {/* ── Refuge selector — image thumbnail cards ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: `1px solid rgba(212,175,55,0.18)` }}>
            {LOCATIONS.map((loc, i) => {
              const active = selectedLoc === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLoc(loc.id)}
                  style={{
                    position: "relative", overflow: "hidden", height: 110, cursor: "pointer",
                    border: "none", outline: "none", padding: 0,
                    borderRight: i < LOCATIONS.length - 1 ? `1px solid rgba(212,175,55,0.15)` : "none",
                    background: "transparent",
                    transition: "all 0.25s",
                  }}
                >
                  {/* Map thumbnail bg */}
                  {loc.mapImg && (
                    <img src={loc.mapImg} alt={loc.name}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", transition: "transform 0.4s ease", transform: active ? "scale(1.06)" : "scale(1.0)" }}
                    />
                  )}
                  {/* Overlay */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: active
                      ? "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.72) 100%)"
                      : "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.82) 100%)",
                    transition: "background 0.3s",
                  }} />
                  {/* Active gold border */}
                  {active && (
                    <div style={{ position: "absolute", inset: 0, border: `2px solid ${GOLD}`, boxShadow: `inset 0 0 20px rgba(212,175,55,0.18)`, pointerEvents: "none" }} />
                  )}
                  {/* Island badge */}
                  <div style={{ position: "absolute", top: 10, left: 12 }}>
                    <span style={{
                      fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, fontWeight: 800,
                      letterSpacing: "0.1em", padding: "2px 8px", borderRadius: 999,
                      background: active ? "rgba(212,175,55,0.9)" : "rgba(255,255,255,0.15)",
                      color: active ? "#000" : "rgba(255,255,255,0.8)",
                      backdropFilter: "blur(4px)",
                      transition: "all 0.25s",
                    }}>{loc.island.toUpperCase()}</span>
                  </div>
                  {/* Refuge name + population */}
                  <div style={{ position: "absolute", bottom: 10, left: 12, right: 12, textAlign: "left" }}>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: active ? GOLD : "rgba(255,255,255,0.9)", margin: 0, textShadow: "0 1px 8px rgba(0,0,0,0.9)", lineHeight: 1.2, transition: "color 0.25s" }}>
                      {loc.name.replace(" National Wildlife Refuge", "").replace(" NWR", "")} NWR
                    </p>
                    <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, color: active ? "rgba(212,175,55,0.85)" : "rgba(255,255,255,0.5)", margin: "3px 0 0", letterSpacing: "0.06em", transition: "color 0.25s" }}>
                      {loc.pop} birds
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── Main content: map + detail panel ── */}
          <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", minHeight: 430 }}>

            {/* Left: map image */}
            <AnimatePresence mode="wait">
              {locData?.mapImg ? (
                <motion.div
                  key={locData.id + "-map"}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  onClick={() => setLightbox({ src: locData.mapImg!, alt: `${locData.name} map` })}
                  style={{ position: "relative", cursor: "zoom-in", overflow: "hidden", borderRight: `1px solid rgba(212,175,55,0.18)` }}
                >
                  <img
                    src={locData.mapImg} alt={`${locData.name} satellite map`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block", transition: "transform 0.6s ease" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  />
                  {/* Bottom gradient for legibility */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 90, background: "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 100%)", pointerEvents: "none" }} />
                  {/* Top-left: USFWS badge */}
                  <div style={{ position: "absolute", top: 14, left: 14, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "6px 14px" }}>
                    <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 9, color: GOLD_DIM, margin: 0, letterSpacing: "0.12em" }}>OFFICIAL USFWS MAP</p>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: "rgba(255,255,255,0.95)", margin: 0 }}>{locData.name}</p>
                  </div>
                  {/* Bottom-right: zoom hint */}
                  <div style={{ position: "absolute", bottom: 14, right: 14, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", border: `1px solid rgba(212,175,55,0.35)`, borderRadius: 8, padding: "5px 12px", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 12 }}>🔍</span>
                    <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.8)", letterSpacing: "0.08em" }}>CLICK TO EXPAND</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={(locData?.id ?? "none") + "-svg"}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  style={{ padding: "24px 28px", borderRight: `1px solid rgba(212,175,55,0.18)`, display: "flex", flexDirection: "column", justifyContent: "center" }}
                >
                  <HawaiiMap selected={selectedLoc} onSelect={setSelectedLoc} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Right: detail panel */}
            <AnimatePresence mode="wait">
              {locData ? (
                <motion.div
                  key={locData.id + "-detail"}
                  initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }}
                  transition={{ duration: 0.35 }}
                  style={{ padding: "22px 22px 20px", display: "flex", flexDirection: "column", gap: 14, overflowY: "auto" }}
                >
                  {/* Header */}
                  <div style={{ paddingBottom: 14, borderBottom: `1px solid rgba(212,175,55,0.14)` }}>
                    <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", padding: "3px 10px", borderRadius: 999, background: "rgba(212,175,55,0.18)", border: `1px solid rgba(212,175,55,0.45)`, color: GOLD }}>
                      {locData.island.toUpperCase()}
                    </span>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 21, color: "#fff", margin: "8px 0 0", lineHeight: 1.2 }}>{locData.name}</p>
                    <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12.5, color: "rgba(255,255,255,0.72)", margin: "8px 0 0", lineHeight: 1.65 }}>{locData.desc}</p>
                  </div>

                  {/* Stats grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {/* Population */}
                    <div style={{ padding: "12px 14px", borderRadius: 10, border: `1px solid rgba(74,222,128,0.3)`, background: "rgba(74,222,128,0.06)" }}>
                      <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: "rgba(74,222,128,0.8)", margin: "0 0 3px", letterSpacing: "0.1em", fontWeight: 700 }}>🐦 POPULATION</p>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#4ade80", margin: 0, lineHeight: 1 }}>{locData.pop}</p>
                      <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.45)", margin: "3px 0 0" }}>birds estimated</p>
                    </div>
                    {/* Habitat */}
                    <div style={{ padding: "12px 14px", borderRadius: 10, border: `1px solid ${BORDER}`, background: "rgba(212,175,55,0.06)" }}>
                      <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: GOLD_DIM, margin: "0 0 3px", letterSpacing: "0.1em", fontWeight: 700 }}>🌿 HABITAT</p>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: GOLD, margin: 0, lineHeight: 1 }}>{locData.habitat}</p>
                      <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.45)", margin: "3px 0 0" }}>protected acres</p>
                    </div>
                    {/* Threat level */}
                    <div style={{ padding: "12px 14px", borderRadius: 10, border: `1px solid ${locData.threat === "Low" ? "rgba(74,222,128,0.3)" : locData.threat === "High" ? "rgba(248,80,50,0.35)" : "rgba(212,175,55,0.3)"}`, background: locData.threat === "Low" ? "rgba(74,222,128,0.06)" : locData.threat === "High" ? "rgba(248,80,50,0.07)" : "rgba(212,175,55,0.06)" }}>
                      <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.55)", margin: "0 0 3px", letterSpacing: "0.1em", fontWeight: 700 }}>⚠ THREAT LEVEL</p>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: locData.threat === "Low" ? "#4ade80" : locData.threat === "High" ? "rgba(248,80,50,1)" : GOLD, margin: 0 }}>{locData.threat}</p>
                    </div>
                    {/* Recovery */}
                    <div style={{ padding: "12px 14px", borderRadius: 10, border: `1px solid ${BORDER}`, background: "rgba(212,175,55,0.06)" }}>
                      <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.55)", margin: "0 0 6px", letterSpacing: "0.1em", fontWeight: 700 }}>✦ RECOVERY</p>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: GOLD, margin: "0 0 6px", lineHeight: 1 }}>{locData.recovery}%</p>
                      <div style={{ height: 5, borderRadius: 999, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${locData.recovery}%`, background: `linear-gradient(90deg, ${RED}, ${GOLD})`, borderRadius: 999 }} />
                      </div>
                    </div>
                  </div>

                  {/* Photos */}
                  {(locData.id === "campbell" || locData.id === "hanalei" || locData.id === "kealia") && (() => {
                    const photos: CarouselPhoto[] = locData.id === "campbell"
                      ? [
                          { src: "/campbell-habitat.png", alt: "James Campbell NWR wetland habitat" },
                          { src: "/campbell-coot.png",    alt: "Hawaiian Coot at James Campbell NWR" },
                          { src: "/campbell-3.png",       alt: "Wetland pond and observation pavilion at James Campbell NWR" },
                          { src: "/campbell-4.png",       alt: "Hawaiian Coots in flight over James Campbell NWR pond" },
                          { src: "/campbell-5.png",       alt: "James Campbell NWR entrance sign" },
                          { src: "/campbell-6.png",       alt: "Herons at James Campbell NWR wetland marsh" },
                        ]
                      : locData.id === "hanalei"
                      ? [
                          { src: "/hanalei-1.png", alt: "Hanalei NWR information panels" },
                          { src: "/hanalei-2.png", alt: "Hanalei Valley from the overlook" },
                          { src: "/hanalei-3.png", alt: "Taro fields at golden hour, Hanalei Valley" },
                          { src: "/hanalei-4.png", alt: "Endangered Birds of the Hanalei NWR interpretive sign" },
                          { src: "/hanalei-5.png", alt: "Hanalei NWR visitor kiosk" },
                          { src: "/hanalei-6.png", alt: "Hawaiian Coot in taro fields at Hanalei" },
                        ]
                      : [
                          { src: "/kealia-1.png", alt: "Keālia Pond NWR entrance sculpture" },
                          { src: "/kealia-2.png", alt: "Boardwalk trail through Keālia Pond NWR" },
                          { src: "/kealia-3.png", alt: "Waipuilani Stream outlet at Keālia Pond" },
                          { src: "/kealia-4.png", alt: "Hawaiian Coot swimming at Keālia Pond" },
                          { src: "/kealia-5.png", alt: "Flock of Hawaiian Coots at Keālia Pond wetland" },
                          { src: "/kealia-6.png", alt: "Keālia Pond NWR sign with pond and mountains" },
                        ];
                    const openCarousel = (i: number) => setCarousel({ photos, index: i });
                    const cols = photos.length >= 6 ? "1fr 1fr 1fr" : "1fr 1fr";
                    const ratio = "4/3";
                    return (
                      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 6 }}>
                        {photos.map((img, i) => (
                          <div key={img.src} onClick={() => openCarousel(i)}
                            style={{ aspectRatio: ratio, borderRadius: 8, overflow: "hidden", cursor: "zoom-in", position: "relative" }}
                          >
                            <img src={img.src} alt={img.alt}
                              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.35s ease" }}
                              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
                              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                            />
                            {/* hover overlay hint */}
                            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", transition: "background 0.2s" }}
                              onMouseEnter={e => (e.currentTarget.style.background = "rgba(212,175,55,0.08)")}
                              onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0)")}
                            />
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                  {/* CTA */}
                  <a
                    href={locData.id === "campbell" ? "https://www.fws.gov/refuge/james-campbell" : locData.id === "hanalei" ? "https://www.fws.gov/refuge/hanalei" : "https://www.fws.gov/refuge/kealia-pond"}
                    target="_blank" rel="noreferrer" style={{ textDecoration: "none", marginTop: "auto" }}
                  >
                    <div style={{
                      padding: "12px 0", textAlign: "center", borderRadius: 10,
                      border: `1px solid rgba(212,175,55,0.55)`,
                      background: "linear-gradient(135deg, rgba(212,175,55,0.14) 0%, rgba(212,175,55,0.07) 100%)",
                      fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, fontWeight: 800,
                      letterSpacing: "0.12em", color: GOLD, cursor: "pointer",
                      boxShadow: "0 0 18px rgba(212,175,55,0.12)", textShadow: "0 0 10px rgba(212,175,55,0.4)",
                    }}>
                      ✦ VISIT USFWS REFUGE PAGE ✦
                    </div>
                  </a>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>Select a refuge above</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
