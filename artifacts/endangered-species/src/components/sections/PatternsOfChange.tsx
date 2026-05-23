import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const popData = [
  { year: '1970', est: 900 },
  { year: '1975', est: 1200 },
  { year: '1980', est: 2100 },
  { year: '1985', est: 2800 },
  { year: '1990', est: 3200 },
  { year: '1995', est: 3000 },
  { year: '2000', est: 3500 },
  { year: '2005', est: 2800 },
  { year: '2010', est: 3100 },
  { year: '2015', est: 3800 },
  { year: '2020', est: 3500 },
  { year: '2024', est: 3200 },
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
            A story of near-extinction followed by gradual, fluctuating recovery dependent on wetland management.
          </p>

          <Card className="bg-card/50 border-primary/20 backdrop-blur mb-12">
            <CardContent className="p-8">
              <h3 className="text-2xl font-serif text-foreground mb-6">Estimated Wild Population (1970 - 2024)</h3>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={popData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                    <YAxis domain={[0, 4500]} stroke="hsl(var(--muted-foreground))" />
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
                  <h4 className="text-lg font-bold text-foreground">1970: Near Extinction</h4>
                  <p className="text-muted-foreground">Population reached a historic low of ~900 birds due to unregulated hunting and massive wetland destruction.</p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-background border-4 border-primary" />
                  <h4 className="text-lg font-bold text-foreground">1977: Federal Protection</h4>
                  <p className="text-muted-foreground">Added to the Endangered Species Act, spurring the creation of protected wildlife refuges and habitat restoration.</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-background border-4 border-secondary" />
                  <h4 className="text-lg font-bold text-foreground">2005: Weather Disruptions</h4>
                  <p className="text-muted-foreground">Severe drought and hurricane seasons caused significant breeding failures and a temporary population dip.</p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-background border-4 border-accent" />
                  <h4 className="text-lg font-bold text-foreground">2024: Current Status</h4>
                  <p className="text-muted-foreground">Population fluctuating around ~3,200 birds, heavily dependent on ongoing predator control and wetland management.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card/30 rounded-xl p-8 border border-border flex flex-col justify-center items-center text-center">
               <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
               </div>
               <h4 className="text-2xl font-serif mb-4">Rainfall Dependency</h4>
               <p className="text-lg text-muted-foreground mb-4">
                 Unlike birds in stable environments, coot numbers <strong className="text-foreground">rapidly boom and bust</strong> based on winter rainfall.
               </p>
               <p className="text-sm text-muted-foreground">
                 A single severe drought year can shrink wetland availability, causing population drops of over 20%. Conversely, wet years allow rapid recovery.
               </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}