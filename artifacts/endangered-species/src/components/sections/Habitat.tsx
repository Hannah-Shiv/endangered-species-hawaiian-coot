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

// 20 rain drops, staggered
const RAIN_DROPS = Array.from({length:20},(_,i)=>({ delay:(i*0.21)%2.1, left:(i*23+7)%96, dur:0.7+(i%5)*0.12 }));

function ImpactBar({label,value,color,icon}:{label:string;value:number;color:string;icon:string}) {
  return (
    <div style={{marginBottom:"10px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"5px"}}>
        <span style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"13px",letterSpacing:"0.07em",textTransform:"uppercase",color:"rgba(212,175,55,0.9)"}}>{icon} {label}</span>
        <motion.span animate={{color}} transition={{duration:0.4}}
          style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"2rem",fontWeight:900,lineHeight:1,color}}>
          {value}%
        </motion.span>
      </div>
      <div style={{height:"10px",borderRadius:"5px",background:"rgba(255,255,255,0.08)",overflow:"hidden"}}>
        <motion.div animate={{width:`${value}%`,background:`linear-gradient(to right,${color}55,${color})`}} transition={{duration:0.7,ease:"easeOut"}}
          style={{height:"100%",borderRadius:"5px"}}/>
      </div>
    </div>
  );
}

