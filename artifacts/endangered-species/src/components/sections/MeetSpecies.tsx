// ─── Meet the Species ─────────────────────────────────────────────────────────
import { motion } from "framer-motion";
import sciClassImg from "@assets/image_1779762468352.png";

const GOLD    = "rgba(212,175,55,1)";
const CRIMSON = "rgba(220,50,30,1)";
const CARD_BG = "rgba(8,10,18,0.97)";
const BORDER  = "rgba(212,175,55,0.18)";
const FF_SERIF = "'Playfair Display', serif";
const FF_SANS  = "'Josefin Sans', sans-serif";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: FF_SANS, fontSize: 12, fontWeight: 800, letterSpacing: "0.18em", color: GOLD, margin: "0 0 14px", display: "flex", alignItems: "center", gap: 7 }}>
      <span style={{ color: GOLD }}>✦</span> {children}
    </p>
  );
}

export function MeetSpecies() {
  const facts = [
    "The Hawaiian Coot is endemic to Hawaii — found nowhere else on Earth naturally",
    "Their distinctive bright white frontal shield can turn red in some individuals — scientists believe it signals social status",
    "Population crashed to fewer than 1,000 birds by the 1970s — recovery efforts brought them back to ~3,200 today",
    "Unlike most waterbirds, Hawaiian Coots are highly territorial and will fiercely defend nesting areas even from larger birds",
    "Chicks have bright orange-red heads — bold coloring may stimulate parental feeding instincts",
  ];

  const stats = [
    { value: "~3,200", label: "Wild Population",  color: CRIMSON },
    { value: "1",      label: "Endemic Island Chain", color: GOLD   },
    { value: "0–1.2K", label: "Elevation (m)",    color: CRIMSON },
    { value: "390–650",label: "Weight (g)",       color: GOLD   },
  ];

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
            style={{
              borderRadius: 20,
              border: `1px solid ${GOLD}40`,
              background: CARD_BG,
              overflow: "hidden",
              position: "relative",
            }}>
            {/* Card header bar */}
            <div style={{ padding: "18px 26px 16px", borderBottom: `1px solid ${GOLD}20`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: CRIMSON, boxShadow: `0 0 10px ${CRIMSON}` }} />
                <span style={{ fontFamily: FF_SANS, fontSize: 13, fontWeight: 800, color: GOLD, letterSpacing: "0.16em" }}>SPECIES DOCUMENTARY</span>
              </div>
              <span style={{ fontFamily: FF_SANS, fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em" }}>PLAY · PAUSE · REPLAY</span>
            </div>

            {/* Video frame */}
            <div style={{ position: "relative", background: "#000", lineHeight: 0 }}>
              <video
                src="/coot.mp4"
                controls
                controlsList="nodownload"
                playsInline
                style={{ width: "100%", display: "block", maxHeight: 540 }}
              />
            </div>

            {/* Card footer */}
            <div style={{ padding: "14px 26px", background: `${GOLD}06`, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: FF_SERIF, fontStyle: "italic", fontSize: 15, color: "rgba(255,255,255,0.72)" }}>
                Fulica alai in its natural wetland habitat — National Wildlife Refuge footage
              </span>
            </div>

            {/* Corner glow */}
            <div style={{ position: "absolute", top: 0, left: 0, width: "30%", height: "30%", background: `radial-gradient(ellipse at 0% 0%, ${GOLD}12, transparent 70%)`, pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: "30%", height: "30%", background: `radial-gradient(ellipse at 100% 100%, ${CRIMSON}0d, transparent 70%)`, pointerEvents: "none" }} />
          </motion.div>

          {/* ── Two-column: facts + stats ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 22 }}>

            {/* Left — Key facts */}
            <div style={{ borderRadius: 16, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "26px 28px" }}>
              <SectionLabel>5 KEY FACTS</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {facts.map((fact, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      display: "flex", gap: 14, alignItems: "flex-start",
                      padding: "14px 16px", borderRadius: 12,
                      border: `1px solid rgba(220,50,30,0.28)`,
                      background: "rgba(220,50,30,0.06)",
                    }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "rgba(212,175,55,0.14)", fontFamily: FF_SANS,
                      fontSize: 13, fontWeight: 900, color: GOLD,
                    }}>{i + 1}</div>
                    <p style={{ fontFamily: FF_SERIF, fontSize: 16, color: "rgba(255,255,255,0.92)", margin: 0, lineHeight: 1.6 }}>{fact}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right — Stats + classification */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Stat grid */}
              <div style={{ borderRadius: 16, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "24px 26px" }}>
                <SectionLabel>SPECIES STATISTICS</SectionLabel>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {stats.map((s, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.07 }}
                      style={{
                        padding: "16px 14px", borderRadius: 12, textAlign: "center",
                        border: `1px solid ${s.color}35`, background: `${s.color}0b`,
                      }}>
                      <p style={{ fontFamily: FF_SERIF, fontSize: 28, fontWeight: 700, color: s.color, margin: 0, lineHeight: 1 }}>{s.value}</p>
                      <p style={{ fontFamily: FF_SANS, fontSize: 12, color: "rgba(255,255,255,0.78)", margin: "6px 0 0", letterSpacing: "0.06em" }}>{s.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Classification image */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                style={{ borderRadius: 16, border: `1px solid ${BORDER}`, background: CARD_BG, padding: "20px", flex: 1 }}>
                <SectionLabel>SCIENTIFIC CLASSIFICATION</SectionLabel>
                <img src={sciClassImg} alt="Scientific Classification" style={{ width: "100%", borderRadius: 10, display: "block" }} />
              </motion.div>
            </div>

          </div>
        </motion.div>
      </div>

    </div>
  );
}
