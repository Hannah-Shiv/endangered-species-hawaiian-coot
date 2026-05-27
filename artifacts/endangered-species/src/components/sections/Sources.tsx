// ─── Sources & Credits ────────────────────────────────────────────────────────
// Academic references, citations, and project credits page.
// Lists 6 scientific sources with external links, image credits,
// and developer / project attribution for Hannah Shiv.
// ─────────────────────────────────────────────────────────────────────────────
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="w-full min-h-screen pt-24 pb-12 px-6 md:px-12 bg-background overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-10 text-center">
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
              The data and scientific information presented in this exhibit are derived from leading conservation organizations and peer-reviewed literature.
            </p>
          </div>

          {/* ── Citation cards ── */}
          <div className="space-y-4 mb-16">
            {sources.map((source, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="bg-card/30 border-border hover:bg-card/50 transition-colors">
                  <CardContent className="p-4 md:p-6 flex justify-between items-center group">
                    <div>
                      <h3 className="text-lg font-bold text-primary group-hover:text-accent transition-colors">{source.title}</h3>
                      <p className="text-muted-foreground text-sm">{source.desc}</p>
                    </div>
                    {source.url && (
                      <a href={source.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground shrink-0 p-2" data-testid={`link-source-${idx}`}>
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* ── Image & org credits ── */}
          <div className="border-t border-border pt-8 mb-10 text-center text-sm text-muted-foreground">
            <p>Image Credits: Few images are generated for educational purposes.</p>
            <p className="mt-2">Conservation Organizations: James Campbell NWR, Kealia Pond NWR, Hawaii Wildlife Fund, The Nature Conservancy Hawaii.</p>
          </div>

          {/* ── Project credit ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            style={{
              borderRadius: 20,
              border: "1px solid rgba(212,175,55,0.5)",
              background: "linear-gradient(145deg, rgba(28,8,4,0.98) 0%, rgba(18,6,2,1) 50%, rgba(8,5,0,1) 100%)",
              boxShadow: "0 0 60px rgba(212,175,55,0.14), 0 0 120px rgba(200,30,10,0.06), inset 0 1px 0 rgba(212,175,55,0.25)",
              overflow: "hidden",
            }}
          >
            {/* Tricolor top bar: red → gold → white → gold → red */}
            <div style={{ height: 4, background: "linear-gradient(90deg, rgba(200,30,10,0.9), rgba(212,175,55,1) 35%, rgba(255,255,255,0.95) 50%, rgba(212,175,55,1) 65%, rgba(200,30,10,0.9))" }} />

            <div style={{ padding: "40px 52px 44px", textAlign: "center" }}>

              {/* Eyebrow */}
              <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11.5, letterSpacing: "0.26em", color: "rgba(220,60,30,0.85)", fontWeight: 800, marginBottom: 8 }}>
                SCIENCE PROJECT · ENDANGERED SPECIES
              </p>

              {/* Project title */}
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "rgba(255,255,255,0.97)", fontStyle: "italic", marginBottom: 30, textShadow: "0 0 30px rgba(212,175,55,0.4)" }}>
                Hawaiian Coot — <em style={{ color: "rgba(212,175,55,1)" }}>Fulica alai</em>
              </p>

              {/* Decorative divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32, justifyContent: "center" }}>
                <div style={{ height: 1, flex: 1, maxWidth: 80, background: "linear-gradient(to right, transparent, rgba(200,30,10,0.6))" }} />
                <span style={{ color: "rgba(212,175,55,1)", fontSize: 16 }}>✦</span>
                <div style={{ height: 1, width: 30, background: "rgba(255,255,255,0.25)" }} />
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>✦</span>
                <div style={{ height: 1, width: 30, background: "rgba(255,255,255,0.25)" }} />
                <span style={{ color: "rgba(212,175,55,1)", fontSize: 16 }}>✦</span>
                <div style={{ height: 1, flex: 1, maxWidth: 80, background: "linear-gradient(to left, transparent, rgba(200,30,10,0.6))" }} />
              </div>

              {/* Team member cards — no initials avatars */}
              <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", marginBottom: 36 }}>
                {[
                  { name: "Hannah Shiv",  role: "Developer & Student Researcher", lead: true },
                  { name: "Chloe Pan",    role: "Student Researcher",             lead: false },
                  { name: "Bahram Ostad", role: "Student Researcher",             lead: false },
                ].map((member) => (
                  <div
                    key={member.name}
                    style={{
                      width: 190,
                      borderRadius: 14,
                      border: member.lead
                        ? "1px solid rgba(212,175,55,0.6)"
                        : "1px solid rgba(255,255,255,0.15)",
                      background: member.lead
                        ? "linear-gradient(145deg, rgba(212,175,55,0.12), rgba(200,30,10,0.06))"
                        : "rgba(255,255,255,0.04)",
                      padding: "22px 16px 20px",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                      boxShadow: member.lead ? "0 0 24px rgba(212,175,55,0.12)" : "none",
                    }}
                  >
                    {/* Colored accent dot */}
                    <div style={{
                      width: 10, height: 10, borderRadius: "50%",
                      background: member.lead ? "rgba(212,175,55,1)" : "rgba(255,255,255,0.4)",
                      boxShadow: member.lead ? "0 0 10px rgba(212,175,55,0.8)" : "none",
                      marginBottom: 4,
                    }} />
                    <p style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 18,
                      color: member.lead ? "rgba(212,175,55,1)" : "rgba(255,255,255,0.9)",
                      margin: 0, lineHeight: 1.2,
                      textShadow: member.lead ? "0 0 20px rgba(212,175,55,0.5)" : "none",
                    }}>
                      {member.name}
                    </p>
                    <div style={{ height: 1, width: 40, background: member.lead ? "rgba(212,175,55,0.4)" : "rgba(255,255,255,0.15)" }} />
                    <p style={{
                      fontFamily: "'Josefin Sans', sans-serif",
                      fontSize: 11, letterSpacing: "0.07em",
                      color: member.lead ? "rgba(220,60,30,0.9)" : "rgba(255,255,255,0.45)",
                      margin: 0, lineHeight: 1.4, textAlign: "center",
                      textTransform: "uppercase", fontWeight: 700,
                    }}>
                      {member.role}
                    </p>
                  </div>
                ))}
              </div>

              {/* School info pills */}
              <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
                {[
                  { icon: "🏫", text: "Cooper Middle School", color: "rgba(212,175,55,0.3)" },
                  { icon: "🔬", text: "Life Science",          color: "rgba(200,30,10,0.3)" },
                  { icon: "📅", text: "2025–2026",             color: "rgba(255,255,255,0.15)" },
                ].map((item) => (
                  <div
                    key={item.text}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "8px 18px",
                      borderRadius: 999,
                      border: `1px solid ${item.color}`,
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{item.icon}</span>
                    <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.72)", letterSpacing: "0.05em", fontWeight: 600 }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

            </div>

            {/* Tricolor bottom bar */}
            <div style={{ height: 4, background: "linear-gradient(90deg, rgba(200,30,10,0.9), rgba(212,175,55,1) 35%, rgba(255,255,255,0.95) 50%, rgba(212,175,55,1) 65%, rgba(200,30,10,0.9))" }} />
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
