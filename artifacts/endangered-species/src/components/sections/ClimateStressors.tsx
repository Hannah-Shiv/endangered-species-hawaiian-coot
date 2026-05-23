import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';

const temperatureData = [
  { year: '1970', temp: 0 },
  { year: '1980', temp: 0.2 },
  { year: '1990', temp: 0.5 },
  { year: '2000', temp: 0.8 },
  { year: '2010', temp: 1.2 },
  { year: '2020', temp: 1.5 },
  { year: '2050 (Proj)', temp: 3.0 },
  { year: '2100 (Proj)', temp: 4.5 },
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
            The roof of the world is melting. The Himalayas are warming at roughly three times the global average, transforming the snow leopard's world.
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
            <h3 className="text-xl font-medium text-muted-foreground mb-2">Habitat Projected to Shrink</h3>
            <div className="text-7xl font-bold text-destructive mb-4">30%</div>
            <p className="text-lg text-foreground/80">by the year 2050 due to treeline shift</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card/50 border-border">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <span className="text-accent font-bold text-xl">1</span>
              </div>
              <h4 className="text-xl font-medium mb-2 text-foreground">Treeline Shift</h4>
              <p className="text-muted-foreground text-sm">
                As temperatures rise, forests move to higher altitudes. Snow leopards are alpine animals that avoid forests, meaning their habitat is shrinking from below, pushing them closer to the peaks where territory is smaller.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <span className="text-accent font-bold text-xl">2</span>
              </div>
              <h4 className="text-xl font-medium mb-2 text-foreground">Prey Decline</h4>
              <p className="text-muted-foreground text-sm">
                Changing vegetation patterns affect blue sheep and ibex. Reduced primary prey forces snow leopards to hunt domestic livestock, increasing human-wildlife conflict.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <span className="text-accent font-bold text-xl">3</span>
              </div>
              <h4 className="text-xl font-medium mb-2 text-foreground">Glacial Retreat</h4>
              <p className="text-muted-foreground text-sm">
                Himalayan glaciers are melting at unprecedented rates. This changes water availability, alters the microclimates essential for alpine flora, and fragments remaining snow leopard corridors.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
