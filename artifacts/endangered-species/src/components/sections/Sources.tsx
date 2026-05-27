// ─── Sources & Credits ────────────────────────────────────────────────────────
// Academic references, citations, and project credits page.
// No-scroll layout: citations left, credits image right, all within one viewport.
// ─────────────────────────────────────────────────────────────────────────────
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export function Sources() {
  const sources = [
    {
      title: "IUCN Red List of Threatened Species",
      desc: "Fulica alai assessment and global status.",
      url: "https://www.iucnredlist.org"
    },
    {
      title: "U.S. Fish and Wildlife Service",
      desc: "Hawaiian Waterbird Recovery Plan and refuge data.",
      url: "https://www.fws.gov"
    },
    {
      title: "Hawaii Division of Forestry and Wildlife",
      desc: "Biannual Hawaiian Waterbird Status Reports.",
      url: "https://dlnr.hawaii.gov/dofaw"
    },
    {
      title: "BirdLife International",
      desc: "Hawaiian Coot species factsheet.",
      url: "http://datazone.birdlife.org"
    },
    {
      title: "Reed, J.M. et al. (2011)",
      desc: "Scientific paper on Hawaiian waterbird population trends."
    },
    {
      title: "Engilis, A. Jr. and Pratt, T.K. (1993)",
      desc: "Status and population trends of Hawaiian waterbirds."
    }
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        paddingTop: 80,
        paddingBottom: 20,
        paddingLeft: 40,
        paddingRight: 40,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", flexShrink: 0 }}
      >
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(2rem, 3.5vw, 3rem)",
          color: "rgba(212,175,55,1)",
          letterSpacing: "0.04em",
          margin: "0 0 4px",
          lineHeight: 1.1,
        }}>
          Sources &amp; Citations
        </h1>
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: "italic",
          fontSize: "clamp(0.75rem, 1.1vw, 1rem)",
          color: "rgba(212,175,55,0.7)",
          margin: 0,
        }}>
          Data sourced from leading conservation organizations and peer-reviewed literature.
        </p>
      </motion.div>

      {/* ── Body: citations left, image right ── */}
      <div style={{ flex: 1, display: "flex", gap: 24, minHeight: 0 }}>

        {/* Left — citation cards */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          style={{
            flex: "0 0 44%",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            minHeight: 0,
          }}
        >
          {/* 2-column citation grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            flex: 1,
            minHeight: 0,
          }}>
            {sources.map((source, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.07 }}
                style={{
                  borderRadius: 10,
                  border: "1px solid rgba(212,175,55,0.2)",
                  background: "rgba(212,175,55,0.04)",
                  padding: "10px 12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 6,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <p style={{
                    fontFamily: "'Josefin Sans', sans-serif",
                    fontSize: "clamp(0.65rem, 0.85vw, 0.8rem)",
                    fontWeight: 700,
                    color: "rgba(212,175,55,0.95)",
                    margin: "0 0 3px",
                    lineHeight: 1.3,
                  }}>
                    {source.title}
                  </p>
                  <p style={{
                    fontFamily: "'Josefin Sans', sans-serif",
                    fontSize: "clamp(0.58rem, 0.75vw, 0.7rem)",
                    color: "rgba(255,255,255,0.45)",
                    margin: 0,
                    lineHeight: 1.35,
                  }}>
                    {source.desc}
                  </p>
                </div>
                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "rgba(212,175,55,0.45)", flexShrink: 0, paddingTop: 2 }}
                    data-testid={`link-source-${idx}`}
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </motion.div>
            ))}
          </div>

          {/* Small image credit note */}
          <p style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontSize: "clamp(0.58rem, 0.7vw, 0.68rem)",
            color: "rgba(255,255,255,0.28)",
            margin: 0,
            letterSpacing: "0.04em",
            flexShrink: 0,
          }}>
            Image Credits: Few images generated for educational purposes. &nbsp;·&nbsp; Conservation Orgs: James Campbell NWR, Kealia Pond NWR, Hawaii Wildlife Fund, The Nature Conservancy Hawaii.
          </p>
        </motion.div>

        {/* Right — credits image */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "stretch" }}
        >
          <img
            src="/credits-card.png"
            alt="Project credits — Hawaiian Coot science project by Hannah Shiv, Chloe Pan, Bahram Ostad. Life Science Teacher: Ms. Calliandra Harris, Cooper Middle School 2025–2026."
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
              borderRadius: 16,
              display: "block",
            }}
          />
        </motion.div>

      </div>
    </div>
  );
}
