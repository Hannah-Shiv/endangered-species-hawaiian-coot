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
            <p>Image Credits: AI-generated images used for educational purposes.</p>
            <p className="mt-2">Conservation Organizations: James Campbell NWR, Kealia Pond NWR, Hawaii Wildlife Fund, The Nature Conservancy Hawaii.</p>
          </div>

          {/* ── Project credit ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            style={{
              borderRadius: 20,
              border: "1px solid rgba(212,175,55,0.35)",
              background: "linear-gradient(135deg, rgba(20,14,0,0.95) 0%, rgba(10,8,2,0.98) 100%)",
              boxShadow: "0 0 40px rgba(212,175,55,0.08), inset 0 1px 0 rgba(212,175,55,0.15)",
              overflow: "hidden",
            }}
          >
            {/* Gold top bar */}
            <div style={{ height: 3, background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.8), rgba(212,175,55,1), rgba(212,175,55,0.8), transparent)" }} />

            <div style={{ padding: "36px 48px 40px", textAlign: "center" }}>

              {/* Eyebrow label */}
              <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, letterSpacing: "0.22em", color: "rgba(212,175,55,0.5)", fontWeight: 700, marginBottom: 6 }}>
                SCIENCE PROJECT · ENDANGERED SPECIES
              </p>

              {/* Project title */}
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "rgba(212,175,55,0.95)", fontStyle: "italic", marginBottom: 28 }}>
                Hawaiian Coot — <em>Fulica alai</em>
              </p>

              {/* Decorative divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28, justifyContent: "center" }}>
                <div style={{ height: 1, width: 60, background: "linear-gradient(to right, transparent, rgba(212,175,55,0.4))" }} />
                <span style={{ color: "rgba(212,175,55,0.6)", fontSize: 14 }}>✦</span>
                <div style={{ height: 1, width: 60, background: "linear-gradient(to left, transparent, rgba(212,175,55,0.4))" }} />
              </div>

              {/* Team member cards */}
              <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
                {[
                  { name: "Hannah Shiv",   initials: "HS", role: "Developer & Student Researcher", lead: true },
                  { name: "Chloe Pan",     initials: "CP", role: "Student Researcher",             lead: false },
                  { name: "Bahram Ostad",  initials: "BO", role: "Student Researcher",             lead: false },
                ].map((member) => (
                  <div
                    key={member.name}
                    style={{
                      width: 180,
                      borderRadius: 14,
                      border: `1px solid rgba(212,175,55,${member.lead ? "0.35" : "0.18"})`,
                      background: `rgba(212,175,55,${member.lead ? "0.07" : "0.03"})`,
                      padding: "20px 16px 18px",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                    }}
                  >
                    {/* Avatar circle */}
                    <div style={{
                      width: 52, height: 52, borderRadius: "50%",
                      background: `rgba(212,175,55,${member.lead ? "0.18" : "0.1"})`,
                      border: `2px solid rgba(212,175,55,${member.lead ? "0.6" : "0.3"})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 18, fontWeight: 700,
                        color: `rgba(212,175,55,${member.lead ? "1" : "0.75"})`,
                      }}>
                        {member.initials}
                      </span>
                    </div>
                    <p style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 17,
                      color: `rgba(212,175,55,${member.lead ? "1" : "0.8"})`,
                      margin: 0, lineHeight: 1.2,
                    }}>
                      {member.name}
                    </p>
                    <p style={{
                      fontFamily: "'Josefin Sans', sans-serif",
                      fontSize: 10.5, letterSpacing: "0.06em",
                      color: "rgba(255,255,255,0.4)",
                      margin: 0, lineHeight: 1.4, textAlign: "center",
                      textTransform: "uppercase",
                    }}>
                      {member.role}
                    </p>
                  </div>
                ))}
              </div>

              {/* School info pills */}
              <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
                {[
                  { icon: "🏫", text: "Cooper Middle School" },
                  { icon: "🔬", text: "Life Science" },
                  { icon: "📅", text: "2025–2026" },
                ].map((item) => (
                  <div
                    key={item.text}
                    style={{
                      display: "flex", alignItems: "center", gap: 7,
                      padding: "7px 16px",
                      borderRadius: 999,
                      border: "1px solid rgba(212,175,55,0.2)",
                      background: "rgba(212,175,55,0.05)",
                    }}
                  >
                    <span style={{ fontSize: 15 }}>{item.icon}</span>
                    <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em" }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

            </div>

            {/* Gold bottom bar */}
            <div style={{ height: 3, background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), rgba(212,175,55,0.8), rgba(212,175,55,0.5), transparent)" }} />
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
