import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type NodeType = 'apex' | 'prey' | 'competitor' | 'scavenger' | 'producer' | 'decomposer';

type FWNode = {
  id: string;
  label: string;
  emoji: string;
  type: NodeType;
  x: number; // % of web container
  y: number;
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
  { id: 'snails',   label: 'Snails/Mollusks', emoji: '🐌', type: 'prey',       x: 50, y: 76 },
  { id: 'algae',    label: 'Algae / Plants',  emoji: '🌿', type: 'producer',   x: 50, y: 91 },
  { id: 'bacteria', label: 'Decomposers',     emoji: '🦠', type: 'decomposer', x: 82, y: 91 },
];

// source is eaten by / flows energy to target
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
  apex:       { border:"rgba(193,18,31,0.9)",   bg:"rgba(193,18,31,0.2)",   text:"rgba(255,210,210,1)", px:136, emojiPx:44, labelPx:10 },
  prey:       { border:"rgba(212,175,55,0.55)",  bg:"rgba(5,8,20,0.93)",     text:"rgba(212,175,55,1)",  px:100, emojiPx:34, labelPx: 9 },
  competitor: { border:"rgba(193,18,31,0.5)",   bg:"rgba(5,8,20,0.93)",     text:"rgba(255,255,255,0.85)", px:90, emojiPx:30, labelPx:8 },
  scavenger:  { border:"rgba(193,18,31,0.4)",   bg:"rgba(5,8,20,0.93)",     text:"rgba(255,255,255,0.75)", px:78, emojiPx:26, labelPx:8 },
  producer:   { border:"rgba(34,197,94,0.6)",   bg:"rgba(34,197,94,0.13)",  text:"rgba(134,239,172,1)", px:100, emojiPx:34, labelPx:9 },
  decomposer: { border:"rgba(212,175,55,0.25)", bg:"rgba(5,8,20,0.93)",     text:"rgba(255,255,255,0.5)", px:72, emojiPx:22, labelPx:8 },
};

const legendItems = [
  { color:"rgba(193,18,31,0.9)",  label:"Hawaiian Coot (apex)" },
  { color:"rgba(212,175,55,0.8)", label:"Prey species" },
  { color:"rgba(193,18,31,0.55)", label:"Competitors / Predators" },
  { color:"rgba(34,197,94,0.8)",  label:"Producers (plants/algae)" },
  { color:"rgba(255,255,255,0.4)",label:"Decomposers" },
];

