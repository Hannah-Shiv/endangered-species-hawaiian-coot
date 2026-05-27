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

          {/* ── Citation cards — 2 columns ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            {sources.map((source, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <Card className="bg-card/30 border-border hover:bg-card/50 transition-colors h-full">
                  <CardContent className="p-4 md:p-6 flex justify-between items-center group h-full">
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

          {/* ── Project credit image ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
          >
            <img
              src="/credits-card.png"
              alt="Project credits — Hawaiian Coot science project by Hannah Shiv, Chloe Pan, Bahram Ostad. Life Science Teacher: Ms. Calliandra Harris, Cooper Middle School 2025–2026."
              style={{ width: "100%", borderRadius: 16, display: "block" }}
            />
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
