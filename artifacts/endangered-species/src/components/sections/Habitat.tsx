import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import habitatImg from "@/assets/habitat.png";

// ── Island data ──────────────────────────────────────────────────────────────
const ISLANDS = {
  Oahu:          { tempLow:24, tempHigh:32, rainfallLow:500,  rainfallHigh:1500, biome:"Coastal wetlands, fishponds, urban refuges",            sites:["James Campbell NWR","Pearl Harbor NWR","Hamakua Marsh"],     wetland:62, food:70, nesting:58 },
  Maui:          { tempLow:22, tempHigh:31, rainfallLow:500,  rainfallHigh:2000, biome:"Coastal ponds, taro fields, brackish lagoons",           sites:["Kanaha Pond","Kealia Pond NWR","Waiehu Marsh"],              wetland:74, food:78, nesting:72 },
  Kauai:         { tempLow:21, tempHigh:30, rainfallLow:1000, rainfallHigh:2000, biome:"River valleys, taro paddies, lush inland marshes",        sites:["Hanalei NWR","Huleia NWR","Alakai Swamp edges"],             wetland:88, food:85, nesting:82 },
  "Hawaii Island":{ tempLow:23, tempHigh:32, rainfallLow:500,  rainfallHigh:1800, biome:"Lowland wetlands, brackish ponds, lava-bordered marshes",sites:["Waipio Valley","Keokea Beach ponds","Hamakua Coast marshes"], wetland:65, food:60, nesting:63 },
};
type IslandKey = keyof typeof ISLANDS;

// ── Helpers ──────────────────────────────────────────────────────────────────
const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
const lerpColor = (r1:number,g1:number,b1:number,r2:number,g2:number,b2:number,t:number) =>
  `rgb(${lerp(r1,r2,t)},${lerp(g1,g2,t)},${lerp(b1,b2,t)})`;

function ImpactBar({ label, value, color, icon }: { label:string; value:number; color:string; icon:string }) {
  return (
    <div style={{ marginBottom:"14px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px", alignItems:"center" }}>
        <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"11px", letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(212,175,55,0.8)" }}>{icon} {label}</span>
        <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"12px", fontWeight:700, color }}>{value}%</span>
      </div>
      <div style={{ height:"8px", borderRadius:"4px", background:"rgba(255,255,255,0.08)", overflow:"hidden" }}>
        <motion.div
          animate={{ width:`${value}%` }}
          transition={{ duration:0.6, ease:"easeOut" }}
          style={{ height:"100%", borderRadius:"4px", background:`linear-gradient(to right, ${color}66, ${color})` }}
        />
      </div>
    </div>
  );
}

const RAIN_DROPS = Array.from({length:20},(_,i)=>({ delay:(i*0.19)%2.2, left:(i*23+7)%96, dur:0.7+(i%4)*0.15 }));
const HEAT_WAVES = [{ delay:0,top:28 },{ delay:0.7,top:50 },{ delay:1.3,top:70 }];

