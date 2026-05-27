// ─── Meet the Species ─────────────────────────────────────────────────────────
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import sciClassImg from "@assets/image_1779762468352.png";

const GOLD     = "rgba(212,175,55,1)";
const CRIMSON  = "rgba(220,50,30,1)";
const CARD_BG  = "rgba(8,10,18,0.97)";
const BORDER   = "rgba(212,175,55,0.18)";
const FF_SERIF = "'Playfair Display', serif";
const FF_SANS  = "'Josefin Sans', sans-serif";

// Single text color for all overlays — deep wine red
const WINE = "#5C0808";


const FADE_DUR = 1.3;
const EASE_IN  = [0.16, 1, 0.3, 1] as const;

// Halve every numeric value inside a clamp() string — used for non-fullscreen overlay sizing
const halve = (s: string) =>
  s.replace(/(\d+(?:\.\d+)?)(px|vw)/g, (_, n, u) => `${parseFloat(n) / 2}${u}`);

function PopIndicator({ fs }: { fs: boolean }) {
  const sz = (s: string) => fs ? s : halve(s);
  return (
    <div style={{
      position: "absolute", top: "7%", left: "4%",
      pointerEvents: "none",
      display: "flex", flexDirection: "column", gap: 2,
    }}>
      {["Only", "3,200", "Remaining"].map((word, i) => (
        <motion.p key={word}
          initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: FADE_DUR, delay: i * 0.18, ease: EASE_IN }}
          style={{
            fontFamily: FF_SERIF,
            fontStyle: "italic",
            fontWeight: 900,
            fontSize: sz("clamp(32px, 4.8vw, 62px)"),
            lineHeight: 1.0,
            letterSpacing: "0.06em",
            color: WINE,
            margin: 0,
          }}>
          {word}
        </motion.p>
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: FF_SANS, fontSize: 12, fontWeight: 800, letterSpacing: "0.18em", color: GOLD, margin: "0 0 14px", display: "flex", alignItems: "center", gap: 7 }}>
      <span style={{ color: GOLD }}>✦</span> {children}
    </p>
  );
}

const CAPTIONS = [
  "A survivor of Hawai\u02bbi's disappearing wetlands\u2026",
  "A species dependent on fragile ecosystems\u2026",
  "Endemic to the islands — found nowhere else on Earth\u2026",
  "Conservation may determine its future\u2026",
];

const QUICK_FACTS = [
  "Endemic to Hawai\u02bbi",
  "IUCN: Vulnerable",
  "Wetland Waterbird",
];

