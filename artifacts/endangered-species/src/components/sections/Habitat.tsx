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

const RAIN_DROPS = Array.from({length:38},(_,i)=>({ delay:(i*0.13)%2.6, left:(i*17+5)%95, dur:0.65+(i%7)*0.11 }));

function StatBox({ label, value, color, icon }: { label:string; value:number; color:string; icon:string }) {
  return (
    <motion.div animate={{ borderColor: color+"66" }} transition={{ duration:0.5 }}
      style={{ borderRadius:"10px", border:`2px solid ${color}66`, background:"rgba(255,255,255,0.03)",
        padding:"10px 8px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"4px" }}>
      <span style={{ fontSize:"20px", lineHeight:1 }}>{icon}</span>
      <motion.div animate={{ color }} transition={{ duration:0.5 }}
        style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"2.2rem", fontWeight:900, lineHeight:1, color }}>
        {value}%
      </motion.div>
      <motion.div style={{ height:"5px", borderRadius:"3px", background:"rgba(255,255,255,0.07)", width:"90%", overflow:"hidden" }}>
        <motion.div animate={{ width:`${value}%`, background: color }} transition={{ duration:0.7, ease:"easeOut" }}
          style={{ height:"100%", borderRadius:"3px" }}/>
      </motion.div>
      <div style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"13px", letterSpacing:"0.08em",
        textTransform:"uppercase", color:"rgba(212,175,55,0.9)", textAlign:"center", lineHeight:1.2 }}>
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

  // Thermometer — taller tube
  const tubeTop = 8, tubeH = 230;
  const thermFill = 0.20 + deg * 0.68;
  const fillH = thermFill * tubeH;
  const fillY = tubeTop + tubeH - fillH;
  const bulbCy = tubeTop + tubeH + 20;

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
        @keyframes therm-glow {0%,100%{filter:drop-shadow(0 0 5px rgba(239,68,68,0.5))}50%{filter:drop-shadow(0 0 16px rgba(239,68,68,1))}}

        /* Thick vertical slider — thumb is a horizontal bar */
        .vslider{writing-mode:vertical-lr;direction:rtl;-webkit-appearance:none;
          height:100%;width:30px;cursor:pointer;outline:none;border:none;background:transparent;padding:0}
        .vslider::-webkit-slider-runnable-track{
          width:30px;border-radius:4px;
          background:linear-gradient(to top,rgba(34,197,94,0.9),rgba(212,175,55,0.9),rgba(239,120,68,0.9),rgba(239,68,68,1));
          box-shadow:0 0 8px rgba(212,175,55,0.25)}
        .vslider::-webkit-slider-thumb{
          -webkit-appearance:none;width:30px;height:7px;border-radius:3px;
          border:none;
          background:rgba(147,51,234,1);
          cursor:pointer;margin-left:0;
          box-shadow:0 0 10px rgba(147,51,234,0.85)}
        .vslider::-moz-range-track{
          width:30px;border-radius:15px;
          background:linear-gradient(to top,rgba(34,197,94,0.9),rgba(212,175,55,0.9),rgba(239,120,68,0.9),rgba(239,68,68,1))}
        .vslider::-moz-range-thumb{
          width:30px;height:7px;border-radius:3px;
          border:none;background:rgba(147,51,234,1);cursor:pointer;
          box-shadow:0 0 10px rgba(147,51,234,0.85)}
      `}</style>

      <div style={{
        height:"100vh", boxSizing:"border-box",
        padding:"68px 14px 10px 14px",
        background:"#000000",
        display:"flex", flexDirection:"column", gap:"8px", overflow:"hidden",
      }}>

        {/* Header */}
        <div style={{textAlign:"center",flexShrink:0,paddingTop:"52px"}}>
          <h1 style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"clamp(1.5rem,2.2vw,2.1rem)",fontWeight:700,letterSpacing:"0.13em",textTransform:"uppercase",color:"rgba(212,175,55,1)",margin:"0 0 2px"}}>
            Habitat &amp; Location
          </h1>
          <p style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:"clamp(0.85rem,1vw,1rem)",color:"rgba(212,175,55,0.85)",margin:0,letterSpacing:"0.02em"}}>
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

        {/* ── 4-column grid: Scene | Slider | Climate Cards | Impact ── */}
        <div style={{flex:1,minHeight:0,display:"grid",gridTemplateColumns:"1.45fr 52px 0.88fr 1.05fr",gap:"10px"}}>

          {/* ═══ COL 1 — Scene (picture + status) ══════════════════════════════ */}
          <div style={{display:"flex",flexDirection:"column",gap:"6px",minHeight:0,overflow:"hidden"}}>
            <div style={{textAlign:"center",flexShrink:0}}>
              <span style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"15px",letterSpacing:"0.12em",textTransform:"uppercase",color:statusColor}}>
                🌡 Climate Change Simulator
              </span>
            </div>
            <div style={{flex:1,minHeight:0,display:"flex",flexDirection:"column",gap:"8px",borderRadius:"14px",
              border:`2.5px solid ${critical?"rgba(239,68,68,0.55)":warn?"rgba(239,140,68,0.45)":"rgba(212,175,55,0.25)"}`,
              background:"rgba(6,2,0,0.98)",padding:"12px",overflow:"hidden",
              boxShadow:critical?"0 0 24px rgba(239,68,68,0.15)":"none",transition:"border-color 0.4s,box-shadow 0.4s"}}>

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

              {/* Status message */}
              <div style={{flexShrink:0}}>
                <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"14px",fontWeight:700,color:statusColor,marginBottom:"4px"}}>{statusLabel}</div>
                <AnimatePresence mode="wait">
                  <motion.p key={Math.floor(slider/25)} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.3}}
                    style={{fontFamily:"'Playfair Display',serif",fontSize:"15px",color:"rgba(255,255,255,0.78)",lineHeight:1.5,borderLeft:`3px solid ${statusColor}`,paddingLeft:"8px",margin:0,overflow:"hidden"}}>
                    {edMsg}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ═══ COL 2 — Vertical Slider (between scene and thermometer) ════════ */}
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"6px",minHeight:0,paddingTop:"28px"}}>

            <span style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"9px",letterSpacing:"0.05em",textTransform:"uppercase",color:"rgba(239,68,68,0.9)",textAlign:"center",lineHeight:1.2,flexShrink:0}}>
              Severe<br/>Change
            </span>

            {/* Slider with "DRAG THIS BAR" text written vertically inside the track */}
            <div style={{flex:1,minHeight:0,position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <input
                type="range" min={0} max={100} value={slider}
                onChange={e=>setSlider(Number(e.target.value))}
                className="vslider"
              />
              <div style={{
                position:"absolute", pointerEvents:"none", userSelect:"none", zIndex:2,
                display:"flex", flexDirection:"column", alignItems:"center", gap:"1px",
                fontFamily:"'Josefin Sans',sans-serif", fontSize:"15px",
                fontWeight:900, letterSpacing:"0.05em", textTransform:"uppercase",
                color:"#000000", lineHeight:1.15,
              }}>
                {(["D",1,"R",1,"A",1,"G",2,"T",1,"H",1,"I",1,"S",2,"B",1,"A",1,"R"] as (string|number)[]).map((c,i)=>
                  c===1 ? <div key={i} style={{height:"5px"}}/>
                  : c===2 ? <div key={i} style={{height:"20px"}}/>
                  : <span key={i}>{c}</span>
                )}
              </div>
            </div>

            <span style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"9px",letterSpacing:"0.05em",textTransform:"uppercase",color:"rgba(34,197,94,0.9)",textAlign:"center",lineHeight:1.2,flexShrink:0}}>
              Healthy<br/>Climate
            </span>
          </div>

          {/* ═══ COL 3 — Climate Profile (Thermometer + Rainfall) ═══════════════ */}
          <div style={{display:"flex",flexDirection:"column",gap:"6px",minHeight:0,overflow:"hidden"}}>
            <div style={{textAlign:"center",flexShrink:0}}>
              <span style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"15px",letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(212,175,55,1)"}}>
                🌤 Climate Profile
              </span>
            </div>

            {/* Temperature card */}
            <div onMouseEnter={()=>setTempHover(true)} onMouseLeave={()=>setTempHover(false)}
              style={{flex:1,minHeight:0,position:"relative",overflow:"hidden",borderRadius:"14px",
                border:`2px solid ${critical?"rgba(239,68,68,0.9)":warn?"rgba(239,68,68,0.55)":"rgba(193,18,31,0.5)"}`,
                background:"rgba(6,2,0,0.98)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between",padding:"10px 10px 12px",
                boxShadow:critical?"0 0 28px rgba(239,68,68,0.35)":warn?"0 0 14px rgba(239,68,68,0.18)":"none",
                transition:"border-color 0.4s,box-shadow 0.4s",cursor:"default"}}>

              {(warn||tempHover)&&[{delay:0,top:16},{delay:0.75,top:42},{delay:1.45,top:70}].map((w,i)=>(
                <div key={i} style={{position:"absolute",left:"5%",top:`${w.top}%`,width:"90%",height:"2px",borderRadius:"50%",
                  background:"linear-gradient(to right,transparent,rgba(239,68,68,0.4),transparent)",
                  animation:`heat-wave 1.85s ease-in-out ${w.delay}s infinite`,pointerEvents:"none"}}/>
              ))}

              {/* Taller thermometer — tubeH=230, viewBox height=300 */}
              <svg width="110" height="268" viewBox="0 0 145 300"
                style={{flexShrink:0,animation:critical?"therm-glow 1.8s ease-in-out infinite":"none"}}>
                {/* Scale ticks */}
                {[0.12,0.30,0.50,0.70,0.88].map((f,i)=>{
                  const ty = tubeTop + tubeH*(1-f);
                  const tempVal = Math.round(d.tempLow + f*(d.tempHigh-d.tempLow) + deg*9*f);
                  return <g key={i}>
                    <line x1="38" y1={ty} x2="52" y2={ty} stroke="rgba(255,255,255,0.35)" strokeWidth="2"/>
                    <text x="57" y={ty+13} fill="rgba(255,255,255,0.9)" fontSize="28" fontFamily="'Josefin Sans'" fontWeight="700">{tempVal}°</text>
                  </g>;
                })}
                {/* Tube */}
                <rect x="26" y={tubeTop} width="12" height={tubeH} rx="6"
                  fill="rgba(255,255,255,0.04)" stroke="rgba(193,18,31,0.6)" strokeWidth="1.5"/>
                {/* Fill */}
                <motion.rect
                  animate={{ y: fillY, height: fillH }}
                  transition={{ duration:1.0, ease:"easeOut" }}
                  x="28.5" width="7" rx="3.5"
                  fill={critical?"rgba(255,55,55,0.9)":warn?"rgba(239,100,60,0.85)":"rgba(239,68,68,0.75)"}/>
                {/* Bulb */}
                <circle cx="32" cy={bulbCy} r="18" fill="rgba(239,68,68,0.18)" stroke="rgba(193,18,31,0.4)" strokeWidth="1.5"/>
                <circle cx="32" cy={bulbCy} r="13" fill="rgba(239,68,68,0.85)"/>
                <motion.circle cx="32" cy={bulbCy} r="8"
                  animate={{fill:critical?"rgba(255,65,65,1)":"rgba(239,68,68,0.9)"}} transition={{duration:0.4}}/>
              </svg>

              <div style={{textAlign:"center",flexShrink:0}}>
                <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"clamp(1.5rem,1.9vw,2rem)",fontWeight:800,color:"rgba(239,68,68,1)",lineHeight:1,marginBottom:"3px"}}>
                  {tempLow}–{tempHigh}°C
                </div>
                <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"15px",letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(212,175,55,0.9)",fontWeight:700,marginBottom:"5px"}}>
                  Year-round Temperature
                </div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"16px",color:"rgba(255,255,255,0.82)",lineHeight:1.5,padding:"5px 8px",borderTop:"1px solid rgba(239,68,68,0.2)",overflow:"hidden"}}>
                  Warm tropical temperatures allow wetlands to remain active year-round.
                </div>
              </div>
            </div>

            {/* Rainfall card */}
            <div onMouseEnter={()=>setRainHover(true)} onMouseLeave={()=>setRainHover(false)}
              style={{flex:1,minHeight:0,position:"relative",overflow:"hidden",borderRadius:"14px",
                border:`2px solid ${critical?"rgba(239,120,68,0.8)":rainActive?"rgba(59,130,246,0.5)":"rgba(212,175,55,0.4)"}`,
                background:"rgba(6,2,0,0.98)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between",padding:"10px 10px 12px",
                boxShadow:rainActive&&!critical?"0 0 16px rgba(59,130,246,0.18)":critical?"0 0 16px rgba(239,68,68,0.18)":"none",
                transition:"border-color 0.4s,box-shadow 0.4s",cursor:"default"}}>

              {RAIN_DROPS.slice(0,rainCount).map((dr,i)=>(
                <div key={i} style={{position:"absolute",left:`${dr.left}%`,top:"-12px",width:"2.5px",height:"19px",borderRadius:"2px",
                  background:"linear-gradient(to bottom,transparent,rgba(59,130,246,0.85))",
                  animation:`rain-fall ${dr.dur}s linear ${dr.delay}s infinite`,pointerEvents:"none"}}/>
              ))}
              {rainActive&&<div style={{position:"absolute",bottom:"10px",left:"50%",transform:"translateX(-50%)",width:"58px",height:"18px",borderRadius:"50%",border:"2px solid rgba(59,130,246,0.5)",animation:"ripple 1.4s ease-out infinite",pointerEvents:"none"}}/>}
              {!rainActive&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:"28px",background:"linear-gradient(to top,rgba(110,55,8,0.45),transparent)",borderTop:"1px solid rgba(110,55,8,0.3)"}}/>}

              <svg width="62" height="42" viewBox="0 0 70 46" style={{flexShrink:0}}>
                <ellipse cx="35" cy="32" rx="30" ry="12" fill={rainActive?"rgba(59,130,246,0.18)":"rgba(120,75,25,0.2)"} stroke={rainActive?"rgba(59,130,246,0.5)":"rgba(150,80,28,0.5)"} strokeWidth="1.5" style={{transition:"all 0.5s"}}/>
                <ellipse cx="24" cy="24" rx="16" ry="11" fill={rainActive?"rgba(59,130,246,0.22)":"rgba(120,75,25,0.2)"} stroke={rainActive?"rgba(59,130,246,0.5)":"rgba(150,80,28,0.5)"} strokeWidth="1.5" style={{transition:"all 0.5s"}}/>
                <ellipse cx="44" cy="20" rx="14" ry="12" fill={rainActive?"rgba(59,130,246,0.22)":"rgba(120,75,25,0.2)"} stroke={rainActive?"rgba(59,130,246,0.5)":"rgba(150,80,28,0.5)"} strokeWidth="1.5" style={{transition:"all 0.5s"}}/>
                {rainActive&&<>
                  <line x1="25" y1="43" x2="23" y2="52" stroke="rgba(59,130,246,0.7)" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="35" y1="43" x2="33" y2="52" stroke="rgba(59,130,246,0.7)" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="45" y1="43" x2="43" y2="52" stroke="rgba(59,130,246,0.7)" strokeWidth="2.5" strokeLinecap="round"/>
                </>}
              </svg>

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
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"16px",color:"rgba(255,255,255,0.82)",lineHeight:1.5,padding:"5px 8px",borderTop:"1px solid rgba(59,130,246,0.2)",overflow:"hidden"}}>
                  {rainActive
                    ? "Rainfall sustains freshwater marshes and wetland biodiversity."
                    : "Reduced rainfall dries freshwater habitats, threatening food and nesting."}
                </div>
              </div>
            </div>
          </div>

          {/* ═══ COL 4 — Habitat Impact Meter + Sites ════════════════════════════ */}
          <div style={{display:"flex",flexDirection:"column",gap:"6px",minHeight:0,overflow:"hidden"}}>
            <div style={{textAlign:"center",flexShrink:0}}>
              <span style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"15px",letterSpacing:"0.12em",textTransform:"uppercase",color:critical?"rgba(239,68,68,1)":warn?"rgba(239,140,68,1)":"rgba(212,175,55,1)"}}>
                🌿 Habitat Impact Meter
              </span>
            </div>

            <div style={{flex:1,minHeight:0,display:"flex",flexDirection:"column",gap:"8px",overflow:"hidden"}}>
              {/* 2×2 stat boxes */}
              {/* Stat boxes react to slider; Key Sites box keyed only on island */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"1fr 1fr",gap:"7px",flex:1,minHeight:0}}>

                <StatBox label="Wetland Stability"  value={wetland} icon="💧" color={wetColor}/>
                <StatBox label="Food Availability"  value={food}    icon="🦋" color={foodColor}/>
                <StatBox label="Nesting Conditions" value={nesting} icon="🥚" color={nestColor}/>

                  {/* Key Sites box — keyed only on island, never on slider */}
                  <AnimatePresence mode="wait">
                    <motion.div key={island} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.3}}
                      style={{borderRadius:"10px",border:"2px solid rgba(212,175,55,0.35)",background:"rgba(255,255,255,0.03)",
                        padding:"10px 10px",display:"flex",flexDirection:"column",overflow:"hidden"}}>
                      <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"13px",letterSpacing:"0.09em",textTransform:"uppercase",color:"rgba(212,175,55,0.9)",marginBottom:"8px",fontWeight:700}}>
                        📍 Key Sites
                      </div>
                      <div style={{display:"flex",flexDirection:"column",justifyContent:"space-around",flex:1}}>
                        {ISLANDS[island].sites.map(s=>(
                          <div key={s} style={{fontFamily:"'Playfair Display',serif",fontSize:"18px",color:"rgba(255,255,255,0.9)",lineHeight:1.35,display:"flex",alignItems:"flex-start",gap:"6px",padding:"4px 0",borderBottom:"1px solid rgba(212,175,55,0.1)"}}>
                            <span style={{color:"rgba(193,18,31,0.8)",fontSize:"10px",marginTop:"5px",flexShrink:0}}>◆</span>{s}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>

              </div>

              {/* Footer */}
              {critical?(
                <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.4}}
                  style={{flexShrink:0,padding:"8px 12px",borderRadius:"8px",border:"1px solid rgba(239,68,68,0.4)",background:"rgba(239,68,68,0.07)"}}>
                  <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"11px",letterSpacing:"0.05em",textTransform:"uppercase",color:"rgba(239,68,68,1)",margin:0,animation:"alert-pulse 2s ease-in-out infinite",textAlign:"center"}}>
                    ⚠ Habitat degradation threatens population recovery
                  </p>
                </motion.div>
              ):(
                <div style={{flexShrink:0,padding:"8px 12px",borderRadius:"8px",background:"rgba(193,18,31,0.08)",border:"1px solid rgba(193,18,31,0.3)"}}>
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
