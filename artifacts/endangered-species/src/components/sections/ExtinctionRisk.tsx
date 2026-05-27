// ─── Extinction Risk — Cinematic Interactive Page ─────────────────────────────
import { useState, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, Droplets, Wind, Activity, Users,
  ChevronLeft, ChevronRight, Info, X, TrendingDown,
  BarChart2, Shield, Leaf, Heart, Map,
} from "lucide-react";

// ─── Palette ──────────────────────────────────────────────────────────────────
const GOLD     = "rgba(212,175,55,1)";
const GOLD_DIM = "rgba(212,175,55,0.65)";
const CRIMSON  = "rgba(220,50,30,1)";
const AMBER    = "rgba(245,158,11,1)";
const GREEN    = "rgba(74,222,128,1)";
// Dark near-black cards — no maroon
const CARD_BG  = "rgba(8,10,18,0.97)";
const CARD_RED = "rgba(10,5,12,0.97)";
const BORDER   = "rgba(212,175,55,0.38)";
const FF_SERIF = "'Playfair Display', serif";
const FF_SANS  = "'Josefin Sans', sans-serif";

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "overview",     label: "Overview",        Icon: BarChart2  },
  { id: "threats",      label: "Threats",         Icon: AlertTriangle },
  { id: "population",   label: "Population",      Icon: TrendingDown },
  { id: "habitat",      label: "Habitat",         Icon: Leaf       },
  { id: "conservation", label: "Conservation",    Icon: Shield     },
  { id: "action",       label: "What You Can Do", Icon: Heart      },
];

// ─── Threat data ──────────────────────────────────────────────────────────────
const THREATS = [
  { id: "habitat",   Icon: Droplets,      label: "Habitat Loss",
    desc: "Loss and degradation of wetlands due to development and water diversion.",
    pct: 84, severity: "HIGH",     color: CRIMSON,
    detail: "Over 90% of Hawaiian wetlands have been drained, filled, or converted since 1900. Remaining wetlands face pressure from urban expansion, agricultural diversion, and altered hydrology. The decline of traditional taro farming has removed thousands of additional acres of shallow freshwater habitat critical for foraging and nesting.",
  },
  { id: "predators", Icon: AlertTriangle, label: "Invasive Predators",
    desc: "Predation by introduced mongooses, rats, and feral cats on eggs and chicks.",
    pct: 78, severity: "HIGH",     color: CRIMSON,
    detail: "Small Indian mongooses were introduced in 1883 and now occupy all major islands except Kauaʻi. They actively raid ground nests, destroying eggs and killing chicks. Rats and feral cats compound the threat. Predator-proof fencing around key refuges has reduced nest failures significantly, but requires constant maintenance.",
  },
  { id: "climate",   Icon: Wind,          label: "Climate Change",
    desc: "Sea level rise, increased droughts, and more intense storms degrade wetlands.",
    pct: 65, severity: "MED-HIGH", color: AMBER,
    detail: "Rising sea levels threaten low-lying coastal wetlands with saltwater intrusion. Increasingly frequent hurricanes can cause sudden population crashes — a single storm can flood nesting sites island-wide. Extended droughts concentrate birds at shrinking water sources, dramatically raising disease transmission risk.",
  },
  { id: "disease",   Icon: Activity,      label: "Disease",
    desc: "Avian malaria and avian pox transmitted by Culex mosquitoes threaten health.",
    pct: 45, severity: "MEDIUM",   color: GOLD,
    detail: "Introduced by non-native birds, avian malaria (Plasmodium relictum) and avian pox (Avipoxvirus) are spread by Culex mosquitoes. Hawaiian waterbirds evolved without these pathogens and have little immunity. Climate warming expands mosquito habitat to higher elevations, threatening previously safe mountain refuges.",
  },
  { id: "human",     Icon: Users,         label: "Human Disturbance",
    desc: "Recreation, vehicles, and human activity disturb nesting and feeding areas.",
    pct: 40, severity: "MEDIUM",   color: GOLD,
    detail: "Recreational activity near nesting sites causes adults to flush, exposing eggs to heat and predators. Vehicle strikes are a documented mortality source on refuge-adjacent roads. Fishing line entanglement and lead sinker ingestion have caused deaths. Noise pollution from urban encroachment disrupts critical feeding behaviour.",
  },
];

