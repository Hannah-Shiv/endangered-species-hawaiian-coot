import { motion } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import wetlandHealthy from "@assets/image_1779819729646.png";
import wetlandStressed from "@assets/image_1779819734890.png";

// ── Combined rainfall + population data ───────────────────────────────────────
const chartData = [
  { year: 1970, rainfall: 820,  pop: 900  },
  { year: 1972, rainfall: 680,  pop: 960  },
  { year: 1974, rainfall: 950,  pop: 1050 },
  { year: 1976, rainfall: 1120, pop: 1150 },
  { year: 1978, rainfall: 1340, pop: 1420 },
  { year: 1980, rainfall: 1560, pop: 1800 },
  { year: 1982, rainfall: 1220, pop: 2000 },
  { year: 1984, rainfall: 1050, pop: 2300 },
  { year: 1986, rainfall: 1450, pop: 2600 },
  { year: 1988, rainfall: 1680, pop: 2900 },
  { year: 1990, rainfall: 1780, pop: 3100 },
  { year: 1992, rainfall: 1650, pop: 3200 },
  { year: 1994, rainfall: 1400, pop: 3000 },
  { year: 1996, rainfall: 1500, pop: 3100 },
  { year: 1998, rainfall: 1180, pop: 3300 },
  { year: 2000, rainfall: 1620, pop: 3500 },
  { year: 2002, rainfall: 1080, pop: 3200 },
  { year: 2004, rainfall: 750,  pop: 2900 },
  { year: 2006, rainfall: 580,  pop: 2600 },
  { year: 2008, rainfall: 1320, pop: 2900 },
  { year: 2010, rainfall: 1540, pop: 3100 },
  { year: 2012, rainfall: 1760, pop: 3400 },
  { year: 2014, rainfall: 1920, pop: 3700 },
  { year: 2016, rainfall: 1580, pop: 3600 },
  { year: 2018, rainfall: 1390, pop: 3500 },
  { year: 2020, rainfall: 1220, pop: 3400 },
  { year: 2022, rainfall: 1480, pop: 3300 },
  { year: 2024, rainfall: 1410, pop: 3200 },
];

