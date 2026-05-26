import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type NodeType = 'apex' | 'prey' | 'competitor' | 'scavenger' | 'producer' | 'decomposer';

type FWNode = {
  id: string;
  label: string;
  emoji: string;
  type: NodeType;
  x: number; // % of web container width
  y: number; // % of web container height
};

const nodes: FWNode[] = [
  { id: 'coot',     label: 'Hawaiian Coot',  emoji: '🦆', type: 'apex',       x: 50, y: 36 },
  { id: 'stilt',    label: 'Hawaiian Stilt',  emoji: '🐦', type: 'competitor', x: 18, y: 38 },
  { id: 'heron',    label: 'Night Heron',     emoji: '🦅', type: 'competitor', x: 82, y: 26 },
  { id: 'mongoose', label: 'Mongoose',        emoji: '🦡', type: 'scavenger',  x: 18, y: 16 },
  { id: 'rats',     label: 'Rats',            emoji: '🐀', type: 'scavenger',  x: 50, y: 10 },
  { id: 'bullfrog', label: 'Bullfrog',        emoji: '🐸', type: 'competitor', x: 82, y: 46 },
  { id: 'insects',  label: 'Aquatic Insects', emoji: '🦟', type: 'prey',       x: 34, y: 60 },
  { id: 'fish',     label: 'Small Fish',      emoji: '🐟', type: 'prey',       x: 66, y: 60 },
  { id: 'snails',   label: 'Snails/\nMollusks', emoji: '🐌', type: 'prey',       x: 50, y: 68 },
  { id: 'algae',    label: 'Algae / Plants',  emoji: '🌿', type: 'producer',   x: 50, y: 91 },
  { id: 'bacteria', label: 'Decomposers',     emoji: '🦠', type: 'decomposer', x: 82, y: 91 },
];

// source is eaten by / flows energy to → target
const edges = [
  { source: 'insects', target: 'coot' },
  { source: 'fish',    target: 'coot' },
  { source: 'algae',   target: 'coot' },
  { source: 'snails',  target: 'coot' },
  { source: 'algae',   target: 'insects' },
  { source: 'algae',   target: 'fish' },
  { source: 'insects', target: 'fish' },
  { source: 'algae',   target: 'snails' },
  { source: 'insects', target: 'stilt' },
  { source: 'fish',    target: 'stilt' },
  { source: 'coot',    target: 'heron' },
  { source: 'fish',    target: 'heron' },
  { source: 'coot',    target: 'mongoose' },
  { source: 'snails',  target: 'mongoose' },
  { source: 'insects', target: 'bullfrog' },
  { source: 'fish',    target: 'bullfrog' },
  { source: 'coot',    target: 'rats' },
  { source: 'algae',   target: 'bacteria' },
];

const nodeStyle: Record<NodeType, { border: string; bg: string; text: string; px: number; emojiPx: number; labelPx: number }> = {
  apex:       { border:"rgba(193,18,31,0.9)",   bg:"rgba(193,18,31,0.2)",   text:"rgba(255,210,210,1)",    px:164, emojiPx:54, labelPx:12 },
  prey:       { border:"rgba(212,175,55,0.55)",  bg:"rgba(5,8,20,0.93)",     text:"rgba(212,175,55,1)",     px:124, emojiPx:42, labelPx:11 },
  competitor: { border:"rgba(193,18,31,0.5)",   bg:"rgba(5,8,20,0.93)",     text:"rgba(255,255,255,0.85)", px:112, emojiPx:38, labelPx:10 },
  scavenger:  { border:"rgba(193,18,31,0.4)",   bg:"rgba(5,8,20,0.93)",     text:"rgba(255,255,255,0.75)", px: 96, emojiPx:32, labelPx:10 },
  producer:   { border:"rgba(34,197,94,0.6)",   bg:"rgba(34,197,94,0.13)",  text:"rgba(134,239,172,1)",    px:124, emojiPx:42, labelPx:11 },
  decomposer: { border:"rgba(212,175,55,0.25)", bg:"rgba(5,8,20,0.93)",     text:"rgba(255,255,255,0.5)",  px: 90, emojiPx:30, labelPx:10 },
};