const POP_DATA = [
  { year: 1990, pop: 8800 }, { year: 1995, pop: 7100 }, { year: 2000, pop: 5400 },
  { year: 2005, pop: 4000 }, { year: 2010, pop: 2700 }, { year: 2015, pop: 2300 },
  { year: 2018, pop: 2600 }, { year: 2021, pop: 2950 }, { year: 2024, pop: 3200 },
];

const REFUGES = [
  { src: "/kealia-2.png",         name: "Keālia Pond NWR",    island: "Maui",   url: "https://www.fws.gov/refuge/kealia-pond" },
  { src: "/campbell-habitat.png", name: "James Campbell NWR", island: "Oʻahu",  url: "https://www.fws.gov/refuge/james-campbell" },
  { src: "/hanalei-3.png",        name: "Hanalei NWR",        island: "Kauaʻi", url: "https://www.fws.gov/refuge/hanalei" },
];

// ─── Animated threat bar ──────────────────────────────────────────────────────
function ThreatBar({ t, delay }: { t: typeof THREATS[0]; delay: number }) {
  const ref  = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [open, setOpen] = useState(false);

  return (
    <div ref={ref} style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: 14, marginBottom: 6 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 9 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${t.color}18`, border: `1.5px solid ${t.color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
          <t.Icon size={18} color={t.color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: FF_SANS, fontSize: 15, fontWeight: 800, color: "rgba(255,255,255,0.95)", margin: 0, letterSpacing: "0.04em" }}>{t.label}</p>
          <p style={{ fontFamily: FF_SANS, fontSize: 13, color: "rgba(255,255,255,0.52)", margin: "3px 0 0", lineHeight: 1.5 }}>{t.desc}</p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ fontFamily: FF_SANS, fontSize: 12, fontWeight: 800, color: t.color, margin: 0, letterSpacing: "0.1em" }}>{t.severity}</p>
          <p style={{ fontFamily: FF_SERIF, fontSize: 20, color: t.color, margin: 0, lineHeight: 1.1 }}>{t.pct}%</p>
        </div>
        <button onClick={() => setOpen(o => !o)}
          style={{ background: "none", border: "1px solid rgba(255,255,255,0.22)", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, marginTop: 4, color: "rgba(255,255,255,0.5)", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.color = t.color; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
        >
          {open ? <X size={13} /> : <Info size={13} />}
        </button>
      </div>
      <div style={{ height: 6, borderRadius: 999, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${t.pct}%` } : { width: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay }}
          style={{ height: "100%", borderRadius: 999, background: `linear-gradient(90deg, ${t.color}99, ${t.color})`, boxShadow: `0 0 10px ${t.color}44` }}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: "hidden" }}>
            <div style={{ marginTop: 12, padding: "14px 16px", borderRadius: 10, background: `${t.color}0c`, border: `1px solid ${t.color}28` }}>
              <p style={{ fontFamily: FF_SANS, fontSize: 13, color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.75 }}>{t.detail}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Population SVG chart ─────────────────────────────────────────────────────
function PopChart() {
  const W = 300, H = 130;
  const pad = { l: 42, r: 14, t: 12, b: 28 };
  const maxPop = 10000;
  const xS = (y: number) => pad.l + (y - 1990) / (2024 - 1990) * (W - pad.l - pad.r);
  const yS = (p: number) => pad.t + (1 - p / maxPop) * (H - pad.t - pad.b);
  const pts = POP_DATA.map(d => `${xS(d.year).toFixed(1)},${yS(d.pop).toFixed(1)}`).join(" ");
  const fillPts = [`${xS(1990)},${H - pad.b}`, ...POP_DATA.map(d => `${xS(d.year).toFixed(1)},${yS(d.pop).toFixed(1)}`), `${xS(2024)},${H - pad.b}`].join(" ");
  const last = POP_DATA[POP_DATA.length - 1];

  return (
    <svg width={W} height={H} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="popGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={CRIMSON} stopOpacity="0.25" />
          <stop offset="100%" stopColor={CRIMSON} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 2500, 5000, 7500, 10000].map(v => (
        <g key={v}>
          <line x1={pad.l} y1={yS(v)} x2={W - pad.r} y2={yS(v)} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
          <text x={pad.l - 5} y={yS(v) + 4} textAnchor="end" fill="rgba(255,255,255,0.32)" fontSize={10} fontFamily={FF_SANS}>
            {v >= 1000 ? `${v / 1000}K` : v}
          </text>
        </g>
      ))}
      <polygon points={fillPts} fill="url(#popGrad)" />
      <polyline points={pts} fill="none" stroke={CRIMSON} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={xS(last.year)} cy={yS(last.pop)} r={5} fill={CRIMSON} />
      <circle cx={xS(last.year)} cy={yS(last.pop)} r={10} fill={CRIMSON} fillOpacity={0.18} />
      <rect x={xS(last.year) - 28} y={yS(last.pop) - 18} width={56} height={15} rx={4} fill="rgba(220,50,30,0.88)" />
      <text x={xS(last.year)} y={yS(last.pop) - 8} textAnchor="middle" fill="#fff" fontSize={9} fontFamily={FF_SANS} fontWeight="bold">~3,200</text>
      {[1990, 2000, 2010, 2020, 2024].map(y => (
        <text key={y} x={xS(y)} y={H - pad.b + 16} textAnchor="middle" fill="rgba(255,255,255,0.32)" fontSize={10} fontFamily={FF_SANS}>{y}</text>
      ))}
    </svg>
  );
}

// ─── Donut chart ──────────────────────────────────────────────────────────────
function DonutChart({ pct, color, label }: { pct: number; color: string; label: string }) {
  const r = 50, cx = 66, cy = 66, stroke = 13;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={132} height={132} style={{ display: "block" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash.toFixed(1)} ${(circ - dash).toFixed(1)}`}
          strokeLinecap="round"
          style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
        />
        <text x={cx} y={cy - 3} textAnchor="middle" fill={color} fontSize={24} fontFamily={FF_SERIF} fontWeight="bold">{pct}%</text>
        <text x={cx} y={cy + 16} textAnchor="middle" fill="rgba(255,255,255,0.42)" fontSize={10} fontFamily={FF_SANS}>{label}</text>
      </svg>
    </div>
  );
}

// ─── Threat simulator ─────────────────────────────────────────────────────────
function ThreatSim() {
  const [years, setYears] = useState(10);
  const estPop  = Math.max(180, Math.round(3200 * Math.pow(0.845, years)));
  const risk     = estPop >= 2800 ? "LOW" : estPop >= 1800 ? "MEDIUM" : estPop >= 900 ? "HIGH" : "CRITICAL";
  const riskColor = risk === "LOW" ? GREEN : risk === "MEDIUM" ? GOLD : CRIMSON;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <p style={{ fontFamily: FF_SANS, fontSize: 12, color: "rgba(255,255,255,0.45)", margin: "0 0 10px", letterSpacing: "0.08em" }}>WHAT IF CONSERVATION STOPPED?</p>
      <div style={{ marginBottom: 16 }}>
        <input type="range" min={0} max={20} value={years} onChange={e => setYears(Number(e.target.value))}
          style={{ width: "100%", accentColor: CRIMSON, cursor: "pointer" }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontFamily: FF_SANS, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>0 yr</span>
          <span style={{ fontFamily: FF_SANS, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>20 yr</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, flex: 1 }}>
        <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <p style={{ fontFamily: FF_SANS, fontSize: 11, color: "rgba(255,255,255,0.4)", margin: "0 0 3px", letterSpacing: "0.1em" }}>YEAR</p>
          <p style={{ fontFamily: FF_SERIF, fontSize: 30, color: GOLD, margin: 0, lineHeight: 1 }}>{years}</p>
        </div>
        <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <p style={{ fontFamily: FF_SANS, fontSize: 11, color: "rgba(255,255,255,0.4)", margin: "0 0 3px", letterSpacing: "0.1em" }}>EST. POPULATION</p>
          <p style={{ fontFamily: FF_SERIF, fontSize: 22, color: CRIMSON, margin: 0, lineHeight: 1 }}>~{estPop.toLocaleString()}</p>
        </div>
        <div style={{ gridColumn: "1 / -1", padding: "10px 14px", borderRadius: 10, background: `${riskColor}14`, border: `1px solid ${riskColor}44`, textAlign: "center" }}>
          <p style={{ fontFamily: FF_SANS, fontSize: 11, color: "rgba(255,255,255,0.4)", margin: "0 0 2px", letterSpacing: "0.1em" }}>RISK LEVEL</p>
          <p style={{ fontFamily: FF_SERIF, fontSize: 26, fontWeight: 700, color: riskColor, margin: 0, textShadow: `0 0 18px ${riskColor}55` }}>{risk}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Refuge mini-carousel ─────────────────────────────────────────────────────
function RefugeCarousel() {
  const [idx, setIdx] = useState(0);
  const cur  = REFUGES[idx];
  const prev = useCallback(() => setIdx(i => (i - 1 + REFUGES.length) % REFUGES.length), []);
  const next = useCallback(() => setIdx(i => (i + 1) % REFUGES.length), []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative", overflow: "hidden" }}>
      <AnimatePresence mode="wait">
        <motion.img key={idx} src={cur.src} alt={cur.name}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AnimatePresence>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.08) 55%)" }} />
      <div style={{ position: "absolute", bottom: 42, left: 16, right: 16 }}>
        <p style={{ fontFamily: FF_SANS, fontSize: 12, color: GOLD_DIM, margin: 0, letterSpacing: "0.12em" }}>{cur.island.toUpperCase()}</p>
        <p style={{ fontFamily: FF_SERIF, fontSize: 16, color: "#fff", margin: "3px 0 0" }}>{cur.name}</p>
      </div>
      <a href={cur.url} target="_blank" rel="noreferrer"
        style={{ position: "absolute", bottom: 14, left: 16, fontFamily: FF_SANS, fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: "0.1em", textDecoration: "none" }}>
        EXPLORE HABITAT →
      </a>
      <button onClick={prev} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: "50%", width: 32, height: 32, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronLeft size={15} /></button>
      <button onClick={next} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: "50%", width: 32, height: 32, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronRight size={15} /></button>
      <div style={{ position: "absolute", bottom: 16, right: 16, display: "flex", gap: 5 }}>
        {REFUGES.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 20 : 7, height: 7, borderRadius: 999, background: i === idx ? GOLD : "rgba(255,255,255,0.3)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.25s" }} />
        ))}
      </div>
    </div>
  );
}

