// ─── Patterns of Change ───────────────────────────────────────────────────────
// Population trend analysis for the Hawaiian Coot from 1970 to 2024.
// Shows: combined Recharts graph with rainfall (area) + population (line),
// key event annotations (DDT ban, Refuge Act, drought), and two wetland photos.
// ─────────────────────────────────────────────────────────────────────────────
import { motion } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ReferenceLine, Customized,
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
    <div style={{ background: "rgba(0,0,0,0.95)", border: "2px solid rgba(212,175,55,0.85)", borderRadius: 10, padding: "12px 18px", boxShadow: "0 0 20px rgba(212,175,55,0.2)" }}>
      <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 17, color: "rgba(212,175,55,1)", fontWeight: 900, marginBottom: 7, letterSpacing: "0.06em" }}>{label}</p>
      {rain && <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "rgba(50,180,255,1)", marginBottom: 4, fontWeight: 600 }}>💧 Rainfall: {rain.value} mm</p>}
      {pop  && <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "rgba(255,100,80,1)", fontWeight: 600 }}>🐦 Population: ~{pop.value.toLocaleString()}</p>}
    </div>
  );
}

// ── Plot-area spy — reads recharts' actual offset so scrubber aligns perfectly ─
function PlotAreaSpy({ offset, onMeasure }: { offset?: { left: number; right: number }; onMeasure: (l: number, r: number) => void }) {
  useEffect(() => {
    if (offset) onMeasure(offset.left, offset.right);
  }, [offset?.left, offset?.right, onMeasure]);
  return null;
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
    <div style={{ padding: "4px 0 6px", userSelect: "none" }}>
      {/* Year pill + range row */}
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", height: 24, marginBottom: 4 }}>
        <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em" }}>{MIN_YEAR}</span>
        <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em" }}>{MAX_YEAR}</span>
        <div style={{ position: "absolute", left: `${pct}%`, top: "50%", transform: "translate(-50%, -50%)", background: "#000", border: "1.5px solid rgba(212,175,55,0.9)", borderRadius: 5, padding: "2px 9px", pointerEvents: "none", transition: dragging.current ? "none" : "left 0.1s ease", zIndex: 4, whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: "rgba(212,175,55,1)", fontWeight: 700, letterSpacing: "0.08em" }}>{currentYear}</span>
        </div>
      </div>
      {/* Thick draggable bar */}
      <div ref={trackRef}
        style={{ position: "relative", height: 44, cursor: "ew-resize", borderRadius: 8, background: "rgba(120,60,200,0.12)", border: "1.5px solid rgba(150,80,220,0.5)" }}
        onMouseDown={onMouseDown} onTouchStart={onTouchStart}
      >
        {/* Filled progress */}
        <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: `${pct}%`, background: "linear-gradient(to right, rgba(100,30,180,0.75), rgba(160,80,255,0.8))", borderRadius: "7px 0 0 7px", transition: dragging.current ? "none" : "width 0.1s ease" }} />
        {/* D R A G   T H I S   B A R */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 16, fontWeight: 900, color: "rgba(255,255,255,0.9)", lineHeight: 1, whiteSpace: "pre" }}>{"D R A G          T H I S          B A R"}</span>
        </div>
        {/* Thumb — vertical white line */}
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pct}%`, width: 4, background: "rgba(220,160,255,1)", transform: "translateX(-50%)", borderRadius: 2, boxShadow: "0 0 10px rgba(180,100,255,0.9)", transition: dragging.current ? "none" : "left 0.1s ease", zIndex: 2 }} />
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

  // Measured recharts plot-area offsets (left/right from SVG edge)
  const plotRef = useRef({ left: 44, right: 82 });
  const [plotArea, setPlotArea] = useState({ left: 44, right: 82 });
  const handlePlotMeasure = useCallback((l: number, r: number) => {
    if (l !== plotRef.current.left || r !== plotRef.current.right) {
      plotRef.current = { left: l, right: r };
      setPlotArea({ left: l, right: r });
    }
  }, []);
  // chart div has padding: "0 4px" so SVG starts 4px inset from panel edge
  const CHART_PAD = 4;
  const padLeft  = CHART_PAD + plotArea.left;
  const padRight = CHART_PAD + plotArea.right;

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
        <h1 style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "clamp(1.4rem, 2.2vw, 2rem)", fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: GOLD, margin: "0 0 4px", textShadow: "0 0 40px rgba(212,175,55,0.45)" }}>
          Patterns of Change
        </h1>
        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 16, color: "rgba(212,175,55,1)" }}>
          A story of near-extinction followed by gradual, fluctuating recovery dependent on wetland management.
        </p>
      </motion.div>

      {/* ── Row 2: Chart (left) + Inflection Points (right) ── */}
      <div style={{ flex: 3, minHeight: 0, display: "grid", gridTemplateColumns: "5fr 3fr", gap: 6 }}>

        {/* Chart column */}
        <div style={{ ...panel, borderRadius: 10, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Chart header — padded to align with plot area */}
          <div style={{ flexShrink: 0, paddingTop: 8, paddingBottom: 4, paddingLeft: padLeft, paddingRight: padRight, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: "rgba(212,175,55,1)", letterSpacing: "0.02em", fontWeight: 900, textShadow: "0 0 14px rgba(212,175,55,0.45)", flexShrink: 1, minWidth: 0 }}>
              Estimated Wild Population &amp; Rainfall (1970 – 2024)
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 18, height: 4, background: "rgba(50,160,255,1)", borderRadius: 1 }} />
                <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: "rgba(50,180,255,1)", letterSpacing: "0.06em" }}>RAINFALL</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 16, height: 2, background: "#e63333", borderRadius: 1 }} />
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#e63333" }} />
                <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: "rgba(235,120,90,1)", letterSpacing: "0.06em" }}>POPULATION</span>
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
                  stroke="rgba(255,255,255,0.55)"
                  tick={{ fontSize: 14, fill: "rgba(255,255,255,1)", fontFamily: "'Josefin Sans', sans-serif" }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="rain" domain={[0, 2000]} ticks={[0,500,1000,1500,2000]}
                  stroke="rgba(50,160,255,0.6)"
                  tick={{ fontSize: 13, fill: "rgba(50,180,255,1)", fontFamily: "'Josefin Sans', sans-serif" }}
                  tickLine={false} width={42}
                />
                <YAxis
                  yAxisId="pop" orientation="right" domain={[0, 4500]} ticks={[0,1500,3000,4500]}
                  stroke="rgba(230,50,50,0.55)"
                  tick={{ fontSize: 13, fill: "rgba(235,120,90,1)", fontFamily: "'Josefin Sans', sans-serif" }}
                  tickLine={false} width={42}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  yAxisId="rain" type="monotone" dataKey="rainfall"
                  stroke="rgba(50,160,255,1)" fill="rgba(50,160,255,0.15)"
                  strokeWidth={3}
                />
                <Line
                  yAxisId="pop" type="monotone" dataKey="pop"
                  stroke="#e63333" strokeWidth={2.5} dot={false}
                  activeDot={{ r: 6, fill: "#ff6644", stroke: "rgba(255,180,150,0.8)", strokeWidth: 2 }}
                />
                <ReferenceLine
                  x={currentYear}
                  yAxisId="rain"
                  stroke="rgba(180,100,255,1)"
                  strokeWidth={2}
                  strokeDasharray="5 3"
                  label={{ value: currentYear, position: "insideTopRight", fill: "rgba(220,160,255,1)", fontSize: 12, fontFamily: "'Josefin Sans', sans-serif", fontWeight: 900, dy: -4 }}
                />
                <Customized component={PlotAreaSpy as any} onMeasure={handlePlotMeasure} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Scrubber — padded to align with plot area */}
          <div style={{ flexShrink: 0, borderTop: "1px solid rgba(212,175,55,0.18)", paddingBottom: 2, paddingLeft: padLeft, paddingRight: padRight }}>
            <TimelineScrubber currentYear={currentYear} onChange={setCurrentYear} />
          </div>
        </div>

        {/* Key Inflection Points column */}
        <div style={{ ...panel, borderRadius: 10, padding: "10px 12px 8px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: GOLD, marginBottom: 8, flexShrink: 0, fontWeight: 900, textShadow: "0 0 14px rgba(212,175,55,0.45)" }}>
            Key Inflection Points
          </h3>
          <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: 0 }}>
            {inflectionPoints.map((pt, i) => (
              <div key={pt.year} style={{ display: "flex", gap: 7, alignItems: "flex-start", flex: 1, minHeight: 0, paddingBottom: i < inflectionPoints.length - 1 ? 6 : 0, borderBottom: i < inflectionPoints.length - 1 ? "1px solid rgba(212,175,55,0.08)" : "none", marginBottom: i < inflectionPoints.length - 1 ? 6 : 0 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: pt.color, flexShrink: 0, marginTop: 3, boxShadow: `0 0 6px ${pt.color}88` }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 16, color: pt.color, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 2 }}>{pt.title}</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.4 }}>{pt.desc}</p>
                </div>
                <button onClick={() => setCurrentYear(pt.year)} style={{
                  flexShrink: 0,
                  background: `linear-gradient(135deg, ${pt.color}25, ${pt.color}45)`,
                  border: `1.5px solid ${pt.color}99`,
                  borderRadius: 7, padding: "8px 18px", fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: 13, color: pt.color, letterSpacing: "0.1em", cursor: "pointer",
                  fontWeight: 900, textTransform: "uppercase", whiteSpace: "nowrap",
                  boxShadow: `0 0 12px ${pt.color}44`,
                }}>→ View</button>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 13, color: "rgba(212,175,55,0.9)", marginTop: 6, flexShrink: 0 }}>
            ☝️ Click any event to jump to that year.
          </p>
        </div>
      </div>

      {/* ── Row 3: Image (4fr, right aligns with chart) | Stacked panels (3fr) ── */}
      <div style={{ flex: 2, minHeight: 0, display: "grid", gridTemplateColumns: "5fr 3fr", gap: 6 }}>

        {/* Left — habitat image, right edge aligns with chart right edge */}
        <div style={{ position: "relative", overflow: "hidden", borderRadius: 10, border: `1px solid ${GOLDF}` }}>
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
          <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.75)", border: `1px solid ${GOLDF}`, borderRadius: 4, padding: "2px 10px" }}>
            <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: GOLD, letterSpacing: "0.08em", fontWeight: 700 }}>{currentYear}</span>
          </div>
        </div>

        {/* Right — Current Year (left) + Ecosystem Status (right) side by side */}
        <div style={{ display: "flex", flexDirection: "row", gap: 6, minHeight: 0 }}>

          {/* Current Year */}
          <motion.div
            key={`year-${currentYear}`}
            initial={{ opacity: 0.7 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
            style={{ ...panel, borderRadius: 10, flex: 1, minHeight: 0, padding: "14px 18px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}
          >
            <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 15, color: "rgba(212,175,55,0.9)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4, fontWeight: 700 }}>Current Year</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, marginBottom: 18, whiteSpace: "nowrap", flexWrap: "nowrap" }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, color: "#ffffff", fontWeight: 900, lineHeight: 1, textShadow: "0 0 22px rgba(212,175,55,0.85), 0 0 8px rgba(212,175,55,0.5)" }}>{currentYear}</span>
              <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 20, color: GOLD, fontWeight: 900, lineHeight: 1 }}>→</span>
              <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 22, color: "rgba(255,255,255,0.88)", letterSpacing: "0.03em", fontWeight: 600 }}>~{currentPop.toLocaleString()} <span style={{ color: "rgba(212,175,55,0.75)", fontWeight: 400, fontSize: 16 }}>individuals</span></span>
            </div>
            <motion.p
              key={yearInfo.desc}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "rgba(255,255,255,0.95)", lineHeight: 1.55, fontWeight: 600 }}
            >
              {yearInfo.desc}
            </motion.p>
          </motion.div>

          {/* Ecosystem Status */}
          <motion.div
            key={`eco-${currentYear}`}
            initial={{ opacity: 0.7 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
            style={{ ...panel, borderRadius: 10, flex: 1, minHeight: 0, padding: "14px 18px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}
          >
            <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 14, color: "rgba(212,175,55,0.9)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14, fontWeight: 700 }}>Ecosystem Status</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {indicators.map((ind) => (
                <motion.div
                  key={ind.label}
                  initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <span style={{ fontSize: 20 }}>{ind.icon}</span>
                  <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.96)", letterSpacing: "0.03em", fontWeight: 600 }}>{ind.label}</span>
                  <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 16, color: ind.color, fontWeight: 900, whiteSpace: "nowrap", marginLeft: 4, textShadow: `0 0 8px ${ind.color}66` }}>{ind.status}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
