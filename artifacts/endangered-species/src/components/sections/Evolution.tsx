import { motion } from "framer-motion";

export function Evolution() {
  return (
    <div className="w-full min-h-screen pt-24 pb-12 px-6 md:px-12 bg-background overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-serif text-foreground mb-4">Evolutionary Journey</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            How a long-distance wanderer became an island endemic.
          </p>
        </motion.div>

        <div className="relative border-l-4 border-primary/30 ml-4 md:ml-[50%] mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-12 relative w-full md:w-[calc(100%+2rem)] md:-ml-[calc(50%+2rem)] flex md:justify-end pr-8 md:pr-12"
          >
            <div className="absolute top-0 right-full md:right-auto md:left-full w-4 h-4 rounded-full bg-primary -ml-[10px] md:-ml-2 mt-1.5" />
            <div className="bg-card/50 border border-border p-6 rounded-xl w-full md:w-96 text-left">
              <span className="text-primary font-bold mb-2 block">~65 Million Years Ago</span>
              <h3 className="text-xl font-serif text-foreground mb-2">Rallidae Family Diverges</h3>
              <p className="text-sm text-muted-foreground">The rail family diverges from common avian ancestors following the dinosaur extinction.</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-12 relative pl-8 md:pl-12 w-full md:w-[calc(100%+2rem)]"
          >
            <div className="absolute top-0 left-0 w-4 h-4 rounded-full bg-primary -ml-[10px] md:-ml-[10px] mt-1.5" />
            <div className="bg-card/50 border border-border p-6 rounded-xl w-full md:w-96">
              <span className="text-primary font-bold mb-2 block">~10 Million Years Ago</span>
              <h3 className="text-xl font-serif text-foreground mb-2">Fulica Genus Spreads</h3>
              <p className="text-sm text-muted-foreground">Coots spread across the Americas and the Pacific, becoming highly adaptable wetland specialists.</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-12 relative w-full md:w-[calc(100%+2rem)] md:-ml-[calc(50%+2rem)] flex md:justify-end pr-8 md:pr-12"
          >
            <div className="absolute top-0 right-full md:right-auto md:left-full w-4 h-4 rounded-full bg-primary -ml-[10px] md:-ml-2 mt-1.5" />
            <div className="bg-card/50 border border-border p-6 rounded-xl w-full md:w-96 text-left">
              <span className="text-primary font-bold mb-2 block">~500,000 Years Ago</span>
              <h3 className="text-xl font-serif text-accent mb-2">Colonizing Hawaii</h3>
              <p className="text-sm text-muted-foreground">Ancestral coots from the Americas arrive in the Hawaiian Islands via remarkable long-distance dispersal.</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-12 relative pl-8 md:pl-12 w-full md:w-[calc(100%+2rem)]"
          >
            <div className="absolute top-0 left-0 w-4 h-4 rounded-full bg-primary -ml-[10px] mt-1.5" />
            <div className="bg-card/50 border border-border p-6 rounded-xl w-full md:w-96">
              <span className="text-primary font-bold mb-2 block">~10,000 Years Ago</span>
              <h3 className="text-xl font-serif text-foreground mb-2">Distinct Species</h3>
              <p className="text-sm text-muted-foreground">Through isolation, Fulica alai becomes a distinct endemic species, adapted to island life.</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-12 relative w-full md:w-[calc(100%+2rem)] md:-ml-[calc(50%+2rem)] flex md:justify-end pr-8 md:pr-12"
          >
            <div className="absolute top-0 right-full md:right-auto md:left-full w-4 h-4 rounded-full bg-primary -ml-[10px] md:-ml-2 mt-1.5" />
            <div className="bg-card/50 border border-border p-6 rounded-xl w-full md:w-96 text-left">
              <span className="text-primary font-bold mb-2 block">1820s-1970s</span>
              <h3 className="text-xl font-serif text-destructive mb-2">Modern Bottleneck</h3>
              <p className="text-sm text-muted-foreground">Western settlement and modern development decimate habitats, pushing the species to near-extinction by 1970.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}