// ─── Dot Matrix ───────────────────────────────────────────────────────────────
function DotMatrix() {
  const cols = 22, total = 400, active = 320;
  const ref   = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 4, maxWidth: 360 }}>
        {Array.from({ length: total }).map((_, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.22, delay: i * 0.004, ease: "backOut" }}
            style={{ width: 9, height: 9, borderRadius: "50%", background: i < active ? CRIMSON : "rgba(255,255,255,0.1)", boxShadow: i < active ? `0 0 3px ${CRIMSON}55` : "none" }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Tab navigation — centered, appealing ─────────────────────────────────────
function TabNav({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  return (
    <div style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(212,175,55,0.18)", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "center", gap: 4, padding: "0 24px", overflowX: "auto" }}>
        {TABS.map(t => {
          const isActive = active === t.id;
          return (
            <button key={t.id} onClick={() => onSelect(t.id)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                fontFamily: FF_SANS, fontSize: 13, fontWeight: 800, letterSpacing: "0.08em",
                padding: "16px 22px",
                cursor: "pointer", border: "none", outline: "none",
                background: isActive ? "rgba(212,175,55,0.1)" : "transparent",
                color: isActive ? GOLD : "rgba(255,255,255,0.42)",
                borderBottom: isActive ? `3px solid ${GOLD}` : "3px solid transparent",
                marginBottom: -1,
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = "rgba(255,255,255,0.82)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = "rgba(255,255,255,0.42)"; e.currentTarget.style.background = "transparent"; } }}
            >
              <t.Icon size={14} />
              {t.label.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Section heading helper ───────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: FF_SANS, fontSize: 13, fontWeight: 800, color: GOLD, margin: 0, letterSpacing: "0.1em", textShadow: "0 0 16px rgba(212,175,55,0.3)" }}>
      ✦ {children}
    </p>
  );
}

// ─── Overview ─────────────────────────────────────────────────────────────────
function OverviewContent() {
  return (
    <div style={{ padding: "32px 40px 48px", maxWidth: 1240, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginBottom: 22 }}>

        {/* Threat Matrix */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ borderRadius: 16, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "26px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <SectionLabel>THREAT MATRIX</SectionLabel>
            <span style={{ fontFamily: FF_SANS, fontSize: 11, color: "rgba(255,255,255,0.28)", letterSpacing: "0.08em" }}>CLICK ⓘ FOR DETAILS</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {THREATS.map((t, i) => <ThreatBar key={t.id} t={t} delay={0.1 + i * 0.08} />)}
          </div>
        </motion.div>

        {/* A Fragile Balance */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.12 }}
          style={{ borderRadius: 16, border: "1px solid rgba(220,50,30,0.32)", background: CARD_RED, padding: "26px 28px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <p style={{ fontFamily: FF_SERIF, fontSize: 22, color: GOLD, margin: 0, textShadow: "0 0 20px rgba(212,175,55,0.3)" }}>A Fragile Balance</p>
            <TrendingDown size={20} color={CRIMSON} />
          </div>
          <p style={{ fontFamily: FF_SANS, fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.95)", margin: "0 0 8px" }}>
            Only ~3,200 Hawaiian Coots remain.
          </p>
          <p style={{ fontFamily: FF_SANS, fontSize: 13, color: "rgba(255,255,255,0.55)", margin: "0 0 20px", lineHeight: 1.65 }}>
            One major hurricane season or severe prolonged drought could reduce the population by 30%.
          </p>
          <DotMatrix />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, alignItems: "center" }}>
            <p style={{ fontFamily: FF_SANS, fontSize: 12, color: "rgba(255,255,255,0.35)", margin: 0 }}>Each dot represents ~10 birds</p>
            <p style={{ fontFamily: FF_SERIF, fontSize: 15, color: CRIMSON, margin: 0, fontStyle: "italic" }}>~3,200 birds estimated</p>
          </div>
        </motion.div>
      </div>

      {/* Bottom 4 cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1.1fr", gap: 16 }}>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.22 }}
          style={{ borderRadius: 16, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "20px 20px 16px" }}>
          <SectionLabel>POPULATION TREND</SectionLabel>
          <div style={{ marginTop: 14 }}><PopChart /></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          style={{ borderRadius: 16, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "20px 20px 16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ alignSelf: "flex-start" }}><SectionLabel>HABITAT STATUS</SectionLabel></div>
          <div style={{ marginTop: 12 }}><DonutChart pct={42} color={GREEN} label="of historical" /></div>
          <p style={{ fontFamily: FF_SANS, fontSize: 13, color: "rgba(255,255,255,0.52)", margin: "6px 0 0", textAlign: "center" }}>wetlands remain</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.36 }}
          style={{ borderRadius: 16, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "20px 20px 16px" }}>
          <SectionLabel>THREAT SIMULATOR</SectionLabel>
          <div style={{ marginTop: 14 }}><ThreatSim /></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.42 }}
          style={{ borderRadius: 16, border: `1px solid ${BORDER}`, overflow: "hidden", position: "relative", minHeight: 220 }}>
          <RefugeCarousel />
        </motion.div>
      </div>
    </div>
  );
}

// ─── Threats tab ──────────────────────────────────────────────────────────────
function ThreatsContent() {
  return (
    <div style={{ padding: "32px 40px 48px", maxWidth: 1000, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={{ fontFamily: FF_SANS, fontSize: 14, color: "rgba(255,255,255,0.5)", margin: "0 0 8px", lineHeight: 1.6 }}>
          Five primary threat categories are actively monitored by U.S. Fish & Wildlife Service researchers.
        </p>
        {THREATS.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            style={{ borderRadius: 14, border: `1px solid ${t.color}2e`, background: CARD_BG, padding: "22px 26px", borderLeft: `4px solid ${t.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${t.color}18`, border: `1.5px solid ${t.color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <t.Icon size={22} color={t.color} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: FF_SANS, fontSize: 16, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "0.04em" }}>{t.label}</p>
                <p style={{ fontFamily: FF_SANS, fontSize: 13, color: t.color, margin: "3px 0 0", fontWeight: 700 }}>{t.severity} — {t.pct}% severity index</p>
              </div>
              <div style={{ height: 8, width: 130, borderRadius: 999, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${t.pct}%` }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 + i * 0.1 }}
                  style={{ height: "100%", background: t.color, borderRadius: 999 }} />
              </div>
            </div>
            <p style={{ fontFamily: FF_SANS, fontSize: 14, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.75 }}>{t.detail}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Population tab ───────────────────────────────────────────────────────────
function PopulationContent() {
  return (
    <div style={{ padding: "32px 40px 48px", maxWidth: 1100, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 22 }}>
        <div style={{ borderRadius: 16, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "26px 30px" }}>
          <SectionLabel>POPULATION TRAJECTORY 1990 – 2024</SectionLabel>
          <p style={{ fontFamily: FF_SANS, fontSize: 14, color: "rgba(255,255,255,0.5)", margin: "8px 0 22px", lineHeight: 1.6 }}>From ~8,800 birds to a low of ~2,300, now recovering to ~3,200 thanks to refuge protection.</p>
          <svg width="100%" viewBox="0 0 480 165" style={{ display: "block", overflow: "visible" }}>
            <defs>
              <linearGradient id="popGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CRIMSON} stopOpacity="0.26" />
                <stop offset="100%" stopColor={CRIMSON} stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0,2500,5000,7500,10000].map(v => {
              const y2 = 12 + (1 - v/10000) * 122;
              return <g key={v}>
                <line x1={52} y1={y2} x2={470} y2={y2} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
                <text x={46} y={y2+4} textAnchor="end" fill="rgba(255,255,255,0.32)" fontSize={11} fontFamily={FF_SANS}>{v>=1000?`${v/1000}K`:v}</text>
              </g>;
            })}
            <polygon points={[`52,134`, ...POP_DATA.map(d => `${52+(d.year-1990)/(2024-1990)*418},${12+(1-d.pop/10000)*122}`), `470,134`].join(" ")} fill="url(#popGrad2)" />
            <polyline points={POP_DATA.map(d => `${52+(d.year-1990)/(2024-1990)*418},${12+(1-d.pop/10000)*122}`).join(" ")} fill="none" stroke={CRIMSON} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            {POP_DATA.map((d, i) => {
              const cx2 = 52+(d.year-1990)/(2024-1990)*418;
              const cy2 = 12+(1-d.pop/10000)*122;
              return <g key={i}>
                <circle cx={cx2} cy={cy2} r={4} fill={CRIMSON} />
                <text x={cx2} y={155} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={11} fontFamily={FF_SANS}>{d.year}</text>
              </g>;
            })}
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { label: "1970s Low",  value: "~1,800", note: "Near-extinction; ESA listing",          color: CRIMSON },
            { label: "1990s Peak", value: "~8,800", note: "Best count in modern records",          color: GREEN  },
            { label: "2015 Low",   value: "~2,300", note: "Drought + habitat pressure",            color: AMBER  },
            { label: "2024 Count", value: "~3,200", note: "Partial recovery underway",             color: GOLD   },
          ].map(s => (
            <div key={s.label} style={{ borderRadius: 12, border: `1px solid ${s.color}30`, background: `${s.color}0a`, padding: "16px 18px" }}>
              <p style={{ fontFamily: FF_SANS, fontSize: 12, color: "rgba(255,255,255,0.45)", margin: "0 0 3px", letterSpacing: "0.1em" }}>{s.label.toUpperCase()}</p>
              <p style={{ fontFamily: FF_SERIF, fontSize: 32, color: s.color, margin: 0, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontFamily: FF_SANS, fontSize: 13, color: "rgba(255,255,255,0.52)", margin: "5px 0 0" }}>{s.note}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Habitat tab ──────────────────────────────────────────────────────────────
function HabitatContent() {
  return (
    <div style={{ padding: "32px 40px 48px", maxWidth: 1100, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        <div style={{ borderRadius: 16, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "26px 28px" }}>
          <SectionLabel>WETLAND LOSS TIMELINE</SectionLabel>
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Historical wetlands (1800s)", value: "~900,000 acres", color: GREEN  },
              { label: "Remaining today",             value: "~378,000 acres (42%)", color: AMBER  },
              { label: "Protected refuge wetlands",   value: "~5,000 acres",    color: GOLD   },
              { label: "Wetlands lost since 1900",    value: "> 58%",           color: CRIMSON},
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                style={{ padding: "16px 18px", borderRadius: 12, border: `1px solid ${s.color}30`, background: `${s.color}0a` }}>
                <p style={{ fontFamily: FF_SANS, fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "0 0 4px" }}>{s.label}</p>
                <p style={{ fontFamily: FF_SERIF, fontSize: 24, color: s.color, margin: 0 }}>{s.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <div style={{ borderRadius: 16, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "26px 28px" }}>
          <SectionLabel>REMAINING WETLAND TYPES</SectionLabel>
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              { type: "Coastal Wetlands", pct: 38, desc: "Brackish coastal ponds, estuaries, and salt flats used for foraging" },
              { type: "Freshwater Ponds", pct: 28, desc: "Inland shallow ponds and reservoirs — primary coot habitat" },
              { type: "Taro Fields",      pct: 18, desc: "Traditional kalo farming paddies with shallow flooded margins" },
              { type: "Managed Refuge",   pct: 16, desc: "Actively managed wetland cells within National Wildlife Refuges" },
            ].map((w, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: FF_SANS, fontSize: 14, color: "rgba(255,255,255,0.85)" }}>{w.type}</span>
                  <span style={{ fontFamily: FF_SANS, fontSize: 14, fontWeight: 800, color: GREEN }}>{w.pct}%</span>
                </div>
                <div style={{ height: 5, borderRadius: 999, background: "rgba(255,255,255,0.07)", overflow: "hidden", marginBottom: 5 }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${w.pct}%` }} transition={{ duration: 1.1, delay: 0.3 + i * 0.1 }}
                    style={{ height: "100%", background: GREEN, borderRadius: 999 }} />
                </div>
                <p style={{ fontFamily: FF_SANS, fontSize: 12, color: "rgba(255,255,255,0.42)", margin: 0 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Conservation tab ─────────────────────────────────────────────────────────
function ConservationContent() {
  const milestones = [
    { year: "1970", event: "Hawaiian Coot listed under the Endangered Species Act",         type: "law"       },
    { year: "1972", event: "Hanalei National Wildlife Refuge established on Kauaʻi",        type: "refuge"    },
    { year: "1978", event: "James Campbell NWR established on Oʻahu north shore",           type: "refuge"    },
    { year: "1992", event: "Keālia Pond NWR established on Maui south shore",               type: "refuge"    },
    { year: "2005", event: "Hawaiian Coot downlisted from Endangered to Vulnerable",        type: "milestone" },
    { year: "2010", event: "Predator control fencing expanded to 80% of key nesting sites", type: "action"    },
    { year: "2019", event: "Population exceeds 3,000 for first time since early 2000s",     type: "milestone" },
    { year: "2024", event: "Ongoing wetland restoration targets an additional 1,200 acres", type: "action"    },
  ];
  const colors: Record<string, string> = { law: CRIMSON, refuge: GREEN, milestone: GOLD, action: AMBER };

  return (
    <div style={{ padding: "32px 40px 48px", maxWidth: 900, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p style={{ fontFamily: FF_SANS, fontSize: 14, color: "rgba(255,255,255,0.5)", margin: "0 0 28px", lineHeight: 1.65 }}>
          Conservation milestones that have shaped the Hawaiian Coot's partial recovery over five decades.
        </p>
        <div style={{ position: "relative", paddingLeft: 36 }}>
          <div style={{ position: "absolute", left: 9, top: 0, bottom: 0, width: 2, background: `linear-gradient(180deg, ${GOLD}55, transparent)` }} />
          {milestones.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              style={{ marginBottom: 18, position: "relative" }}>
              <div style={{ position: "absolute", left: -30, top: 8, width: 12, height: 12, borderRadius: "50%", background: colors[m.type], boxShadow: `0 0 12px ${colors[m.type]}66` }} />
              <div style={{ padding: "16px 20px", borderRadius: 12, border: `1px solid ${colors[m.type]}26`, background: `${colors[m.type]}0a` }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
                  <span style={{ fontFamily: FF_SERIF, fontSize: 22, color: colors[m.type] }}>{m.year}</span>
                  <span style={{ fontFamily: FF_SANS, fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{m.type}</span>
                </div>
                <p style={{ fontFamily: FF_SANS, fontSize: 14, color: "rgba(255,255,255,0.78)", margin: 0, lineHeight: 1.65 }}>{m.event}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── What You Can Do tab ──────────────────────────────────────────────────────
function ActionContent() {
  const actions = [
    { icon: "🔭", title: "Report Sightings",      desc: "Submit observations to eBird or iNaturalist. Citizen science data directly informs USFWS population assessments.", link: "https://ebird.org",                     cta: "Open eBird →"    },
    { icon: "🌿", title: "Restore Native Plants",  desc: "Volunteer with the Hawaii Wildlife Fund or TNC to restore native wetland vegetation around refuge borders.",          link: "https://www.hwf.org",                    cta: "Join HWF →"      },
    { icon: "🏞", title: "Visit Respectfully",     desc: "Stay on designated trails, keep dogs leashed, never approach nesting birds. Give wildlife space at refuges.",       link: "https://www.fws.gov",                    cta: "Find Refuges →"  },
    { icon: "💰", title: "Donate to Recovery",     desc: "Support USFWS, TNC Hawaii, and Hawaii Wildlife Fund programs that fund predator control and habitat restoration.",   link: "https://www.tnc.org",                    cta: "Donate →"        },
    { icon: "📢", title: "Advocate for Wetlands",  desc: "Contact your state legislators in support of wetland protection laws and waterbird conservation funding.",          link: "https://www.capitol.hawaii.gov",         cta: "Contact Reps →"  },
    { icon: "📚", title: "Educate Others",          desc: "Share this page and spread awareness. Conservation begins with understanding the stakes.",                           link: "#",                                      cta: "Share This Page" },
  ];

  return (
    <div style={{ padding: "32px 40px 48px", maxWidth: 1100, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p style={{ fontFamily: FF_SERIF, fontStyle: "italic", fontSize: 18, color: "rgba(212,175,55,0.72)", margin: "0 0 28px", textAlign: "center" }}>
          "Conservation works. Protection, habitat restoration, and community efforts give the Hawaiian Coot a future."
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {actions.map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              style={{ borderRadius: 14, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "22px 22px" }}>
              <p style={{ fontSize: 30, margin: "0 0 10px" }}>{a.icon}</p>
              <p style={{ fontFamily: FF_SANS, fontSize: 15, fontWeight: 800, color: GOLD, margin: "0 0 8px", letterSpacing: "0.04em" }}>{a.title}</p>
              <p style={{ fontFamily: FF_SANS, fontSize: 13, color: "rgba(255,255,255,0.62)", margin: "0 0 16px", lineHeight: 1.7 }}>{a.desc}</p>
              <a href={a.link} target="_blank" rel="noreferrer"
                style={{ fontFamily: FF_SANS, fontSize: 12, fontWeight: 800, color: GOLD, letterSpacing: "0.1em", textDecoration: "none", padding: "8px 16px", borderRadius: 8, border: `1px solid rgba(212,175,55,0.42)`, background: "rgba(212,175,55,0.09)", display: "inline-block" }}>
                {a.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function ExtinctionRisk() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff" }}>

      {/* Cinematic header */}
      <div style={{ position: "relative", height: 272, overflow: "hidden" }}>
        <img src="/campbell-habitat.png" alt="" aria-hidden
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 60%", filter: "brightness(0.32)" }}
        />
        <img src="/hanalei-6.png" alt="" aria-hidden
          style={{ position: "absolute", right: 0, bottom: 0, height: "88%", width: "26%", objectFit: "cover", objectPosition: "center top", opacity: 0.55,
            maskImage: "linear-gradient(to left, rgba(0,0,0,0.85) 40%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,0.85) 40%, transparent 100%)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.75) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.35) 0%, transparent 55%)" }} />

        {/* Centered text block */}
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "38px 32px 0", maxWidth: 860, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85 }}>
            <h1 style={{ fontFamily: FF_SERIF, fontSize: "clamp(38px, 5vw, 56px)", color: GOLD, margin: 0, letterSpacing: "0.04em", textShadow: "0 0 48px rgba(212,175,55,0.55)" }}>
              Extinction Risk
            </h1>
            <p style={{ fontFamily: FF_SERIF, fontStyle: "italic", fontSize: 15, color: "rgba(212,175,55,0.75)", margin: "8px 0 16px" }}>
              Downlisted from Endangered after partial recovery, but still entirely dependent on conservation management.
            </p>
            <span style={{ fontFamily: FF_SANS, fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 8 }}>
              IUCN RED LIST STATUS
            </span>
            <p style={{ fontFamily: FF_SERIF, fontSize: "clamp(44px, 7vw, 68px)", color: CRIMSON, margin: 0, letterSpacing: "0.06em", lineHeight: 1, textShadow: `0 0 44px ${CRIMSON}66` }}>
              VULNERABLE
            </p>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <TabNav active={activeTab} onSelect={setActiveTab} />

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }}>
          {activeTab === "overview"     && <OverviewContent />}
          {activeTab === "threats"      && <ThreatsContent />}
          {activeTab === "population"   && <PopulationContent />}
          {activeTab === "habitat"      && <HabitatContent />}
          {activeTab === "conservation" && <ConservationContent />}
          {activeTab === "action"       && <ActionContent />}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "22px 32px 36px", borderTop: "1px solid rgba(212,175,55,0.14)" }}>
        <p style={{ fontFamily: FF_SANS, fontSize: 13, color: "rgba(255,255,255,0.32)", margin: 0, letterSpacing: "0.06em" }}>
          🌿 &nbsp; Conservation works. Protection, habitat restoration, and community efforts give the Hawaiian Coot a future.
        </p>
      </div>
    </div>
  );
}
