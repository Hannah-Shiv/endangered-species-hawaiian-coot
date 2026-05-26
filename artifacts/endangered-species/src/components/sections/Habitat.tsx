import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import habitatImg from "@/assets/habitat.png";

const ISLANDS = {
  Oahu:            { tempLow:24, tempHigh:32, rainLow:500,  rainHigh:1500, biome:"Coastal wetlands, fishponds, urban refuges",             sites:["James Campbell NWR","Pearl Harbor NWR","Hamakua Marsh"],      wetland:62, food:70, nesting:58 },
  Maui:            { tempLow:22, tempHigh:31, rainLow:500,  rainHigh:2000, biome:"Coastal ponds, taro fields, brackish lagoons",            sites:["Kanaha Pond","Kealia Pond NWR","Waiehu Marsh"],               wetland:74, food:78, nesting:72 },
  Kauai:           { tempLow:21, tempHigh:30, rainLow:1000, rainHigh:2000, biome:"River valleys, taro paddies, lush inland marshes",        sites:["Hanalei NWR","Huleia NWR","Alakai Swamp edges"],              wetland:88, food:85, nesting:82 },
  "Hawaii Island": { tempLow:23, tempHigh:32, rainLow:500,  rainHigh:1800, biome:"Lowland wetlands, brackish ponds, lava-bordered marshes", sites:["Waipio Valley","Keokea Beach ponds","Hamakua Coast marshes"], wetland:65, food:60, nesting:63 },
};
type IslandKey = keyof typeof ISLANDS;

const RAIN_DROPS = Array.from({length:20},(_,i)=>({ delay:(i*0.21)%2.1, left:(i*23+7)%96, dur:0.7+(i%5)*0.12 }));

// ── Stat Box for Impact Meter ─────────────────────────────────────────────────
function StatBox({ label, value, color, icon }: { label:string; value:number; color:string; icon:string }) {
  return (
    <motion.div
      animate={{ borderColor: color+"66" }}
      transition={{ duration:0.5 }}
      style={{ borderRadius:"10px", border:`2px solid ${color}66`, background:"rgba(255,255,255,0.03)", padding:"10px 8px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"4px" }}
    >
      <span style={{ fontSize:"20px", lineHeight:1 }}>{icon}</span>
      <motion.div
        animate={{ color }}
        transition={{ duration:0.5 }}
        style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"2.2rem", fontWeight:900, lineHeight:1, color }}
      >
        {value}%
      </motion.div>
      <motion.div style={{ height:"5px", borderRadius:"3px", background:"rgba(255,255,255,0.07)", width:"90%", overflow:"hidden" }}>
        <motion.div animate={{ width:`${value}%`, background: color }} transition={{ duration:0.7, ease:"easeOut" }} style={{ height:"100%", borderRadius:"3px" }}/>
      </motion.div>
      <div style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"13px", letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(212,175,55,0.9)", textAlign:"center", lineHeight:1.2 }}>
        {label}
      </div>
    </motion.div>
  );
}

