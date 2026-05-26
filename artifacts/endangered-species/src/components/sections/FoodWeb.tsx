import { useState } from "react";
import { motion } from "framer-motion";

type NodeType = 'apex' | 'prey' | 'competitor' | 'scavenger' | 'producer' | 'decomposer';

type Node = {
  id: string;
  label: string;
  emoji: string;
  type: NodeType;
  x: number;
  y: number;
};

const nodes: Node[] = [
  { id: 'coot',     label: 'Hawaiian Coot',   emoji: '🦆', type: 'apex',       x: 50, y: 35 },
  { id: 'stilt',    label: 'Hawaiian Stilt',   emoji: '🐦', type: 'competitor', x: 20, y: 35 },
  { id: 'heron',    label: 'Night Heron',      emoji: '🦅', type: 'competitor', x: 80, y: 25 },
  { id: 'mongoose', label: 'Mongoose',         emoji: '🦡', type: 'scavenger',  x: 20, y: 15 },
  { id: 'rats',     label: 'Rats',             emoji: '🐀', type: 'scavenger',  x: 50, y: 10 },
  { id: 'bullfrog', label: 'Bullfrog',         emoji: '🐸', type: 'competitor', x: 80, y: 45 },
  { id: 'insects',  label: 'Aquatic Insects',  emoji: '🦟', type: 'prey',       x: 35, y: 60 },
  { id: 'fish',     label: 'Small Fish',       emoji: '🐟', type: 'prey',       x: 65, y: 60 },
  { id: 'snails',   label: 'Snails/Mollusks',  emoji: '🐌', type: 'prey',       x: 50, y: 75 },
  { id: 'algae',    label: 'Algae / Plants',   emoji: '🌿', type: 'producer',   x: 50, y: 90 },
  { id: 'bacteria', label: 'Decomposers',      emoji: '🦠', type: 'decomposer', x: 80, y: 90 },
];

// source → target means "source is eaten by / flows energy to target"
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

const nodeStyle: Record<NodeType, { border: string; bg: string; text: string; size: string; emojiSize: string }> = {
  apex:       { border: "rgba(193,18,31,0.9)",  bg: "rgba(193,18,31,0.22)",   text: "rgba(255,220,220,1)", size: "w-28 h-28 md:w-36 md:h-36", emojiSize: "28px" },
  prey:       { border: "rgba(212,175,55,0.45)", bg: "rgba(3,5,14,0.92)",     text: "rgba(212,175,55,1)",  size: "w-22 h-22 md:w-26 md:h-26", emojiSize: "22px" },
  competitor: { border: "rgba(193,18,31,0.45)", bg: "rgba(3,5,14,0.92)",     text: "rgba(255,255,255,0.85)", size: "w-20 h-20 md:w-24 md:h-24", emojiSize: "20px" },
  scavenger:  { border: "rgba(193,18,31,0.35)", bg: "rgba(3,5,14,0.92)",     text: "rgba(255,255,255,0.75)", size: "w-16 h-16 md:w-20 md:h-20", emojiSize: "18px" },
  producer:   { border: "rgba(34,197,94,0.55)", bg: "rgba(34,197,94,0.12)",  text: "rgba(134,239,172,1)", size: "w-24 h-24",                   emojiSize: "24px" },
  decomposer: { border: "rgba(212,175,55,0.25)", bg: "rgba(3,5,14,0.92)",    text: "rgba(255,255,255,0.55)", size: "w-16 h-16",                emojiSize: "16px" },
};

