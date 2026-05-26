import { motion } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ComposedChart, Area, Legend,
} from "recharts";
import wetlandHealthy from "@assets/image_1779814678211.png";
import wetlandStressed from "@assets/image_1779814700434.png";

// ── Data ─────────────────────────────────────────────────────────────────────
const popData = [
  { year: 1970, pop: 900 },
  { year: 1975, pop: 1200 },
  { year: 1980, pop: 2100 },
  { year: 1985, pop: 2800 },
  { year: 1990, pop: 3200 },
  { year: 1995, pop: 3000 },
  { year: 2000, pop: 3500 },
  { year: 2005, pop: 2800 },
  { year: 2010, pop: 3100 },
  { year: 2015, pop: 3800 },
  { year: 2020, pop: 3500 },
  { year: 2024, pop: 3200 },
];

const rainfallData = [
  { year: 1970, rainfall: 820, pop: 900 },
  { year: 1972, rainfall: 680, pop: 960 },
  { year: 1974, rainfall: 950, pop: 1050 },
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

const inflectionPoints = [
  { year: 1970, color: "#e63333", title: "1970: Near Extinction",    desc: "Historic low of ~900 birds due to unregulated hunting and massive wetland destruction." },
  { year: 1977, color: "#dd9922", title: "1977: Federal Protection", desc: "Added to the Endangered Species Act, creating protected wildlife refuges and habitat restoration." },
  { year: 2005, color: "#4488dd", title: "2005: Weather Disruptions", desc: "Severe drought and hurricane seasons caused breeding failures and a temporary population dip." },
  { year: 2024, color: "#44bb66", title: "2024: Current Status",     desc: "~3,200 birds, heavily dependent on ongoing predator control and wetland management." },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function getPopForYear(year: number): number {
  const d = popData;
  for (let i = 0; i < d.length - 1; i++) {
    if (year >= d[i].year && year <= d[i + 1].year) {
      const t = (year - d[i].year) / (d[i + 1].year - d[i].year);
      return Math.round(d[i].pop + t * (d[i + 1].pop - d[i].pop));
    }
  }
  return d[d.length - 1].pop;
}

function getYearInfo(year: number): { desc: string; isStressed: boolean } {
  if (year <= 1972) return { isStressed: true,  desc: "Population at historic low of ~900 birds. Unregulated hunting and wetland destruction drive the species toward extinction." };
  if (year <= 1979) return { isStressed: false, desc: "Federal Protection (1977) triggers habitat restoration. Population begins recovering from the brink of extinction." };
  if (year <= 2003) return { isStressed: false, desc: "Steady recovery underway. Protected refuges established, wetlands managed, population climbing toward 3,500 individuals." };
  if (year <= 2007) return { isStressed: true,  desc: "Drought and hurricane seasons cause significant breeding failures. Population dips to around 2,800 birds." };
  if (year <= 2017) return { isStressed: false, desc: "Strong recovery. High rainfall and active predator control drive population to a peak of ~3,800 birds by 2015." };
  return                  { isStressed: false, desc: "Population fluctuating ~3,200 birds, dependent on ongoing predator control and wetland management." };
}

function getIndicators(year: number) {
  if (year <= 1972) return [
    { icon: "🌿", label: "Habitat Health",       status: "Critical",        color: "#e63333" },
    { icon: "💧", label: "Wetland Water Levels", status: "Very Low",        color: "#e63333" },
    { icon: "🐾", label: "Predator Control",     status: "None",            color: "#e63333" },
    { icon: "📈", label: "Population Trend",     status: "Declining",       color: "#e63333" },
  ];
  if (year <= 1979) return [
    { icon: "🌿", label: "Habitat Health",       status: "Improving",       color: "#88cc44" },
    { icon: "💧", label: "Wetland Water Levels", status: "Low",             color: "#ddaa22" },
    { icon: "🐾", label: "Predator Control",     status: "Beginning",       color: "#ddaa22" },
    { icon: "📈", label: "Population Trend",     status: "Slight Increase", color: "#88cc44" },
  ];
  if (year <= 2003) return [
    { icon: "🌿", label: "Habitat Health",       status: "Good",            color: "#44cc88" },
    { icon: "💧", label: "Wetland Water Levels", status: "Stable",          color: "#4488dd" },
    { icon: "🐾", label: "Predator Control",     status: "Active",          color: "rgba(212,175,55,1)" },
    { icon: "📈", label: "Population Trend",     status: "Increasing",      color: "#44cc88" },
  ];
  if (year <= 2007) return [
    { icon: "🌿", label: "Habitat Health",       status: "Stressed",        color: "#dd8822" },
    { icon: "💧", label: "Wetland Water Levels", status: "Low",             color: "#dd8822" },
    { icon: "🐾", label: "Predator Control",     status: "Disrupted",       color: "#dd8822" },
    { icon: "📈", label: "Population Trend",     status: "Declining",       color: "#e63333" },
  ];
  if (year <= 2017) return [
    { icon: "🌿", label: "Habitat Health",       status: "Excellent",       color: "#22dd66" },
    { icon: "💧", label: "Wetland Water Levels", status: "High",            color: "#4499ee" },
    { icon: "🐾", label: "Predator Control",     status: "Strong",          color: "#44cc88" },
    { icon: "📈", label: "Population Trend",     status: "Increasing",      color: "#22dd66" },
  ];
  return [
    { icon: "🌿", label: "Habitat Health",       status: "Good",            color: "#44cc88" },
    { icon: "💧", label: "Wetland Water Levels", status: "Stable",          color: "#4488dd" },
    { icon: "🐾", label: "Predator Control",     status: "Active",          color: "rgba(212,175,55,1)" },
    { icon: "📈", label: "Population Trend",     status: "Slight Increase", color: "#88cc44" },
  ];
}

// ── Custom chart tooltip ──────────────────────────────────────────────────────
function PopTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  const { year, pop } = payload[0].payload;
  return (
    <div style={{ background: "rgba(8,4,0,0.95)", border: "1px solid rgba(212,175,55,0.4)", borderRadius: 8, padding: "8px 12px" }}>
      <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 14, color: "rgba(212,175,55,1)", fontWeight: 700, marginBottom: 2 }}>{year}</p>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, color: "#ff7766", lineHeight: 1.4 }}>Population: ~{pop.toLocaleString()}<br />individuals</p>
    </div>
  );
}