export function FoodWeb() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const getConnected = (id: string) => {
    const s = new Set<string>([id]);
    edges.forEach(e => {
      if (e.source === id) s.add(e.target);
      if (e.target === id) s.add(e.source);
    });
    return s;
  };

  const active = hoveredNode ? getConnected(hoveredNode) : new Set(nodes.map(n => n.id));

  // Who does the hovered node eat, and who eats it?
  const eats    = hoveredNode ? edges.filter(e => e.target === hoveredNode).map(e => nodes.find(n => n.id === e.source)!) : [];
  const eatenBy = hoveredNode ? edges.filter(e => e.source === hoveredNode).map(e => nodes.find(n => n.id === e.target)!) : [];
  const hovNode = hoveredNode ? nodes.find(n => n.id === hoveredNode) : null;

  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", background:"#000000", overflow:"hidden", boxSizing:"border-box" }}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div style={{ paddingTop:"52px", paddingBottom:"10px", textAlign:"center", flexShrink:0 }}>
        <h1 style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"clamp(1.8rem,3vw,2.8rem)", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(212,175,55,1)", margin:0 }}>
          Wetland Food Web
        </h1>
        <p style={{ fontFamily:"'Playfair Display',serif", color:"rgba(255,255,255,0.55)", fontSize:"14px", margin:"4px 0 0" }}>
          Hover any organism — <span style={{ color:"rgba(34,197,94,0.9)" }}>green arrows</span> = what it eats &nbsp;·&nbsp; <span style={{ color:"rgba(239,68,68,0.9)" }}>red arrows</span> = what eats it
        </p>
      </div>

      {/* ── Body ───────────────────────────────────────────────── */}
      <div style={{ flex:1, display:"flex", overflow:"hidden", minHeight:0 }}>

        {/* ════ WEB AREA ════ */}
        <div style={{ flex:1, position:"relative", minWidth:0, minHeight:0 }}>

          {/* SVG arrows */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
            <defs>
              <marker id="arr-default" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0,0.5 L0,6.5 L6.5,3.5 z" fill="rgba(212,175,55,0.35)"/>
              </marker>
              <marker id="arr-eats" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0.5 L0,7.5 L7.5,4 z" fill="rgba(34,197,94,1)"/>
              </marker>
              <marker id="arr-eatenby" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0.5 L0,7.5 L7.5,4 z" fill="rgba(239,68,68,1)"/>
              </marker>
              <marker id="arr-faded" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0,0.5 L0,6.5 L6.5,3.5 z" fill="rgba(212,175,55,0.08)"/>
              </marker>
            </defs>

            {edges.map((edge, i) => {
              const src = nodes.find(n => n.id === edge.source)!;
              const tgt = nodes.find(n => n.id === edge.target)!;

              // Arrow classification relative to hovered node
              const isEats   = hoveredNode === edge.target; // hovered node eats source
              const isEatenBy = hoveredNode === edge.source; // something eats hovered node
              const isHovered = isEats || isEatenBy;
              const isFaded  = !!hoveredNode && !isHovered;

              const dx = tgt.x - src.x, dy = tgt.y - src.y;
              const len = Math.sqrt(dx*dx + dy*dy) || 1;
              const trim = 5;
              const x2 = tgt.x - (dx/len)*trim;
              const y2 = tgt.y - (dy/len)*trim;

              const stroke = isEats
                ? "rgba(34,197,94,1)"
                : isEatenBy
                  ? "rgba(239,68,68,1)"
                  : "rgba(212,175,55,0.28)";

              const marker = isFaded
                ? "url(#arr-faded)"
                : isEats
                  ? "url(#arr-eats)"
                  : isEatenBy
                    ? "url(#arr-eatenby)"
                    : "url(#arr-default)";

              return (
                <g key={i}>
                  <motion.line
                    x1={`${src.x}%`} y1={`${src.y}%`}
                    x2={`${x2}%`}   y2={`${y2}%`}
                    stroke={stroke}
                    strokeWidth={isHovered ? 3 : 1.2}
                    opacity={isFaded ? 0.06 : isHovered ? 1 : 0.55}
                    markerEnd={marker}
                    initial={{ opacity:0 }}
                    animate={{ opacity: isFaded ? 0.06 : isHovered ? 1 : 0.55 }}
                    transition={{ duration:0.4, delay: i*0.03 }}
                  />
                  {isHovered && (
                    <circle r="4" fill={isEats ? "rgba(34,197,94,1)" : "rgba(239,68,68,1)"}>
                      <animateMotion
                        dur="1.6s"
                        repeatCount="indefinite"
                        path={`M ${src.x * window.innerWidth / 100} ${src.y * window.innerHeight / 100} L ${x2 * window.innerWidth / 100} ${y2 * window.innerHeight / 100}`}
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* HTML Nodes */}
          {nodes.map(node => {
            const isActive = active.has(node.id);
            const isFaded  = !!hoveredNode && !isActive;
            const st = nodeStyle[node.type];

            return (
              <div
                key={node.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left:`${node.x}%`, top:`${node.y}%`,
                  zIndex: isActive ? 10 : 1,
                  transition:"opacity 0.3s, transform 0.3s",
                  opacity: isFaded ? 0.12 : 1,
                  transform: `translate(-50%,-50%) scale(${isFaded ? 0.88 : 1})`,
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <motion.div
                  style={{
                    width: st.px, height: st.px, borderRadius:"50%",
                    border:`2.5px solid ${isActive && hoveredNode ? "rgba(212,175,55,1)" : st.border}`,
                    background: isActive && hoveredNode ? "rgba(15,0,0,0.97)" : st.bg,
                    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                    cursor:"pointer", textAlign:"center", padding:"8px", boxSizing:"border-box",
                    boxShadow: isActive && hoveredNode
                      ? `0 0 22px ${st.border}, 0 6px 24px rgba(0,0,0,0.7)`
                      : "0 4px 16px rgba(0,0,0,0.5)",
                    fontFamily:"'Josefin Sans',sans-serif",
                  }}
                  whileHover={{ scale:1.14 }}
                  transition={{ type:"spring", stiffness:300, damping:20 }}
                >
                  <span style={{ fontSize: st.emojiPx, lineHeight:1, display:"block" }}>
                    {node.emoji}
                  </span>
                  <span style={{
                    fontSize: st.labelPx, fontWeight:800, letterSpacing:"0.06em",
                    textTransform:"uppercase", lineHeight:1.2, marginTop:"4px",
                    color: isActive && hoveredNode ? "#fff" : st.text,
                    display:"block",
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
          width:"260px", flexShrink:0, display:"flex", flexDirection:"column", gap:"12px",
          padding:"12px 16px 16px", borderLeft:"1px solid rgba(212,175,55,0.18)",
          overflowY:"auto", boxSizing:"border-box",
        }}>

          {/* Legend */}
          <div>
            <p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"10px", letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(212,175,55,0.7)", margin:"0 0 10px", fontWeight:700 }}>
              Legend
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              {legendItems.map(l => (
                <div key={l.label} style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <div style={{ width:14, height:14, borderRadius:"50%", background:l.color, flexShrink:0, border:"1.5px solid rgba(255,255,255,0.15)" }}/>
                  <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"12px", letterSpacing:"0.06em", color:"rgba(255,255,255,0.75)", lineHeight:1.3 }}>{l.label}</span>
                </div>
              ))}
              <div style={{ display:"flex", alignItems:"center", gap:"10px", marginTop:"2px" }}>
                <div style={{ display:"flex", flexDirection:"column", gap:"3px", flexShrink:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
                    <div style={{ width:20, height:2.5, background:"rgba(34,197,94,1)", borderRadius:2 }}/>
                    <span style={{ fontSize:"10px", color:"rgba(34,197,94,1)" }}>▶</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
                    <div style={{ width:20, height:2.5, background:"rgba(239,68,68,1)", borderRadius:2 }}/>
                    <span style={{ fontSize:"10px", color:"rgba(239,68,68,1)" }}>▶</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"11px", color:"rgba(34,197,94,0.9)", lineHeight:1.3 }}>Eats (outgoing)</div>
                  <div style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"11px", color:"rgba(239,68,68,0.9)", lineHeight:1.3 }}>Eaten by (incoming)</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ height:"1px", background:"rgba(212,175,55,0.2)", flexShrink:0 }}/>

          {/* Who Eats Whom Panel */}
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"10px", letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(212,175,55,0.7)", margin:"0 0 10px", fontWeight:700 }}>
              Who Eats Whom
            </p>

            <AnimatePresence mode="wait">
              {!hovNode ? (
                <motion.div
                  key="hint"
                  initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  style={{
                    padding:"14px", borderRadius:"10px", border:"1px dashed rgba(212,175,55,0.25)",
                    textAlign:"center",
                  }}
                >
                  <span style={{ fontSize:"28px" }}>👆</span>
                  <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"13px", color:"rgba(255,255,255,0.45)", margin:"8px 0 0", lineHeight:1.5 }}>
                    Hover any organism to see its feeding relationships
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={hovNode.id}
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                  transition={{ duration:0.25 }}
                >
                  {/* Hovered node badge */}
                  <div style={{
                    display:"flex", alignItems:"center", gap:"10px",
                    padding:"10px 12px", borderRadius:"10px",
                    background: nodeStyle[hovNode.type].bg,
                    border:`1.5px solid ${nodeStyle[hovNode.type].border}`,
                    marginBottom:"14px",
                  }}>
                    <span style={{ fontSize:"28px", lineHeight:1 }}>{hovNode.emoji}</span>
                    <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"12px", fontWeight:800, letterSpacing:"0.07em", textTransform:"uppercase", color:nodeStyle[hovNode.type].text, lineHeight:1.25 }}>
                      {hovNode.label}
                    </span>
                  </div>

                  {/* Eats */}
                  {eats.length > 0 && (
                    <div style={{ marginBottom:"12px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"6px" }}>
                        <div style={{ width:14, height:2, background:"rgba(34,197,94,1)", borderRadius:2 }}/>
                        <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"10px", letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(34,197,94,1)", fontWeight:700 }}>
                          Eats
                        </span>
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:"5px", paddingLeft:"4px" }}>
                        {eats.map(n => (
                          <div key={n.id} style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                            <span style={{ fontSize:"18px", lineHeight:1 }}>{n.emoji}</span>
                            <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"12px", color:"rgba(255,255,255,0.8)", letterSpacing:"0.03em" }}>{n.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Eaten by */}
                  {eatenBy.length > 0 && (
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"6px" }}>
                        <div style={{ width:14, height:2, background:"rgba(239,68,68,1)", borderRadius:2 }}/>
                        <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"10px", letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(239,68,68,1)", fontWeight:700 }}>
                          Eaten By
                        </span>
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:"5px", paddingLeft:"4px" }}>
                        {eatenBy.map(n => (
                          <div key={n.id} style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                            <span style={{ fontSize:"18px", lineHeight:1 }}>{n.emoji}</span>
                            <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"12px", color:"rgba(255,255,255,0.8)", letterSpacing:"0.03em" }}>{n.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {eats.length === 0 && eatenBy.length === 0 && (
                    <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"13px", color:"rgba(255,255,255,0.4)", margin:0 }}>No direct connections found.</p>
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