export function Habitat() {
  const [island,   setIsland]   = useState<IslandKey>("Maui");
  const [slider,   setSlider]   = useState(0);
  const [tempHover,setTempHover]= useState(false);
  const [rainHover,setRainHover]= useState(false);
  const d = ISLANDS[island];

  const deg  = slider / 100;           // 0 = healthy, 1 = critical
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

  // Thermometer fill: 0.28 (healthy) → 0.88 (critical)
  const thermFill = 0.28 + deg * 0.60;
  // Tube dimensions in SVG (viewBox="0 0 60 160")
  const tubeTop = 6, tubeH = 100;
  const fillH   = thermFill * tubeH;
  const fillY   = tubeTop + tubeH - fillH;

  // Rain: full count at slider=0, zero at slider=80
  const rainCount = Math.round(RAIN_DROPS.length * Math.max(0, (80 - slider) / 80));
  const rainActive = rainCount > 0;

  const statusColor = slider<20?"rgba(34,197,94,1)":slider<50?"rgba(212,175,55,1)":slider<75?"rgba(239,140,68,1)":"rgba(239,68,68,1)";
  const statusLabel = slider<20?"✓ Healthy":slider<50?"Mild Stress":slider<75?"⚠ High Risk":"🔴 Critical";

  const edMsg =
    slider<25?"Stable climate supports long-term survival and reproduction.":
    slider<50?"Higher temperatures increase evaporation, shrinking wetlands.":
    slider<75?"Reduced rainfall threatens food sources and nesting areas.":
              "Critical degradation — nesting success and recovery severely at risk.";

  return (
    <>
      <style>{`
        @keyframes rain-fall  {0%{transform:translateY(-12px);opacity:0}10%{opacity:1}88%{opacity:1}100%{transform:translateY(170px);opacity:0}}
        @keyframes heat-wave  {0%{transform:scaleX(0.2) translateX(-40%);opacity:0}50%{transform:scaleX(1) translateX(0);opacity:1}100%{transform:scaleX(0.2) translateX(40%);opacity:0}}
        @keyframes ripple     {0%{transform:scale(0.4);opacity:0.7}100%{transform:scale(2.4);opacity:0}}
        @keyframes alert-pulse{0%,100%{opacity:0.4}50%{opacity:1}}
        @keyframes therm-glow {0%,100%{filter:drop-shadow(0 0 4px rgba(239,68,68,0.5))}50%{filter:drop-shadow(0 0 12px rgba(239,68,68,0.9))}}
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

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div style={{textAlign:"center",flexShrink:0}}>
          <h1 style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"clamp(1.5rem,2.2vw,2.2rem)",fontWeight:700,letterSpacing:"0.13em",textTransform:"uppercase",color:"rgba(212,175,55,1)",margin:"0 0 2px"}}>
            Habitat &amp; Location
          </h1>
          <p style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(0.82rem,1vw,0.95rem)",color:"rgba(255,255,255,0.65)",margin:0}}>
            Freshwater and brackish wetlands across the Hawaiian Islands — home to the Hawaiian Coot.
          </p>
        </div>

        {/* ── Island Selector ─────────────────────────────────────────────────── */}
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

        {/* ── 3-Column Grid ───────────────────────────────────────────────────── */}
        <div style={{flex:1,minHeight:0,display:"grid",gridTemplateColumns:"1.9fr 0.85fr 1fr",gap:"10px"}}>

          {/* ═══ COL 1 — Climate Change Simulator ════════════════════════════════ */}
          <div style={{display:"flex",flexDirection:"column",gap:"6px",minHeight:0,overflow:"hidden"}}>
            <div style={{textAlign:"center",flexShrink:0}}>
              <span style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"12px",letterSpacing:"0.12em",textTransform:"uppercase",color:statusColor}}>
                🌡 Climate Change Simulator
              </span>
            </div>
            <div style={{flex:1,minHeight:0,display:"flex",gap:"10px",borderRadius:"14px",
              border:`2.5px solid ${critical?"rgba(239,68,68,0.55)":warn?"rgba(239,140,68,0.45)":"rgba(212,175,55,0.25)"}`,
              background:"rgba(6,2,0,0.98)",padding:"12px 14px",overflow:"hidden",
              boxShadow:critical?"0 0 24px rgba(239,68,68,0.15)":"none",transition:"border-color 0.4s,box-shadow 0.4s"}}>

              {/* Vertical slider */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"6px",flexShrink:0,width:"54px"}}>
                <span style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"10px",letterSpacing:"0.05em",textTransform:"uppercase",color:"rgba(239,68,68,0.85)",textAlign:"center",lineHeight:1.2}}>Severe<br/>Change</span>
                <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",minHeight:0}}>
                  <input type="range" min={0} max={100} value={slider} onChange={e=>setSlider(Number(e.target.value))} className="vslider"/>
                </div>
                <span style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"10px",letterSpacing:"0.05em",textTransform:"uppercase",color:"rgba(34,197,94,0.85)",textAlign:"center",lineHeight:1.2}}>Healthy<br/>Climate</span>
              </div>

              {/* Scene + status */}
              <div style={{flex:1,minHeight:0,display:"flex",flexDirection:"column",gap:"8px",overflow:"hidden"}}>
                {/* Habitat photo */}
                <div style={{flex:1,minHeight:0,borderRadius:"10px",overflow:"hidden",position:"relative"}}>
                  <img src={habitatImg} alt="Habitat" style={{width:"100%",height:"100%",objectFit:"cover",
                    filter:`saturate(${1-deg*0.78}) brightness(${1-deg*0.38}) sepia(${deg*0.55})`,transition:"filter 0.5s"}}/>
                  {slider>45&&<div style={{position:"absolute",inset:0,
                    background:"repeating-linear-gradient(43deg,rgba(100,50,8,0.11) 0,rgba(100,50,8,0.11) 2px,transparent 2px,transparent 26px),repeating-linear-gradient(-43deg,rgba(100,50,8,0.11) 0,rgba(100,50,8,0.11) 2px,transparent 2px,transparent 26px)",
                    opacity:(slider-45)/55*0.65}}/>}
                  {critical&&<div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 60%,transparent 35%,rgba(239,68,68,0.22) 100%)",animation:"alert-pulse 2s ease-in-out infinite"}}/>}
                  {slider<65&&[0,1,2].map(i=><div key={i} style={{position:"absolute",bottom:`${14+i*12}%`,left:`${26+i*14}%`,width:"55px",height:"16px",borderRadius:"50%",border:"2px solid rgba(59,130,246,0.4)",opacity:Math.max(0,0.55-deg*0.5),animation:`ripple ${1.3+i*0.45}s ease-out ${i*0.55}s infinite`}}/>)}
                </div>

                {/* Status */}
                <div style={{flexShrink:0,paddingLeft:"2px"}}>
                  <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"14px",fontWeight:700,color:statusColor,marginBottom:"4px"}}>{statusLabel}</div>
                  <AnimatePresence mode="wait">
                    <motion.p key={Math.floor(slider/25)} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.3}}
                      style={{fontFamily:"'Playfair Display',serif",fontSize:"12.5px",color:"rgba(255,255,255,0.72)",lineHeight:1.5,
                        borderLeft:`3px solid ${statusColor}`,paddingLeft:"8px",margin:0}}>
                      {edMsg}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ COL 2 — Climate Profile ═════════════════════════════════════════ */}
          <div style={{display:"flex",flexDirection:"column",gap:"6px",minHeight:0,overflow:"hidden"}}>
            <div style={{textAlign:"center",flexShrink:0}}>
              <span style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"12px",letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(212,175,55,1)"}}>
                🌤 Climate Profile
              </span>
            </div>

            {/* ── Temperature Card ── */}
            <div onMouseEnter={()=>setTempHover(true)} onMouseLeave={()=>setTempHover(false)}
              style={{flex:1,minHeight:0,position:"relative",overflow:"hidden",borderRadius:"14px",
                border:`2px solid ${critical?"rgba(239,68,68,0.9)":warn?"rgba(239,68,68,0.55)":"rgba(193,18,31,0.5)"}`,
                background:"rgba(6,2,0,0.98)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"12px 10px",
                boxShadow:critical?"0 0 28px rgba(239,68,68,0.35)":warn?"0 0 16px rgba(239,68,68,0.2)":"none",
                transition:"border-color 0.4s,box-shadow 0.4s",cursor:"default"}}>

              {/* Heat waves — always on when warn */}
              {(warn||tempHover)&&[{delay:0,top:20},{delay:0.75,top:48},{delay:1.45,top:74}].map((w,i)=>(
                <div key={i} style={{position:"absolute",left:"6%",top:`${w.top}%`,width:"88%",height:"2px",borderRadius:"50%",
                  background:"linear-gradient(to right,transparent,rgba(239,68,68,0.4),transparent)",
                  animation:`heat-wave 1.85s ease-in-out ${w.delay}s infinite`,pointerEvents:"none"}}/>
              ))}

              {/* Taller thermometer — always reactive */}
              <svg width="48" height="155" viewBox="0 0 60 160"
                style={{flexShrink:0,marginBottom:"6px",animation:critical?"therm-glow 1.8s ease-in-out infinite":"none"}}>
                {/* Scale ticks */}
                {[0.2,0.4,0.6,0.8].map((f,i)=>{
                  const ty = tubeTop + tubeH*(1-f);
                  return <g key={i}>
                    <line x1="34" y1={ty} x2="40" y2={ty} stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
                    <text x="42" y={ty+3.5} fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="Josefin Sans">{Math.round(d.tempLow + f*(d.tempHigh-d.tempLow)+deg*9*f)}°</text>
                  </g>;
                })}
                {/* Tube */}
                <rect x="22" y={tubeTop} width="10" height={tubeH} rx="5" fill="rgba(255,255,255,0.05)" stroke="rgba(193,18,31,0.6)" strokeWidth="1.5"/>
                {/* Fill — driven by slider */}
                <motion.rect
                  animate={{ y: fillY, height: fillH }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  x="24" width="6" rx="3"
                  fill={critical?"rgba(255,60,60,0.9)":warn?"rgba(239,100,68,0.85)":"rgba(239,68,68,0.75)"}/>
                {/* Bulb */}
                <circle cx="27" cy={tubeTop+tubeH+14} r="13" fill="rgba(239,68,68,0.85)"/>
                <motion.circle cx="27" cy={tubeTop+tubeH+14} r="8"
                  animate={{fill:critical?"rgba(255,70,70,1)":"rgba(239,68,68,0.9)"}} transition={{duration:0.4}}/>
              </svg>

              <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"clamp(1.5rem,1.8vw,2rem)",fontWeight:800,color:"rgba(239,68,68,1)",lineHeight:1,marginBottom:"3px",textAlign:"center"}}>
                {tempLow}–{tempHigh}°C
              </div>
              <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"10px",letterSpacing:"0.14em",textTransform:"uppercase",color:"rgba(212,175,55,0.75)",margin:0,textAlign:"center"}}>
                Year-round Temperature
              </p>

              {/* Hover tooltip overlay */}
              <AnimatePresence>
                {tempHover&&(
                  <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.2}}
                    style={{position:"absolute",bottom:0,left:0,right:0,padding:"10px 12px",background:"rgba(6,2,0,0.94)",borderTop:"1px solid rgba(239,68,68,0.35)"}}>
                    <p style={{fontFamily:"'Playfair Display',serif",fontSize:"12px",color:"rgba(255,255,255,0.82)",lineHeight:1.5,margin:0}}>
                      Warm tropical temperatures allow wetlands to remain active year-round.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Rainfall Card ── */}
            <div onMouseEnter={()=>setRainHover(true)} onMouseLeave={()=>setRainHover(false)}
              style={{flex:1,minHeight:0,position:"relative",overflow:"hidden",borderRadius:"14px",
                border:`2px solid ${critical?"rgba(239,120,68,0.8)":rainActive?"rgba(59,130,246,0.5)":"rgba(212,175,55,0.4)"}`,
                background:"rgba(6,2,0,0.98)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"12px 10px",
                boxShadow:rainActive&&!critical?"0 0 18px rgba(59,130,246,0.2)":critical?"0 0 18px rgba(239,68,68,0.2)":"none",
                transition:"border-color 0.4s,box-shadow 0.4s",cursor:"default"}}>

              {/* Rain drops — always on, quantity from slider */}
              {RAIN_DROPS.slice(0,rainCount).map((dr,i)=>(
                <div key={i} style={{position:"absolute",left:`${dr.left}%`,top:"-12px",width:"2px",height:"15px",borderRadius:"2px",
                  background:"linear-gradient(to bottom,transparent,rgba(59,130,246,0.85))",
                  animation:`rain-fall ${dr.dur}s linear ${dr.delay}s infinite`,pointerEvents:"none"}}/>
              ))}

              {/* Ripple — always when rain active */}
              {rainActive&&<div style={{position:"absolute",bottom:"10px",left:"50%",transform:"translateX(-50%)",width:"58px",height:"18px",borderRadius:"50%",border:"2px solid rgba(59,130,246,0.5)",animation:"ripple 1.4s ease-out infinite",pointerEvents:"none"}}/>}

              {/* Cracked ground when dry */}
              {!rainActive&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:"32px",background:"linear-gradient(to top,rgba(110,55,8,0.45),transparent)",borderTop:"1px solid rgba(110,55,8,0.3)"}}/>}

              {/* Cloud */}
              <svg width="56" height="36" viewBox="0 0 60 40" style={{flexShrink:0,marginBottom:"8px"}}>
                <ellipse cx="30" cy="28" rx="26" ry="11" fill={rainActive?"rgba(59,130,246,0.18)":"rgba(120,75,25,0.2)"} stroke={rainActive?"rgba(59,130,246,0.5)":"rgba(150,80,28,0.5)"} strokeWidth="1.5" style={{transition:"all 0.5s"}}/>
                <ellipse cx="20" cy="21" rx="14" ry="10" fill={rainActive?"rgba(59,130,246,0.22)":"rgba(120,75,25,0.2)"} stroke={rainActive?"rgba(59,130,246,0.5)":"rgba(150,80,28,0.5)"} strokeWidth="1.5" style={{transition:"all 0.5s"}}/>
                <ellipse cx="38" cy="18" rx="12" ry="10" fill={rainActive?"rgba(59,130,246,0.22)":"rgba(120,75,25,0.2)"} stroke={rainActive?"rgba(59,130,246,0.5)":"rgba(150,80,28,0.5)"} strokeWidth="1.5" style={{transition:"all 0.5s"}}/>
                {rainActive&&<>
                  <line x1="22" y1="38" x2="20" y2="46" stroke="rgba(59,130,246,0.7)" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="30" y1="38" x2="28" y2="46" stroke="rgba(59,130,246,0.7)" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="38" y1="38" x2="36" y2="46" stroke="rgba(59,130,246,0.7)" strokeWidth="2" strokeLinecap="round"/>
                </>}
              </svg>

              <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"clamp(1.3rem,1.7vw,1.85rem)",fontWeight:800,color:rainActive?"rgba(212,175,55,1)":"rgba(180,75,25,1)",lineHeight:1,marginBottom:"3px",textAlign:"center",transition:"color 0.5s"}}>
                {rainLow}–{rainHigh} mm
              </div>
              <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"10px",letterSpacing:"0.14em",textTransform:"uppercase",color:"rgba(212,175,55,0.75)",margin:0,textAlign:"center"}}>
                Annual Rainfall
              </p>
              {!rainActive&&<div style={{marginTop:"6px",fontFamily:"'Josefin Sans',sans-serif",fontSize:"11px",color:"rgba(239,120,68,0.9)",animation:"alert-pulse 1.8s ease-in-out infinite"}}>⚠ DRY CONDITIONS</div>}

              <AnimatePresence>
                {rainHover&&(
                  <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.2}}
                    style={{position:"absolute",bottom:0,left:0,right:0,padding:"10px 12px",background:"rgba(6,2,0,0.94)",borderTop:"1px solid rgba(59,130,246,0.3)",zIndex:2}}>
                    <p style={{fontFamily:"'Playfair Display',serif",fontSize:"12px",color:"rgba(255,255,255,0.82)",lineHeight:1.5,margin:0}}>
                      {rainActive?"Rainfall sustains freshwater marshes and wetland biodiversity.":"Reduced rainfall dries freshwater habitats, threatening food and nesting."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ═══ COL 3 — Habitat Impact Meter + Location ═════════════════════════ */}
          <div style={{display:"flex",flexDirection:"column",gap:"6px",minHeight:0,overflow:"hidden"}}>
            <div style={{textAlign:"center",flexShrink:0}}>
              <span style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"12px",letterSpacing:"0.12em",textTransform:"uppercase",color:critical?"rgba(239,68,68,1)":warn?"rgba(239,140,68,1)":"rgba(212,175,55,1)"}}>
                🌿 Habitat Impact Meter
              </span>
            </div>

            <div style={{flex:1,minHeight:0,display:"flex",flexDirection:"column",borderRadius:"14px",
              border:`2px solid ${critical?"rgba(239,68,68,0.4)":warn?"rgba(239,140,68,0.3)":"rgba(212,175,55,0.22)"}`,
              background:"rgba(6,2,0,0.98)",padding:"12px 14px",overflow:"hidden",gap:"8px",
              transition:"border-color 0.4s"}}>

              {/* Impact bars */}
              <AnimatePresence mode="wait">
                <motion.div key={`${island}-${Math.floor(slider/5)}`} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}} style={{flexShrink:0}}>
                  <ImpactBar label="Wetland Stability"  value={wetland} icon="💧" color={wetland>60?"rgba(34,197,94,1)":wetland>35?"rgba(212,175,55,1)":"rgba(239,68,68,1)"}/>
                  <ImpactBar label="Food Availability"  value={food}    icon="🦋" color={food>60?"rgba(212,175,55,1)":food>35?"rgba(239,140,68,1)":"rgba(239,68,68,1)"}/>
                  <ImpactBar label="Nesting Conditions" value={nesting} icon="🥚" color={nesting>60?"rgba(59,130,246,1)":nesting>35?"rgba(239,140,68,1)":"rgba(239,68,68,1)"}/>
                </motion.div>
              </AnimatePresence>

              <div style={{height:"1px",background:"rgba(212,175,55,0.12)",flexShrink:0}}/>

              {/* Island info */}
              <AnimatePresence mode="wait">
                <motion.div key={island} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.3}} style={{flex:1,minHeight:0,overflow:"hidden"}}>
                  <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"15px",fontWeight:700,letterSpacing:"0.07em",color:"rgba(212,175,55,1)",marginBottom:"2px"}}>{island}</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:"12px",color:"rgba(255,255,255,0.48)",fontStyle:"italic",marginBottom:"8px"}}>{ISLANDS[island].biome}</div>
                  <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"10.5px",letterSpacing:"0.08em",textTransform:"uppercase",color:"rgba(212,175,55,0.6)",marginBottom:"5px"}}>Key Sites</div>
                  {ISLANDS[island].sites.map(s=>(
                    <div key={s} style={{fontFamily:"'Playfair Display',serif",fontSize:"13px",color:"rgba(255,255,255,0.78)",padding:"3px 0",borderBottom:"1px solid rgba(212,175,55,0.07)",display:"flex",gap:"6px",alignItems:"center"}}>
                      <span style={{color:"rgba(193,18,31,0.7)",fontSize:"8px"}}>◆</span>{s}
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Warning / stat footer */}
              {critical?(
                <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.4}}
                  style={{flexShrink:0,padding:"7px 10px",borderRadius:"8px",border:"1px solid rgba(239,68,68,0.4)",background:"rgba(239,68,68,0.07)"}}>
                  <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"11px",letterSpacing:"0.05em",textTransform:"uppercase",color:"rgba(239,68,68,1)",margin:0,animation:"alert-pulse 2s ease-in-out infinite",textAlign:"center"}}>
                    ⚠ Habitat degradation threatens population recovery
                  </p>
                </motion.div>
              ):(
                <div style={{flexShrink:0,padding:"7px 10px",borderRadius:"8px",background:"rgba(193,18,31,0.08)",border:"1px solid rgba(193,18,31,0.3)"}}>
                  <p style={{fontFamily:"'Playfair Display',serif",fontSize:"12.5px",color:"rgba(212,175,55,1)",fontWeight:700,margin:0}}>
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
