import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import habitatImg from "@/assets/habitat.png";

// ── Island data ──────────────────────────────────────────────────────────────
const ISLANDS = {
  Oahu:            { tempLow:24, tempHigh:32, rainLow:500,  rainHigh:1500, biome:"Coastal wetlands, fishponds, urban refuges",             sites:["James Campbell NWR","Pearl Harbor NWR","Hamakua Marsh"],      wetland:62, food:70, nesting:58 },
  Maui:            { tempLow:22, tempHigh:31, rainLow:500,  rainHigh:2000, biome:"Coastal ponds, taro fields, brackish lagoons",            sites:["Kanaha Pond","Kealia Pond NWR","Waiehu Marsh"],               wetland:74, food:78, nesting:72 },
  Kauai:           { tempLow:21, tempHigh:30, rainLow:1000, rainHigh:2000, biome:"River valleys, taro paddies, lush inland marshes",        sites:["Hanalei NWR","Huleia NWR","Alakai Swamp edges"],              wetland:88, food:85, nesting:82 },
  "Hawaii Island": { tempLow:23, tempHigh:32, rainLow:500,  rainHigh:1800, biome:"Lowland wetlands, brackish ponds, lava-bordered marshes", sites:["Waipio Valley","Keokea Beach ponds","Hamakua Coast marshes"], wetland:65, food:60, nesting:63 },
};
type IslandKey = keyof typeof ISLANDS;

const lerp = (a:number,b:number,t:number) => Math.round(a+(b-a)*t);

const RAIN_DROPS = Array.from({length:18},(_,i)=>({ delay:(i*0.19)%2, left:(i*23+7)%96, dur:0.75+(i%4)*0.15 }));
const HEAT_WAVES = [{delay:0,top:25},{delay:0.7,top:52},{delay:1.4,top:72}];

function ImpactBar({label,value,color,icon}:{label:string;value:number;color:string;icon:string}) {
  return (
    <div style={{marginBottom:"14px"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}>
        <span style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"13px",letterSpacing:"0.08em",textTransform:"uppercase",color:"rgba(212,175,55,0.85)"}}>{icon} {label}</span>
        <span style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"14px",fontWeight:700,color}}>{value}%</span>
      </div>
      <div style={{height:"9px",borderRadius:"5px",background:"rgba(255,255,255,0.08)",overflow:"hidden"}}>
        <motion.div animate={{width:`${value}%`}} transition={{duration:0.6,ease:"easeOut"}}
          style={{height:"100%",borderRadius:"5px",background:`linear-gradient(to right,${color}55,${color})`}}/>
      </div>
    </div>
  );
}