// ── Timeline scrubber ─────────────────────────────────────────────────────────
const MIN_YEAR = 1970;
const MAX_YEAR = 2024;

function TimelineScrubber({ currentYear, onChange }: { currentYear: number; onChange: (y: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const pct = ((currentYear - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;

  const updateFromX = useCallback((clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const raw = (clientX - rect.left) / rect.width;
    onChange(Math.round(MIN_YEAR + Math.max(0, Math.min(1, raw)) * (MAX_YEAR - MIN_YEAR)));
  }, [onChange]);

  const onMouseDown = useCallback((e: React.MouseEvent) => { dragging.current = true; updateFromX(e.clientX); }, [updateFromX]);
  const onTouchStart = useCallback((e: React.TouchEvent) => { dragging.current = true; updateFromX(e.touches[0].clientX); }, [updateFromX]);

  useEffect(() => {
    const onMove  = (e: MouseEvent)      => { if (dragging.current) updateFromX(e.clientX); };
    const onTouch = (e: TouchEvent)      => { if (dragging.current) updateFromX(e.touches[0].clientX); };
    const onUp    = ()                   => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    window.addEventListener("touchmove", onTouch);
    window.addEventListener("touchend",  onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend",  onUp);
    };
  }, [updateFromX]);

  return (
    <div style={{ padding: "0 20px", userSelect: "none" }}>
      <div className="flex justify-between" style={{ marginBottom: 2 }}>
        <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em" }}>{MIN_YEAR}</span>
        <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em" }}>{MAX_YEAR}</span>
      </div>
      <div ref={trackRef} className="relative" style={{ height: 26, cursor: "ew-resize" }}
        onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
        {/* Track bg */}
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 5, transform: "translateY(-50%)", borderRadius: 3, background: "linear-gradient(to right, rgba(212,175,55,0.2), rgba(212,175,55,0.5))" }} />
        {/* Filled */}
        <div style={{ position: "absolute", top: "50%", left: 0, width: `${pct}%`, height: 5, transform: "translateY(-50%)", borderRadius: 3, background: "linear-gradient(to right, rgba(180,30,10,0.7), rgba(212,175,55,0.9))", transition: dragging.current ? "none" : "width 0.12s ease" }} />
        {/* Year bubble */}
        <div style={{ position: "absolute", left: `${pct}%`, bottom: "calc(50% + 8px)", transform: "translateX(-50%)", background: "rgba(30,18,0,0.95)", border: "1px solid rgba(212,175,55,0.6)", borderRadius: 5, padding: "1px 6px", pointerEvents: "none", transition: dragging.current ? "none" : "left 0.12s ease" }}>
          <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, color: "rgba(212,175,55,1)", fontWeight: 700, letterSpacing: "0.06em" }}>{currentYear}</span>
        </div>
        {/* Dot */}
        <div style={{ position: "absolute", top: "50%", left: `${pct}%`, transform: "translate(-50%, -50%)", width: 17, height: 17, borderRadius: "50%", background: "#e63333", border: "2px solid rgba(255,180,160,0.9)", boxShadow: "0 0 8px rgba(230,50,50,0.7)", transition: dragging.current ? "none" : "left 0.12s ease", zIndex: 2 }} />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function PatternsOfChange() {
  const [currentYear, setCurrentYear] = useState(1995);
  const yearInfo    = getYearInfo(currentYear);
  const indicators  = getIndicators(currentYear);
  const currentPop  = getPopForYear(currentYear);

  // Shared styles
  const panelBase: React.CSSProperties = {
    background: "rgba(8,4,0,0.72)",
    border: "1px solid rgba(212,175,55,0.22)",
  };
  const labelSm: React.CSSProperties = {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: 10,
    color: "rgba(212,175,55,0.55)",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  };

  return (
    <div style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      padding: "10px 20px 8px",
      gap: 5,
      overflow: "hidden",
      boxSizing: "border-box",
    }}>

      {/* ── Row 1: Header ── */}
      <div style={{ flexShrink: 0, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, color: "#cc3333", letterSpacing: "0.02em", lineHeight: 1, margin: 0 }}>
            Patterns of Change
          </h1>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>
            A story of near-extinction followed by gradual, fluctuating recovery dependent on wetland management.
          </p>
        </div>
        <div style={{ ...panelBase, borderRadius: 8, padding: "7px 12px", maxWidth: 200, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
            <span style={{ fontSize: 13 }}>☝️</span>
            <p style={{ ...labelSm, fontSize: 10 }}>Explore the story over time</p>
          </div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>
            Drag the timeline or click inflection points to see how events impacted population and habitat.
          </p>
        </div>
      </div>

      {/* ── Row 2: Chart panel (flex 1 = grows to fill space) ── */}
      <div style={{ ...panelBase, borderRadius: "10px 10px 0 0", flex: 1, minHeight: 0, display: "flex", flexDirection: "column", padding: "10px 14px 4px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4, flexShrink: 0 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "rgba(255,255,255,0.88)" }}>
            Estimated Wild Population (1970 – 2024)
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 22, height: 2, background: "#e63333", borderRadius: 1 }} />
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#e63333" }} />
            <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em" }}>
              Estimated Population (Number of Individuals)
            </span>
          </div>
        </div>
        {/* Chart fills the remaining height of this panel */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={popData} margin={{ top: 6, right: 16, bottom: 0, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.07)" vertical={false} />
              <XAxis
                dataKey="year" type="number" domain={[1970, 2024]}
                ticks={[1970,1975,1980,1985,1990,1995,2000,2005,2010,2015,2020,2024]}
                stroke="rgba(255,255,255,0.4)"
                tick={{ fontSize: 10, fill: "rgba(255,255,255,0.65)", fontFamily: "'Josefin Sans', sans-serif" }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 4500]} ticks={[0,1500,3000,4500]}
                stroke="rgba(255,255,255,0.4)"
                tick={{ fontSize: 10, fill: "rgba(255,255,255,0.65)", fontFamily: "'Josefin Sans', sans-serif" }}
                tickLine={false} width={38}
              />
              <Tooltip content={<PopTooltip />} />
              <ReferenceLine x={currentYear} stroke="rgba(212,175,55,0.55)" strokeDasharray="4 4" strokeWidth={1.5} />
              <Line
                type="monotone" dataKey="pop" stroke="#e63333" strokeWidth={2.5}
                dot={(props: any) => {
                  const nearest = popData.reduce((a, b) =>
                    Math.abs(b.year - currentYear) < Math.abs(a.year - currentYear) ? b : a
                  ).year === props.payload.year;
                  return (
                    <circle key={props.key} cx={props.cx} cy={props.cy}
                      r={nearest ? 7 : 4}
                      fill={nearest ? "#ff4444" : "#e63333"}
                      stroke={nearest ? "rgba(255,160,140,0.8)" : "rgba(230,50,50,0.4)"}
                      strokeWidth={nearest ? 2.5 : 1}
                    />
                  );
                }}
                activeDot={{ r: 7, fill: "#ff6644", stroke: "rgba(255,180,150,0.8)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Row 3: Scrubber ── */}
      <div style={{ ...panelBase, borderRadius: 0, flexShrink: 0, padding: "3px 0 2px", borderTop: "none", borderBottom: "none" }}>
        <TimelineScrubber currentYear={currentYear} onChange={setCurrentYear} />
      </div>

      {/* ── Row 4: Habitat panel ── */}
      <div style={{
        ...panelBase,
        borderRadius: "0 0 10px 10px",
        flexShrink: 0,
        height: 130,
        display: "grid",
        gridTemplateColumns: "190px 1fr 230px",
        overflow: "hidden",
        borderTop: "none",
      }}>
        {/* Left */}
        <div style={{ padding: "10px 12px", borderRight: "1px solid rgba(212,175,55,0.12)" }}>
          <p style={{ ...labelSm, marginBottom: 2 }}>Current Year</p>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "rgba(212,175,55,1)", fontWeight: 700, lineHeight: 1, marginBottom: 2 }}>{currentYear}</p>
          <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: "rgba(212,175,55,0.6)", letterSpacing: "0.04em", marginBottom: 5 }}>~{currentPop.toLocaleString()} individuals</p>
          <motion.p key={yearInfo.desc} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>
            {yearInfo.desc}
          </motion.p>
        </div>
        {/* Center image */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <motion.img key={yearInfo.isStressed ? "s" : "h"}
            src={yearInfo.isStressed ? wetlandStressed : wetlandHealthy}
            alt="Habitat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 60%", display: "block" }}
          />
          {yearInfo.isStressed && <div style={{ position: "absolute", inset: 0, background: "rgba(80,20,0,0.28)", pointerEvents: "none" }} />}
        </div>
        {/* Right indicators */}
        <div style={{ padding: "10px 12px", borderLeft: "1px solid rgba(212,175,55,0.12)" }}>
          <p style={{ ...labelSm, marginBottom: 8 }}>Ecosystem Status</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {indicators.map((ind) => (
              <motion.div key={ind.label} initial={{ opacity: 0, x: 4 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 13 }}>{ind.icon}</span>
                  <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.65)", letterSpacing: "0.03em" }}>{ind.label}</span>
                </div>
                <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, color: ind.color, fontWeight: 700, whiteSpace: "nowrap" }}>{ind.status}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 5: Bottom — Inflection Points + Rainfall ── */}
      <div style={{ flexShrink: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, flex: "0 0 212px" }}>

        {/* Key Inflection Points */}
        <div style={{ ...panelBase, borderRadius: 10, padding: "10px 14px", overflow: "hidden" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "rgba(212,175,55,1)", marginBottom: 8 }}>
            Key Inflection Points
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {inflectionPoints.map((pt) => (
              <div key={pt.year} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: pt.color, flexShrink: 0, marginTop: 2, boxShadow: `0 0 6px ${pt.color}88` }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, color: pt.color, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 0 }}>{pt.title}</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>{pt.desc}</p>
                </div>
                <button onClick={() => setCurrentYear(pt.year)} style={{
                  flexShrink: 0,
                  background: "rgba(212,175,55,0.08)",
                  border: `1px solid ${pt.color}55`,
                  borderRadius: 5,
                  padding: "2px 7px",
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: 9,
                  color: pt.color,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}>View Year</button>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 10, color: "rgba(212,175,55,0.35)", marginTop: 6 }}>
            ☝️ Click any event to jump to that year on the timeline.
          </p>
        </div>

        {/* Rainfall Dependency */}
        <div style={{ ...panelBase, borderRadius: 10, padding: "10px 14px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "rgba(212,175,55,1)", marginBottom: 2, flexShrink: 0 }}>
            Rainfall Dependency
          </h3>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.4, marginBottom: 4, flexShrink: 0 }}>
            Unlike birds in stable environments, coot numbers <strong style={{ color: "rgba(255,255,255,0.78)" }}>rapidly boom and bust</strong> based on winter rainfall.
          </p>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={rainfallData} margin={{ top: 2, right: 30, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.06)" vertical={false} />
                <XAxis dataKey="year" type="number" domain={[1970, 2024]} ticks={[1970,1980,1990,2000,2010,2024]}
                  stroke="rgba(255,255,255,0.35)"
                  tick={{ fontSize: 9, fill: "rgba(255,255,255,0.6)", fontFamily: "'Josefin Sans', sans-serif" }}
                  tickLine={false}
                />
                <YAxis yAxisId="rain" domain={[0, 2000]} ticks={[0,1000,2000]}
                  stroke="rgba(80,160,220,0.4)"
                  tick={{ fontSize: 9, fill: "rgba(80,160,220,0.7)" }}
                  tickLine={false} width={30}
                />
                <YAxis yAxisId="pop" orientation="right" domain={[0, 4500]} ticks={[0,1500,3000,4500]}
                  stroke="rgba(230,50,50,0.4)"
                  tick={{ fontSize: 9, fill: "rgba(230,100,80,0.7)" }}
                  tickLine={false} width={30}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0a0700", borderColor: "rgba(212,175,55,0.3)" }}
                  labelStyle={{ color: "rgba(212,175,55,0.9)", fontFamily: "'Josefin Sans', sans-serif", fontSize: 10 }}
                  itemStyle={{ fontSize: 10 }}
                  formatter={(value: number, name: string) => name === "rainfall" ? [`${value} mm`, "Rainfall"] : [`~${value}`, "Population"]}
                />
                <Legend wrapperStyle={{ fontSize: 9, fontFamily: "'Josefin Sans', sans-serif" }}
                  formatter={(v) => v === "rainfall" ? "Rainfall (mm)" : "Population"} />
                <Area yAxisId="rain" type="monotone" dataKey="rainfall" stroke="#4488dd" fill="rgba(68,136,220,0.13)" strokeWidth={1.5} />
                <Line  yAxisId="pop"  type="monotone" dataKey="pop" stroke="#e63333" strokeWidth={1.5} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 10, color: "rgba(255,255,255,0.4)", lineHeight: 1.4, flexShrink: 0, marginTop: 3 }}>
            ℹ️ A single severe drought year can shrink wetland availability, causing population drops of over 20%. Wet years allow rapid recovery.
          </p>
        </div>

      </div>
    </div>
  );
}