export function Habitat() {
  const [island,   setIsland]   = useState<IslandKey>("Maui");
  const [slider,   setSlider]   = useState(0);
  const [tempHover,setTempHover]= useState(false);
  const [rainHover,setRainHover]= useState(false);
  const d = ISLANDS[island];

  const deg  = slider / 100;
  const hlth = 1 - deg;

  const tempLow  = d.tempLow  + Math.round(deg * 9);
  const tempHigh = d.tempHigh + Math.round(deg * 9);
  const rainLow  = Math.max(80,  Math.round(d.rainLow  * hlth));
  const rainHigh = Math.max(200, Math.round(d.rainHigh * hlth));

  const wetland = Math.round(d.wetland * hlth);
  const food    = Math.round(d.food    * hlth);
  const nesting = Math.round(d.nesting * hlth);

  const warn     = slider > 50;
  const critical = slider > 80;
  const rainActive = slider < 75;
  const rainCount  = Math.round(RAIN_DROPS.length * Math.max(0, (75 - slider) / 75));

  // Thermometer — viewBox 0 0 70 240, tube: top=8, height=170
  const tubeTop = 8, tubeH = 170;
  const thermFill = 0.22 + deg * 0.65;           // 0.22 healthy → 0.87 critical
  const fillH = thermFill * tubeH;
  const fillY = tubeTop + tubeH - fillH;

  const statusColor = slider<20?"rgba(34,197,94,1)":slider<50?"rgba(212,175,55,1)":slider<75?"rgba(239,140,68,1)":"rgba(239,68,68,1)";
  const statusLabel = slider<20?"✓ Healthy Climate":slider<50?"Mild Stress":slider<75?"⚠ High Risk":"🔴 Critical";
  const edMsg =
    slider<25?"Stable climate supports long-term survival and reproduction.":
    slider<50?"Higher temperatures increase evaporation, shrinking wetlands.":
    slider<75?"Reduced rainfall threatens food sources and nesting areas.":
              "Critical degradation — nesting success and recovery severely at risk.";

  const wetColor  = wetland>60?"rgba(34,197,94,1)":wetland>35?"rgba(212,175,55,1)":"rgba(239,68,68,1)";
  const foodColor = food>60?"rgba(212,175,55,1)":food>35?"rgba(239,140,68,1)":"rgba(239,68,68,1)";
  const nestColor = nesting>60?"rgba(59,130,246,1)":nesting>35?"rgba(239,140,68,1)":"rgba(239,68,68,1)";

  return (
    <>
      <style>{`
        @keyframes rain-fall  {0%{transform:translateY(-12px);opacity:0}10%{opacity:1}88%{opacity:1}100%{transform:translateY(170px);opacity:0}}
        @keyframes heat-wave  {0%{transform:scaleX(0.2) translateX(-40%);opacity:0}50%{transform:scaleX(1) translateX(0);opacity:1}100%{transform:scaleX(0.2) translateX(40%);opacity:0}}
        @keyframes ripple     {0%{transform:scale(0.4);opacity:0.7}100%{transform:scale(2.4);opacity:0}}
        @keyframes alert-pulse{0%,100%{opacity:0.4}50%{opacity:1}}
        @keyframes therm-glow {0%,100%{filter:drop-shadow(0 0 5px rgba(239,68,68,0.5))}50%{filter:drop-shadow(0 0 14px rgba(239,68,68,1))}}
        .vslider{writing-mode:vertical-lr;direction:rtl;-webkit-appearance:slider-vertical;
          height:100%;width:32px;cursor:pointer;outline:none;border:none;background:transparent;padding:0}
        .vslider::-webkit-slider-runnable-track{width:10px;border-radius:5px;background:linear-gradient(to top,rgba(34,197,94,0.85),rgba(212,175,55,0.85),rgba(239,120,68,0.85),rgba(239,68,68,1))}
        .vslider::-webkit-slider-thumb{-webkit-appearance:none;width:26px;height:26px;border-radius:50%;border:2.5px solid rgba(212,175,55,0.9);background:rgba(8,4,0,1);cursor:pointer;margin-left:-8px}
        .vslider::-moz-range-track{width:10px;border-radius:5px;background:linear-gradient(to top,rgba(34,197,94,0.85),rgba(212,175,55,0.85),rgba(239,120,68,0.85),rgba(239,68,68,1))}
        .vslider::-moz-range-thumb{width:24px;height:24px;border-radius:50%;border:2.5px solid rgba(212,175,55,0.9);background:rgba(8,4,0,1);cursor:pointer}
      `}</style>

      <div style={{
        height:"100vh", boxSizing:"border-box",
        padding:"68px 16px 10px 16px",
        background:"#000000",
        display:"flex", flexDirection:"column", gap:"8px", overflow:"hidden",
      }}>

        {/* Header */}
        <div style={{textAlign:"center",flexShrink:0}}>
          <h1 style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"clamp(1.5rem,2.2vw,2.1rem)",fontWeight:700,letterSpacing:"0.13em",textTransform:"uppercase",color:"rgba(212,175,55,1)",margin:"0 0 2px"}}>
            Habitat &amp; Location
          </h1>
          <p style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(0.8rem,0.95vw,0.92rem)",color:"rgba(255,255,255,0.6)",margin:0}}>
            Freshwater and brackish wetlands across the Hawaiian Islands — home to the Hawaiian Coot.
          </p>
        </div>

        {/* Island selector */}
        <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"7px",flexShrink:0}}>
          {(Object.keys(ISLANDS) as IslandKey[]).map(name=>(
            <button key={name} onClick={()=>setIsland(name)} style={{
              fontFamily:"'Josefin Sans',sans-serif",fontSize:"11.5px",letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:700,
              padding:"5px 15px",borderRadius:"999px",
              border:`2px solid ${island===name?"rgba(212,175,55,1)":"rgba(212,175,55,0.3)"}`,
              background:island===name?"rgba(212,175,55,0.15)":"rgba(0,0,0,0.6)",
              color:island===name?"rgba(212,175,55,1)":"rgba(212,175,55,0.5)",
              cursor:"pointer",transition:"all 0.2s",
              boxShadow:island===name?"0 0 14px rgba(212,175,55,0.3)":"none",
            }}>{name}</button>
          ))}
        </div>

        {/* 3-column grid */}
        <div style={{flex:1,minHeight:0,display:"grid",gridTemplateColumns:"1.85fr 0.82fr 1fr",gap:"10px"}}>

          {/* ═══ COL 1 — Climate Change Simulator ═══════════════════════════════ */}
          <div style={{display:"flex",flexDirection:"column",gap:"6px",minHeight:0,overflow:"hidden"}}>
            <div style={{textAlign:"center",flexShrink:0}}>
              <span style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"15px",letterSpacing:"0.12em",textTransform:"uppercase",color:statusColor}}>
                🌡 Climate Change Simulator
              </span>
            </div>
            <div style={{flex:1,minHeight:0,display:"flex",gap:"10px",borderRadius:"14px",
              border:`2.5px solid ${critical?"rgba(239,68,68,0.55)":warn?"rgba(239,140,68,0.45)":"rgba(212,175,55,0.25)"}`,
              background:"rgba(6,2,0,0.98)",padding:"12px 14px",overflow:"hidden",
              boxShadow:critical?"0 0 24px rgba(239,68,68,0.15)":"none",transition:"border-color 0.4s,box-shadow 0.4s"}}>

              {/* Vertical slider */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"6px",flexShrink:0,width:"52px"}}>
                <span style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"9.5px",letterSpacing:"0.05em",textTransform:"uppercase",color:"rgba(239,68,68,0.85)",textAlign:"center",lineHeight:1.2}}>Severe<br/>Change</span>
                <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",minHeight:0}}>
                  <input type="range" min={0} max={100} value={slider} onChange={e=>setSlider(Number(e.target.value))} className="vslider"/>
                </div>
                <span style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"9.5px",letterSpacing:"0.05em",textTransform:"uppercase",color:"rgba(34,197,94,0.85)",textAlign:"center",lineHeight:1.2}}>Healthy<br/>Climate</span>
              </div>

              {/* Scene + status */}
              <div style={{flex:1,minHeight:0,display:"flex",flexDirection:"column",gap:"8px",overflow:"hidden"}}>
                <div style={{flex:1,minHeight:0,borderRadius:"10px",overflow:"hidden",position:"relative"}}>
                  <img src={habitatImg} alt="Habitat" style={{width:"100%",height:"100%",objectFit:"cover",
                    filter:`saturate(${1-deg*0.78}) brightness(${1-deg*0.38}) sepia(${deg*0.55})`,transition:"filter 0.5s"}}/>
                  {slider>45&&<div style={{position:"absolute",inset:0,
                    background:"repeating-linear-gradient(43deg,rgba(100,50,8,0.11) 0,rgba(100,50,8,0.11) 2px,transparent 2px,transparent 26px),repeating-linear-gradient(-43deg,rgba(100,50,8,0.11) 0,rgba(100,50,8,0.11) 2px,transparent 2px,transparent 26px)",
                    opacity:(slider-45)/55*0.65}}/>}
                  {critical&&<div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 60%,transparent 35%,rgba(239,68,68,0.22) 100%)",animation:"alert-pulse 2s ease-in-out infinite"}}/>}
                  {slider<65&&[0,1,2].map(i=><div key={i} style={{position:"absolute",bottom:`${14+i*12}%`,left:`${26+i*14}%`,width:"55px",height:"16px",borderRadius:"50%",border:"2px solid rgba(59,130,246,0.4)",opacity:Math.max(0,0.55-deg*0.5),animation:`ripple ${1.3+i*0.45}s ease-out ${i*0.55}s infinite`}}/>)}
                </div>
                <div style={{flexShrink:0}}>
                  <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"14px",fontWeight:700,color:statusColor,marginBottom:"4px"}}>{statusLabel}</div>
                  <AnimatePresence mode="wait">
                    <motion.p key={Math.floor(slider/25)} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.3}}
                      style={{fontFamily:"'Playfair Display',serif",fontSize:"12.5px",color:"rgba(255,255,255,0.72)",lineHeight:1.5,borderLeft:`3px solid ${statusColor}`,paddingLeft:"8px",margin:0}}>
                      {edMsg}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ COL 2 — Climate Profile ════════════════════════════════════════ */}
          <div style={{display:"flex",flexDirection:"column",gap:"6px",minHeight:0,overflow:"hidden"}}>
            <div style={{textAlign:"center",flexShrink:0}}>
              <span style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"15px",letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(212,175,55,1)"}}>
                🌤 Climate Profile
              </span>
            </div>

            {/* ── Temperature Card ── */}
            <div onMouseEnter={()=>setTempHover(true)} onMouseLeave={()=>setTempHover(false)}
              style={{flex:1,minHeight:0,position:"relative",overflow:"hidden",borderRadius:"14px",
                border:`2px solid ${critical?"rgba(239,68,68,0.9)":warn?"rgba(239,68,68,0.55)":"rgba(193,18,31,0.5)"}`,
                background:"rgba(6,2,0,0.98)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between",padding:"10px 10px 12px",
                boxShadow:critical?"0 0 28px rgba(239,68,68,0.35)":warn?"0 0 14px rgba(239,68,68,0.18)":"none",
                transition:"border-color 0.4s,box-shadow 0.4s",cursor:"default"}}>

              {(warn||tempHover)&&[{delay:0,top:18},{delay:0.75,top:48},{delay:1.45,top:76}].map((w,i)=>(
                <div key={i} style={{position:"absolute",left:"5%",top:`${w.top}%`,width:"90%",height:"2px",borderRadius:"50%",
                  background:"linear-gradient(to right,transparent,rgba(239,68,68,0.4),transparent)",
                  animation:`heat-wave 1.85s ease-in-out ${w.delay}s infinite`,pointerEvents:"none"}}/>
              ))}

              {/* Taller thermometer — viewBox 0 0 70 240 */}
              <svg width="52" height="200" viewBox="0 0 70 240"
                style={{flexShrink:0,animation:critical?"therm-glow 1.8s ease-in-out infinite":"none"}}>
                {/* Scale ticks + labels */}
                {[0.15,0.35,0.55,0.75,0.92].map((f,i)=>{
                  const ty = tubeTop + tubeH*(1-f);
                  const tempVal = Math.round(d.tempLow + f*(d.tempHigh - d.tempLow) + deg*9*f);
                  return <g key={i}>
                    <line x1="38" y1={ty} x2="46" y2={ty} stroke="rgba(255,255,255,0.22)" strokeWidth="1"/>
                    <text x="48" y={ty+4} fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="'Josefin Sans'">{tempVal}°</text>
                  </g>;
                })}
                {/* Tube outline */}
                <rect x="26" y={tubeTop} width="12" height={tubeH} rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(193,18,31,0.6)" strokeWidth="1.5"/>
                {/* Fill bar — animated by slider */}
                <motion.rect
                  animate={{ y: fillY, height: fillH }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  x="28.5" width="7" rx="3.5"
                  fill={critical?"rgba(255,55,55,0.9)":warn?"rgba(239,100,60,0.85)":"rgba(239,68,68,0.75)"}/>
                {/* Bulb ring */}
                <circle cx="32" cy={tubeTop+tubeH+18} r="17" fill="rgba(239,68,68,0.2)" stroke="rgba(193,18,31,0.5)" strokeWidth="1.5"/>
                <circle cx="32" cy={tubeTop+tubeH+18} r="13" fill="rgba(239,68,68,0.85)"/>
                <motion.circle cx="32" cy={tubeTop+tubeH+18} r="8"
                  animate={{fill:critical?"rgba(255,65,65,1)":"rgba(239,68,68,0.9)"}} transition={{duration:0.4}}/>
              </svg>

              {/* Value + label */}
              <div style={{textAlign:"center",flexShrink:0}}>
                <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"clamp(1.5rem,1.9vw,2rem)",fontWeight:800,color:"rgba(239,68,68,1)",lineHeight:1,marginBottom:"3px"}}>
                  {tempLow}–{tempHigh}°C
                </div>
                <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"15px",letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(212,175,55,0.9)",fontWeight:700,marginBottom:"6px"}}>
                  Year-round Temperature
                </div>
                {/* Always-visible info */}
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"14.5px",color:"rgba(255,255,255,0.78)",lineHeight:1.55,padding:"6px 8px",borderTop:"1px solid rgba(239,68,68,0.2)",marginTop:"2px"}}>
                  Warm tropical temperatures allow wetlands to remain active year-round.
                </div>
              </div>
            </div>

            {/* ── Rainfall Card ── */}
            <div onMouseEnter={()=>setRainHover(true)} onMouseLeave={()=>setRainHover(false)}
              style={{flex:1,minHeight:0,position:"relative",overflow:"hidden",borderRadius:"14px",
                border:`2px solid ${critical?"rgba(239,120,68,0.8)":rainActive?"rgba(59,130,246,0.5)":"rgba(212,175,55,0.4)"}`,
                background:"rgba(6,2,0,0.98)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between",padding:"10px 10px 12px",
                boxShadow:rainActive&&!critical?"0 0 16px rgba(59,130,246,0.18)":critical?"0 0 16px rgba(239,68,68,0.18)":"none",
                transition:"border-color 0.4s,box-shadow 0.4s",cursor:"default"}}>

              {/* Always-on rain drops */}
              {RAIN_DROPS.slice(0,rainCount).map((dr,i)=>(
                <div key={i} style={{position:"absolute",left:`${dr.left}%`,top:"-12px",width:"2px",height:"15px",borderRadius:"2px",
                  background:"linear-gradient(to bottom,transparent,rgba(59,130,246,0.85))",
                  animation:`rain-fall ${dr.dur}s linear ${dr.delay}s infinite`,pointerEvents:"none"}}/>
              ))}
              {rainActive&&<div style={{position:"absolute",bottom:"10px",left:"50%",transform:"translateX(-50%)",width:"58px",height:"18px",borderRadius:"50%",border:"2px solid rgba(59,130,246,0.5)",animation:"ripple 1.4s ease-out infinite",pointerEvents:"none"}}/>}
              {!rainActive&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:"28px",background:"linear-gradient(to top,rgba(110,55,8,0.45),transparent)",borderTop:"1px solid rgba(110,55,8,0.3)"}}/>}

              {/* Cloud SVG */}
              <svg width="60" height="40" viewBox="0 0 70 46" style={{flexShrink:0}}>
                <ellipse cx="35" cy="32" rx="30" ry="12" fill={rainActive?"rgba(59,130,246,0.18)":"rgba(120,75,25,0.2)"} stroke={rainActive?"rgba(59,130,246,0.5)":"rgba(150,80,28,0.5)"} strokeWidth="1.5" style={{transition:"all 0.5s"}}/>
                <ellipse cx="24" cy="24" rx="16" ry="11" fill={rainActive?"rgba(59,130,246,0.22)":"rgba(120,75,25,0.2)"} stroke={rainActive?"rgba(59,130,246,0.5)":"rgba(150,80,28,0.5)"} strokeWidth="1.5" style={{transition:"all 0.5s"}}/>
                <ellipse cx="44" cy="20" rx="14" ry="12" fill={rainActive?"rgba(59,130,246,0.22)":"rgba(120,75,25,0.2)"} stroke={rainActive?"rgba(59,130,246,0.5)":"rgba(150,80,28,0.5)"} strokeWidth="1.5" style={{transition:"all 0.5s"}}/>
                {rainActive&&<>
                  <line x1="25" y1="43" x2="23" y2="52" stroke="rgba(59,130,246,0.7)" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="35" y1="43" x2="33" y2="52" stroke="rgba(59,130,246,0.7)" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="45" y1="43" x2="43" y2="52" stroke="rgba(59,130,246,0.7)" strokeWidth="2.5" strokeLinecap="round"/>
                </>}
              </svg>

              {/* Value + label */}
              <div style={{textAlign:"center",flexShrink:0,position:"relative",zIndex:1}}>
                <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"clamp(1.3rem,1.7vw,1.85rem)",fontWeight:800,color:rainActive?"rgba(212,175,55,1)":"rgba(180,75,25,1)",lineHeight:1,marginBottom:"3px",transition:"color 0.5s"}}>
                  {rainLow}–{rainHigh} mm
                </div>
                <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"15px",letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(212,175,55,0.9)",fontWeight:700,marginBottom:"3px"}}>
                  Annual Rainfall
                </div>
                {critical&&<div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"15px",letterSpacing:"0.07em",color:"rgba(239,120,68,1)",fontWeight:700,animation:"alert-pulse 1.8s ease-in-out infinite",marginBottom:"3px"}}>
                  ⚠ DRY CONDITIONS
                </div>}
                {/* Always-visible info */}
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"14.5px",color:"rgba(255,255,255,0.78)",lineHeight:1.55,padding:"6px 8px",borderTop:"1px solid rgba(59,130,246,0.2)",marginTop:"2px"}}>
                  {rainActive
                    ? "Rainfall sustains freshwater marshes and wetland biodiversity."
                    : "Reduced rainfall dries freshwater habitats, threatening food and nesting."}
                </div>
              </div>
            </div>
          </div>

          {/* ═══ COL 3 — Habitat Impact + Sites ════════════════════════════════ */}
          <div style={{display:"flex",flexDirection:"column",gap:"6px",minHeight:0,overflow:"hidden"}}>
            <div style={{textAlign:"center",flexShrink:0}}>
              <span style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"15px",letterSpacing:"0.12em",textTransform:"uppercase",color:critical?"rgba(239,68,68,1)":warn?"rgba(239,140,68,1)":"rgba(212,175,55,1)"}}>
                🌿 Habitat Impact Meter
              </span>
            </div>

            <div style={{flex:1,minHeight:0,display:"flex",flexDirection:"column",gap:"8px",overflow:"hidden"}}>

              {/* 2×2 stat boxes */}
              <AnimatePresence mode="wait">
                <motion.div key={`${island}-${Math.floor(slider/5)}`} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}}
                  style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"1fr 1fr",gap:"7px",flex:1,minHeight:0}}>

                  {/* Wetland Stability */}
                  <StatBox label="Wetland Stability"  value={wetland} icon="💧" color={wetColor}/>
                  {/* Food Availability */}
                  <StatBox label="Food Availability"  value={food}    icon="🦋" color={foodColor}/>
                  {/* Nesting Conditions */}
                  <StatBox label="Nesting Conditions" value={nesting} icon="🥚" color={nestColor}/>

                  {/* Key Sites box */}
                  <AnimatePresence mode="wait">
                    <motion.div key={island} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.3}}
                      style={{borderRadius:"10px",border:"2px solid rgba(212,175,55,0.3)",background:"rgba(255,255,255,0.03)",padding:"8px 8px",display:"flex",flexDirection:"column",gap:"3px",overflow:"hidden"}}>
                      <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"13px",letterSpacing:"0.09em",textTransform:"uppercase",color:"rgba(212,175,55,0.9)",marginBottom:"4px",fontWeight:700}}>📍 Key Sites</div>
                      {ISLANDS[island].sites.map(s=>(
                        <div key={s} style={{fontFamily:"'Playfair Display',serif",fontSize:"15px",color:"rgba(255,255,255,0.88)",lineHeight:1.35,display:"flex",alignItems:"flex-start",gap:"5px"}}>
                          <span style={{color:"rgba(193,18,31,0.75)",fontSize:"9px",marginTop:"4px",flexShrink:0}}>◆</span>{s}
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>

                </motion.div>
              </AnimatePresence>

              {/* Footer */}
              {critical?(
                <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.4}} style={{flexShrink:0,padding:"7px 10px",borderRadius:"8px",border:"1px solid rgba(239,68,68,0.4)",background:"rgba(239,68,68,0.07)"}}>
                  <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"11px",letterSpacing:"0.05em",textTransform:"uppercase",color:"rgba(239,68,68,1)",margin:0,animation:"alert-pulse 2s ease-in-out infinite",textAlign:"center"}}>
                    ⚠ Habitat degradation threatens population recovery
                  </p>
                </motion.div>
              ):(
                <div style={{flexShrink:0,padding:"7px 10px",borderRadius:"8px",background:"rgba(193,18,31,0.08)",border:"1px solid rgba(193,18,31,0.3)"}}>
                  <p style={{fontFamily:"'Playfair Display',serif",fontSize:"16px",color:"rgba(212,175,55,1)",fontWeight:700,margin:0}}>
                    70% of Hawaiian wetlands lost to development.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
