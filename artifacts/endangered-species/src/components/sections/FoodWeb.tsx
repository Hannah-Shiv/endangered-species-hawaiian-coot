import { useState } from "react";
import { motion } from "framer-motion";

type Node = {
  id: string;
  label: string;
  type: 'apex' | 'prey' | 'competitor' | 'scavenger' | 'producer' | 'decomposer';
  x: number;
  y: number;
};

const nodes: Node[] = [
  { id: 'coot', label: 'Hawaiian Coot', type: 'apex', x: 50, y: 35 },
  { id: 'stilt', label: 'Hawaiian Stilt', type: 'competitor', x: 20, y: 35 },
  { id: 'heron', label: 'Night Heron', type: 'competitor', x: 80, y: 25 },
  { id: 'mongoose', label: 'Mongoose', type: 'scavenger', x: 20, y: 15 },
  { id: 'rats', label: 'Rats', type: 'scavenger', x: 50, y: 10 },
  { id: 'bullfrog', label: 'Bullfrog', type: 'competitor', x: 80, y: 45 },
  { id: 'insects', label: 'Aquatic Insects', type: 'prey', x: 35, y: 60 },
  { id: 'fish', label: 'Small Fish', type: 'prey', x: 65, y: 60 },
  { id: 'snails', label: 'Snails/Mollusks', type: 'prey', x: 50, y: 75 },
  { id: 'algae', label: 'Algae/Plants', type: 'producer', x: 50, y: 90 },
  { id: 'bacteria', label: 'Decomposers', type: 'decomposer', x: 80, y: 90 },
];

const edges = [
  { source: 'insects', target: 'coot' },
  { source: 'fish', target: 'coot' },
  { source: 'algae', target: 'coot' },
  { source: 'snails', target: 'coot' },
  { source: 'algae', target: 'insects' },
  { source: 'algae', target: 'fish' },
  { source: 'insects', target: 'fish' },
  { source: 'algae', target: 'snails' },
  { source: 'insects', target: 'stilt' },
  { source: 'fish', target: 'stilt' },
  { source: 'coot', target: 'heron' },
  { source: 'fish', target: 'heron' },
  { source: 'coot', target: 'mongoose' },
  { source: 'snails', target: 'mongoose' },
  { source: 'insects', target: 'bullfrog' },
  { source: 'fish', target: 'bullfrog' },
  { source: 'coot', target: 'rats' },
  { source: 'algae', target: 'bacteria' },
];

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

  const activeNodes = hoveredNode ? getConnectedNodes(hoveredNode) : new Set(nodes.map(n => n.id));

  return (
    <div className="w-full min-h-screen pt-24 pb-12 px-6 md:px-12 bg-background overflow-hidden flex flex-col">
      <div className="text-center mb-8 relative z-10">
        <h1 className="text-5xl uppercase mb-2" style={{ fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", color: "rgba(212,175,55,1)" }}>
          Wetland Food Web
        </h1>
        <p className="text-lg" style={{ fontFamily: "'Playfair Display', serif", color: "rgba(255,255,255,0.7)" }}>
          Hover over organisms to see energy flow.
        </p>
      </div>

      <div className="flex-1 relative w-full max-w-5xl mx-auto">
        {/* SVG Edges */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          {edges.map((edge, i) => {
            const sourceNode = nodes.find(n => n.id === edge.source)!;
            const targetNode = nodes.find(n => n.id === edge.target)!;
            
            const isHovered = hoveredNode && (edge.source === hoveredNode || edge.target === hoveredNode);
            const isFaded = hoveredNode && !isHovered;

            return (
              <g key={i}>
                <motion.line
                  x1={`${sourceNode.x}%`}
                  y1={`${sourceNode.y}%`}
                  x2={`${targetNode.x}%`}
                  y2={`${targetNode.y}%`}
                  stroke={isHovered ? "rgba(212,175,55,1)" : "rgba(212,175,55,0.2)"}
                  strokeWidth={isHovered ? 2 : 1}
                  opacity={isFaded ? 0.05 : (isHovered ? 1 : 0.4)}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: i * 0.05 }}
                />
                {isHovered && (
                  <circle r="4" fill="rgba(193,18,31,1)">
                    <animateMotion 
                      dur="2s" 
                      repeatCount="indefinite" 
                      path={`M ${sourceNode.x * window.innerWidth / 100} ${sourceNode.y * window.innerHeight / 100} L ${targetNode.x * window.innerWidth / 100} ${targetNode.y * window.innerHeight / 100}`}
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
          const isFaded = hoveredNode && !isActive;

          // Color scheme logic mapping to red/gold
          let borderC = "rgba(212,175,55,0.5)";
          let bgC = "rgba(5,8,22,0.9)";
          let textC = "rgba(212,175,55,1)";
          let sizeClass = "w-20 h-20";

          if (node.type === 'apex') {
            borderC = "rgba(193,18,31,0.8)";
            bgC = "rgba(193,18,31,0.2)";
            sizeClass = "w-24 h-24 md:w-32 md:h-32";
          } else if (node.type === 'prey') {
            borderC = "rgba(212,175,55,0.3)";
            bgC = "rgba(3,5,14,0.95)";
            sizeClass = "w-20 h-20 md:w-24 md:h-24";
          } else if (node.type === 'producer') {
            borderC = "rgba(212,175,55,0.4)";
            bgC = "rgba(212,175,55,0.1)";
            sizeClass = "w-24 h-24";
          } else if (node.type === 'competitor' || node.type === 'scavenger') {
            borderC = "rgba(193,18,31,0.4)";
            bgC = "rgba(3,5,14,0.95)";
            textC = "rgba(255,255,255,0.8)";
            sizeClass = node.type === 'scavenger' ? "w-16 h-16" : "w-20 h-20";
          } else if (node.type === 'decomposer') {
            borderC = "rgba(212,175,55,0.2)";
            bgC = "rgba(3,5,14,0.95)";
            textC = "rgba(255,255,255,0.6)";
            sizeClass = "w-16 h-16";
          }

          return (
            <div
              key={node.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isFaded ? 'opacity-20 scale-95' : 'opacity-100 scale-100'}`}
              style={{ left: `${node.x}%`, top: `${node.y}%`, zIndex: isActive ? 10 : 1 }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div 
                className={`
                  p-2 rounded-full border-2 backdrop-blur flex flex-col items-center justify-center text-center cursor-pointer shadow-lg
                  ${sizeClass}
                  transition-all duration-300
                `}
                style={{
                  background: isActive && hoveredNode ? "rgba(193,18,31,0.9)" : bgC,
                  borderColor: isActive && hoveredNode ? "rgba(212,175,55,1)" : borderC,
                  color: isActive && hoveredNode ? "#fff" : textC,
                  fontFamily: "'Josefin Sans', sans-serif"
                }}
              >
                <span className="text-xs md:text-sm font-bold uppercase tracking-wider">{node.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}