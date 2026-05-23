import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export function Sources() {
  const sources = [
    {
      title: "IUCN Red List of Threatened Species",
      desc: "Panthera uncia classification and assessment data.",
      url: "https://www.iucnredlist.org"
    },
    {
      title: "Snow Leopard Trust",
      desc: "Population statistics, biology, and conservation program details.",
      url: "https://www.snowleopard.org"
    },
    {
      title: "WWF Snow Leopard Program",
      desc: "Threat assessments, climate change impacts on habitat.",
      url: "https://www.worldwildlife.org"
    },
    {
      title: "Global Snow Leopard & Ecosystem Protection Program",
      desc: "Bishkek Declaration and international policy goals.",
      url: "https://globalsnowleopard.org"
    },
    {
      title: "McCarthy et al., 2017",
      desc: "Scientific paper on snow leopard conservation status and population modeling."
    },
    {
      title: "Jackson et al., 2019",
      desc: "Research on human-wildlife conflict and retaliation killing metrics."
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
          <h1 className="text-5xl font-serif text-foreground mb-4">Sources & Citations</h1>
          <p className="text-xl text-muted-foreground mb-12">
            The data and scientific information presented in this exhibit are derived from leading conservation organizations and peer-reviewed literature.
          </p>

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

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>Image Credits: Custom generation and open-source nature photography.</p>
            <p className="mt-2">Created for educational purposes.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