// ── Inflection points ──────────────────────────────────────────────────────────
const inflectionPoints = [
  { year: 1970, color: "#e63333", title: "1970: Near Extinction",     desc: "Historic low of ~900 birds due to unregulated hunting and massive wetland destruction." },
  { year: 1977, color: "#dd9922", title: "1977: Federal Protection",  desc: "Added to the Endangered Species Act, creating protected refuges and habitat restoration." },
  { year: 2005, color: "#4488dd", title: "2005: Weather Disruptions", desc: "Severe drought and hurricane seasons caused breeding failures and a temporary population dip." },
  { year: 2024, color: "#44bb66", title: "2024: Current Status",      desc: "~3,200 birds, heavily dependent on predator control and ongoing wetland management." },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
const MIN_YEAR = 1970;
const MAX_YEAR = 2024;

function interpolatePop(year: number): number {
  for (let i = 0; i < chartData.length - 1; i++) {
    if (year >= chartData[i].year && year <= chartData[i + 1].year) {
      const t = (year - chartData[i].year) / (chartData[i + 1].year - chartData[i].year);
      return Math.round(chartData[i].pop + t * (chartData[i + 1].pop - chartData[i].pop));
    }
  }
  return chartData[chartData.length - 1].pop;
}

function getYearInfo(year: number): { desc: string; isStressed: boolean } {
  if (year <= 1972) return { isStressed: true,  desc: "Population at historic low of ~900 birds. Unregulated hunting and wetland destruction drive the species toward extinction." };
  if (year <= 1979) return { isStressed: false, desc: "Federal Protection (1977) triggers habitat restoration. Population begins recovering from the brink of extinction." };
  if (year <= 2003) return { isStressed: false, desc: "Steady recovery underway. Protected refuges established, wetlands managed, population climbing toward 3,500 individuals." };
  if (year <= 2007) return { isStressed: true,  desc: "Drought and hurricane seasons cause breeding failures. Population dips to ~2,800 birds." };
  if (year <= 2017) return { isStressed: false, desc: "Strong recovery. High rainfall and predator control drive population to a peak of ~3,800 birds by 2015." };
  return                  { isStressed: false, desc: "Population ~3,200 birds, dependent on ongoing predator control and wetland management." };
}

function getIndicators(year: number) {
  if (year <= 1972) return [
    { icon: "🌿", label: "Habitat Health",       status: "Critical",        color: "#e63333" },
    { icon: "💧", label: "Water Levels",         status: "Very Low",        color: "#e63333" },
    { icon: "🐾", label: "Predator Control",     status: "None",            color: "#e63333" },
    { icon: "📈", label: "Population Trend",     status: "Declining",       color: "#e63333" },
  ];
  if (year <= 1979) return [
    { icon: "🌿", label: "Habitat Health",       status: "Improving",       color: "#88cc44" },
    { icon: "💧", label: "Water Levels",         status: "Low",             color: "#ddaa22" },
    { icon: "🐾", label: "Predator Control",     status: "Beginning",       color: "#ddaa22" },
    { icon: "📈", label: "Population Trend",     status: "Slight Increase", color: "#88cc44" },
  ];
  if (year <= 2003) return [
    { icon: "🌿", label: "Habitat Health",       status: "Good",            color: "#44cc88" },
    { icon: "💧", label: "Water Levels",         status: "Stable",          color: "#4488dd" },
    { icon: "🐾", label: "Predator Control",     status: "Active",          color: "rgba(212,175,55,1)" },
    { icon: "📈", label: "Population Trend",     status: "Increasing",      color: "#44cc88" },
  ];
  if (year <= 2007) return [
    { icon: "🌿", label: "Habitat Health",       status: "Stressed",        color: "#dd8822" },
    { icon: "💧", label: "Water Levels",         status: "Low",             color: "#dd8822" },
    { icon: "🐾", label: "Predator Control",     status: "Disrupted",       color: "#dd8822" },
    { icon: "📈", label: "Population Trend",     status: "Declining",       color: "#e63333" },
  ];
  if (year <= 2017) return [
    { icon: "🌿", label: "Habitat Health",       status: "Excellent",       color: "#22dd66" },
    { icon: "💧", label: "Water Levels",         status: "High",            color: "#4499ee" },
    { icon: "🐾", label: "Predator Control",     status: "Strong",          color: "#44cc88" },
    { icon: "📈", label: "Population Trend",     status: "Increasing",      color: "#22dd66" },
  ];
  return [
    { icon: "🌿", label: "Habitat Health",       status: "Good",            color: "#44cc88" },
    { icon: "💧", label: "Water Levels",         status: "Stable",          color: "#4488dd" },
    { icon: "🐾", label: "Predator Control",     status: "Active",          color: "rgba(212,175,55,1)" },
    { icon: "📈", label: "Population Trend",     status: "Slight Increase", color: "#88cc44" },
  ];
}

// ── Custom tooltip ─────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const rain = payload.find((p: any) => p.dataKey === "rainfall");
  const pop  = payload.find((p: any) => p.dataKey === "pop");
  return (
    <div style={{ background: "#000", border: "1px solid rgba(212,175,55,0.45)", borderRadius: 7, padding: "8px 12px" }}>
      <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: "rgba(212,175,55,1)", fontWeight: 700, marginBottom: 4 }}>{label}</p>
      {rain && <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, color: "#5599ee", marginBottom: 2 }}>Rainfall: {rain.value} mm</p>}
      {pop  && <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, color: "#e63333" }}>Population: ~{pop.value.toLocaleString()}</p>}
    </div>
  );
}

