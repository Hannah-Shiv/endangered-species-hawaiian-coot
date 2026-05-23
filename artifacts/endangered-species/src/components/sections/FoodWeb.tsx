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
  { id: 'leopard', label: 'Snow Leopard', type: 'apex', x: 50, y: 15 },
  { id: 'wolf', label: 'Mountain Wolf', type: 'competitor', x: 20, y: 25 },
  { id: 'vulture', label: 'Griffon Vulture', type: 'scavenger', x: 80, y: 25 },
  { id: 'sheep', label: 'Blue Sheep (Bharal)', type: 'prey', x: 35, y: 50 },
  { id: 'tahr', label: 'Himalayan Tahr', type: 'prey', x: 65, y: 50 },
  { id: 'argali', label: 'Argali', type: 'prey', x: 50, y: 65 },
  { id: 'marmot', label: 'Marmots', type: 'prey', x: 20, y: 70 },
  { id: 'pika', label: 'Pikas', type: 'prey', x: 80, y: 70 },
  { id: 'snowcock', label: 'Snowcock', type: 'prey', x: 35, y: 80 },
  { id: 'grass', label: 'Alpine Grasses/Shrubs', type: 'producer', x: 50, y: 90 },
  { id: 'bacteria', label: 'Decomposers', type: 'decomposer', x: 80, y: 90 },
];

const edges = [
  { source: 'sheep', target: 'leopard' },
  { source: 'tahr', target: 'leopard' },
  { source: 'argali', target: 'leopard' },
  { source: 'marmot', target: 'leopard' },
  { source: 'sheep', target: 'wolf' },
  { source: 'marmot', target: 'wolf' },
  { source: 'leopard', target: 'vulture' }, // scavenging kills
  { source: 'wolf', target: 'vulture' },
  { source: 'grass', target: 'sheep' },
  { source: 'grass', target: 'tahr' },
  { source: 'grass', target: 'argali' },
  { source: 'grass', target: 'marmot' },
  { source: 'grass', target: 'pika' },
  { source: 'grass', target: 'snowcock' },
  { source: 'leopard', target: 'bacteria' },
  { source: 'sheep', target: 'bacteria' },
  { source: 'vulture', target: 'bacteria' },
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
        <h1 className="text-5xl font-serif text-primary mb-2">The Alpine Food Web</h1>
        <p className="text-muted-foreground">Hover over organisms to see energy flow.</p>
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
                  stroke={isHovered ? "hsl(var(--accent))" : "hsl(var(--border))"}
                  strokeWidth={isHovered ? 3 : 1}
                  opacity={isFaded ? 0.1 : (isHovered ? 1 : 0.4)}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: i * 0.05 }}
                />
                {isHovered && (
                  <circle r="4" fill="hsl(var(--accent))">
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

          return (
            <div
              key={node.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isFaded ? 'opacity-20 scale-95' : 'opacity-100 scale-100'}`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div 
                className={`
                  p-4 rounded-full border-2 backdrop-blur-md flex flex-col items-center justify-center text-center cursor-pointer shadow-lg
                  ${node.type === 'apex' ? 'w-24 h-24 md:w-32 md:h-32 border-primary bg-primary/20 text-primary-foreground' : ''}
                  ${node.type === 'prey' ? 'w-20 h-20 md:w-24 md:h-24 border-green-500/50 bg-green-500/10 text-foreground' : ''}
                  ${node.type === 'competitor' ? 'w-20 h-20 border-red-500/50 bg-red-500/10 text-foreground' : ''}
                  ${node.type === 'scavenger' ? 'w-16 h-16 border-orange-500/50 bg-orange-500/10 text-foreground' : ''}
                  ${node.type === 'producer' ? 'w-24 h-24 border-emerald-500/50 bg-emerald-500/10 text-foreground' : ''}
                  ${node.type === 'decomposer' ? 'w-16 h-16 border-purple-500/50 bg-purple-500/10 text-foreground' : ''}
                  hover:scale-110 hover:shadow-[0_0_20px_rgba(var(--accent),0.4)] hover:border-accent hover:bg-accent/20 transition-all duration-300
                `}
              >
                <span className="text-xs md:text-sm font-semibold">{node.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
