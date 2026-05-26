import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useRef, useState, useCallback, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import wetlandBefore from "@assets/image_1779814678211.png";
import wetlandAfter from "@assets/image_1779814700434.png";

const temperatureData = [
  { year: "1960", temp: 0.0 },
  { year: "1965", temp: 0.05 },
  { year: "1970", temp: 0.1 },
  { year: "1975", temp: 0.15 },
  { year: "1980", temp: 0.2 },
  { year: "1985", temp: 0.25 },
  { year: "1990", temp: 0.3 },
  { year: "1995", temp: 0.4 },
  { year: "2000", temp: 0.45 },
  { year: "2005", temp: 0.5 },
  { year: "2010", temp: 0.55 },
  { year: "2015", temp: 0.65 },
  { year: "2020", temp: 0.75 },
  { year: "2024", temp: 0.8 },
];

const beforeCards = [
  {
    icon: "🌿",
    title: "Extensive Wetlands",
    desc: "Large areas of shallow water and vegetation support abundant wildlife.",
  },
  {
    icon: "🪺",
    title: "Safe Nesting Habitat",
    desc: "Coots can build and protect nests among dense vegetation.",
  },
  {
    icon: "💧",
    title: "Stable Water Levels",
    desc: "Balanced ecosystems provide food, shelter, and breeding success.",
  },
];

const afterCards = [
  {
    icon: "🌊",
    title: "Loss of Wetlands",
    desc: "Rising seas submerge low-lying wetlands, reducing critical habitat.",
  },
  {
    icon: "⚠️",
    title: "Nesting at Risk",
    desc: "Higher water levels increase nest flooding and reduce survival.",
  },
  {
    icon: "☠️",
    title: "Ecosystem Impact",
    desc: "Salinity intrusion and habitat loss threaten food sources and long-term survival.",
  },
];

function BeforeAfterSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateSlider = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    updateSlider(e.clientX);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setDragging(true);
    updateSlider(e.touches[0].clientX);
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => updateSlider(e.clientX);
    const onTouchMove = (e: TouchEvent) => updateSlider(e.touches[0].clientX);
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging, updateSlider]);

  const handleContainerClick = (e: React.MouseEvent) => {
    if (!dragging) updateSlider(e.clientX);
  };

  return (
    <div className="space-y-0">
      {/* Slider image — height is viewport-relative so image + cards always fit on screen */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-t-xl"
        style={{
          height: "clamp(260px, calc(100vh - 420px), 580px)",
          cursor: dragging ? "ew-resize" : "col-resize",
          userSelect: "none",
        }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onClick={handleContainerClick}
      >
        {/* BEFORE image */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img
            src={wetlandBefore}
            alt="Healthy Hawaiian wetland before sea level rise"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 65%", display: "block" }}
            draggable={false}
          />
          <div className="absolute inset-0" style={{ background: "rgba(0,90,10,0.22)", mixBlendMode: "multiply", pointerEvents: "none" }} />
        </div>

        {/* AFTER image */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
        >
          <img
            src={wetlandAfter}
            alt="Hawaiian wetland after projected sea level rise"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 65%", display: "block" }}
            draggable={false}
          />
          <div className="absolute inset-0" style={{ background: "rgba(140,20,0,0.28)", mixBlendMode: "multiply", pointerEvents: "none" }} />
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 w-px"
          style={{
            left: `${sliderPos}%`,
            background: "rgba(212,175,55,0.9)",
            boxShadow: "0 0 12px 2px rgba(212,175,55,0.6)",
            pointerEvents: "none",
          }}
        />

        {/* Drag handle circle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center rounded-full"
          style={{
            left: `${sliderPos}%`,
            width: 48,
            height: 48,
            background: "rgba(0,0,0,0.85)",
            border: "2px solid rgba(212,175,55,0.9)",
            boxShadow: "0 0 18px rgba(212,175,55,0.5)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
            <path d="M8 8H2M2 8L5 5M2 8L5 11" stroke="rgba(212,175,55,0.95)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 8H26M26 8L23 5M26 8L23 11" stroke="rgba(212,175,55,0.95)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="14" y1="2" x2="14" y2="14" stroke="rgba(212,175,55,0.4)" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
        </div>

        {/* BEFORE block — top-left corner, unified box */}
        <div
          className="absolute top-4 left-4"
          style={{ pointerEvents: "none", opacity: sliderPos > 10 ? 1 : 0, transition: "opacity 0.25s", maxWidth: 290 }}
        >
          <div style={{ background: "rgba(0,0,0,0.82)", border: "2px solid rgba(34,200,34,0.9)", borderRadius: 12, padding: "10px 16px 12px" }}>
            <div className="flex items-center gap-2 mb-2">
              <span style={{ fontSize: 20 }}>🌿</span>
              <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 20, letterSpacing: "0.18em", color: "rgb(80,240,80)", fontWeight: 700 }}>BEFORE</span>
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 16, color: "rgba(220,255,220,1)", lineHeight: 1.5, fontWeight: 600 }}>
              Healthy Wetlands at Current Sea Levels
            </p>
          </div>
        </div>

        {/* AFTER block — top-right corner, unified box */}
        <div
          className="absolute top-4 right-4 text-right"
          style={{ pointerEvents: "none", opacity: sliderPos < 90 ? 1 : 0, transition: "opacity 0.25s", maxWidth: 290 }}
        >
          <div style={{ background: "rgba(0,0,0,0.82)", border: "2px solid rgba(240,60,30,0.9)", borderRadius: 12, padding: "10px 16px 12px" }}>
            <div className="flex items-center gap-2 mb-2 justify-end">
              <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 20, letterSpacing: "0.18em", color: "rgb(255,90,60)", fontWeight: 700 }}>AFTER</span>
              <span style={{ fontSize: 20 }}>🔥</span>
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 16, color: "rgba(255,220,215,1)", lineHeight: 1.5, fontWeight: 600 }}>
              Projected Sea Level Rise (20–60 cm by 2100)
            </p>
          </div>
        </div>

        {/* Drag hint — bottom center of image */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2" style={{ pointerEvents: "none", zIndex: 10 }}>
          <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, letterSpacing: "0.12em", color: "rgba(212,175,55,0.65)", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            ← drag to compare →
          </p>
        </div>
      </div>

      {/* Cards section — sits BELOW the full image, never overlapping */}
      <div
        className="relative rounded-b-xl overflow-hidden"
        style={{ border: "1px solid rgba(212,175,55,0.25)", borderTop: "none" }}
      >
        {/* BEFORE cards */}
        <div
          className="grid grid-cols-3"
          style={{
            background: "rgba(0,22,4,0.92)",
            opacity: sliderPos >= 50 ? 1 : 0,
            transition: "opacity 0.4s ease",
            position: sliderPos >= 50 ? "relative" : "absolute",
            inset: 0,
            width: "100%",
          }}
        >
          {beforeCards.map((c, i) => (
            <div key={c.title} className="p-5 flex flex-col gap-2"
              style={{ borderRight: i < 2 ? "1px solid rgba(212,175,55,0.15)" : "none" }}>
              <span style={{ fontSize: 32 }}>{c.icon}</span>
              <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 15, letterSpacing: "0.1em", color: "rgb(80,230,80)", fontWeight: 700, textTransform: "uppercase" }}>{c.title}</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "rgba(210,250,210,0.9)", lineHeight: 1.55 }}>{c.desc}</p>
            </div>
          ))}
        </div>

        {/* AFTER cards */}
        <div
          className="grid grid-cols-3"
          style={{
            background: "rgba(26,5,0,0.92)",
            opacity: sliderPos < 50 ? 1 : 0,
            transition: "opacity 0.4s ease",
            position: sliderPos < 50 ? "relative" : "absolute",
            inset: 0,
            width: "100%",
          }}
        >
          {afterCards.map((c, i) => (
            <div key={c.title} className="p-5 flex flex-col gap-2"
              style={{ borderRight: i < 2 ? "1px solid rgba(212,175,55,0.15)" : "none" }}>
              <span style={{ fontSize: 32 }}>{c.icon}</span>
              <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 15, letterSpacing: "0.1em", color: "rgb(255,90,60)", fontWeight: 700, textTransform: "uppercase" }}>{c.title}</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "rgba(255,210,200,0.9)", lineHeight: 1.55 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom warning banner */}
      <div
        className="mt-3 flex items-center justify-between px-6 py-4 rounded-xl"
        style={{
          background: "rgba(10,5,0,0.7)",
          border: "1px solid rgba(212,175,55,0.3)",
        }}
      >
        <div className="flex items-center gap-3">
          <span style={{ fontSize: 20 }}>⚠️</span>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: 17,
              color: "rgba(255,230,150,0.9)",
              lineHeight: 1.6,
            }}
          >
            Hawaiian Coots are highly vulnerable to sea level rise.
            <br />
            Protecting wetlands today is essential for their tomorrow.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-6">
          <span style={{ fontSize: 20 }}>🌱</span>
          <p
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontSize: 12,
              letterSpacing: "0.08em",
              color: "rgba(212,175,55,0.9)",
              fontWeight: 600,
              textAlign: "right",
              lineHeight: 1.5,
            }}
          >
            Conserve Wetlands.
            <br />
            Protect Wildlife.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ClimateStressors() {
  return (
    <div className="w-full min-h-screen pt-24 pb-12 px-6 md:px-12 bg-background overflow-y-auto">
      <div className="max-w-7xl mx-auto">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4 text-center"
        >
          <h1
            className="text-6xl mb-3"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "rgba(212,175,55,1)",
              letterSpacing: "0.04em",
            }}
          >
            Climate Stressors
          </h1>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: 20,
              color: "rgba(212,175,55,0.88)",
              whiteSpace: "nowrap",
              margin: "0 auto",
            }}
          >
            Hawaii's delicate ecosystems are facing unprecedented changes, directly threatening the shallow wetlands coots depend on.
          </p>
        </motion.div>

        {/* ── Rising Sea Level slider section ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="mb-10"
          style={{
            border: "1px solid rgba(212,175,55,0.3)",
            borderRadius: 12,
            padding: "10px 10px 16px",
            background: "rgba(6,4,0,0.6)",
            margin: "0 6px 40px",
          }}
        >
          <BeforeAfterSlider />
        </motion.div>

        {/* ── Charts row ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid gap-8 mb-12"
          style={{ gridTemplateColumns: "3fr 1fr" }}
        >
          <div
            style={{
              background: "rgba(10,5,0,0.7)",
              border: "1px solid rgba(212,175,55,0.2)",
              borderRadius: 12,
              padding: 24,
            }}
          >
            <h3
              className="mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 20,
                color: "rgba(212,175,55,1)",
              }}
            >
              Temperature Increase — °C
            </h3>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={temperatureData}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d44" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#d44" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
                  <XAxis dataKey="year" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0a0700",
                      borderColor: "rgba(212,175,55,0.3)",
                    }}
                    itemStyle={{ color: "#ff6644" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="temp"
                    stroke="#ff5533"
                    fillOpacity={1}
                    fill="url(#colorTemp)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div
            className="flex flex-col justify-center items-center text-center"
            style={{
              background: "rgba(10,5,0,0.7)",
              border: "1px solid rgba(212,175,55,0.2)",
              borderRadius: 12,
              padding: 32,
            }}
          >
            <p
              style={{
                fontFamily: "'Josefin Sans', sans-serif",
                fontSize: 13,
                letterSpacing: "0.14em",
                color: "rgba(212,175,55,0.7)",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Sea Level Rise Projection
            </p>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 76,
                fontWeight: 700,
                color: "#ff4422",
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              20–60
              <span style={{ fontSize: 38 }}>cm</span>
            </div>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: 16,
                color: "rgba(255,255,255,0.7)",
                marginTop: 10,
              }}
            >
              by the year 2100, threatening coastal wetlands
            </p>
          </div>
        </motion.div>

        {/* ── Stressor cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              num: "1",
              title: "Coastal Inundation",
              desc: "Sea level rise directly threatens low-lying coastal wetlands where Hawaiian Coots nest, increasing salinity and altering vegetation.",
              color: "rgba(212,175,55,0.85)",
            },
            {
              num: "2",
              title: "Increased Drought",
              desc: "More frequent and severe droughts reduce freshwater pond levels, concentrating predators and shrinking available habitat.",
              color: "rgba(212,175,55,0.85)",
            },
            {
              num: "3",
              title: "Extreme Weather",
              desc: "Intensified hurricanes and flash flooding disrupt nesting seasons, while temperature increases accelerate harmful algal blooms.",
              color: "rgba(212,175,55,0.85)",
            },
          ].map((card) => (
            <div
              key={card.num}
              style={{
                background: "rgba(10,5,0,0.7)",
                border: "1px solid rgba(212,175,55,0.2)",
                borderRadius: 12,
                padding: 24,
              }}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center mb-4"
                style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.3)" }}
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: card.color,
                  }}
                >
                  {card.num}
                </span>
              </div>
              <h4
                className="mb-2"
                style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: 15,
                  letterSpacing: "0.08em",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.9)",
                  textTransform: "uppercase",
                }}
              >
                {card.title}
              </h4>
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.65,
                }}
              >
                {card.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