export function Habitat() {
  const [island, setIsland] = useState<IslandKey>("Maui");
  const [slider, setSlider] = useState(0);      // 0 = healthy, 100 = severe
  const [tempHover, setTempHover] = useState(false);
  const [rainHover, setRainHover] = useState(false);
  const d = ISLANDS[island];

  // Derived climate values
  const deg  = slider / 100;                   // 0=healthy 1=crisis
  const hlth = 1 - deg;

  const tempLow   = d.tempLow  + Math.round(deg * 9);
  const tempHigh  = d.tempHigh + Math.round(deg * 9);
  const rainLow   = Math.max(80,  Math.round(d.rainfallLow  * hlth));
  const rainHigh  = Math.max(200, Math.round(d.rainfallHigh * hlth));

  const wetland = Math.round(d.wetland  * hlth);
  const food    = Math.round(d.food    * hlth);
  const nesting = Math.round(d.nesting * hlth);

  // Dynamic colours
  const accentR = lerpColor(212,175,55,  239,68,68,   deg);   // gold → red
  const waterR  = lerpColor(59,130,246,  120,60,10,   deg);   // blue → brown
  const vegR    = lerpColor(34,197,94,   180,120,30,  deg);   // green → yellow/brown
  const dangerLevel = slider > 60;
  const criticalLevel = slider > 80;

  // Rain intensity: full at 0 slider, none at 80+
  const rainActive = slider < 75;
  const rainCount  = Math.round(RAIN_DROPS.length * Math.max(0, (75 - slider) / 75));

  return (
    <>
      <style>{`
        @keyframes rain-fall { 0%{transform:translateY(-10px);opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{transform:translateY(165px);opacity:0} }
        @keyframes heat-wave { 0%{transform:scaleX(0.3) translateX(-30%);opacity:0} 50%{transform:scaleX(1) translateX(0);opacity:1} 100%{transform:scaleX(0.3) translateX(30%);opacity:0} }
        @keyframes ripple    { 0%{transform:scale(0.5);opacity:0.8} 100%{transform:scale(2);opacity:0} }
        @keyframes alert-pulse { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.08)} }
        @keyframes crack-in    { from{opacity:0} to{opacity:0.55} }
        @keyframes float-up    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .slider-track { -webkit-appearance:none; appearance:none; width:100%; height:8px; border-radius:4px; outline:none; cursor:pointer; }
        .slider-track::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:22px; height:22px; border-radius:50%; border:2px solid rgba(212,175,55,0.8); cursor:pointer; }
      `}</style>

      <div className="w-full min-h-screen pt-24 pb-12 px-6 md:px-12 bg-background overflow-y-auto">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.8}} className="text-center mb-10">
            <h1 className="text-5xl uppercase mb-4" style={{ fontFamily:"'Josefin Sans',sans-serif", letterSpacing:"0.1em", color:"rgba(212,175,55,1)" }}>Habitat & Location</h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ fontFamily:"'Playfair Display',serif", color:"rgba(255,255,255,0.8)" }}>
              The Hawaiian Coot's domain spans the fragile freshwater and brackish wetlands across the Hawaiian Islands.
            </p>
          </motion.div>

          {/* Island selector */}
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}} className="flex flex-wrap justify-center gap-3 mb-10">
            {(Object.keys(ISLANDS) as IslandKey[]).map(name=>(
              <button key={name} onClick={()=>setIsland(name)} style={{
                fontFamily:"'Josefin Sans',sans-serif", fontSize:"12px", letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:700,
                padding:"8px 20px", borderRadius:"999px",
                border:`2px solid ${island===name?"rgba(212,175,55,1)":"rgba(212,175,55,0.3)"}`,
                background: island===name?"rgba(212,175,55,0.15)":"rgba(3,5,14,0.8)",
                color: island===name?"rgba(212,175,55,1)":"rgba(212,175,55,0.5)",
                cursor:"pointer", transition:"all 0.2s ease",
                boxShadow: island===name?"0 0 18px rgba(212,175,55,0.25)":"none",
              }}>{name}</button>
            ))}
          </motion.div>

          {/* Top two-column */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Location card */}
            <AnimatePresence mode="wait">
              <motion.div key={island} initial={{opacity:0,x:-30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:30}} transition={{duration:0.4}}
                className="p-8 rounded-2xl border" style={{ background:"rgba(3,5,14,0.95)", borderColor:"rgba(212,175,55,0.3)" }}>
                <h2 className="text-2xl font-bold uppercase mb-2" style={{ fontFamily:"'Josefin Sans',sans-serif", letterSpacing:"0.1em", color:"rgba(212,175,55,1)" }}>{island}</h2>
                <p className="text-sm mb-5" style={{ fontFamily:"'Playfair Display',serif", color:"rgba(255,255,255,0.55)", fontStyle:"italic" }}>{d.biome}</p>
                <p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"11px", letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(212,175,55,0.7)", marginBottom:"8px" }}>Key Refuge Sites</p>
                <ul className="mb-6">
                  {d.sites.map(s=>(
                    <li key={s} style={{ fontFamily:"'Playfair Display',serif", color:"rgba(255,255,255,0.8)", fontSize:"15px", padding:"4px 0", borderBottom:"1px solid rgba(212,175,55,0.08)", display:"flex", alignItems:"center", gap:"8px" }}>
                      <span style={{ color:"rgba(193,18,31,0.8)", fontSize:"9px" }}>◆</span>{s}
                    </li>
                  ))}
                </ul>
                <div className="p-4 border rounded-lg" style={{ background:"rgba(193,18,31,0.08)", borderColor:"rgba(193,18,31,0.35)" }}>
                  <p style={{ fontFamily:"'Playfair Display',serif", color:"rgba(212,175,55,1)", fontSize:"15px", fontWeight:700 }}>
                    70% of original Hawaiian wetlands have been lost to development.
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Habitat scene — reacts to slider */}
            <motion.div initial={{opacity:0,x:50}} animate={{opacity:1,x:0}} transition={{duration:0.8,delay:0.4}}>
              <div className="rounded-2xl overflow-hidden border-2 relative" style={{ borderColor:`rgba(193,18,31,0.5)`, height:"280px" }}>
                {/* Base photo with climate filter */}
                <img src={habitatImg} alt="Hawaiian Wetland Habitat" className="w-full h-full object-cover" style={{
                  filter:`saturate(${1-deg*0.7}) brightness(${1-deg*0.35}) sepia(${deg*0.5})`,
                  transition:"filter 0.4s ease",
                }} />

                {/* Cracked-earth overlay */}
                {slider > 50 && (
                  <div style={{
                    position:"absolute", inset:0,
                    background:"repeating-linear-gradient(45deg,rgba(120,60,10,0.12) 0,rgba(120,60,10,0.12) 2px,transparent 2px,transparent 30px), repeating-linear-gradient(-45deg,rgba(120,60,10,0.12) 0,rgba(120,60,10,0.12) 2px,transparent 2px,transparent 30px)",
                    animation:"crack-in 0.6s ease forwards",
                    opacity: (slider-50)/50 * 0.55,
                  }}/>
                )}

                {/* Water ripples when healthy */}
                {slider < 60 && [0,1,2].map(i=>(
                  <div key={i} style={{
                    position:"absolute", bottom:`${18+i*10}%`, left:`${30+i*12}%`,
                    width:"60px", height:"20px", borderRadius:"50%",
                    border:`2px solid ${waterR}`,
                    opacity:0.5-deg*0.4,
                    animation:`ripple ${1.4+i*0.4}s ease-out ${i*0.5}s infinite`,
                    pointerEvents:"none",
                  }}/>
                ))}

                {/* Warning overlay */}
                {dangerLevel && (
                  <div style={{
                    position:"absolute", inset:0,
                    background:`radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(239,68,68,${(slider-60)/40*0.4}) 100%)`,
                    animation:"alert-pulse 2s ease-in-out infinite",
                    pointerEvents:"none",
                  }}/>
                )}

                {/* Gradient caption overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent flex flex-col justify-end p-5">
                  <h3 className="text-xl font-bold uppercase" style={{ fontFamily:"'Josefin Sans',sans-serif", letterSpacing:"0.1em", color:`rgba(212,175,55,1)` }}>
                    Hawaiian Wetlands
                  </h3>
                  <p style={{ fontFamily:"'Playfair Display',serif", color:"rgba(255,255,255,0.8)", fontSize:"14px" }}>
                    {slider < 25  ? "Freshwater ponds, taro fields, and lush tropical vegetation." :
                     slider < 55  ? "Wetland conditions showing signs of climate stress." :
                     slider < 75  ? "Reduced rainfall — water levels falling, habitat shrinking." :
                                    "⚠ Critical habitat degradation — nesting areas at severe risk."}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Climate Change Slider ─────────────────────────────────────────── */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.5}}
            className="p-7 rounded-2xl border mb-10 max-w-4xl mx-auto" style={{ background:"rgba(3,5,14,0.95)", borderColor: criticalLevel?"rgba(239,68,68,0.5)":dangerLevel?"rgba(239,120,68,0.4)":"rgba(212,175,55,0.25)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px" }}>
              <h3 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"13px", letterSpacing:"0.12em", textTransform:"uppercase", color: criticalLevel?"rgba(239,68,68,1)":dangerLevel?"rgba(239,140,68,1)":"rgba(212,175,55,1)" }}>
                🌡 Climate Change Simulator
              </h3>
              <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"11px", letterSpacing:"0.08em", fontWeight:700, color: criticalLevel?"rgba(239,68,68,1)":dangerLevel?"rgba(239,140,68,1)":"rgba(34,197,94,1)" }}>
                {slider === 0  ? "✓ Healthy Climate" :
                 slider < 30  ? "Mild Stress"        :
                 slider < 60  ? "Moderate Stress"    :
                 slider < 80  ? "⚠ High Risk"        : "🔴 Critical"}
              </span>
            </div>

            {/* Slider */}
            <div style={{ position:"relative", marginBottom:"8px" }}>
              <input
                type="range" min={0} max={100} value={slider}
                onChange={e=>setSlider(Number(e.target.value))}
                className="slider-track"
                style={{
                  background:`linear-gradient(to right, rgba(34,197,94,0.8) 0%, rgba(212,175,55,0.8) 40%, rgba(239,120,68,0.8) 70%, rgba(239,68,68,1) 100%)`,
                }}
              />
              <style>{`.slider-track::-webkit-slider-thumb { background: ${criticalLevel?"rgba(239,68,68,1)":dangerLevel?"rgba(239,140,68,1)":"rgba(212,175,55,1)"}; }`}</style>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"'Josefin Sans',sans-serif", fontSize:"10px", letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)", marginBottom:"14px" }}>
              <span>Healthy</span><span>Severe Climate Change</span>
            </div>

            {/* Educational message */}
            <AnimatePresence mode="wait">
              <motion.p key={Math.floor(slider/25)} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.3}}
                style={{ fontFamily:"'Playfair Display',serif", fontSize:"13.5px", color:"rgba(255,255,255,0.75)", lineHeight:1.6, fontStyle:"italic", borderLeft:`3px solid ${criticalLevel?"rgba(239,68,68,0.8)":dangerLevel?"rgba(239,140,68,0.7)":"rgba(34,197,94,0.7)"}`, paddingLeft:"12px" }}>
                {slider < 25  ? "Stable climate conditions support long-term survival and reproduction of the Hawaiian Coot." :
                 slider < 50  ? "Higher temperatures increase evaporation and begin to shrink wetlands used for nesting and feeding." :
                 slider < 75  ? "Reduced rainfall causes freshwater habitats to dry, threatening food sources and nesting areas." :
                                "Climate change is dramatically altering Hawaiian wetland ecosystems — habitat degradation reduces nesting success and threatens population recovery."}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* ── Climate Profile cards ─────────────────────────────────────────── */}
          <h2 className="text-3xl font-bold text-center uppercase mb-8" style={{ fontFamily:"'Josefin Sans',sans-serif", letterSpacing:"0.1em", color:"rgba(212,175,55,1)" }}>Climate Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">

            {/* Temperature card */}
            <div
              onMouseEnter={()=>setTempHover(true)} onMouseLeave={()=>setTempHover(false)}
              style={{
                position:"relative", overflow:"hidden", borderRadius:"16px", minHeight:"230px",
                border:`2px solid ${tempHover||criticalLevel?"rgba(239,68,68,0.9)":"rgba(193,18,31,0.5)"}`,
                background:"rgba(3,5,14,0.97)", padding:"28px 24px",
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                boxShadow: tempHover||criticalLevel ? "0 0 40px rgba(239,68,68,0.45)" : "none",
                transition:"border-color 0.3s, box-shadow 0.3s", cursor:"default",
              }}
            >
              {(tempHover||dangerLevel) && HEAT_WAVES.map((w,i)=>(
                <div key={i} style={{ position:"absolute", left:"10%", top:`${w.top}%`, width:"80%", height:"2px", borderRadius:"50%", background:"linear-gradient(to right,transparent,rgba(239,68,68,0.4),transparent)", animation:`heat-wave 1.8s ease-in-out ${w.delay}s infinite`, pointerEvents:"none" }}/>
              ))}

              {/* Thermometer */}
              <svg width="36" height="64" viewBox="0 0 36 64" style={{marginBottom:"10px"}}>
                <rect x="14" y="4" width="8" height="38" rx="4" fill="rgba(255,255,255,0.06)" stroke="rgba(193,18,31,0.5)" strokeWidth="1.5"/>
                <rect x="15.5" y={tempHover ? "8" : slider>50?"16":"26"} width="5" rx="2.5"
                  height={tempHover ? "34" : slider>50?"26":"16"}
                  fill="rgba(239,68,68,0.85)" style={{transition:"all 0.8s ease"}}/>
                <circle cx="18" cy="50" r="10" fill="rgba(239,68,68,0.85)"/>
                <circle cx="18" cy="50" r="6" fill={tempHover||criticalLevel?"rgba(255,80,80,1)":"rgba(239,68,68,0.9)"} style={{transition:"fill 0.3s"}}/>
              </svg>

              <div style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"2.4rem", fontWeight:700, color:"rgba(239,68,68,1)", lineHeight:1, marginBottom:"4px" }}>
                {tempLow}–{tempHigh}°C
              </div>
              <p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"10px", letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(212,175,55,0.7)", marginBottom: tempHover?"12px":"0", transition:"margin 0.3s" }}>
                Year-round Temperature
              </p>
              <AnimatePresence>
                {tempHover && (
                  <motion.p initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}} transition={{duration:0.3}}
                    style={{ fontFamily:"'Playfair Display',serif", fontSize:"13px", color:"rgba(255,255,255,0.75)", textAlign:"center", lineHeight:1.5, marginTop:"10px" }}>
                    Warm tropical temperatures allow wetlands and taro fields to remain active year-round, supporting feeding and nesting habitats.
                  </motion.p>
                )}
              </AnimatePresence>
              {criticalLevel && !tempHover && (
                <div style={{ marginTop:"10px", fontFamily:"'Josefin Sans',sans-serif", fontSize:"11px", letterSpacing:"0.08em", color:"rgba(239,68,68,0.9)", animation:"alert-pulse 1.8s ease-in-out infinite" }}>⚠ ELEVATED DANGER</div>
              )}
            </div>

            {/* Rainfall card */}
            <div
              onMouseEnter={()=>setRainHover(true)} onMouseLeave={()=>setRainHover(false)}
              style={{
                position:"relative", overflow:"hidden", borderRadius:"16px", minHeight:"230px",
                border:`2px solid ${rainHover?"rgba(59,130,246,0.9)":criticalLevel?"rgba(239,120,68,0.8)":"rgba(212,175,55,0.4)"}`,
                background:"rgba(3,5,14,0.97)", padding:"28px 24px",
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                boxShadow: rainHover?"0 0 40px rgba(59,130,246,0.45)":criticalLevel?"0 0 30px rgba(239,68,68,0.3)":"none",
                transition:"border-color 0.3s, box-shadow 0.3s", cursor:"default",
              }}
            >
              {/* Rain drops — shown on hover OR when slider says rain is present */}
              {(rainHover && rainActive) && RAIN_DROPS.slice(0,rainCount).map((d,i)=>(
                <div key={i} style={{ position:"absolute", left:`${d.left}%`, top:"-10px", width:"2px", height:"14px", borderRadius:"2px", background:"linear-gradient(to bottom,transparent,rgba(59,130,246,0.85))", animation:`rain-fall ${d.dur}s linear ${d.delay}s infinite`, pointerEvents:"none" }}/>
              ))}

              {/* Ripple — only when enough rainfall */}
              {rainHover && rainActive && (
                <div style={{ position:"absolute", bottom:"14px", left:"50%", transform:"translateX(-50%)", width:"60px", height:"18px", borderRadius:"50%", border:"2px solid rgba(59,130,246,0.5)", animation:"ripple 1.4s ease-out infinite", pointerEvents:"none" }}/>
              )}

              {/* Cracked bottom when rain gone */}
              {!rainActive && (
                <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"30px", background:"linear-gradient(to top, rgba(120,60,10,0.4), transparent)", borderTop:"1px solid rgba(120,60,10,0.3)" }}/>
              )}

              {/* Cloud SVG */}
              <svg width="52" height="38" viewBox="0 0 52 38" style={{marginBottom:"10px"}}>
                <ellipse cx="26" cy="24" rx="22" ry="10" fill={rainHover?"rgba(59,130,246,0.25)":rainActive?"rgba(59,130,246,0.12)":"rgba(120,80,30,0.2)"} stroke={rainActive?"rgba(59,130,246,0.5)":"rgba(150,80,30,0.5)"} strokeWidth="1.5" style={{transition:"all 0.5s"}}/>
                <ellipse cx="18" cy="19" rx="12" ry="9" fill={rainHover?"rgba(59,130,246,0.3)":rainActive?"rgba(59,130,246,0.15)":"rgba(120,80,30,0.2)"} stroke={rainActive?"rgba(59,130,246,0.5)":"rgba(150,80,30,0.5)"} strokeWidth="1.5" style={{transition:"all 0.5s"}}/>
                <ellipse cx="32" cy="17" rx="10" ry="9" fill={rainHover?"rgba(59,130,246,0.3)":rainActive?"rgba(59,130,246,0.15)":"rgba(120,80,30,0.2)"} stroke={rainActive?"rgba(59,130,246,0.5)":"rgba(150,80,30,0.5)"} strokeWidth="1.5" style={{transition:"all 0.5s"}}/>
                {rainHover && rainActive && <>
                  <line x1="18" y1="33" x2="16" y2="41" stroke="rgba(59,130,246,0.8)" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="26" y1="33" x2="24" y2="41" stroke="rgba(59,130,246,0.8)" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="34" y1="33" x2="32" y2="41" stroke="rgba(59,130,246,0.8)" strokeWidth="2" strokeLinecap="round"/>
                </>}
              </svg>

              <div style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"2.1rem", fontWeight:700, color: rainActive?"rgba(212,175,55,1)":"rgba(180,80,30,1)", lineHeight:1, marginBottom:"4px", transition:"color 0.4s" }}>
                {rainLow}–{rainHigh} mm
              </div>
              <p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"10px", letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(212,175,55,0.7)", marginBottom: rainHover?"12px":"0", transition:"margin 0.3s" }}>
                Annual Rainfall
              </p>
              <AnimatePresence>
                {rainHover && (
                  <motion.p initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}} transition={{duration:0.3}}
                    style={{ fontFamily:"'Playfair Display',serif", fontSize:"13px", color:"rgba(255,255,255,0.75)", textAlign:"center", lineHeight:1.5, marginTop:"10px", position:"relative", zIndex:2 }}>
                    {rainActive
                      ? "Rainfall maintains freshwater wetlands essential for feeding and nesting."
                      : "Reduced rainfall causes freshwater habitats to dry, threatening food sources and nesting areas."}
                  </motion.p>
                )}
              </AnimatePresence>
              {criticalLevel && !rainHover && (
                <div style={{ marginTop:"10px", fontFamily:"'Josefin Sans',sans-serif", fontSize:"11px", letterSpacing:"0.08em", color:"rgba(239,120,68,0.9)", animation:"alert-pulse 1.8s ease-in-out infinite" }}>⚠ DRY CONDITIONS</div>
              )}
            </div>
          </div>

          {/* Habitat Impact Meter */}
          <AnimatePresence mode="wait">
            <motion.div key={`${island}-${Math.floor(slider/5)}`} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.4}}
              className="max-w-4xl mx-auto p-8 rounded-2xl border"
              style={{ background:"rgba(3,5,14,0.95)", borderColor: criticalLevel?"rgba(239,68,68,0.35)":dangerLevel?"rgba(239,140,68,0.3)":"rgba(212,175,55,0.2)" }}>
              <h3 className="text-lg font-bold uppercase mb-6 text-center" style={{ fontFamily:"'Josefin Sans',sans-serif", letterSpacing:"0.12em", color: criticalLevel?"rgba(239,68,68,1)":dangerLevel?"rgba(239,140,68,1)":"rgba(212,175,55,1)" }}>
                🌿 Habitat Impact Meter — {island}
              </h3>
              <ImpactBar label="Wetland Stability"  value={wetland} color={wetland>60?"rgba(34,197,94,1)":wetland>35?"rgba(212,175,55,1)":"rgba(239,68,68,1)"} icon="💧"/>
              <ImpactBar label="Food Availability"  value={food}    color={food>60?"rgba(212,175,55,1)":food>35?"rgba(239,140,68,1)":"rgba(239,68,68,1)"}   icon="🦋"/>
              <ImpactBar label="Nesting Conditions" value={nesting} color={nesting>60?"rgba(59,130,246,1)":nesting>35?"rgba(239,140,68,1)":"rgba(239,68,68,1)"} icon="🥚"/>
              {criticalLevel && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.5}}
                  className="mt-6 p-4 rounded-lg border text-center" style={{ background:"rgba(239,68,68,0.08)", borderColor:"rgba(239,68,68,0.4)" }}>
                  <p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"12px", letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(239,68,68,1)", animation:"alert-pulse 2s ease-in-out infinite" }}>
                    ⚠ Habitat degradation reduces nesting success and threatens long-term population recovery
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </>
  );
}