// ── Timeline scrubber ──────────────────────────────────────────────────────────
function TimelineScrubber({ currentYear, onChange }: { currentYear: number; onChange: (y: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const pct = ((currentYear - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;

  const updateFromX = useCallback((clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    onChange(Math.round(MIN_YEAR + Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) * (MAX_YEAR - MIN_YEAR)));
  }, [onChange]);

  const onMouseDown  = useCallback((e: React.MouseEvent) => { dragging.current = true; updateFromX(e.clientX); }, [updateFromX]);
  const onTouchStart = useCallback((e: React.TouchEvent) => { dragging.current = true; updateFromX(e.touches[0].clientX); }, [updateFromX]);

  useEffect(() => {
    const onMove  = (e: MouseEvent) => { if (dragging.current) updateFromX(e.clientX); };
    const onTouch = (e: TouchEvent) => { if (dragging.current) updateFromX(e.touches[0].clientX); };
    const onUp    = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove); window.addEventListener("mouseup",   onUp);
    window.addEventListener("touchmove", onTouch); window.addEventListener("touchend",  onUp);
    return () => {
      window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup",   onUp);
      window.removeEventListener("touchmove", onTouch); window.removeEventListener("touchend",  onUp);
    };
  }, [updateFromX]);

  return (
    <div style={{ padding: "2px 16px 4px", userSelect: "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 1 }}>
        <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em" }}>{MIN_YEAR}</span>
        <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em" }}>{MAX_YEAR}</span>
      </div>
      <div ref={trackRef} style={{ position: "relative", height: 24, cursor: "ew-resize" }}
        onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 4, transform: "translateY(-50%)", borderRadius: 2, background: "linear-gradient(to right, rgba(212,175,55,0.18), rgba(212,175,55,0.48))" }} />
        <div style={{ position: "absolute", top: "50%", left: 0, width: `${pct}%`, height: 4, transform: "translateY(-50%)", borderRadius: 2, background: "linear-gradient(to right, rgba(180,30,10,0.65), rgba(212,175,55,0.85))", transition: dragging.current ? "none" : "width 0.1s ease" }} />
        <div style={{ position: "absolute", left: `${pct}%`, bottom: "calc(50% + 7px)", transform: "translateX(-50%)", background: "#000", border: "1px solid rgba(212,175,55,0.65)", borderRadius: 4, padding: "1px 5px", pointerEvents: "none", transition: dragging.current ? "none" : "left 0.1s ease" }}>
          <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: "rgba(212,175,55,1)", fontWeight: 700, letterSpacing: "0.06em" }}>{currentYear}</span>
        </div>
        <div style={{ position: "absolute", top: "50%", left: `${pct}%`, transform: "translate(-50%, -50%)", width: 15, height: 15, borderRadius: "50%", background: "#e63333", border: "2px solid rgba(255,160,140,0.85)", boxShadow: "0 0 7px rgba(230,50,50,0.65)", transition: dragging.current ? "none" : "left 0.1s ease", zIndex: 2 }} />
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export function PatternsOfChange() {
  const [currentYear, setCurrentYear] = useState(1995);
  const yearInfo   = getYearInfo(currentYear);
  const indicators = getIndicators(currentYear);
  const currentPop = interpolatePop(currentYear);

  const GOLD   = "rgba(212,175,55,1)";
  const GOLDF  = "rgba(212,175,55,0.22)";
  const panel: React.CSSProperties = { background: "#000", border: `1px solid ${GOLDF}` };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "80px 18px 8px", gap: 6, overflow: "hidden", boxSizing: "border-box", background: "#000" }}>

      {/* ── Row 1: Centered title — matches other pages ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-2 text-center"
        style={{ flexShrink: 0 }}
      >
        <h1 className="text-6xl mb-2" style={{ fontFamily: "'Playfair Display', serif", color: GOLD, letterSpacing: "0.04em" }}>
          Patterns of Change
        </h1>
        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 16, color: "rgba(212,175,55,0.8)" }}>
          A story of near-extinction followed by gradual, fluctuating recovery dependent on wetland management.
        </p>
      </motion.div>

      {/* ── Row 2: Chart (left) + Inflection Points (right) ── */}
      <div style={{ flex: 3, minHeight: 0, display: "grid", gridTemplateColumns: "1fr 290px", gap: 6 }}>

        {/* Chart column */}
        <div style={{ ...panel, borderRadius: 10, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Chart header */}
          <div style={{ flexShrink: 0, padding: "8px 14px 2px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
              Estimated Wild Population &amp; Rainfall (1970 – 2024)
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 16, height: 3, background: "rgba(68,136,220,0.7)", borderRadius: 1 }} />
                <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 9, color: "rgba(80,160,220,0.85)", letterSpacing: "0.06em" }}>RAINFALL (mm)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 16, height: 2, background: "#e63333", borderRadius: 1 }} />
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#e63333" }} />
                <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 9, color: "rgba(230,80,60,0.85)", letterSpacing: "0.06em" }}>POPULATION</span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div style={{ flex: 1, minHeight: 0, padding: "0 4px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 6, right: 40, bottom: 0, left: 2 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.06)" vertical={false} />
                <XAxis
                  dataKey="year" type="number" domain={[1970, 2024]}
                  ticks={[1970,1975,1980,1985,1990,1995,2000,2005,2010,2015,2020,2024]}
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fontSize: 10, fill: "rgba(255,255,255,0.6)", fontFamily: "'Josefin Sans', sans-serif" }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="rain" domain={[0, 2000]} ticks={[0,500,1000,1500,2000]}
                  stroke="rgba(68,136,220,0.35)"
                  tick={{ fontSize: 9, fill: "rgba(80,160,220,0.75)", fontFamily: "'Josefin Sans', sans-serif" }}
                  tickLine={false} width={34}
                />
                <YAxis
                  yAxisId="pop" orientation="right" domain={[0, 4500]} ticks={[0,1500,3000,4500]}
                  stroke="rgba(230,50,50,0.35)"
                  tick={{ fontSize: 9, fill: "rgba(230,100,80,0.75)", fontFamily: "'Josefin Sans', sans-serif" }}
                  tickLine={false} width={34}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  yAxisId="rain" type="monotone" dataKey="rainfall"
                  stroke="rgba(68,136,220,0.75)" fill="rgba(68,136,220,0.12)"
                  strokeWidth={1.5}
                />
                <Line
                  yAxisId="pop" type="monotone" dataKey="pop"
                  stroke="#e63333" strokeWidth={2.5} dot={false}
                  activeDot={{ r: 6, fill: "#ff6644", stroke: "rgba(255,180,150,0.8)", strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Scrubber */}
          <div style={{ flexShrink: 0, borderTop: "1px solid rgba(212,175,55,0.12)", paddingBottom: 2 }}>
            <TimelineScrubber currentYear={currentYear} onChange={setCurrentYear} />
          </div>
        </div>

        {/* Key Inflection Points column */}
        <div style={{ ...panel, borderRadius: 10, padding: "10px 12px 8px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: GOLD, marginBottom: 8, flexShrink: 0 }}>
            Key Inflection Points
          </h3>
          <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: 0 }}>
            {inflectionPoints.map((pt, i) => (
              <div key={pt.year} style={{ display: "flex", gap: 7, alignItems: "flex-start", flex: 1, minHeight: 0, paddingBottom: i < inflectionPoints.length - 1 ? 6 : 0, borderBottom: i < inflectionPoints.length - 1 ? "1px solid rgba(212,175,55,0.08)" : "none", marginBottom: i < inflectionPoints.length - 1 ? 6 : 0 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: pt.color, flexShrink: 0, marginTop: 3, boxShadow: `0 0 5px ${pt.color}88` }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: pt.color, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 1 }}>{pt.title}</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, color: "rgba(255,255,255,0.58)", lineHeight: 1.4 }}>{pt.desc}</p>
                </div>
                <button onClick={() => setCurrentYear(pt.year)} style={{
                  flexShrink: 0, background: "transparent", border: `1px solid ${pt.color}55`,
                  borderRadius: 4, padding: "1px 6px", fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: 9, color: pt.color, letterSpacing: "0.07em", cursor: "pointer",
                  fontWeight: 700, textTransform: "uppercase", whiteSpace: "nowrap",
                }}>View</button>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 9, color: "rgba(212,175,55,0.3)", marginTop: 4, flexShrink: 0 }}>
            ☝️ Click any event to jump to that year.
          </p>
        </div>
      </div>

      {/* ── Row 3: Triptych — Year flap | Habitat image | Ecosystem flap ── */}
      <div style={{ flex: 2, minHeight: 0, display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 0, border: `1px solid ${GOLDF}`, borderRadius: 10, overflow: "hidden" }}>

        {/* Left flap — Current Year */}
        <motion.div
          key={`year-${currentYear}`}
          initial={{ opacity: 0.7 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
          style={{ background: "#000", borderRight: `1px solid ${GOLDF}`, padding: "14px 18px", display: "flex", flexDirection: "column", justifyContent: "center" }}
        >
          <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: "rgba(212,175,55,0.5)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>Current Year</p>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: GOLD, fontWeight: 700, lineHeight: 1, marginBottom: 4 }}>{currentYear}</p>
          <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, color: "rgba(212,175,55,0.6)", letterSpacing: "0.04em", marginBottom: 8 }}>
            ~{currentPop.toLocaleString()} individuals
          </p>
          <motion.p
            key={yearInfo.desc}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.55 }}
          >
            {yearInfo.desc}
          </motion.p>
        </motion.div>

        {/* Center — habitat image: fixed aspect ratio, doesn't dominate */}
        <div style={{ position: "relative", overflow: "hidden", width: "clamp(875px, 100vw, 1250px)", flexShrink: 0 }}>
          <motion.img
            key={yearInfo.isStressed ? "stressed" : "healthy"}
            src={yearInfo.isStressed ? wetlandStressed : wetlandHealthy}
            alt="Habitat"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.55 }}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", display: "block" }}
          />
          {yearInfo.isStressed && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(60,10,0,0.28)", pointerEvents: "none" }} />
          )}
          <div style={{ position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.75)", border: `1px solid ${GOLDF}`, borderRadius: 4, padding: "1px 8px" }}>
            <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: GOLD, letterSpacing: "0.08em", fontWeight: 700 }}>{currentYear}</span>
          </div>
        </div>

        {/* Right flap — Ecosystem Status */}
        <motion.div
          key={`eco-${currentYear}`}
          initial={{ opacity: 0.7 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
          style={{ background: "#000", borderLeft: `1px solid ${GOLDF}`, padding: "14px 18px", display: "flex", flexDirection: "column", justifyContent: "center" }}
        >
          <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: "rgba(212,175,55,0.5)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>Ecosystem Status</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {indicators.map((ind) => (
              <motion.div
                key={ind.label}
                initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 17 }}>{ind.icon}</span>
                  <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.75)", letterSpacing: "0.03em" }}>{ind.label}</span>
                </div>
                <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 14, color: ind.color, fontWeight: 700, whiteSpace: "nowrap" }}>{ind.status}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
