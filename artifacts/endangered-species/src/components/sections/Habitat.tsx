import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import habitatImg from "@/assets/habitat.png";

export function Habitat() {
  return (
    <div className="w-full min-h-screen pt-24 pb-12 px-6 md:px-12 bg-background overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "0.8rem", letterSpacing: "0.2em", color: "rgba(212,175,55,1)" }} className="mb-4 font-bold uppercase">
            ◆ SECTION 02 ◆
          </div>
          <h1 className="text-5xl uppercase mb-4" style={{ fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", color: "rgba(212,175,55,1)" }}>
            Habitat & Location
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ fontFamily: "'Playfair Display', serif", color: "rgba(255,255,255,0.8)" }}>
            The Hawaiian Coot's domain spans the fragile freshwater and brackish wetlands across the Hawaiian Islands.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="p-8 rounded-2xl border"
            style={{ background: "rgba(3,5,14,0.95)", borderColor: "rgba(212,175,55,0.3)" }}
          >
            <h2 className="text-2xl font-bold uppercase mb-6" style={{ fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", color: "rgba(212,175,55,1)" }}>
              Location & Biome
            </h2>
            <div className="flex flex-wrap gap-3 mb-6">
              {['Oahu', 'Maui', 'Kauai', 'Hawaii Island'].map(island => (
                <span key={island} className="px-4 py-2 border rounded-full text-sm font-bold uppercase" style={{ background: "rgba(193,18,31,0.2)", borderColor: "rgba(193,18,31,0.5)", color: "rgba(212,175,55,1)", fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.05em" }}>
                  {island}
                </span>
              ))}
            </div>
            <p className="text-lg mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "rgba(255,255,255,0.8)" }}>
              <strong style={{ color: "rgba(212,175,55,1)" }}>Biome:</strong> Freshwater wetlands, brackish coastal ponds, fishponds, taro (loi) fields, sewage treatment wetland ponds.
            </p>
            <p className="text-lg mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "rgba(255,255,255,0.8)" }}>
              <strong style={{ color: "rgba(212,175,55,1)" }}>Key Sites:</strong> Kanaha Pond (Maui), Kealia Pond (Maui), Hanalei NWR (Kauai), James Campbell NWR (Oahu), Pearl Harbor NWR (Oahu).
            </p>
            <div className="p-4 border rounded-lg mt-6" style={{ background: "rgba(193,18,31,0.1)", borderColor: "rgba(193,18,31,0.4)" }}>
              <p className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif", color: "rgba(212,175,55,1)" }}>
                70% of original Hawaiian wetlands have been lost to development.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="aspect-video rounded-2xl overflow-hidden border-2 relative" style={{ borderColor: "rgba(193,18,31,0.5)" }}>
              <img src={habitatImg} alt="Hawaiian Wetland Habitat" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold uppercase" style={{ fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", color: "rgba(212,175,55,1)" }}>Hawaiian Wetlands</h3>
                <p className="text-lg" style={{ fontFamily: "'Playfair Display', serif", color: "rgba(255,255,255,0.8)" }}>Freshwater ponds, taro fields, and lush tropical vegetation.</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center uppercase mb-8" style={{ fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", color: "rgba(212,175,55,1)" }}>
            Climate Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border-0" style={{ background: "rgba(3,5,14,0.95)", borderTop: "2px solid rgba(193,18,31,0.8)" }}>
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: "rgba(193,18,31,1)", fontFamily: "'Josefin Sans', sans-serif" }}>21-32°C</div>
                <p className="uppercase text-xs font-bold tracking-wider" style={{ color: "rgba(212,175,55,0.8)", fontFamily: "'Josefin Sans', sans-serif" }}>Year-round Temperature</p>
              </CardContent>
            </Card>
            <Card className="border-0" style={{ background: "rgba(3,5,14,0.95)", borderTop: "2px solid rgba(212,175,55,0.8)" }}>
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: "rgba(212,175,55,1)", fontFamily: "'Josefin Sans', sans-serif" }}>500-2000mm</div>
                <p className="uppercase text-xs font-bold tracking-wider" style={{ color: "rgba(212,175,55,0.8)", fontFamily: "'Josefin Sans', sans-serif" }}>Annual Rainfall</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}