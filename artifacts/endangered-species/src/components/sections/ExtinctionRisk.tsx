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
    <div ref={ref} style={{ paddingBottom: 14, marginBottom: 6 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 9 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${t.color}18`, border: `1.5px solid ${t.color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
          <t.Icon size={18} color={t.color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: FF_SANS, fontSize: 16, fontWeight: 800, color: "rgba(255,255,255,0.95)", margin: 0, letterSpacing: "0.04em" }}>{t.label}</p>
          <p style={{ fontFamily: FF_SANS, fontSize: 14, color: "rgba(255,255,255,0.62)", margin: "3px 0 0", lineHeight: 1.5 }}>{t.desc}</p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ fontFamily: FF_SANS, fontSize: 13, fontWeight: 800, color: t.color, margin: 0, letterSpacing: "0.1em" }}>{t.severity}</p>
          <p style={{ fontFamily: FF_SERIF, fontSize: 21, color: t.color, margin: 0, lineHeight: 1.1 }}>{t.pct}%</p>
        </div>
        <button onClick={() => setOpen(o => !o)}
          className={open ? undefined : "threat-info-btn"}
          style={{ background: open ? `${t.color}18` : "none", border: `1.5px solid ${open ? t.color : "rgba(212,175,55,0.7)"}`, borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, marginTop: 4, color: open ? t.color : GOLD, transition: "background 0.2s, color 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = `${t.color}28`; e.currentTarget.style.color = t.color; e.currentTarget.style.borderColor = t.color; }}
          onMouseLeave={e => { e.currentTarget.style.background = open ? `${t.color}18` : "none"; e.currentTarget.style.color = open ? t.color : GOLD; e.currentTarget.style.borderColor = open ? t.color : "rgba(212,175,55,0.7)"; }}
        >
          {open ? <X size={14} /> : <Info size={14} />}
        </button>
      </div>
      {/* Progress bar — gold-tinted track doubles as the row divider */}
      <div style={{ height: 5, borderRadius: 999, background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.22) 18%, rgba(212,175,55,0.22) 82%, transparent 100%)", overflow: "hidden" }}>
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
              <p style={{ fontFamily: FF_SANS, fontSize: 14, color: "rgba(255,255,255,0.82)", margin: 0, lineHeight: 1.75 }}>{t.detail}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Population SVG chart — live interactive ──────────────────────────────────
function PopChart() {
  const W = 300, H = 240;
  const pad = { l: 46, r: 16, t: 16, b: 32 };
  const maxPop = 10000;
  const xS = (y: number) => pad.l + (y - 1990) / (2024 - 1990) * (W - pad.l - pad.r);
  const yS = (p: number) => pad.t + (1 - p / maxPop) * (H - pad.t - pad.b);

  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<typeof POP_DATA[0] | null>(null);
  const inView = useInView(svgRef, { once: true });

  const pathD = POP_DATA.map((d, i) =>
    `${i === 0 ? "M" : "L"} ${xS(d.year).toFixed(1)} ${yS(d.pop).toFixed(1)}`
  ).join(" ");
  const fillD = [
    `M ${xS(POP_DATA[0].year).toFixed(1)} ${(H - pad.b).toFixed(1)}`,
    ...POP_DATA.map(d => `L ${xS(d.year).toFixed(1)} ${yS(d.pop).toFixed(1)}`),
    `L ${xS(POP_DATA[POP_DATA.length - 1].year).toFixed(1)} ${(H - pad.b).toFixed(1)} Z`,
  ].join(" ");
  const last = POP_DATA[POP_DATA.length - 1];

  const POINT_LABELS: Record<number, string> = {
    1990: "Historic High", 2015: "Record Low", 2018: "Recovery Begins",
    2021: "Stabilizing", 2024: "Current",
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    let nearest = POP_DATA[0], minDist = Infinity;
    for (const d of POP_DATA) {
      const dist = Math.abs(xS(d.year) - mx);
      if (dist < minDist) { minDist = dist; nearest = d; }
    }
    setHovered(nearest);
  };

  return (
    <div style={{ position: "relative", height: "100%", minHeight: 260 }}>
      {/* LIVE badge */}
      <div style={{ position: "absolute", top: 0, right: 0, display: "flex", alignItems: "center", gap: 5, zIndex: 2 }}>
        <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.4, repeat: Infinity }}
          style={{ width: 7, height: 7, borderRadius: "50%", background: CRIMSON, boxShadow: `0 0 6px ${CRIMSON}` }}
        />
        <span style={{ fontFamily: FF_SANS, fontSize: 10, fontWeight: 800, color: CRIMSON, letterSpacing: "0.12em" }}>LIVE</span>
      </div>

      <svg ref={svgRef} width={W} height={H} viewBox={`0 0 ${W} ${H}`}
        style={{ display: "block", overflow: "visible", cursor: "crosshair", width: "100%", height: "100%" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id="popGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CRIMSON} stopOpacity="0.28" />
            <stop offset="100%" stopColor={CRIMSON} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 2500, 5000, 7500, 10000].map(v => (
          <g key={v}>
            <line x1={pad.l} y1={yS(v)} x2={W - pad.r} y2={yS(v)}
              stroke={hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.12)"} strokeWidth={1} />
            <text x={pad.l - 5} y={yS(v) + 4} textAnchor="end"
              fill="rgba(255,255,255,0.72)" fontSize={10} fontFamily={FF_SANS} fontWeight="bold">
              {v >= 1000 ? `${v / 1000}K` : v}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <motion.path d={fillD} fill="url(#popGrad)"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.4 }}
        />

        {/* Hover crosshair */}
        {hovered && (
          <line x1={xS(hovered.year)} y1={pad.t} x2={xS(hovered.year)} y2={H - pad.b}
            stroke={GOLD} strokeWidth={1} strokeDasharray="3 3" strokeOpacity={0.6}
          />
        )}

        {/* Animated line draw */}
        <motion.path d={pathD} fill="none" stroke={CRIMSON} strokeWidth={2.5}
          strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        />

        {/* Data point dots */}
        {POP_DATA.map((d) => (
          <circle key={d.year}
            cx={xS(d.year)} cy={yS(d.pop)}
            r={hovered?.year === d.year ? 5.5 : 3}
            fill={hovered?.year === d.year ? "#fff" : CRIMSON}
            stroke={CRIMSON} strokeWidth={1.5}
            style={{ transition: "r 0.12s ease, fill 0.12s ease" }}
          />
        ))}

        {/* Pulsing ring on latest point when not hovering */}
        {!hovered && (
          <>
            <motion.circle cx={xS(last.year)} cy={yS(last.pop)}
              fill="none" stroke={CRIMSON} strokeWidth={1.5}
              animate={{ r: [5, 14], opacity: [0.7, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
            <circle cx={xS(last.year)} cy={yS(last.pop)} r={5} fill={CRIMSON} />
            <rect x={xS(last.year) - 26} y={yS(last.pop) - 20} width={52} height={16} rx={4} fill="rgba(220,50,30,0.9)" />
            <text x={xS(last.year)} y={yS(last.pop) - 9} textAnchor="middle"
              fill="#fff" fontSize={9} fontFamily={FF_SANS} fontWeight="bold">~3,200</text>
          </>
        )}

        {/* Hover tooltip */}
        {hovered && (() => {
          const tx = xS(hovered.year);
          const ty = yS(hovered.pop);
          const flipLeft = tx > W * 0.65;
          const tooltipX = flipLeft ? tx - 72 : tx + 10;
          const label = POINT_LABELS[hovered.year] ?? (hovered.year < 2015 ? "Declining" : "Recovery");
          const isLow = hovered.year === 2015;
          return (
            <g>
              <circle cx={tx} cy={ty} r={6} fill="#fff" stroke={CRIMSON} strokeWidth={2} />
              <rect x={tooltipX} y={ty - 32} width={62} height={44} rx={7}
                fill="rgba(6,4,8,0.97)" stroke={isLow ? AMBER : CRIMSON} strokeWidth={1.2}
              />
              <text x={tooltipX + 31} y={ty - 18} textAnchor="middle"
                fill={isLow ? AMBER : CRIMSON} fontSize={10} fontFamily={FF_SANS} fontWeight="bold">
                {hovered.year}
              </text>
              <text x={tooltipX + 31} y={ty - 5} textAnchor="middle"
                fill="#fff" fontSize={12} fontFamily={FF_SANS} fontWeight="bold">
                {hovered.pop.toLocaleString()}
              </text>
              <text x={tooltipX + 31} y={ty + 7} textAnchor="middle"
                fill="rgba(255,255,255,0.45)" fontSize={8.5} fontFamily={FF_SANS}>
                {label}
              </text>
            </g>
          );
        })()}

        {/* Year axis labels */}
        {[1990, 2000, 2010, 2020, 2024].map(y => (
          <text key={y} x={xS(y)} y={H - pad.b + 16} textAnchor="middle"
            fill={hovered?.year === y ? GOLD : "rgba(255,255,255,0.72)"}
            fontSize={10} fontFamily={FF_SANS} fontWeight="bold"
            style={{ transition: "fill 0.12s" }}
          >{y}</text>
        ))}

        {/* Transparent overlay — sits on top, guarantees mouse capture over all child elements */}
        <rect x={0} y={0} width={W} height={H} fill="transparent" style={{ cursor: "crosshair" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHovered(null)}
        />
      </svg>
    </div>
  );
}

// ─── Donut chart ──────────────────────────────────────────────────────────────
function DonutChart({ pct, color, label }: { pct: number; color: string; label: string }) {
  const r = 76, cx = 100, cy = 100, stroke = 18;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={200} height={200} style={{ display: "block" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash.toFixed(1)} ${(circ - dash).toFixed(1)}`}
          strokeLinecap="round"
          style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
        />
        <text x={cx} y={cy - 6} textAnchor="middle" fill={color} fontSize={36} fontFamily={FF_SERIF} fontWeight="bold">{pct}%</text>
        <text x={cx} y={cy + 20} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize={13} fontFamily={FF_SANS}>{label}</text>
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
      <p style={{ fontFamily: FF_SANS, fontSize: 12, color: "#fff", margin: "0 0 10px", letterSpacing: "0.08em", fontWeight: 700 }}>WHAT IF CONSERVATION STOPPED?</p>
      <div style={{ marginBottom: 16 }}>
        <input type="range" min={0} max={20} value={years} onChange={e => setYears(Number(e.target.value))}
          style={{ width: "100%", accentColor: CRIMSON, cursor: "pointer" }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontFamily: FF_SANS, fontSize: 11, color: "rgba(255,255,255,0.82)" }}>0 yr</span>
          <span style={{ fontFamily: FF_SANS, fontSize: 11, color: "rgba(255,255,255,0.82)" }}>20 yr</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, flex: 1 }}>
        <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.18)" }}>
          <p style={{ fontFamily: FF_SANS, fontSize: 11, color: "rgba(255,255,255,0.88)", margin: "0 0 3px", letterSpacing: "0.1em", fontWeight: 700 }}>YEAR</p>
          <p style={{ fontFamily: FF_SERIF, fontSize: 30, color: GOLD, margin: 0, lineHeight: 1 }}>{years}</p>
        </div>
        <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.18)" }}>
          <p style={{ fontFamily: FF_SANS, fontSize: 11, color: "rgba(255,255,255,0.88)", margin: "0 0 3px", letterSpacing: "0.1em", fontWeight: 700 }}>EST. POPULATION</p>
          <p style={{ fontFamily: FF_SERIF, fontSize: 22, color: CRIMSON, margin: 0, lineHeight: 1 }}>~{estPop.toLocaleString()}</p>
        </div>
        <div style={{ gridColumn: "1 / -1", padding: "10px 14px", borderRadius: 10, background: `${riskColor}18`, border: `1px solid ${riskColor}66`, textAlign: "center" }}>
          <p style={{ fontFamily: FF_SANS, fontSize: 11, color: "rgba(255,255,255,0.88)", margin: "0 0 2px", letterSpacing: "0.1em", fontWeight: 700 }}>RISK LEVEL</p>
          <p style={{ fontFamily: FF_SERIF, fontSize: 26, fontWeight: 700, color: riskColor, margin: 0, textShadow: `0 0 18px ${riskColor}88` }}>{risk}</p>
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
  const [tip, setTip] = useState<{ x: number; y: number; text: string; sub: string; color: string } | null>(null);

  return (
    <div ref={ref} data-dotmatrix style={{ position: "relative" }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 4, maxWidth: 360 }}>
        {Array.from({ length: total }).map((_, i) => {
          const alive = i < active;
          return (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.22, delay: i * 0.004, ease: "backOut" }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.transform = "scale(2)";
                el.style.zIndex = "10";
                el.style.background = alive ? CRIMSON : "rgba(220,50,30,0.55)";
                el.style.boxShadow = alive
                  ? `0 0 10px ${CRIMSON}, 0 0 20px ${CRIMSON}88`
                  : `0 0 8px rgba(220,50,30,0.5)`;
                const rect = el.getBoundingClientRect();
                const parent = el.closest("[data-dotmatrix]")!.getBoundingClientRect();
                setTip({
                  x: rect.left - parent.left + rect.width / 2,
                  y: rect.top - parent.top - 12,
                  text: alive ? "≈10 birds still surviving" : "≈10 birds lost forever",
                  sub: alive ? "Every dot counts." : "Habitat destroyed.",
                  color: alive ? CRIMSON : "rgba(180,40,20,0.9)",
                });
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.transform = "scale(1)";
                el.style.zIndex = "1";
                el.style.background = alive ? CRIMSON : "rgba(255,255,255,0.1)";
                el.style.boxShadow = alive ? `0 0 3px ${CRIMSON}55` : "none";
                setTip(null);
              }}
              style={{ width: 9, height: 9, borderRadius: "50%", background: alive ? CRIMSON : "rgba(255,255,255,0.1)", boxShadow: alive ? `0 0 3px ${CRIMSON}55` : "none", cursor: "crosshair", transition: "transform 0.15s, box-shadow 0.15s, background 0.15s", position: "relative" }}
            />
          );
        })}
      </div>
      {/* Urgency tooltip */}
      {tip && (
        <div style={{ position: "absolute", left: tip.x, top: tip.y, transform: "translate(-50%, -100%)", pointerEvents: "none", zIndex: 20, textAlign: "center" }}>
          <div style={{ background: "rgba(8,6,4,0.96)", border: `1px solid ${tip.color}`, borderRadius: 8, padding: "7px 13px", whiteSpace: "nowrap", boxShadow: `0 0 18px ${tip.color}55` }}>
            <p style={{ fontFamily: FF_SANS, fontSize: 12, fontWeight: 800, color: tip.color, margin: 0, letterSpacing: "0.06em" }}>{tip.text}</p>
            <p style={{ fontFamily: FF_SERIF, fontSize: 11, color: "rgba(255,255,255,0.6)", margin: "2px 0 0", fontStyle: "italic" }}>{tip.sub}</p>
          </div>
          <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `5px solid ${tip.color}`, margin: "0 auto" }} />
        </div>
      )}
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
                color: isActive ? GOLD : "rgba(255,255,255,0.9)",
                borderBottom: isActive ? `3px solid ${GOLD}` : "3px solid transparent",
                marginBottom: -1,
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = "rgba(255,255,255,0.9)"; e.currentTarget.style.background = "transparent"; } }}
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
            <span style={{ fontFamily: FF_SANS, fontSize: 11, color: GOLD, letterSpacing: "0.08em", opacity: 0.9 }}>CLICK ⓘ FOR DETAILS</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {THREATS.map((t, i) => <ThreatBar key={t.id} t={t} delay={0.1 + i * 0.08} />)}
          </div>
        </motion.div>

        {/* A Fragile Balance */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.12 }}
          style={{ borderRadius: 16, border: "1px solid rgba(220,50,30,0.32)", background: CARD_RED, padding: "26px 28px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <p style={{ fontFamily: FF_SERIF, fontSize: 24, color: GOLD, margin: 0, textShadow: "0 0 20px rgba(212,175,55,0.3)" }}>A Fragile Balance</p>
            <TrendingDown size={22} color={CRIMSON} />
          </div>
          {/* Critical stat #1 */}
          <p className="critical-pulse"
            style={{ fontFamily: FF_SERIF, fontSize: 22, fontWeight: 700, color: CRIMSON, margin: "0 0 14px", letterSpacing: "0.02em", lineHeight: 1.2 }}>
            ⚠ Only ~3,200 Hawaiian Coots remain.
          </p>
          {/* Critical stat #2 — amber warning block */}
          <div style={{ borderLeft: `3px solid rgba(245,158,11,0.9)`, background: "rgba(245,158,11,0.07)", borderRadius: "0 8px 8px 0", padding: "10px 14px", marginBottom: 20 }}>
            <p style={{ fontFamily: FF_SANS, fontSize: 14, fontWeight: 700, color: "rgba(245,158,11,1)", margin: "0 0 2px", letterSpacing: "0.05em" }}>⚡ ONE EVENT AWAY FROM COLLAPSE</p>
            <p style={{ fontFamily: FF_SANS, fontSize: 14, color: "rgba(255,255,255,0.88)", margin: 0, lineHeight: 1.65 }}>
              One major hurricane season or severe prolonged drought could reduce the population by <span style={{ color: "rgba(245,158,11,1)", fontWeight: 800 }}>30%</span>.
            </p>
          </div>
          <DotMatrix />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, alignItems: "center" }}>
            <p style={{ fontFamily: FF_SANS, fontSize: 13, color: "rgba(255,255,255,0.42)", margin: 0, fontStyle: "italic" }}>Each dot = ~10 birds</p>
            <p style={{ fontFamily: FF_SERIF, fontSize: 16, color: CRIMSON, margin: 0, fontStyle: "italic", textShadow: `0 0 12px ${CRIMSON}66` }}>~3,200 birds estimated</p>
          </div>
        </motion.div>
      </div>

      {/* Bottom 2×2 grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.22 }}
          style={{ borderRadius: 16, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "20px 24px 18px", display: "flex", flexDirection: "column" }}>
          <SectionLabel>POPULATION TREND</SectionLabel>
          <div style={{ marginTop: 14, flex: 1, minHeight: 0 }}><PopChart /></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          style={{ borderRadius: 16, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "20px 24px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ alignSelf: "flex-start" }}><SectionLabel>HABITAT STATUS</SectionLabel></div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 8 }}>
            <DonutChart pct={42} color={GREEN} label="of historical" />
            <p style={{ fontFamily: FF_SANS, fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.92)", margin: 0, textAlign: "center" }}>wetlands remain</p>
            <p style={{ fontFamily: FF_SANS, fontSize: 14, color: "rgba(255,255,255,0.65)", margin: 0, textAlign: "center", lineHeight: 1.65 }}>
              Only <span style={{ color: GREEN, fontWeight: 800 }}>42%</span> of historical Hawaiian wetland habitat survives today
            </p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.36 }}
          style={{ borderRadius: 16, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "20px 24px 18px" }}>
          <SectionLabel>THREAT SIMULATOR</SectionLabel>
          <div style={{ marginTop: 14 }}><ThreatSim /></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.42 }}
          style={{ borderRadius: 16, border: `1px solid ${BORDER}`, overflow: "hidden", position: "relative", minHeight: 280 }}>
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

// ─── Population tab — live interactive chart ──────────────────────────────────
function PopTrendChart() {
  const W = 480, H = 280;
  const pad = { l: 52, r: 20, t: 24, b: 36 };
  const maxPop = 10000;
  const xS = (y: number) => pad.l + (y - 1990) / (2024 - 1990) * (W - pad.l - pad.r);
  const yS = (p: number) => pad.t + (1 - p / maxPop) * (H - pad.t - pad.b);

  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<typeof POP_DATA[0] | null>(null);
  const inView = useInView(svgRef, { once: true });

  const pathD = POP_DATA.map((d, i) =>
    `${i === 0 ? "M" : "L"} ${xS(d.year).toFixed(1)} ${yS(d.pop).toFixed(1)}`
  ).join(" ");
  const fillD = [
    `M ${xS(POP_DATA[0].year).toFixed(1)} ${(H - pad.b).toFixed(1)}`,
    ...POP_DATA.map(d => `L ${xS(d.year).toFixed(1)} ${yS(d.pop).toFixed(1)}`),
    `L ${xS(POP_DATA[POP_DATA.length - 1].year).toFixed(1)} ${(H - pad.b).toFixed(1)} Z`,
  ].join(" ");
  const last = POP_DATA[POP_DATA.length - 1];

  const POINT_LABELS: Record<number, string> = {
    1990: "Historic High", 1995: "Declining", 2000: "Declining", 2005: "Downlisted",
    2010: "Critical Low", 2015: "Record Low", 2018: "Recovery Begins",
    2021: "Stabilizing", 2024: "Current",
  };

  const handleMouseMove = (e: React.MouseEvent<SVGRectElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    let nearest = POP_DATA[0], minDist = Infinity;
    for (const d of POP_DATA) {
      const dist = Math.abs(xS(d.year) - mx);
      if (dist < minDist) { minDist = dist; nearest = d; }
    }
    setHovered(nearest);
  };

  return (
    <div style={{ position: "relative", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      <div style={{ position: "absolute", top: 0, right: 0, display: "flex", alignItems: "center", gap: 5, zIndex: 2 }}>
        <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.4, repeat: Infinity }}
          style={{ width: 8, height: 8, borderRadius: "50%", background: CRIMSON, boxShadow: `0 0 8px ${CRIMSON}` }} />
        <span style={{ fontFamily: FF_SANS, fontSize: 11, fontWeight: 800, color: CRIMSON, letterSpacing: "0.12em" }}>LIVE DATA</span>
      </div>

      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`}
        style={{ display: "block", overflow: "visible", width: "100%", height: "100%", flex: 1, minHeight: 260 }}>
        <defs>
          <linearGradient id="popGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CRIMSON} stopOpacity="0.3" />
            <stop offset="100%" stopColor={CRIMSON} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines + Y-axis labels */}
        {[0, 2500, 5000, 7500, 10000].map(v => (
          <g key={v}>
            <line x1={pad.l} y1={yS(v)} x2={W - pad.r} y2={yS(v)}
              stroke={hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.11)"} strokeWidth={1} />
            <text x={pad.l - 6} y={yS(v) + 4} textAnchor="end"
              fill="rgba(255,255,255,0.75)" fontSize={11} fontFamily={FF_SANS} fontWeight="bold">
              {v >= 1000 ? `${v / 1000}K` : v}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <motion.path d={fillD} fill="url(#popGrad2)"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.4 }} />

        {/* Hover crosshair */}
        {hovered && (
          <line x1={xS(hovered.year)} y1={pad.t} x2={xS(hovered.year)} y2={H - pad.b}
            stroke={GOLD} strokeWidth={1.5} strokeDasharray="4 3" strokeOpacity={0.75} />
        )}

        {/* Animated line draw */}
        <motion.path d={pathD} fill="none" stroke={CRIMSON} strokeWidth={3}
          strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        />

        {/* Data dots */}
        {POP_DATA.map(d => (
          <circle key={d.year}
            cx={xS(d.year)} cy={yS(d.pop)}
            r={hovered?.year === d.year ? 7 : 4}
            fill={hovered?.year === d.year ? "#fff" : CRIMSON}
            stroke={CRIMSON} strokeWidth={2}
            style={{ transition: "r 0.12s ease, fill 0.12s ease" }}
          />
        ))}

        {/* Pulsing ring on latest point */}
        {!hovered && (
          <>
            <motion.circle cx={xS(last.year)} cy={yS(last.pop)}
              fill="none" stroke={CRIMSON} strokeWidth={2}
              animate={{ r: [6, 18], opacity: [0.8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />
            <circle cx={xS(last.year)} cy={yS(last.pop)} r={5} fill={CRIMSON} />
            <rect x={xS(last.year) - 30} y={yS(last.pop) - 24} width={60} height={19} rx={5} fill="rgba(220,50,30,0.93)" />
            <text x={xS(last.year)} y={yS(last.pop) - 11} textAnchor="middle"
              fill="#fff" fontSize={11} fontFamily={FF_SANS} fontWeight="bold">~3,200</text>
          </>
        )}

        {/* Hover tooltip */}
        {hovered && (() => {
          const tx = xS(hovered.year);
          const ty = yS(hovered.pop);
          const flipLeft = tx > W * 0.72;
          const tX = flipLeft ? tx - 84 : tx + 12;
          const label = POINT_LABELS[hovered.year] ?? "Data Point";
          const isWarning = hovered.year === 2015 || hovered.year === 2010;
          return (
            <g>
              <circle cx={tx} cy={ty} r={7} fill="#fff" stroke={CRIMSON} strokeWidth={2.5} />
              <rect x={tX} y={ty - 42} width={76} height={56} rx={9}
                fill="rgba(6,4,8,0.97)" stroke={isWarning ? AMBER : CRIMSON} strokeWidth={1.5} />
              <text x={tX + 38} y={ty - 26} textAnchor="middle"
                fill={isWarning ? AMBER : CRIMSON} fontSize={12} fontFamily={FF_SANS} fontWeight="bold">
                {hovered.year}
              </text>
              <text x={tX + 38} y={ty - 8} textAnchor="middle"
                fill="#fff" fontSize={16} fontFamily={FF_SERIF} fontWeight="bold">
                {hovered.pop.toLocaleString()}
              </text>
              <text x={tX + 38} y={ty + 8} textAnchor="middle"
                fill="rgba(255,255,255,0.52)" fontSize={9.5} fontFamily={FF_SANS}>
                {label}
              </text>
            </g>
          );
        })()}

        {/* X-axis year labels */}
        {POP_DATA.map(d => (
          <text key={d.year} x={xS(d.year)} y={H - pad.b + 20} textAnchor="middle"
            fill={hovered?.year === d.year ? GOLD : "rgba(255,255,255,0.7)"}
            fontSize={11} fontFamily={FF_SANS} fontWeight="bold"
            style={{ transition: "fill 0.12s" }}>
            {d.year}
          </text>
        ))}

        {/* Transparent mouse-capture overlay — must be last */}
        <rect x={0} y={0} width={W} height={H} fill="transparent" style={{ cursor: "crosshair" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHovered(null)} />
      </svg>
    </div>
  );
}

// ─── Population tab ───────────────────────────────────────────────────────────
function PopulationContent() {
  const stats = [
    { year: "1970", suffix: "s Low",  value: "~1,800", note: "Near-extinction — ESA listing triggered",   color: CRIMSON },
    { year: "1990", suffix: "s Peak", value: "~8,800", note: "Best population count in modern records",   color: GREEN   },
    { year: "2015", suffix: " Low",   value: "~2,300", note: "Severe drought & compounding habitat loss", color: AMBER   },
    { year: "2024", suffix: " Count", value: "~3,200", note: "Partial recovery — restoration ongoing",    color: GOLD    },
  ];

  return (
    <div style={{ padding: "32px 40px 48px", maxWidth: 1100, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Chart — full width */}
        <div style={{ borderRadius: 16, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "26px 30px", display: "flex", flexDirection: "column", minHeight: 420 }}>
          <SectionLabel>POPULATION TRAJECTORY 1990 – 2024</SectionLabel>
          <p style={{ fontFamily: FF_SANS, fontSize: 15, color: "rgba(255,255,255,0.88)", margin: "8px 0 18px", lineHeight: 1.65 }}>
            From ~8,800 birds to a record low of ~2,300, now recovering to ~3,200 thanks to refuge protection and active management.
          </p>
          <PopTrendChart />
        </div>

        {/* 2 × 2 big stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          {stats.map((s, i) => (
            <motion.div key={s.year}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{
                borderRadius: 18,
                border: `1px solid ${s.color}48`,
                background: `${s.color}0e`,
                padding: "30px 34px 28px",
                position: "relative",
                overflow: "hidden",
              }}>
              {/* Corner glow */}
              <div style={{
                position: "absolute", top: 0, left: 0, width: "60%", height: "60%",
                background: `radial-gradient(ellipse at 0% 0%, ${s.color}1a, transparent 70%)`,
                pointerEvents: "none",
              }} />

              {/* ERA label — year BIG + suffix small */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 10 }}>
                <span style={{
                  fontFamily: FF_SANS, fontSize: 44, fontWeight: 900,
                  color: s.color, letterSpacing: "-0.02em", lineHeight: 1,
                }}>{s.year}</span>
                <span style={{
                  fontFamily: FF_SANS, fontSize: 19, fontWeight: 700,
                  color: "rgba(255,255,255,0.92)", letterSpacing: "0.03em",
                }}>{s.suffix}</span>
              </div>

              {/* Population value */}
              <p style={{
                fontFamily: FF_SERIF, fontSize: 52, fontWeight: 700,
                color: "#fff", margin: "0 0 12px", lineHeight: 1,
              }}>{s.value}</p>

              {/* Divider */}
              <div style={{ height: 1, background: `${s.color}30`, marginBottom: 12 }} />

              {/* Note */}
              <p style={{
                fontFamily: FF_SANS, fontSize: 16, fontWeight: 500,
                color: "rgba(255,255,255,0.88)", margin: 0, lineHeight: 1.55,
              }}>{s.note}</p>
            </motion.div>
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

        {/* Left — Wetland Loss */}
        <div style={{ borderRadius: 16, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "28px 30px" }}>
          <SectionLabel>WETLAND LOSS TIMELINE</SectionLabel>
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Historical wetlands (1800s)", value: "~900,000 acres", color: GREEN   },
              { label: "Remaining today",             value: "~378,000 acres (42%)", color: AMBER  },
              { label: "Protected refuge wetlands",   value: "~5,000 acres",    color: GOLD   },
              { label: "Wetlands lost since 1900",    value: "> 58%",           color: CRIMSON },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.09 }}
                style={{ padding: "18px 20px", borderRadius: 13, border: `1px solid ${s.color}40`, background: `${s.color}0e`, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: "50%", height: "100%", background: `radial-gradient(ellipse at 0% 50%, ${s.color}12, transparent 70%)`, pointerEvents: "none" }} />
                <p style={{ fontFamily: FF_SANS, fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.82)", margin: "0 0 6px", letterSpacing: "0.02em" }}>{s.label}</p>
                <p style={{ fontFamily: FF_SERIF, fontSize: 30, color: s.color, margin: 0, lineHeight: 1 }}>{s.value}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right — Wetland Types */}
        <div style={{ borderRadius: 16, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "28px 30px" }}>
          <SectionLabel>REMAINING WETLAND TYPES</SectionLabel>
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              { type: "Coastal Wetlands", pct: 38, desc: "Brackish coastal ponds, estuaries, and salt flats used for foraging" },
              { type: "Freshwater Ponds", pct: 28, desc: "Inland shallow ponds and reservoirs — primary coot habitat" },
              { type: "Taro Fields",      pct: 18, desc: "Traditional kalo farming paddies with shallow flooded margins" },
              { type: "Managed Refuge",   pct: 16, desc: "Actively managed wetland cells within National Wildlife Refuges" },
            ].map((w, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <span style={{ fontFamily: FF_SANS, fontSize: 17, fontWeight: 700, color: "rgba(255,255,255,0.95)" }}>{w.type}</span>
                  <span style={{ fontFamily: FF_SERIF, fontSize: 22, fontWeight: 700, color: GREEN }}>{w.pct}%</span>
                </div>
                <div style={{ height: 10, borderRadius: 999, background: "rgba(255,255,255,0.09)", overflow: "hidden", marginBottom: 9 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${w.pct}%` }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.1 }}
                    style={{ height: "100%", background: GREEN, borderRadius: 999 }} />
                </div>
                <p style={{ fontFamily: FF_SANS, fontSize: 14, color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.55 }}>{w.desc}</p>
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
  const colors: Record<string, string> = { law: CRIMSON, refuge: GREEN, milestone: GOLD, action: AMBER };
  const typeLabel: Record<string, string> = { law: "Federal Law", refuge: "Refuge", milestone: "Milestone", action: "Active Program" };

  const milestones = [
    { year: "1970", event: "Hawaiian Coot listed under the Endangered Species Act",          type: "law"       },
    { year: "1972", event: "Hanalei National Wildlife Refuge established on Kauaʻi",         type: "refuge"    },
    { year: "1978", event: "James Campbell NWR established on Oʻahu's north shore",          type: "refuge"    },
    { year: "1992", event: "Keālia Pond NWR established on Maui's south shore",              type: "refuge"    },
    { year: "2005", event: "Hawaiian Coot downlisted from Endangered to Vulnerable",         type: "milestone" },
    { year: "2010", event: "Predator control fencing expanded to 80% of key nesting sites",  type: "action"    },
    { year: "2019", event: "Population exceeds 3,000 for first time since early 2000s",      type: "milestone" },
    { year: "2024", event: "Wetland restoration targets an additional 1,200 protected acres",type: "action"    },
  ];

  const summary = [
    { value: "54",  unit: "yrs",    label: "of active protection" },
    { value: "4",   unit: "",       label: "wildlife refuges established" },
    { value: "1",   unit: "",       label: "successful downlisting" },
    { value: "3.2K",unit: "birds",  label: "counted in 2024" },
  ];

  return (
    <div style={{ padding: "28px 40px 48px", maxWidth: 1100, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Summary stat row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {summary.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              style={{ borderRadius: 14, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "18px 20px", textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 5 }}>
                <span style={{ fontFamily: FF_SERIF, fontSize: 48, fontWeight: 700, color: GOLD, lineHeight: 1 }}>{s.value}</span>
                {s.unit && <span style={{ fontFamily: FF_SANS, fontSize: 17, fontWeight: 700, color: "rgba(255,255,255,0.82)" }}>{s.unit}</span>}
              </div>
              <p style={{ fontFamily: FF_SANS, fontSize: 15, color: "rgba(255,255,255,0.82)", margin: "8px 0 0", lineHeight: 1.4 }}>{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* 2 × 4 milestone cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {milestones.map((m, i) => {
            const c = colors[m.type];
            return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  borderRadius: 14,
                  border: `1px solid ${c}40`,
                  background: `${c}0c`,
                  padding: "20px 22px 20px 20px",
                  display: "flex",
                  gap: 18,
                  alignItems: "flex-start",
                  position: "relative",
                  overflow: "hidden",
                }}>
                {/* Left color bar */}
                <div style={{ width: 3, borderRadius: 99, background: c, flexShrink: 0, alignSelf: "stretch", minHeight: 40 }} />

                <div style={{ flex: 1 }}>
                  {/* Year + type badge */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontFamily: FF_SERIF, fontSize: 40, fontWeight: 700, color: c, lineHeight: 1 }}>{m.year}</span>
                    <span style={{
                      fontFamily: FF_SANS, fontSize: 12, fontWeight: 800,
                      color: c, background: `${c}1e`,
                      border: `1px solid ${c}50`,
                      borderRadius: 6, padding: "4px 10px",
                      letterSpacing: "0.08em", textTransform: "uppercase",
                    }}>{typeLabel[m.type]}</span>
                  </div>
                  {/* Event text */}
                  <p style={{ fontFamily: FF_SANS, fontSize: 17, fontWeight: 500, color: "rgba(255,255,255,0.95)", margin: 0, lineHeight: 1.55 }}>{m.event}</p>
                </div>

                {/* Corner glow */}
                <div style={{ position: "absolute", top: 0, right: 0, width: "40%", height: "100%", background: `radial-gradient(ellipse at 100% 0%, ${c}10, transparent 70%)`, pointerEvents: "none" }} />
              </motion.div>
            );
          })}
        </div>

      </motion.div>
    </div>
  );
}

// ─── What You Can Do tab ──────────────────────────────────────────────────────
function ActionContent() {
  const actions = [
    { icon: "🔭", title: "Report Sightings",     desc: "Submit observations to eBird or iNaturalist. Citizen science data directly informs USFWS population assessments.", link: "https://ebird.org",             cta: "Open eBird →",    color: GOLD                    },
    { icon: "🌿", title: "Restore Native Plants", desc: "Volunteer with the Hawaii Wildlife Fund or TNC to restore native wetland vegetation around refuge borders.",         link: "https://www.hwf.org",           cta: "Join HWF →",      color: GREEN                   },
    { icon: "🏞", title: "Visit Respectfully",    desc: "Stay on designated trails, keep dogs leashed, never approach nesting birds. Give wildlife space at refuges.",      link: "https://www.fws.gov",           cta: "Find Refuges →",  color: AMBER                   },
    { icon: "💰", title: "Donate to Recovery",    desc: "Support USFWS, TNC Hawaii, and Hawaii Wildlife Fund programs that fund predator control and habitat restoration.",  link: "https://www.tnc.org",           cta: "Donate →",        color: CRIMSON                 },
    { icon: "📢", title: "Advocate for Wetlands", desc: "Contact your state legislators in support of wetland protection laws and waterbird conservation funding.",         link: "https://www.capitol.hawaii.gov",cta: "Contact Reps →",  color: "rgba(139,92,246,1)"    },
    { icon: "📚", title: "Educate Others",         desc: "Share this page and spread awareness. Conservation begins with understanding the stakes.",                          link: "#",                             cta: "Share This Page", color: "rgba(56,189,248,1)"    },
  ];

  return (
    <div style={{ padding: "32px 40px 48px", maxWidth: 1100, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <p style={{ fontFamily: FF_SERIF, fontStyle: "italic", fontSize: 20, color: "rgba(212,175,55,0.88)", margin: 0, textAlign: "center", lineHeight: 1.6 }}>
          "Conservation works. Protection, habitat restoration, and community effort give the Hawaiian Coot a future."
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {actions.map((a, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -5, boxShadow: `0 8px 48px ${a.color}44` }}
              style={{
                borderRadius: 16,
                border: `1px solid ${a.color}42`,
                background: `${a.color}0d`,
                padding: "26px 24px",
                cursor: "default",
                position: "relative",
                overflow: "hidden",
              }}>
              {/* Corner glow */}
              <div style={{ position: "absolute", top: 0, left: 0, width: "70%", height: "70%", background: `radial-gradient(ellipse at 0% 0%, ${a.color}15, transparent 70%)`, pointerEvents: "none" }} />

              {/* Icon */}
              <p style={{ fontSize: 36, margin: "0 0 12px", lineHeight: 1 }}>{a.icon}</p>

              {/* Title */}
              <p style={{ fontFamily: FF_SANS, fontSize: 17, fontWeight: 800, color: a.color, margin: "0 0 10px", letterSpacing: "0.03em" }}>{a.title}</p>

              {/* Description */}
              <p style={{ fontFamily: FF_SANS, fontSize: 15, color: "rgba(255,255,255,0.88)", margin: "0 0 18px", lineHeight: 1.7 }}>{a.desc}</p>

              {/* CTA */}
              <a href={a.link} target="_blank" rel="noreferrer"
                style={{
                  fontFamily: FF_SANS, fontSize: 14, fontWeight: 800,
                  color: a.color, letterSpacing: "0.08em", textDecoration: "none",
                  padding: "9px 18px", borderRadius: 9,
                  border: `1px solid ${a.color}55`,
                  background: `${a.color}14`,
                  display: "inline-block",
                }}>
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

      {/* Cinematic header — minHeight so VULNERABLE never gets clipped */}
      <div style={{ position: "relative", minHeight: 390, overflow: "hidden" }}>
        {/* Background image — brighter so sides pop */}
        <img src="/campbell-new-header.png" alt="" aria-hidden
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", filter: "brightness(0.92)" }}
        />
        {/* Horizontal vignette: left + right thirds stay bright, center third darkened for text legibility */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.88) 40%, rgba(0,0,0,0.92) 50%, rgba(0,0,0,0.88) 60%, rgba(0,0,0,0) 70%, rgba(0,0,0,0) 100%)" }} />
        {/* Soft bottom fade into the tab bar */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, transparent 40%, rgba(0,0,0,0.55) 100%)" }} />

        {/* Centered text block — top padding clears the DomeNav hamburger (~80px button + gap) */}
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "96px 32px 0", maxWidth: 860, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85 }}>
            <h1 style={{ fontFamily: FF_SERIF, fontSize: "clamp(38px, 5vw, 56px)", color: GOLD, margin: 0, letterSpacing: "0.04em", textShadow: "0 0 48px rgba(212,175,55,0.55)" }}>
              Extinction Risk
            </h1>
            <p style={{ fontFamily: FF_SERIF, fontStyle: "italic", fontSize: 16, color: "#fff", margin: "8px 0 16px" }}>
              Downlisted from Endangered after partial recovery, but still entirely dependent on conservation management.
            </p>
            <span style={{ fontFamily: FF_SANS, fontSize: 14, fontWeight: 800, letterSpacing: "0.2em", color: CRIMSON, display: "block", marginBottom: 8 }}>
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