export function Habitat() {
  const [island, setIsland]   = useState<IslandKey>("Maui");
  const [slider, setSlider]   = useState(0);
  const [tempHover, setTempHover] = useState(false);
  const [rainHover, setRainHover] = useState(false);
  const d = ISLANDS[island];

  const deg  = slider/100;
  const hlth = 1-deg;

  const tempLow  = d.tempLow  + Math.round(deg*9);
  const tempHigh = d.tempHigh + Math.round(deg*9);
  const rainLow  = Math.max(80,  Math.round(d.rainLow  * hlth));
  const rainHigh = Math.max(200, Math.round(d.rainHigh * hlth));

  const wetland = Math.round(d.wetland * hlth);
  const food    = Math.round(d.food    * hlth);
  const nesting = Math.round(d.nesting * hlth);

  const warn     = slider > 55;
  const critical = slider > 80;
  const rainActive = slider < 75;
  const rainCount  = Math.round(RAIN_DROPS.length * Math.max(0,(75-slider)/75));

  const sliderStatus =
    slider < 20 ? { label:"✓ Healthy Climate",   color:"rgba(34,197,94,1)"   } :
    slider < 50 ? { label:"Mild Stress",           color:"rgba(212,175,55,1)"  } :
    slider < 75 ? { label:"⚠ High Risk",           color:"rgba(239,140,68,1)"  } :
                  { label:"🔴 Critical",            color:"rgba(239,68,68,1)"   };

  const edMsg =
    slider < 25 ? "Stable climate supports long-term survival and reproduction of the Hawaiian Coot." :
    slider < 50 ? "Higher temperatures increase evaporation and shrink wetlands used for nesting." :
    slider < 75 ? "Reduced rainfall causes freshwater habitats to dry, threatening food and nesting." :
                  "Critical climate change: habitat degradation reduces nesting success and threatens population recovery.";

  return (
    <>
      <style>{`
        @keyframes rain-fall  {0%{transform:translateY(-10px);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateY(155px);opacity:0}}
        @keyframes heat-wave  {0%{transform:scaleX(0.3) translateX(-30%);opacity:0}50%{transform:scaleX(1) translateX(0);opacity:1}100%{transform:scaleX(0.3) translateX(30%);opacity:0}}
        @keyframes ripple     {0%{transform:scale(0.5);opacity:0.7}100%{transform:scale(2.2);opacity:0}}
        @keyframes alert-pulse{0%,100%{opacity:0.5}50%{opacity:1}}
        .v-slider{writing-mode:vertical-lr;direction:rtl;-webkit-appearance:slider-vertical;
          height:100%;width:28px;cursor:pointer;outline:none;border:none;background:transparent;padding:0}
        .v-slider::-webkit-slider-runnable-track{width:8px;border-radius:4px;background:linear-gradient(to top,rgba(34,197,94,0.8),rgba(212,175,55,0.8),rgba(239,120,68,0.8),rgba(239,68,68,1))}
        .v-slider::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;border:2px solid rgba(212,175,55,0.9);background:rgba(20,10,5,1);cursor:pointer;margin-left:-7px}
        .v-slider::-moz-range-track{width:8px;border-radius:4px;background:linear-gradient(to top,rgba(34,197,94,0.8),rgba(212,175,55,0.8),rgba(239,120,68,0.8),rgba(239,68,68,1))}
        .v-slider::-moz-range-thumb{width:20px;height:20px;border-radius:50%;border:2px solid rgba(212,175,55,0.9);background:rgba(20,10,5,1);cursor:pointer}
      `}</style>

      {/* ── Full-viewport container ──────────────────────────────────────────── */}
      <div style={{height:"100vh",paddingTop:"68px",overflow:"hidden",display:"flex",flexDirection:"column",boxSizing:"border-box",padding:"68px 18px 12px 18px",gap:"10px"}}>

        {/* Header row */}
        <div style={{textAlign:"center",flexShrink:0}}>
          <h1 style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"clamp(1.6rem,2.5vw,2.4rem)",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(212,175,55,1)",margin:"0 0 4px"}}>
            Habitat & Location
          </h1>
          <p style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(0.85rem,1.1vw,1rem)",color:"rgba(255,255,255,0.7)",margin:0}}>
            The Hawaiian Coot's domain spans the fragile freshwater and brackish wetlands across the Hawaiian Islands.
          </p>
        </div>

        {/* Island selector */}
        <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"8px",flexShrink:0}}>
          {(Object.keys(ISLANDS) as IslandKey[]).map(name=>(
            <button key={name} onClick={()=>setIsland(name)} style={{
              fontFamily:"'Josefin Sans',sans-serif",fontSize:"12px",letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:700,
              padding:"6px 16px",borderRadius:"999px",
              border:`2px solid ${island===name?"rgba(212,175,55,1)":"rgba(212,175,55,0.3)"}`,
              background:island===name?"rgba(212,175,55,0.15)":"rgba(3,5,14,0.8)",
              color:island===name?"rgba(212,175,55,1)":"rgba(212,175,55,0.5)",
              cursor:"pointer",transition:"all 0.2s",
              boxShadow:island===name?"0 0 16px rgba(212,175,55,0.25)":"none",
            }}>{name}</button>
          ))}
        </div>

        {/* ── 3-column main ───────────────────────────────────────────────────── */}
        <div style={{flex:1,minHeight:0,display:"grid",gridTemplateColumns:"1fr 1.1fr 1.2fr",gap:"12px"}}>

          {/* ── COL 1 — Climate Change Simulator ─────────────────────────────── */}
          <div style={{display:"flex",flexDirection:"column",gap:"8px",minHeight:0,overflow:"hidden"}}>
            <h2 style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"13px",letterSpacing:"0.12em",textTransform:"uppercase",color:sliderStatus.color,margin:0,flexShrink:0,textAlign:"center"}}>
              🌡 Climate Change Simulator
            </h2>

            <div style={{flex:1,minHeight:0,display:"flex",gap:"10px",borderRadius:"14px",border:`2px solid ${critical?"rgba(239,68,68,0.5)":warn?"rgba(239,140,68,0.4)":"rgba(212,175,55,0.2)"}`,background:"rgba(3,5,14,0.95)",padding:"12px",overflow:"hidden"}}>

              {/* Vertical slider column */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"8px",flexShrink:0,width:"48px"}}>
                <span style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"10px",letterSpacing:"0.06em",textTransform:"uppercase",color:"rgba(239,68,68,0.8)",textAlign:"center",lineHeight:1.2}}>Severe</span>
                <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",minHeight:0}}>
                  <input type="range" min={0} max={100} value={slider} onChange={e=>setSlider(Number(e.target.value))} className="v-slider"/>
                </div>
                <span style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"10px",letterSpacing:"0.06em",textTransform:"uppercase",color:"rgba(34,197,94,0.8)",textAlign:"center",lineHeight:1.2}}>Healthy</span>
              </div>

              {/* Scene + info */}
              <div style={{flex:1,minHeight:0,display:"flex",flexDirection:"column",gap:"8px",overflow:"hidden"}}>
                {/* Habitat mini-scene */}
                <div style={{flex:1,minHeight:0,borderRadius:"10px",overflow:"hidden",position:"relative"}}>
                  <img src={habitatImg} alt="Habitat" style={{width:"100%",height:"100%",objectFit:"cover",
                    filter:`saturate(${1-deg*0.75}) brightness(${1-deg*0.38}) sepia(${deg*0.55})`,transition:"filter 0.4s"}}/>
                  {slider>50&&<div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(45deg,rgba(120,60,10,0.1) 0,rgba(120,60,10,0.1) 2px,transparent 2px,transparent 28px),repeating-linear-gradient(-45deg,rgba(120,60,10,0.1) 0,rgba(120,60,10,0.1) 2px,transparent 2px,transparent 28px)",opacity:(slider-50)/50*0.6}}/>}
                  {critical&&<div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 50%,transparent 40%,rgba(239,68,68,0.25) 100%)",animation:"alert-pulse 2s ease-in-out infinite"}}/>}
                  {slider<60&&[0,1].map(i=><div key={i} style={{position:"absolute",bottom:`${16+i*14}%`,left:`${28+i*15}%`,width:"50px",height:"16px",borderRadius:"50%",border:"2px solid rgba(59,130,246,0.45)",opacity:0.5-deg*0.4,animation:`ripple ${1.3+i*0.5}s ease-out ${i*0.6}s infinite`}}/>)}
                </div>

                {/* Status + message */}
                <div style={{flexShrink:0}}>
                  <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"13px",fontWeight:700,color:sliderStatus.color,marginBottom:"4px"}}>{sliderStatus.label}</div>
                  <AnimatePresence mode="wait">
                    <motion.p key={Math.floor(slider/25)} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.3}}
                      style={{fontFamily:"'Playfair Display',serif",fontSize:"12px",color:"rgba(255,255,255,0.72)",lineHeight:1.5,borderLeft:`3px solid ${sliderStatus.color}`,paddingLeft:"8px",margin:0}}>
                      {edMsg}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* ── COL 2 — Climate Profile ───────────────────────────────────────── */}
          <div style={{display:"flex",flexDirection:"column",gap:"8px",minHeight:0,overflow:"hidden"}}>
            <h2 style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"13px",letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(212,175,55,1)",margin:0,flexShrink:0,textAlign:"center"}}>
              🌤 Climate Profile
            </h2>

            {/* Temperature card — FIXED height, tooltip as absolute overlay */}
            <div onMouseEnter={()=>setTempHover(true)} onMouseLeave={()=>setTempHover(false)}
              style={{flex:1,minHeight:0,position:"relative",overflow:"hidden",borderRadius:"14px",
                border:`2px solid ${tempHover||critical?"rgba(239,68,68,0.9)":"rgba(193,18,31,0.5)"}`,
                background:"rgba(3,5,14,0.97)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                boxShadow:tempHover||critical?"0 0 36px rgba(239,68,68,0.4)":"none",
                transition:"border-color 0.3s,box-shadow 0.3s",cursor:"default"}}>

              {(tempHover||warn)&&HEAT_WAVES.map((w,i)=>(
                <div key={i} style={{position:"absolute",left:"8%",top:`${w.top}%`,width:"84%",height:"2px",borderRadius:"50%",background:"linear-gradient(to right,transparent,rgba(239,68,68,0.4),transparent)",animation:`heat-wave 1.9s ease-in-out ${w.delay}s infinite`,pointerEvents:"none"}}/>
              ))}

              <svg width="30" height="56" viewBox="0 0 36 64" style={{marginBottom:"8px",flexShrink:0}}>
                <rect x="14" y="4" width="8" height="38" rx="4" fill="rgba(255,255,255,0.06)" stroke="rgba(193,18,31,0.5)" strokeWidth="1.5"/>
                <rect x="15.5" y={tempHover?"8":slider>50?"16":"26"} width="5" rx="2.5"
                  height={tempHover?"34":slider>50?"26":"16"}
                  fill="rgba(239,68,68,0.85)" style={{transition:"all 0.8s ease"}}/>
                <circle cx="18" cy="50" r="10" fill="rgba(239,68,68,0.85)"/>
                <circle cx="18" cy="50" r="6" fill={tempHover||critical?"rgba(255,80,80,1)":"rgba(239,68,68,0.9)"} style={{transition:"fill 0.3s"}}/>
              </svg>

              <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"clamp(1.6rem,2.2vw,2.2rem)",fontWeight:700,color:"rgba(239,68,68,1)",lineHeight:1,marginBottom:"4px"}}>
                {tempLow}–{tempHigh}°C
              </div>
              <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"11px",letterSpacing:"0.14em",textTransform:"uppercase",color:"rgba(212,175,55,0.75)",margin:0}}>
                Year-round Temperature
              </p>
              {critical&&!tempHover&&<div style={{marginTop:"8px",fontFamily:"'Josefin Sans',sans-serif",fontSize:"11px",letterSpacing:"0.07em",color:"rgba(239,68,68,0.9)",animation:"alert-pulse 1.8s ease-in-out infinite"}}>⚠ ELEVATED DANGER</div>}

              {/* Hover tooltip — absolute, doesn't shift layout */}
              <AnimatePresence>
                {tempHover&&(
                  <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.25}}
                    style={{position:"absolute",bottom:0,left:0,right:0,padding:"12px 14px",background:"rgba(3,5,14,0.92)",borderTop:"1px solid rgba(239,68,68,0.3)"}}>
                    <p style={{fontFamily:"'Playfair Display',serif",fontSize:"12.5px",color:"rgba(255,255,255,0.8)",lineHeight:1.5,margin:0}}>
                      Warm tropical temperatures allow wetlands and taro fields to remain active year-round, supporting feeding and nesting.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Rainfall card — FIXED height */}
            <div onMouseEnter={()=>setRainHover(true)} onMouseLeave={()=>setRainHover(false)}
              style={{flex:1,minHeight:0,position:"relative",overflow:"hidden",borderRadius:"14px",
                border:`2px solid ${rainHover?"rgba(59,130,246,0.9)":critical?"rgba(239,120,68,0.7)":"rgba(212,175,55,0.4)"}`,
                background:"rgba(3,5,14,0.97)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                boxShadow:rainHover?"0 0 36px rgba(59,130,246,0.4)":critical?"0 0 24px rgba(239,68,68,0.25)":"none",
                transition:"border-color 0.3s,box-shadow 0.3s",cursor:"default"}}>

              {rainHover&&rainActive&&RAIN_DROPS.slice(0,rainCount).map((dr,i)=>(
                <div key={i} style={{position:"absolute",left:`${dr.left}%`,top:"-10px",width:"2px",height:"13px",borderRadius:"2px",background:"linear-gradient(to bottom,transparent,rgba(59,130,246,0.85))",animation:`rain-fall ${dr.dur}s linear ${dr.delay}s infinite`,pointerEvents:"none"}}/>
              ))}
              {rainHover&&rainActive&&<div style={{position:"absolute",bottom:"12px",left:"50%",transform:"translateX(-50%)",width:"52px",height:"16px",borderRadius:"50%",border:"2px solid rgba(59,130,246,0.5)",animation:"ripple 1.4s ease-out infinite",pointerEvents:"none"}}/>}

              <svg width="46" height="32" viewBox="0 0 52 36" style={{marginBottom:"8px",flexShrink:0}}>
                <ellipse cx="26" cy="24" rx="22" ry="10" fill={rainHover?"rgba(59,130,246,0.25)":rainActive?"rgba(59,130,246,0.12)":"rgba(120,80,30,0.2)"} stroke={rainActive?"rgba(59,130,246,0.5)":"rgba(150,80,30,0.5)"} strokeWidth="1.5" style={{transition:"all 0.5s"}}/>
                <ellipse cx="18" cy="19" rx="12" ry="9" fill={rainHover?"rgba(59,130,246,0.3)":rainActive?"rgba(59,130,246,0.15)":"rgba(120,80,30,0.2)"} stroke={rainActive?"rgba(59,130,246,0.5)":"rgba(150,80,30,0.5)"} strokeWidth="1.5" style={{transition:"all 0.5s"}}/>
                <ellipse cx="32" cy="17" rx="10" ry="9" fill={rainHover?"rgba(59,130,246,0.3)":rainActive?"rgba(59,130,246,0.15)":"rgba(120,80,30,0.2)"} stroke={rainActive?"rgba(59,130,246,0.5)":"rgba(150,80,30,0.5)"} strokeWidth="1.5" style={{transition:"all 0.5s"}}/>
                {rainHover&&rainActive&&<>
                  <line x1="18" y1="33" x2="16" y2="40" stroke="rgba(59,130,246,0.8)" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="26" y1="33" x2="24" y2="40" stroke="rgba(59,130,246,0.8)" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="34" y1="33" x2="32" y2="40" stroke="rgba(59,130,246,0.8)" strokeWidth="2" strokeLinecap="round"/>
                </>}
              </svg>

              <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"clamp(1.4rem,2vw,2rem)",fontWeight:700,color:rainActive?"rgba(212,175,55,1)":"rgba(180,80,30,1)",lineHeight:1,marginBottom:"4px",transition:"color 0.4s"}}>
                {rainLow}–{rainHigh} mm
              </div>
              <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"11px",letterSpacing:"0.14em",textTransform:"uppercase",color:"rgba(212,175,55,0.75)",margin:0}}>
                Annual Rainfall
              </p>
              {critical&&!rainHover&&<div style={{marginTop:"8px",fontFamily:"'Josefin Sans',sans-serif",fontSize:"11px",letterSpacing:"0.07em",color:"rgba(239,120,68,0.9)",animation:"alert-pulse 1.8s ease-in-out infinite"}}>⚠ DRY CONDITIONS</div>}

              <AnimatePresence>
                {rainHover&&(
                  <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.25}}
                    style={{position:"absolute",bottom:0,left:0,right:0,padding:"12px 14px",background:"rgba(3,5,14,0.92)",borderTop:"1px solid rgba(59,130,246,0.3)",zIndex:2}}>
                    <p style={{fontFamily:"'Playfair Display',serif",fontSize:"12.5px",color:"rgba(255,255,255,0.8)",lineHeight:1.5,margin:0}}>
                      {rainActive?"Rainfall maintains freshwater wetlands essential for feeding and nesting.":"Reduced rainfall causes freshwater habitats to dry, threatening food sources and nesting areas."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── COL 3 — Impact Meter + Location ──────────────────────────────── */}
          <div style={{display:"flex",flexDirection:"column",gap:"8px",minHeight:0,overflow:"hidden"}}>
            <h2 style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"13px",letterSpacing:"0.12em",textTransform:"uppercase",color:critical?"rgba(239,68,68,1)":warn?"rgba(239,140,68,1)":"rgba(212,175,55,1)",margin:0,flexShrink:0,textAlign:"center"}}>
              🌿 Habitat Impact Meter
            </h2>

            <div style={{flex:1,minHeight:0,display:"flex",flexDirection:"column",borderRadius:"14px",border:`2px solid ${critical?"rgba(239,68,68,0.35)":warn?"rgba(239,140,68,0.3)":"rgba(212,175,55,0.2)"}`,background:"rgba(3,5,14,0.95)",padding:"14px 16px",overflow:"hidden",gap:"6px"}}>

              {/* Impact bars */}
              <AnimatePresence mode="wait">
                <motion.div key={`${island}-${Math.floor(slider/5)}`} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}} style={{flexShrink:0}}>
                  <ImpactBar label="Wetland Stability"  value={wetland} icon="💧" color={wetland>60?"rgba(34,197,94,1)":wetland>35?"rgba(212,175,55,1)":"rgba(239,68,68,1)"}/>
                  <ImpactBar label="Food Availability"  value={food}    icon="🦋" color={food>60?"rgba(212,175,55,1)":food>35?"rgba(239,140,68,1)":"rgba(239,68,68,1)"}/>
                  <ImpactBar label="Nesting Conditions" value={nesting} icon="🥚" color={nesting>60?"rgba(59,130,246,1)":nesting>35?"rgba(239,140,68,1)":"rgba(239,68,68,1)"}/>
                </motion.div>
              </AnimatePresence>

              {/* Divider */}
              <div style={{height:"1px",background:"rgba(212,175,55,0.12)",flexShrink:0}}/>

              {/* Island info */}
              <AnimatePresence mode="wait">
                <motion.div key={island} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.35}} style={{flex:1,minHeight:0,overflow:"hidden"}}>
                  <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"15px",fontWeight:700,letterSpacing:"0.08em",color:"rgba(212,175,55,1)",marginBottom:"3px"}}>{island}</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:"12.5px",color:"rgba(255,255,255,0.5)",fontStyle:"italic",marginBottom:"10px"}}>{ISLANDS[island].biome}</div>
                  <div style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"11px",letterSpacing:"0.08em",textTransform:"uppercase",color:"rgba(212,175,55,0.6)",marginBottom:"6px"}}>Key Sites</div>
                  {ISLANDS[island].sites.map(s=>(
                    <div key={s} style={{fontFamily:"'Playfair Display',serif",fontSize:"13px",color:"rgba(255,255,255,0.78)",padding:"3px 0",borderBottom:"1px solid rgba(212,175,55,0.07)",display:"flex",alignItems:"center",gap:"6px"}}>
                      <span style={{color:"rgba(193,18,31,0.7)",fontSize:"8px"}}>◆</span>{s}
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Warning bar */}
              {critical&&(
                <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.4}}
                  style={{flexShrink:0,padding:"8px 10px",borderRadius:"8px",border:"1px solid rgba(239,68,68,0.4)",background:"rgba(239,68,68,0.07)"}}>
                  <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:"11px",letterSpacing:"0.06em",textTransform:"uppercase",color:"rgba(239,68,68,1)",margin:0,animation:"alert-pulse 2s ease-in-out infinite",textAlign:"center"}}>
                    ⚠ Habitat degradation threatens long-term population recovery
                  </p>
                </motion.div>
              )}

              {/* Wetlands stat */}
              <div style={{flexShrink:0,padding:"8px 10px",borderRadius:"8px",background:"rgba(193,18,31,0.08)",border:"1px solid rgba(193,18,31,0.3)"}}>
                <p style={{fontFamily:"'Playfair Display',serif",fontSize:"13px",color:"rgba(212,175,55,1)",fontWeight:700,margin:0}}>
                  70% of original Hawaiian wetlands lost to development.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
