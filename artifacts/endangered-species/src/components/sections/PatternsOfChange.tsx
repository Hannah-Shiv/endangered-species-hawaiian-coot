import { motion } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ComposedChart, Area, Legend,
} from "recharts";
import wetlandHealthy from "@assets/image_1779814678211.png";
import wetlandStressed from "@assets/image_1779814700434.png";

// ── Population data ──────────────────────────────────────────────────────────
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

// ── Rainfall + population correlation data ───────────────────────────────────
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

// ── Inflection points ────────────────────────────────────────────────────────
const inflectionPoints = [
  {
    year: 1970,
    color: "#e63333",
    title: "1970: Near Extinction",
    desc: "Population reached a historic low of ~900 birds due to unregulated hunting and massive wetland destruction.",
  },
  {
    year: 1977,
    color: "#dd9922",
    title: "1977: Federal Protection",
    desc: "Added to the Endangered Species Act, spurring the creation of protected wildlife refuges and habitat restoration.",
  },
  {
    year: 2005,
    color: "#4488dd",
    title: "2005: Weather Disruptions",
    desc: "Severe drought and hurricane seasons caused significant breeding failures and a temporary population dip.",
  },
  {
    year: 2024,
    color: "#44bb66",
    title: "2024: Current Status",
    desc: "Population fluctuating around ~3,200 birds, heavily dependent on ongoing predator control and wetland management.",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
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
  if (year <= 1972) return { isStressed: true, desc: "Population at historic low of ~900 birds. Unregulated hunting and massive wetland destruction drive the species toward extinction." };
  if (year <= 1979) return { isStressed: false, desc: "Federal Protection (1977) triggers habitat restoration programs. Population begins recovering from the brink of extinction." };
  if (year <= 2003) return { isStressed: false, desc: "Steady recovery underway. Protected wildlife refuges established, wetlands managed, and population climbing toward 3,500 individuals." };
  if (year <= 2007) return { isStressed: true, desc: "Severe drought and hurricane seasons cause significant breeding failures and a temporary population dip to around 2,800 birds." };
  if (year <= 2017) return { isStressed: false, desc: "Strong recovery. High rainfall years and active predator control drive population to a peak of ~3,800 birds by 2015." };
  return { isStressed: false, desc: "Population fluctuating around ~3,200 birds, heavily dependent on ongoing predator control and wetland management." };
}

function getIndicators(year: number) {
  if (year <= 1972) return [
    { icon: "🌿", label: "Habitat Health",        status: "Critical",        color: "#e63333" },
    { icon: "💧", label: "Wetland Water Levels",  status: "Very Low",        color: "#e63333" },
    { icon: "🐾", label: "Predator Control",      status: "None",            color: "#e63333" },
    { icon: "📈", label: "Population Trend",      status: "Declining",       color: "#e63333" },
  ];
  if (year <= 1979) return [
    { icon: "🌿", label: "Habitat Health",        status: "Improving",       color: "#88cc44" },
    { icon: "💧", label: "Wetland Water Levels",  status: "Low",             color: "#ddaa22" },
    { icon: "🐾", label: "Predator Control",      status: "Beginning",       color: "#ddaa22" },
    { icon: "📈", label: "Population Trend",      status: "Slight Increase", color: "#88cc44" },
  ];
  if (year <= 2003) return [
    { icon: "🌿", label: "Habitat Health",        status: "Good",            color: "#44cc88" },
    { icon: "💧", label: "Wetland Water Levels",  status: "Stable",          color: "#4488dd" },
    { icon: "🐾", label: "Predator Control",      status: "Active",          color: "rgba(212,175,55,1)" },
    { icon: "📈", label: "Population Trend",      status: "Increasing",      color: "#44cc88" },
  ];
  if (year <= 2007) return [
    { icon: "🌿", label: "Habitat Health",        status: "Stressed",        color: "#dd8822" },
    { icon: "💧", label: "Wetland Water Levels",  status: "Low",             color: "#dd8822" },
    { icon: "🐾", label: "Predator Control",      status: "Disrupted",       color: "#dd8822" },
    { icon: "📈", label: "Population Trend",      status: "Declining",       color: "#e63333" },
  ];
  if (year <= 2017) return [
    { icon: "🌿", label: "Habitat Health",        status: "Excellent",       color: "#22dd66" },
    { icon: "💧", label: "Wetland Water Levels",  status: "High",            color: "#4499ee" },
    { icon: "🐾", label: "Predator Control",      status: "Strong",          color: "#44cc88" },
    { icon: "📈", label: "Population Trend",      status: "Increasing",      color: "#22dd66" },
  ];
  return [
    { icon: "🌿", label: "Habitat Health",        status: "Good",            color: "#44cc88" },
    { icon: "💧", label: "Wetland Water Levels",  status: "Stable",          color: "#4488dd" },
    { icon: "🐾", label: "Predator Control",      status: "Active",          color: "rgba(212,175,55,1)" },
    { icon: "📈", label: "Population Trend",      status: "Slight Increase", color: "#88cc44" },
  ];
}

// ── Custom tooltip for population chart ──────────────────────────────────────
function PopTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  const { year, pop } = payload[0].payload;
  return (
    <div style={{
      background: "rgba(8,4,0,0.95)",
      border: "1px solid rgba(212,175,55,0.4)",
      borderRadius: 8,
      padding: "10px 14px",
      minWidth: 140,
    }}>
      <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 16, color: "rgba(212,175,55,1)", fontWeight: 700, marginBottom: 4 }}>{year}</p>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, color: "#ff7766", lineHeight: 1.5 }}>
        Population: ~{pop.toLocaleString()}<br />individuals
      </p>
    </div>
  );
}

