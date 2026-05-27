// ─── Sources & Citations ────────────────────────────────────────────────────────
// Academic references, citations, and project credits page.
// No-scroll layout: compact citations on the left, credits image on the right.
// Header matches the style used across all other section pages.
// ─────────────────────────────────────────────────────────────────────────────
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

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
      className="w-full"
      style={{
        height: "100vh",
        overflow: "hidden",
        background: "#000000",
        display: "flex",
        flexDirection: "column",
        paddingTop: 88,
        paddingBottom: 24,
        paddingLeft: 48,
        paddingRight: 48,
        boxSizing: "border-box",
        gap: 20,
      }}
    >
      {/* ── Header — matches all other pages ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: "center", flexShrink: 0 }}
      >
        <h1
          className="text-6xl mb-3"
          style={{ fontFamily: "'Playfair Display', serif", color: "rgba(212,175,55,1)", letterSpacing: "0.04em" }}
        >
          Sources &amp; Citations
        </h1>
        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontSize: 20,
            color: "rgba(212,175,55,0.88)",
            margin: "0 auto",
          }}
        >
          Data sourced from leading conservation organizations and peer-reviewed literature.
        </p>
      </motion.div>

      {/* ── Body: citations left · image right ── */}
      <div style={{ flex: 1, display: "flex", gap: 28, minHeight: 0 }}>

        {/* Left — citations */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            flex: "0 0 42%",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            minHeight: 0,
          }}
        >
          {/* 2-column grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            flex: 1,
            minHeight: 0,
          }}>
            {sources.map((source, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                style={{ minHeight: 0 }}
              >
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block h-full"
                    data-testid={`link-source-${idx}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Card className="bg-card/30 border-border hover:bg-card/60 hover:border-primary/50 transition-colors h-full cursor-pointer">
                      <CardContent className="p-4 h-full">
                        <h3 className="text-lg font-bold text-primary">{source.title}</h3>
                        <p className="text-muted-foreground text-base mt-1">{source.desc}</p>
                      </CardContent>
                    </Card>
                  </a>
                ) : (
                  <Card className="bg-card/30 border-border h-full">
                    <CardContent className="p-4 h-full">
                      <h3 className="text-lg font-bold text-primary">{source.title}</h3>
                      <p className="text-muted-foreground text-base mt-1">{source.desc}</p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            ))}
          </div>

          {/* Image credit note */}
          <p style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontSize: 11,
            color: "rgba(255,255,255,0.3)",
            margin: 0,
            letterSpacing: "0.03em",
            flexShrink: 0,
          }}>
            Image Credits: Few images generated for educational purposes.&nbsp; · &nbsp;Conservation Orgs: James Campbell NWR, Kealia Pond NWR, Hawaii Wildlife Fund, The Nature Conservancy Hawaii.
          </p>
        </motion.div>

        {/* Right — credits image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{ flex: 1, minHeight: 0, display: "flex" }}
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