export function FoodWeb() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const getConnectedNodes = (nodeId: string) => {
    const connected = new Set<string>();
    connected.add(nodeId);
    edges.forEach(e => {
      if (e.source === nodeId) connected.add(e.target);
      if (e.target === nodeId) connected.add(e.source);
    });
    return connected;
  };

  const activeNodes = hoveredNode
    ? getConnectedNodes(hoveredNode)
    : new Set(nodes.map(n => n.id));

  return (
    <div className="w-full min-h-screen pt-20 pb-8 px-6 md:px-12 bg-background overflow-hidden flex flex-col">

      {/* Header */}
      <div className="text-center mb-6 relative z-10 flex-shrink-0">
        <h1 className="text-5xl uppercase mb-1" style={{ fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", color: "rgba(212,175,55,1)" }}>
          Wetland Food Web
        </h1>
        <p style={{ fontFamily: "'Playfair Display', serif", color: "rgba(255,255,255,0.6)", fontSize:"15px" }}>
          Hover an organism — arrows show who eats whom.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-4 flex-shrink-0 relative z-10">
        {([
          { label: "Hawaiian Coot",  color: "rgba(193,18,31,1)" },
          { label: "Prey",           color: "rgba(212,175,55,1)" },
          { label: "Competitors / Predators", color: "rgba(193,18,31,0.6)" },
          { label: "Producers",      color: "rgba(34,197,94,1)" },
          { label: "Decomposers",    color: "rgba(255,255,255,0.4)" },
        ] as {label:string;color:string}[]).map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div style={{ width:10, height:10, borderRadius:"50%", background:l.color, flexShrink:0 }}/>
            <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"10px", letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(255,255,255,0.6)" }}>{l.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span style={{ color:"rgba(212,175,55,0.9)", fontSize:"12px" }}>→</span>
          <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"10px", letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(255,255,255,0.6)" }}>Energy / eaten by</span>
        </div>
      </div>

      {/* Web */}
      <div className="flex-1 relative w-full max-w-5xl mx-auto" style={{ minHeight: 0 }}>

        {/* SVG layer — arrows */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Default arrow marker */}
            <marker id="arr-default" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,0.5 L0,6.5 L6.5,3.5 z" fill="rgba(212,175,55,0.45)"/>
            </marker>
            {/* Active (hovered) arrow marker */}
            <marker id="arr-active" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,0.5 L0,6.5 L6.5,3.5 z" fill="rgba(212,175,55,1)"/>
            </marker>
            {/* Faded arrow marker */}
            <marker id="arr-faded" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,0.5 L0,6.5 L6.5,3.5 z" fill="rgba(212,175,55,0.08)"/>
            </marker>
          </defs>

          {edges.map((edge, i) => {
            const src = nodes.find(n => n.id === edge.source)!;
            const tgt = nodes.find(n => n.id === edge.target)!;
            const isHovered = !!hoveredNode && (edge.source === hoveredNode || edge.target === hoveredNode);
            const isFaded   = !!hoveredNode && !isHovered;

            // Shorten the line slightly so arrowhead lands near node border
            const dx = tgt.x - src.x;
            const dy = tgt.y - src.y;
            const len = Math.sqrt(dx*dx + dy*dy) || 1;
            const trim = 4.5; // percentage units to trim from target end
            const x2 = tgt.x - (dx/len)*trim;
            const y2 = tgt.y - (dy/len)*trim;

            return (
              <g key={i}>
                <motion.line
                  x1={`${src.x}%`}  y1={`${src.y}%`}
                  x2={`${x2}%`}     y2={`${y2}%`}
                  stroke={isHovered ? "rgba(212,175,55,1)" : "rgba(212,175,55,0.28)"}
                  strokeWidth={isHovered ? 2.5 : 1.2}
                  opacity={isFaded ? 0.08 : 1}
                  markerEnd={isFaded ? "url(#arr-faded)" : isHovered ? "url(#arr-active)" : "url(#arr-default)"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isFaded ? 0.08 : 1 }}
                  transition={{ duration: 0.6, delay: i * 0.04 }}
                />
                {/* Travelling dot on hover */}
                {isHovered && (
                  <circle r="3.5" fill="rgba(193,18,31,1)">
                    <animateMotion
                      dur="1.8s"
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
        {nodes.map((node) => {
          const isActive = activeNodes.has(node.id);
          const isFaded  = !!hoveredNode && !isActive;
          const st = nodeStyle[node.type];

          return (
            <div
              key={node.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isFaded ? 'opacity-15 scale-90' : 'opacity-100 scale-100'}`}
              style={{ left: `${node.x}%`, top: `${node.y}%`, zIndex: isActive ? 10 : 1 }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <motion.div
                className={`rounded-full border-2 backdrop-blur flex flex-col items-center justify-center text-center cursor-pointer shadow-lg ${st.size} transition-all duration-300`}
                style={{
                  background: isActive && hoveredNode ? "rgba(30,0,0,0.95)" : st.bg,
                  borderColor: isActive && hoveredNode ? "rgba(212,175,55,1)" : st.border,
                  color: st.text,
                  fontFamily: "'Josefin Sans', sans-serif",
                  padding: "6px",
                  boxShadow: isActive && hoveredNode
                    ? `0 0 18px ${st.border}, 0 4px 20px rgba(0,0,0,0.6)`
                    : "0 4px 16px rgba(0,0,0,0.5)",
                }}
                whileHover={{ scale: 1.12 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                {/* Emoji picture */}
                <span style={{ fontSize: st.emojiSize, lineHeight: 1, display:"block" }}>
                  {node.emoji}
                </span>
                {/* Label */}
                <span
                  className="font-bold uppercase"
                  style={{
                    fontSize: node.type === 'apex' ? "9px" : "8px",
                    letterSpacing: "0.06em",
                    lineHeight: 1.15,
                    marginTop: "3px",
                    color: isActive && hoveredNode ? "#fff" : st.text,
                  }}
                >
                  {node.label}
                </span>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