export function MeetSpecies() {
  const facts = [
    "The Hawaiian Coot is endemic to Hawaii — found nowhere else on Earth naturally",
    "Their distinctive bright white frontal shield can turn red in some individuals — scientists believe it signals social status",
    "Population crashed to fewer than 1,000 birds by the 1970s — recovery efforts brought them back to ~3,200 today",
    "Unlike most waterbirds, Hawaiian Coots are highly territorial and will fiercely defend nesting areas even from larger birds",
    "Chicks have bright orange-red heads — bold coloring may stimulate parental feeding instincts",
  ];

  const stats = [
    { value: "~3,200", label: "Wild Population",     color: CRIMSON },
    { value: "1",      label: "Endemic Island Chain", color: GOLD   },
    { value: "0–1.2K", label: "Elevation (m)",        color: CRIMSON },
    { value: "390–650",label: "Weight (g)",            color: GOLD   },
  ];

  const [titlePhase, setTitlePhase] = useState<"visible" | "hidden">("visible");
  const [captionIdx, setCaptionIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setTitlePhase("hidden"), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setCaptionIdx(i => (i + 1) % CAPTIONS.length), 7000);
    return () => clearInterval(iv);
  }, []);

  // Track fullscreen state
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = () => {
    if (!videoWrapRef.current) return;
    if (!document.fullscreenElement) {
      videoWrapRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Shared text style for overlays — halved when not in fullscreen
  const sz = (s: string) => isFullscreen ? s : halve(s);
  const overlayText = (size: string, sub = false): React.CSSProperties => ({
    fontFamily: FF_SERIF,
    fontStyle: "italic",
    fontWeight: sub ? 700 : 900,
    fontSize: sz(size),
    lineHeight: sub ? 1.4 : 1.05,
    letterSpacing: sub ? "0.03em" : "0.05em",
    color: WINE,
    margin: 0,
  });

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff" }}>

      {/* ── Cinematic header ── */}
      <div style={{ position: "relative", minHeight: 360, overflow: "hidden" }}>
        <img src="/campbell-coot.png" alt="" aria-hidden
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", filter: "brightness(0.78)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0.82) 38%, rgba(0,0,0,0.90) 50%, rgba(0,0,0,0.82) 62%, rgba(0,0,0,0) 75%, rgba(0,0,0,0) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 35%, rgba(0,0,0,0.6) 100%)" }} />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "90px 32px 0", maxWidth: 820, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85 }}>
            <span style={{ fontFamily: FF_SANS, fontSize: 13, fontWeight: 800, letterSpacing: "0.22em", color: CRIMSON, display: "block", marginBottom: 10 }}>
              ENDEMIC TO HAWAII
            </span>
            <h1 style={{ fontFamily: FF_SERIF, fontSize: "clamp(36px, 5vw, 54px)", color: GOLD, margin: 0, letterSpacing: "0.04em", textShadow: "0 0 48px rgba(212,175,55,0.5)" }}>
              Meet the Species
            </h1>
            <p style={{ fontFamily: FF_SERIF, fontStyle: "italic", fontSize: 22, color: "rgba(255,255,255,0.88)", margin: "10px 0 0" }}>
              Fulica alai — Hawaiian Coot
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "40px 40px 60px", maxWidth: 1100, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ display: "flex", flexDirection: "column", gap: 28 }}>

          {/* ── Video card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ borderRadius: 20, border: `1px solid ${GOLD}40`, background: CARD_BG, overflow: "hidden", position: "relative" }}>

            {/* Card header bar */}
            <div style={{ padding: "18px 26px 16px", borderBottom: `1px solid ${GOLD}20`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: CRIMSON, boxShadow: `0 0 10px ${CRIMSON}` }} />
                <span style={{ fontFamily: FF_SANS, fontSize: 13, fontWeight: 800, color: GOLD, letterSpacing: "0.16em" }}>SPECIES DOCUMENTARY</span>
              </div>
            </div>

            {/* ── Video frame + overlays — fullscreen wrapper ── */}
            <div ref={videoWrapRef} style={{
              position: "relative", background: "#000", lineHeight: 0,
              // When this div is fullscreened, fill the screen
              ...(isFullscreen ? { width: "100vw", height: "100vh", display: "flex", alignItems: "center" } : {}),
            }}>
              <video
                src="/coot.mp4"
                controls
                controlsList="nodownload nofullscreen"
                playsInline
                style={{ width: "100%", display: "block", maxHeight: isFullscreen ? "100vh" : 540, objectFit: "contain" }}
              />

              {/* ── Custom fullscreen button ── */}
              <button
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                style={{
                  position: "absolute", bottom: 12, right: 12, zIndex: 30,
                  background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: 6, color: "#fff", cursor: "pointer",
                  width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, lineHeight: 1, backdropFilter: "blur(4px)",
                  transition: "background 0.2s",
                }}>
                {isFullscreen ? "✕" : "⛶"}
              </button>

              {/* ── OVERLAY: Cinematic Opening Title ── */}
              <AnimatePresence>
                {titlePhase === "visible" && (
                  <motion.div
                    key="opening-title"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: FADE_DUR, ease: EASE_IN }}
                    style={{
                      position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexDirection: "column",
                      pointerEvents: "none",
                    }}>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: FADE_DUR, ease: EASE_IN }}
                      style={{ ...overlayText("clamp(44px, 6.5vw, 88px)"), fontSize: sz("clamp(44px, 6.5vw, 88px)") }}>
                      Hawaiian Coot
                    </motion.p>

                    <motion.div
                      initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.9, delay: 0.55, ease: EASE_IN }}
                      style={{
                        height: "1.5px", width: 100, margin: "16px auto",
                        background: `linear-gradient(to right, transparent, ${WINE} 40%, transparent)`,
                        transformOrigin: "center", opacity: 0.5,
                      }}
                    />

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: FADE_DUR, delay: 0.55, ease: EASE_IN }}
                      style={{ ...overlayText("clamp(20px, 2.8vw, 38px)", true), fontSize: sz("clamp(20px, 2.8vw, 38px)") }}>
                      Fulica alai
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── OVERLAY: Top-right Quick Facts ── */}
              <AnimatePresence>
                {titlePhase === "hidden" && (
                  <motion.div
                    key="quick-facts"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: FADE_DUR, ease: EASE_IN }}
                    style={{ position: "absolute", top: "7%", right: "4%", textAlign: "right", pointerEvents: "none" }}>
                    {QUICK_FACTS.map((label, i) => (
                      <motion.p key={i}
                        initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: FADE_DUR, delay: i * 0.12, ease: EASE_IN }}
                        style={{ ...overlayText("clamp(32px, 4.8vw, 62px)", true), margin: "0 0 8px" }}>
                        {label}
                      </motion.p>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── OVERLAY: Top-left Matrix decode banner ── */}
              <AnimatePresence>
                {titlePhase === "hidden" && (
                  <motion.div
                    key="pop-indicator"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: FADE_DUR, delay: 0.15, ease: EASE_IN }}
                    style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" }}>
                    <PopIndicator fs={isFullscreen} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── OVERLAY: Rotating captions — on the video content, above the black strip ── */}
              <div style={{
                position: "absolute", bottom: "22%", left: 0, right: 0,
                display: "flex", justifyContent: "center",
                pointerEvents: "none",
              }}>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={captionIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 1.1, ease: EASE_IN }}
                    style={{
                      ...overlayText("clamp(32px, 4.8vw, 62px)", true),
                      textAlign: "center",
                      maxWidth: "78%",
                    }}>
                    {CAPTIONS[captionIdx]}
                  </motion.p>
                </AnimatePresence>
              </div>

            </div>{/* end video frame */}

            {/* Card footer */}
            <div style={{ padding: "14px 26px", background: `${GOLD}06`, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: FF_SERIF, fontSize: 15, color: "rgba(255,255,255,0.72)" }}>
                Fulica alai in its natural wetland habitat — National Wildlife Refuge footage
              </span>
            </div>

            <div style={{ position: "absolute", top: 0, left: 0, width: "30%", height: "30%", background: `radial-gradient(ellipse at 0% 0%, ${GOLD}12, transparent 70%)`, pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: "30%", height: "30%", background: `radial-gradient(ellipse at 100% 100%, ${CRIMSON}0d, transparent 70%)`, pointerEvents: "none" }} />
          </motion.div>

          {/* ── 1: Species Statistics ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ borderRadius: 16, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "26px 30px" }}>
            <SectionLabel>SPECIES STATISTICS</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              {stats.map((s, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.07 }}
                  style={{ padding: "20px 16px", borderRadius: 14, textAlign: "center", border: `1px solid ${s.color}40`, background: `${s.color}0d` }}>
                  <p style={{ fontFamily: FF_SERIF, fontSize: 36, fontWeight: 700, color: s.color, margin: 0, lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontFamily: FF_SANS, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.82)", margin: "8px 0 0", letterSpacing: "0.06em" }}>{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── 2: Scientific Classification ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{ borderRadius: 16, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "26px 30px" }}>
            <SectionLabel>SCIENTIFIC CLASSIFICATION</SectionLabel>
            <img src={sciClassImg} alt="Scientific Classification" style={{ width: "100%", borderRadius: 12, display: "block" }} />
          </motion.div>

          {/* ── 3: Key Facts ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            style={{ borderRadius: 16, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "26px 30px" }}>
            <SectionLabel>5 KEY FACTS</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {facts.map((fact, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display: "flex", gap: 18, alignItems: "flex-start",
                    padding: "16px 4px",
                    borderBottom: i < facts.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                  }}>
                  <span style={{ fontFamily: FF_SERIF, fontSize: 22, fontWeight: 700, color: GOLD, flexShrink: 0, lineHeight: 1, marginTop: 2 }}>{i + 1}</span>
                  <p style={{ fontFamily: FF_SERIF, fontSize: 17, color: "rgba(255,255,255,0.92)", margin: 0, lineHeight: 1.65 }}>{fact}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>

    </div>
  );
}
