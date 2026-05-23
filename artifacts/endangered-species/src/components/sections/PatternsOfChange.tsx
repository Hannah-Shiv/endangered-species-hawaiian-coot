import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const popData = [
  { year: '1970', est: 8000 },
  { year: '1980', est: 7200 },
  { year: '1990', est: 6500 },
  { year: '2000', est: 5000 },
  { year: '2010', est: 4080 },
  { year: '2020', est: 4500 }, // Slight recovery due to conservation
];

export function PatternsOfChange() {
  return (
    <div className="w-full min-h-screen pt-24 pb-12 px-6 md:px-12 bg-background overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-serif text-primary mb-6">Patterns of Change</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mb-12">
            Decades of data reveal a stark contraction in range and numbers, followed by a fragile, recent stabilization.
          </p>

          <Card className="bg-card/50 border-primary/20 backdrop-blur mb-12">
            <CardContent className="p-8">
              <h3 className="text-2xl font-serif text-foreground mb-6">Estimated Wild Population (1970 - 2020)</h3>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={popData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                    <YAxis domain={[0, 9000]} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                      itemStyle={{ color: 'hsl(var(--primary))' }}
                      formatter={(value) => [`~${value} individuals`, 'Population']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="est" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={4}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-serif text-accent">Key Inflection Points</h3>
              
              <div className="relative pl-8 border-l-2 border-border space-y-8">
                <div className="relative">
                  <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-background border-4 border-destructive" />
                  <h4 className="text-lg font-bold text-foreground">1990s: Poaching Crisis</h4>
                  <p className="text-muted-foreground">Following the collapse of the Soviet Union, organized poaching for pelts and bones spiked across Central Asia.</p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-background border-4 border-secondary" />
                  <h4 className="text-lg font-bold text-foreground">2003: Conservation Focus</h4>
                  <p className="text-muted-foreground">Increased international funding and establishment of the first community-based conservation programs in India and Mongolia.</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-background border-4 border-primary" />
                  <h4 className="text-lg font-bold text-foreground">2013: Bishkek Declaration</h4>
                  <p className="text-muted-foreground">12 range countries endorse the Global Snow Leopard & Ecosystem Protection Program (GSLEP).</p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-background border-4 border-accent" />
                  <h4 className="text-lg font-bold text-foreground">2017: Status Change</h4>
                  <p className="text-muted-foreground">IUCN reclassifies snow leopards from "Endangered" to "Vulnerable", reflecting slower decline, though threats remain severe.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card/30 rounded-xl p-8 border border-border flex flex-col justify-center items-center text-center">
               <div className="w-24 h-24 rounded-full bg-destructive/20 flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
               </div>
               <h4 className="text-2xl font-serif mb-4">Poaching Reality</h4>
               <p className="text-lg text-muted-foreground mb-4">
                 Between 2008 and 2016, an estimated <strong className="text-foreground">220 to 450</strong> snow leopards were killed annually.
               </p>
               <p className="text-sm text-muted-foreground">
                 That equates to roughly 4 snow leopards poached every week. Over half of these are retaliatory killings by herders, not driven by the illegal trade in pelts.
               </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