const legendItems = [
  { color:"rgba(193,18,31,0.9)",  label:"Hawaiian Coot (apex)" },
  { color:"rgba(212,175,55,0.8)", label:"Prey species" },
  { color:"rgba(193,18,31,0.55)", label:"Competitors / Predators" },
  { color:"rgba(34,197,94,0.8)",  label:"Producers (plants/algae)" },
  { color:"rgba(255,255,255,0.4)",label:"Decomposers" },
];

export function FoodWeb() {
  const [hoveredNode, setHoveredNode]   = useState<string | null>(null);
  const [dims, setDims]                 = useState({ w: 900, h: 600 });
  const containerRef                    = useRef<HTMLDivElement>(null);

  // Measure the web container in pixels for accurate arrow alignment
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(entries => {
      for (const e of entries)
        setDims({ w: e.contentRect.width, h: e.contentRect.height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const getConnected = (id: string) => {
    const s = new Set<string>([id]);
    edges.forEach(e => {
      if (e.source === id) s.add(e.target);
      if (e.target === id) s.add(e.source);
    });
    return s;
  };

  const active   = hoveredNode ? getConnected(hoveredNode) : new Set(nodes.map(n => n.id));
  const eats     = hoveredNode ? edges.filter(e => e.target === hoveredNode).map(e => nodes.find(n => n.id === e.source)!) : [];
  const eatenBy  = hoveredNode ? edges.filter(e => e.source === hoveredNode).map(e => nodes.find(n => n.id === e.target)!) : [];
  const hovNode  = hoveredNode ? nodes.find(n => n.id === hoveredNode) : null;

  // ── Arrow endpoint calculation (pixel-precise) ─────────────────────────────
  // Convert node % positions to pixels, trim from each circle edge, convert back to %.
  const getArrowCoords = (src: FWNode, tgt: FWNode) => {
    const sx = src.x / 100 * dims.w,  sy = src.y / 100 * dims.h;
    const tx = tgt.x / 100 * dims.w,  ty = tgt.y / 100 * dims.h;
    const dx = tx - sx, dy = ty - sy;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / len, uy = dy / len;           // unit vector source→target

    const srcR = nodeStyle[src.type].px / 2 + 6;  // start just outside source circle
    const tgtR = nodeStyle[tgt.type].px / 2 + 14; // end just outside target circle (room for arrowhead)

    return {
      x1: ((sx + ux * srcR) / dims.w) * 100,
      y1: ((sy + uy * srcR) / dims.h) * 100,
      x2: ((tx - ux * tgtR) / dims.w) * 100,
      y2: ((ty - uy * tgtR) / dims.h) * 100,
    };
  };

  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", background:"#000000", overflow:"hidden", boxSizing:"border-box" }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ paddingTop:"80px", paddingBottom:"10px", textAlign:"center", flexShrink:0 }}>
        <h1 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"clamp(1.8rem,3vw,2.8rem)", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(212,175,55,1)", margin:0 }}>
          Wetland Food Web
        </h1>
        <p style={{ fontFamily:"'Playfair Display',serif", color:"rgba(255,255,255,0.88)", fontSize:"17px", margin:"4px 0 0" }}>
          Hover any organism — <span style={{ color:"rgba(34,197,94,0.9)" }}>green arrows</span> = what it eats &nbsp;·&nbsp; <span style={{ color:"rgba(239,68,68,0.9)" }}>red arrows</span> = what eats it
        </p>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div style={{ flex:1, display:"flex", overflow:"hidden", minHeight:0 }}>

        {/* ════ WEB AREA ════ */}
        <div ref={containerRef} style={{ flex:1, position:"relative", minWidth:0, minHeight:0 }}>

          {/* SVG arrows */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
            <defs>
              <marker id="arr-default" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0,0.5 L0,6.5 L6.5,3.5 z" fill="rgba(212,175,55,0.4)"/>
              </marker>
              <marker id="arr-eats" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0.5 L0,7.5 L7.5,4 z" fill="rgba(34,197,94,1)"/>
              </marker>
              <marker id="arr-eatenby" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0.5 L0,7.5 L7.5,4 z" fill="rgba(239,68,68,1)"/>
              </marker>
              <marker id="arr-faded" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0,0.5 L0,6.5 L6.5,3.5 z" fill="rgba(212,175,55,0.07)"/>
              </marker>
            </defs>

            {edges.map((edge, i) => {
              const src = nodes.find(n => n.id === edge.source)!;
              const tgt = nodes.find(n => n.id === edge.target)!;
              const { x1, y1, x2, y2 } = getArrowCoords(src, tgt);

              const isEats    = hoveredNode === edge.target; // hovered node eats src
              const isEatenBy = hoveredNode === edge.source; // tgt eats hovered node
              const isActive  = isEats || isEatenBy;
              const isFaded   = !!hoveredNode && !isActive;

              const stroke = isEats ? "rgba(34,197,94,1)" : isEatenBy ? "rgba(239,68,68,1)" : "rgba(212,175,55,0.35)";
              const marker = isFaded ? "url(#arr-faded)" : isEats ? "url(#arr-eats)" : isEatenBy ? "url(#arr-eatenby)" : "url(#arr-default)";

              return (
                <motion.line
                  key={i}
                  x1={`${x1}%`} y1={`${y1}%`}
                  x2={`${x2}%`} y2={`${y2}%`}
                  stroke={stroke}
                  strokeWidth={isActive ? 2.8 : 1.2}
                  opacity={isFaded ? 0.06 : isActive ? 1 : 0.6}
                  markerEnd={marker}
                  initial={{ opacity:0 }}
                  animate={{ opacity: isFaded ? 0.06 : isActive ? 1 : 0.6 }}
                  transition={{ duration:0.35, delay: i * 0.03 }}
                />
              );
            })}
          </svg>

          {/* HTML Nodes */}
          {nodes.map(node => {
            const isActive = active.has(node.id);
            const isFaded  = !!hoveredNode && !isActive;
            const st       = nodeStyle[node.type];

            return (
              <div
                key={node.id}
                style={{
                  position:"absolute", left:`${node.x}%`, top:`${node.y}%`,
                  transform:`translate(-50%,-50%) scale(${isFaded ? 0.88 : 1})`,
                  zIndex: isActive ? 10 : 1,
                  opacity: isFaded ? 0.42 : 1,
                  transition:"opacity 0.3s, transform 0.3s",
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <motion.div
                  style={{
                    width:st.px, height:st.px, borderRadius:"50%",
                    border:`2.5px solid ${isActive && hoveredNode ? "rgba(212,175,55,1)" : st.border}`,
                    background: isActive && hoveredNode ? "rgba(15,0,0,0.97)" : st.bg,
                    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                    cursor:"pointer", textAlign:"center", padding:"8px", boxSizing:"border-box",
                    boxShadow: isActive && hoveredNode
                      ? `0 0 22px ${st.border}, 0 6px 24px rgba(0,0,0,0.7)` : "0 4px 16px rgba(0,0,0,0.5)",
                    fontFamily:"'Josefin Sans',sans-serif",
                  }}
                  whileHover={{ scale:1.12 }}
                  transition={{ type:"spring", stiffness:300, damping:20 }}
                >
                  <span style={{ fontSize:st.emojiPx, lineHeight:1, display:"block" }}>{node.emoji}</span>
                  <span style={{
                    fontSize:st.labelPx, fontWeight:800, letterSpacing:"0.06em",
                    textTransform:"uppercase", lineHeight:1.2, marginTop:"4px",
                    color: isActive && hoveredNode ? "#fff" : st.text, display:"block",
                    whiteSpace:"pre-line",
                  }}>
                    {node.label}
                  </span>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* ════ RIGHT SIDEBAR ════ */}
        <div style={{
          width:"270px", flexShrink:0, display:"flex", flexDirection:"column", gap:"14px",
          padding:"14px 18px 18px", borderLeft:"1px solid rgba(212,175,55,0.18)",
          overflowY:"auto", boxSizing:"border-box",
        }}>

          {/* Legend */}
          <div>
            <p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"13px", letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(212,175,55,1)", margin:"0 0 12px", fontWeight:700 }}>
              Legend
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:"11px" }}>
              {legendItems.map(l => (
                <div key={l.label} style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <div style={{ width:15, height:15, borderRadius:"50%", background:l.color, flexShrink:0, border:"1.5px solid rgba(255,255,255,0.15)" }}/>
                  <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"15px", letterSpacing:"0.04em", color:"rgba(255,255,255,0.8)", lineHeight:1.3 }}>{l.label}</span>
                </div>
              ))}

              {/* Arrow key */}
              <div style={{ display:"flex", alignItems:"flex-start", gap:"10px", marginTop:"2px" }}>
                <div style={{ display:"flex", flexDirection:"column", gap:"6px", flexShrink:0, paddingTop:"2px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
                    <div style={{ width:22, height:3, background:"rgba(34,197,94,1)", borderRadius:2 }}/>
                    <span style={{ fontSize:"12px", color:"rgba(34,197,94,1)" }}>▶</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
                    <div style={{ width:22, height:3, background:"rgba(239,68,68,1)", borderRadius:2 }}/>
                    <span style={{ fontSize:"12px", color:"rgba(239,68,68,1)" }}>▶</span>
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                  <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"14px", color:"rgba(34,197,94,0.9)", lineHeight:1.3 }}>Eats (outgoing)</span>
                  <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"14px", color:"rgba(239,68,68,0.9)", lineHeight:1.3 }}>Eaten by (incoming)</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ height:"1px", background:"rgba(212,175,55,0.2)", flexShrink:0 }}/>

          {/* Who Eats Whom */}
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"13px", letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(212,175,55,1)", margin:"0 0 12px", fontWeight:700 }}>
              Who Eats Whom
            </p>

            <AnimatePresence mode="wait">
              {!hovNode ? (
                <motion.div
                  key="hint"
                  initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  style={{ padding:"16px", borderRadius:"10px", border:"1px dashed rgba(212,175,55,0.25)", textAlign:"center" }}
                >
                  <span style={{ fontSize:"30px" }}>👆</span>
                  <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"16px", color:"rgba(255,255,255,0.45)", margin:"10px 0 0", lineHeight:1.55 }}>
                    Hover any organism to see its feeding relationships
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={hovNode.id}
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                  transition={{ duration:0.22 }}
                >
                  {/* Badge */}
                  <div style={{
                    display:"flex", alignItems:"center", gap:"12px",
                    padding:"12px 14px", borderRadius:"10px",
                    background: nodeStyle[hovNode.type].bg,
                    border:`1.5px solid ${nodeStyle[hovNode.type].border}`,
                    marginBottom:"16px",
                  }}>
                    <span style={{ fontSize:"34px", lineHeight:1 }}>{hovNode.emoji}</span>
                    <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"15px", fontWeight:800, letterSpacing:"0.06em", textTransform:"uppercase", color:nodeStyle[hovNode.type].text, lineHeight:1.25 }}>
                      {hovNode.label}
                    </span>
                  </div>

                  {/* Eats list */}
                  {eats.length > 0 && (
                    <div style={{ marginBottom:"14px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"7px", marginBottom:"8px" }}>
                        <div style={{ width:16, height:3, background:"rgba(34,197,94,1)", borderRadius:2 }}/>
                        <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"13px", letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(34,197,94,1)", fontWeight:700 }}>
                          Eats
                        </span>
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:"7px", paddingLeft:"6px" }}>
                        {eats.map(n => (
                          <div key={n.id} style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                            <span style={{ fontSize:"22px", lineHeight:1 }}>{n.emoji}</span>
                            <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"15px", color:"rgba(255,255,255,0.85)", letterSpacing:"0.03em", whiteSpace:"pre-line" }}>{n.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Eaten-by list */}
                  {eatenBy.length > 0 && (
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:"7px", marginBottom:"8px" }}>
                        <div style={{ width:16, height:3, background:"rgba(239,68,68,1)", borderRadius:2 }}/>
                        <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"13px", letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(239,68,68,1)", fontWeight:700 }}>
                          Eaten By
                        </span>
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:"7px", paddingLeft:"6px" }}>
                        {eatenBy.map(n => (
                          <div key={n.id} style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                            <span style={{ fontSize:"22px", lineHeight:1 }}>{n.emoji}</span>
                            <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"15px", color:"rgba(255,255,255,0.85)", letterSpacing:"0.03em", whiteSpace:"pre-line" }}>{n.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {eats.length === 0 && eatenBy.length === 0 && (
                    <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"16px", color:"rgba(255,255,255,0.4)", margin:0 }}>No direct connections found.</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
