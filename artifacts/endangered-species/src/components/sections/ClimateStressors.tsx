import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';

const temperatureData = [
  { year: '1960', temp: 0.0 },
  { year: '1965', temp: 0.05 },
  { year: '1970', temp: 0.1 },
  { year: '1975', temp: 0.15 },
  { year: '1980', temp: 0.2 },
  { year: '1985', temp: 0.25 },
  { year: '1990', temp: 0.3 },
  { year: '1995', temp: 0.4 },
  { year: '2000', temp: 0.45 },
  { year: '2005', temp: 0.5 },
  { year: '2010', temp: 0.55 },
  { year: '2015', temp: 0.65 },
  { year: '2020', temp: 0.75 },
  { year: '2024', temp: 0.8 },
];

export function ClimateStressors() {
  return (
    <div className="w-full min-h-screen pt-24 pb-12 px-6 md:px-12 bg-background overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-serif text-destructive mb-4">Climate Stressors</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hawaii's delicate ecosystems are facing unprecedented changes, directly threatening the shallow wetlands coots depend on.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="bg-card/50 border-destructive/20 backdrop-blur">
            <CardContent className="p-6">
              <h3 className="text-2xl font-serif text-destructive mb-6">Rising Temperatures (°C Anomaly)</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={temperatureData}>
                    <defs>
                      <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                      itemStyle={{ color: 'hsl(var(--destructive))' }}
                    />
                    <Area type="monotone" dataKey="temp" stroke="hsl(var(--destructive))" fillOpacity={1} fill="url(#colorTemp)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-primary/20 backdrop-blur flex flex-col justify-center items-center text-center p-8">
            <h3 className="text-xl font-medium text-muted-foreground mb-2">Sea Level Rise Projection</h3>
            <div className="text-7xl font-bold text-destructive mb-4">20-60<span className="text-4xl">cm</span></div>
            <p className="text-lg text-foreground/80">by the year 2100, threatening coastal wetlands</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card/50 border-border">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <span className="text-accent font-bold text-xl">1</span>
              </div>
              <h4 className="text-xl font-medium mb-2 text-foreground">Coastal Inundation</h4>
              <p className="text-muted-foreground text-sm">
                Sea level rise directly threatens low-lying coastal wetlands where Hawaiian Coots nest, increasing salinity and altering vegetation.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <span className="text-accent font-bold text-xl">2</span>
              </div>
              <h4 className="text-xl font-medium mb-2 text-foreground">Increased Drought</h4>
              <p className="text-muted-foreground text-sm">
                More frequent and severe droughts reduce freshwater pond levels, concentrating predators and shrinking available habitat.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <span className="text-accent font-bold text-xl">3</span>
              </div>
              <h4 className="text-xl font-medium mb-2 text-foreground">Extreme Weather</h4>
              <p className="text-muted-foreground text-sm">
                Intensified hurricanes and flash flooding disrupt nesting seasons, while temperature increases accelerate harmful algal blooms.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}