// ── Timeline scrubber ────────────────────────────────────────────────────────
const MIN_YEAR = 1970;
const MAX_YEAR = 2024;

function TimelineScrubber({ currentYear, onChange }: { currentYear: number; onChange: (y: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const yearToPercent = (y: number) => ((y - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;
  const pct = yearToPercent(currentYear);

  const updateFromX = useCallback((clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const raw = (clientX - rect.left) / rect.width;
    const clamped = Math.max(0, Math.min(1, raw));
    const year = Math.round(MIN_YEAR + clamped * (MAX_YEAR - MIN_YEAR));
    onChange(year);
  }, [onChange]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    updateFromX(e.clientX);
  }, [updateFromX]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    dragging.current = true;
    updateFromX(e.touches[0].clientX);
  }, [updateFromX]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (dragging.current) updateFromX(e.clientX); };
    const onTouch = (e: TouchEvent) => { if (dragging.current) updateFromX(e.touches[0].clientX); };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouch);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onUp);
    };
  }, [updateFromX]);

  return (
    <div style={{ padding: "8px 12px 4px", userSelect: "none" }}>
      {/* Year labels */}
      <div className="flex justify-between mb-1" style={{ padding: "0 6px" }}>
        <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)", letterSpacing: "0.06em" }}>{MIN_YEAR}</span>
        <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)", letterSpacing: "0.06em" }}>{MAX_YEAR}</span>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="relative"
        style={{ height: 28, cursor: "ew-resize" }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {/* Track background */}
        <div style={{
          position: "absolute",
          top: "50%", left: 0, right: 0,
          height: 6,
          transform: "translateY(-50%)",
          borderRadius: 3,
          background: "linear-gradient(to right, rgba(212,175,55,0.25) 0%, rgba(212,175,55,0.55) 100%)",
        }} />

        {/* Filled portion */}
        <div style={{
          position: "absolute",
          top: "50%", left: 0,
          width: `${pct}%`,
          height: 6,
          transform: "translateY(-50%)",
          borderRadius: 3,
          background: "linear-gradient(to right, rgba(180,30,10,0.7), rgba(212,175,55,0.9))",
          transition: dragging.current ? "none" : "width 0.15s ease",
        }} />

        {/* Year bubble above dot */}
        <div style={{
          position: "absolute",
          left: `${pct}%`,
          bottom: "calc(50% + 10px)",
          transform: "translateX(-50%)",
          background: "rgba(30,18,0,0.95)",
          border: "1px solid rgba(212,175,55,0.6)",
          borderRadius: 6,
          padding: "2px 8px",
          pointerEvents: "none",
          transition: dragging.current ? "none" : "left 0.15s ease",
        }}>
          <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: "rgba(212,175,55,1)", fontWeight: 700, letterSpacing: "0.06em" }}>{currentYear}</span>
        </div>

        {/* Scrubber dot */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: `${pct}%`,
          transform: "translate(-50%, -50%)",
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#e63333",
          border: "2px solid rgba(255,180,160,0.9)",
          boxShadow: "0 0 10px rgba(230,50,50,0.7)",
          transition: dragging.current ? "none" : "left 0.15s ease",
          zIndex: 2,
        }} />
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export function PatternsOfChange() {
  const [currentYear, setCurrentYear] = useState(1995);

  const yearInfo = getYearInfo(currentYear);
  const indicators = getIndicators(currentYear);
  const currentPop = getPopForYear(currentYear);

  return (
    <div className="w-full min-h-screen pt-24 pb-12 px-6 md:px-12 bg-background overflow-y-auto">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-start justify-between mb-6"
        >
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 52, color: "#cc3333", letterSpacing: "0.02em", lineHeight: 1.1, marginBottom: 8 }}>
              Patterns of Change
            </h1>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 17, color: "rgba(255,255,255,0.7)", maxWidth: 640 }}>
              A story of near-extinction followed by gradual, fluctuating recovery dependent on wetland management.
            </p>
          </div>
          <div style={{
            background: "rgba(20,12,0,0.8)",
            border: "1px solid rgba(212,175,55,0.3)",
            borderRadius: 10,
            padding: "12px 16px",
            maxWidth: 220,
            flexShrink: 0,
            marginLeft: 24,
          }}>
            <div className="flex items-center gap-2 mb-1">
              <span style={{ fontSize: 18 }}>☝️</span>
              <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: "rgba(212,175,55,1)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Explore the story over time</p>
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
              Drag the timeline or click on key inflection points to see how events impacted population and habitat.
            </p>
          </div>
        </motion.div>

        {/* ── Population Chart ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{
            background: "rgba(8,4,0,0.7)",
            border: "1px solid rgba(212,175,55,0.25)",
            borderRadius: "12px 12px 0 0",
            padding: "20px 20px 8px",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "rgba(255,255,255,0.9)" }}>
              Estimated Wild Population (1970 – 2024)
            </h3>
            <div className="flex items-center gap-2">
              <div style={{ width: 28, height: 2, background: "#e63333", borderRadius: 1 }} />
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e63333" }} />
              <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em" }}>
                Estimated Population (Number of Individuals)
              </span>
            </div>
          </div>

          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={popData} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.08)" vertical={false} />
                <XAxis
                  dataKey="year"
                  type="number"
                  domain={[1970, 2024]}
                  ticks={[1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024]}
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fontSize: 12, fill: "rgba(255,255,255,0.7)", fontFamily: "'Josefin Sans', sans-serif" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 4500]}
                  ticks={[0, 1500, 3000, 4500]}
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fontSize: 12, fill: "rgba(255,255,255,0.7)", fontFamily: "'Josefin Sans', sans-serif" }}
                  tickLine={false}
                  width={45}
                />
                <Tooltip content={<PopTooltip />} />
                <ReferenceLine
                  x={currentYear}
                  stroke="rgba(212,175,55,0.6)"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                />
                <Line
                  type="monotone"
                  dataKey="pop"
                  stroke="#e63333"
                  strokeWidth={2.5}
                  dot={(props: any) => {
                    const isNearest = popData.reduce((prev, cur) =>
                      Math.abs(cur.year - currentYear) < Math.abs(prev.year - currentYear) ? cur : prev
                    ).year === props.payload.year;
                    return (
                      <circle
                        key={props.key}
                        cx={props.cx}
                        cy={props.cy}
                        r={isNearest ? 7 : 4}
                        fill={isNearest ? "#ff4444" : "#e63333"}
                        stroke={isNearest ? "rgba(255,160,140,0.8)" : "rgba(230,50,50,0.4)"}
                        strokeWidth={isNearest ? 2.5 : 1}
                      />
                    );
                  }}
                  activeDot={{ r: 8, fill: "#ff6644", stroke: "rgba(255,180,150,0.8)", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ── Timeline Scrubber ── */}
        <div style={{
          background: "rgba(12,6,0,0.8)",
          border: "1px solid rgba(212,175,55,0.25)",
          borderTop: "1px solid rgba(212,175,55,0.12)",
          borderBottom: "none",
          padding: "4px 20px 2px",
        }}>
          <TimelineScrubber currentYear={currentYear} onChange={setCurrentYear} />
        </div>

        {/* ── Habitat Panel ── */}
        <motion.div
          style={{
            background: "rgba(8,4,0,0.7)",
            border: "1px solid rgba(212,175,55,0.25)",
            borderTop: "none",
            borderRadius: "0 0 12px 12px",
            display: "grid",
            gridTemplateColumns: "220px 1fr 260px",
            overflow: "hidden",
            minHeight: 180,
          }}
        >
          {/* Left — year info */}
          <div style={{ padding: "18px 16px", borderRight: "1px solid rgba(212,175,55,0.12)" }}>
            <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: "rgba(212,175,55,0.7)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
              Current Year
            </p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "rgba(212,175,55,1)", fontWeight: 700, marginBottom: 6, lineHeight: 1 }}>
              {currentYear}
            </p>
            <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: "rgba(212,175,55,0.6)", letterSpacing: "0.06em", marginBottom: 8 }}>
              ~{currentPop.toLocaleString()} individuals
            </p>
            <motion.p
              key={yearInfo.desc}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}
            >
              {yearInfo.desc}
            </motion.p>
          </div>

          {/* Center — habitat image */}
          <div style={{ position: "relative", overflow: "hidden", minHeight: 180 }}>
            <motion.img
              key={yearInfo.isStressed ? "stressed" : "healthy"}
              src={yearInfo.isStressed ? wetlandStressed : wetlandHealthy}
              alt="Habitat visualization"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 60%", display: "block" }}
            />
            {yearInfo.isStressed && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(80,20,0,0.3)", mixBlendMode: "multiply", pointerEvents: "none" }} />
            )}
          </div>

          {/* Right — ecosystem indicators */}
          <div style={{ padding: "18px 16px", borderLeft: "1px solid rgba(212,175,55,0.12)" }}>
            <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, color: "rgba(212,175,55,0.5)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
              Ecosystem Status
            </p>
            <div className="flex flex-col gap-3">
              {indicators.map((ind) => (
                <motion.div
                  key={ind.label}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 16 }}>{ind.icon}</span>
                    <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.7)", letterSpacing: "0.04em" }}>{ind.label}</span>
                  </div>
                  <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: ind.color, fontWeight: 700, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{ind.status}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Bottom row: Inflection Points + Rainfall ── */}
        <div className="grid grid-cols-2 gap-6 mt-6">

          {/* ── Key Inflection Points ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            style={{
              background: "rgba(8,4,0,0.7)",
              border: "1px solid rgba(212,175,55,0.25)",
              borderRadius: 12,
              padding: "20px 20px 16px",
            }}
          >
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "rgba(212,175,55,1)", marginBottom: 16 }}>
              Key Inflection Points
            </h3>
            <div className="flex flex-col gap-5">
              {inflectionPoints.map((pt) => (
                <div key={pt.year} className="flex gap-3 items-start">
                  <div style={{
                    width: 14, height: 14, borderRadius: "50%",
                    background: pt.color,
                    flexShrink: 0,
                    marginTop: 3,
                    boxShadow: `0 0 8px ${pt.color}88`,
                  }} />
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 14, color: pt.color, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 2 }}>{pt.title}</p>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.55 }}>{pt.desc}</p>
                  </div>
                  <button
                    onClick={() => setCurrentYear(pt.year)}
                    style={{
                      flexShrink: 0,
                      background: "rgba(212,175,55,0.1)",
                      border: `1px solid ${pt.color}66`,
                      borderRadius: 6,
                      padding: "4px 10px",
                      fontFamily: "'Josefin Sans', sans-serif",
                      fontSize: 11,
                      color: pt.color,
                      letterSpacing: "0.08em",
                      cursor: "pointer",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    View Year
                  </button>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 12, color: "rgba(212,175,55,0.4)", marginTop: 14 }}>
              ☝️ Click any event to jump to that year on the timeline above.
            </p>
          </motion.div>

          {/* ── Rainfall Dependency ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            style={{
              background: "rgba(8,4,0,0.7)",
              border: "1px solid rgba(212,175,55,0.25)",
              borderRadius: 12,
              padding: "20px 20px 16px",
            }}
          >
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "rgba(212,175,55,1)", marginBottom: 4 }}>
              Rainfall Dependency
            </h3>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 14, lineHeight: 1.5 }}>
              Unlike birds in stable environments, coot numbers rapidly <strong style={{ color: "rgba(255,255,255,0.85)" }}>boom and bust</strong> based on winter rainfall.
            </p>

            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={rainfallData} margin={{ top: 4, right: 36, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.07)" vertical={false} />
                  <XAxis
                    dataKey="year"
                    type="number"
                    domain={[1970, 2024]}
                    ticks={[1970, 1980, 1990, 2000, 2010, 2024]}
                    stroke="rgba(255,255,255,0.4)"
                    tick={{ fontSize: 11, fill: "rgba(255,255,255,0.65)", fontFamily: "'Josefin Sans', sans-serif" }}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="rain"
                    domain={[0, 2000]}
                    ticks={[0, 500, 1000, 1500, 2000]}
                    stroke="rgba(80,160,220,0.5)"
                    tick={{ fontSize: 10, fill: "rgba(80,160,220,0.8)" }}
                    tickLine={false}
                    width={36}
                    label={{ value: "Rainfall (mm)", angle: -90, position: "insideLeft", fontSize: 10, fill: "rgba(80,160,220,0.6)", dx: -2 }}
                  />
                  <YAxis
                    yAxisId="pop"
                    orientation="right"
                    domain={[0, 4500]}
                    ticks={[0, 1500, 3000, 4500]}
                    stroke="rgba(230,50,50,0.5)"
                    tick={{ fontSize: 10, fill: "rgba(230,100,80,0.8)" }}
                    tickLine={false}
                    width={36}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0a0700", borderColor: "rgba(212,175,55,0.3)" }}
                    labelStyle={{ color: "rgba(212,175,55,0.9)", fontFamily: "'Josefin Sans', sans-serif", fontSize: 12 }}
                    itemStyle={{ fontSize: 12 }}
                    formatter={(value: number, name: string) =>
                      name === "rainfall" ? [`${value} mm`, "Rainfall"] : [`~${value}`, "Population"]
                    }
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 11, fontFamily: "'Josefin Sans', sans-serif", paddingTop: 4 }}
                    formatter={(value) => value === "rainfall" ? "Rainfall (mm)" : "Population"}
                  />
                  <Area
                    yAxisId="rain"
                    type="monotone"
                    dataKey="rainfall"
                    stroke="#4488dd"
                    fill="rgba(68,136,220,0.15)"
                    strokeWidth={1.5}
                  />
                  <Line
                    yAxisId="pop"
                    type="monotone"
                    dataKey="pop"
                    stroke="#e63333"
                    strokeWidth={1.5}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div style={{
              marginTop: 10,
              padding: "8px 12px",
              background: "rgba(212,175,55,0.06)",
              border: "1px solid rgba(212,175,55,0.15)",
              borderRadius: 8,
            }}>
              <div className="flex items-start gap-2">
                <span style={{ fontSize: 14, flexShrink: 0 }}>ℹ️</span>
                <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.55 }}>
                  A single severe drought year can shrink wetland availability, causing population drops of over 20%. Conversely, wet years allow rapid recovery.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
