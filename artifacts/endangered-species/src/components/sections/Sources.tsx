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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="rounded-2xl border border-border bg-card/40 p-8 text-center"
          >
            <p className="text-xs tracking-widest text-muted-foreground mb-4 font-semibold uppercase">
              Science Project — Endangered Species — Hawaiian Coot
            </p>

            <div className="flex flex-col gap-2 mb-6">
              <div>
                <span className="text-2xl font-serif" style={{ color: "rgba(212,175,55,1)" }}>Hannah Shiv</span>
                <span className="text-muted-foreground text-sm ml-3">Developer &amp; Student Researcher</span>
              </div>
              <div>
                <span className="text-2xl font-serif" style={{ color: "rgba(212,175,55,0.85)" }}>Chloe Pan</span>
                <span className="text-muted-foreground text-sm ml-3">Student Researcher</span>
              </div>
              <div>
                <span className="text-2xl font-serif" style={{ color: "rgba(212,175,55,0.85)" }}>Bahram Ostad</span>
                <span className="text-muted-foreground text-sm ml-3">Student Researcher</span>
              </div>
            </div>

            <div className="flex justify-center gap-6 text-sm text-muted-foreground flex-wrap">
              <span>🏫 Cooper Middle School</span>
              <span>🔬 Life Science</span>
              <span>📅 2025–2026</span>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
