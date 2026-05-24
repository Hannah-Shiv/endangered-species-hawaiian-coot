import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import heroBg from "@assets/image_1779576726784.png";

function HeroSignalArcs() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [arcs, setArcs] = useState<Array<{d: string; opacity: number; dots: Array<{cx: number; cy: number; delay: number}>}>>([]);

  useEffect(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const cx = W / 2;
    const cy = H / 2;

    function qb(t: number, x0: number, y0: number, cpx: number, cpy: number, x1: number, y1: number) {
      const m = 1 - t;
      return { x: m*m*x0 + 2*m*t*cpx + t*t*x1, y: m*m*y0 + 2*m*t*cpy + t*t*y1 };
    }

    const newArcs: typeof arcs = [];

    function addArc(ox: number, oy: number, cpx: number, cpy: number, ex: number, ey: number, opacity: number, dotTs: [number, number][]) {
      const dots = dotTs.map(([t, delay]) => {
        const pt = qb(t, ox, oy, cpx, cpy, ex, ey);
        return { cx: pt.x, cy: pt.y, delay };
      });
      newArcs.push({ d: "M "+ox+","+oy+" Q "+cpx+","+cpy+" "+ex+","+ey, opacity, dots });
    }

    const lx = cx - 40, ly = cy;
    addArc(lx,ly, lx*0.5,ly-50,    20,cy-100,  0.12, [[0.3,0],[0.65,0.5]]);
    addArc(lx,ly, lx*0.3,ly,         0,cy,       0.12, [[0.28,0.1],[0.6,0.5],[0.88,0.9]]);
    addArc(lx,ly, lx*0.4,ly+50,    20,cy+100,  0.12, [[0.32,0.3],[0.68,0.8]]);
    addArc(lx,ly, lx*0.2,ly-100,     0,0,        0.12, [[0.4,0.4],[0.76,0.9]]);

    const rx = cx + 40, ry = cy;
    const rw = W - rx;
    addArc(rx,ry, rx+rw*0.5,ry-50,  W-20,cy-100, 0.12, [[0.3,0.1],[0.65,0.6]]);
    addArc(rx,ry, rx+rw*0.3,ry,       W,cy,        0.12, [[0.28,0.2],[0.6,0.6],[0.88,1.0]]);
    addArc(rx,ry, rx+rw*0.4,ry+50,  W-20,cy+100, 0.12, [[0.32,0.4],[0.68,0.9]]);
    addArc(rx,ry, rx+rw*0.2,ry-100,   W,0,         0.12, [[0.4,0.5],[0.76,1.0]]);

    setArcs(newArcs);
  }, []);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <filter id="hero-dot-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {arcs.map((arc, i) => (
        <g key={i}>
          <path d={arc.d} stroke={"rgba(212,175,55,"+arc.opacity+")"} strokeWidth="1.2" fill="none"/>
          {arc.dots.map((dot, j) => (
            <circle
              key={j}
              cx={dot.cx}
              cy={dot.cy}
              r="3"
              fill="rgba(255,185,45,0.9)"
              filter="url(#hero-dot-glow)"
              style={{
                animation: "dotPulse 2.4s ease-in-out infinite",
                animationDelay: dot.delay + "s"
              }}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

export function LandingHero({ onEnter }: { onEnter: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const tagRef = useRef<HTMLParagraphElement>(null);
  const topTagRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Particle system
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles: { x: number; y: number; r: number; vx: number; vy: number; alpha: number }[] = [];
    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.5 + 0.1
      });
    }

    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 220, 200, ${p.alpha})`;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // GSAP entrance
    const tl = gsap.timeline();
    tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 2, ease: "power2.inOut" })
      .fromTo(topTagRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, "-=1")
      .fromTo(titleRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" }, "-=0.8")
      .fromTo(subtitleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, "-=0.5")
      .fromTo(tagRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, "-=0.5")
      .fromTo(buttonRef.current, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.7)" }, "-=0.2");

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-background">
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ filter: "brightness(1.15) saturate(1.4) contrast(1.05)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-background/85" />
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      <HeroSignalArcs />
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        
        <div 
          ref={topTagRef}
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "0.875rem", letterSpacing: "0.3em", color: "rgba(212,175,55,1)", textShadow: "0 0 10px rgba(212,175,55,0.5)" }}
          className="mb-6 uppercase font-bold"
        >
          ◆ VULNERABLE SPECIES ◆
        </div>

        <h1 
          ref={titleRef} 
          className="text-6xl md:text-8xl lg:text-9xl font-black text-foreground mb-6 drop-shadow-2xl uppercase"
          style={{ fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.15em" }}
        >
          HAWAIIAN COOT
        </h1>
        
        <h2 
          ref={subtitleRef} 
          className="text-lg md:text-2xl mb-4 italic"
          style={{ fontFamily: "'Playfair Display', serif", color: "rgba(212,175,55,0.75)" }}
        >
          Fulica alai  •  Alae keokeeo
        </h2>
        
        <p ref={tagRef} className="text-lg md:text-2xl text-foreground/80 font-light mb-12 max-w-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>
          Hawaii's Vulnerable Waterbird — Fighting to Survive in Shrinking Wetlands
        </p>
        
        <div ref={buttonRef}>
          <button 
            onClick={onEnter}
            data-testid="button-enter-exhibit"
            className="group relative overflow-hidden text-lg px-8 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] cursor-pointer"
            style={{ 
              background: "rgba(193,18,31,0.85)", 
              border: "2px solid rgba(212,175,55,0.6)", 
              color: "rgba(212,175,55,1)", 
              fontFamily: "'Josefin Sans', sans-serif", 
              letterSpacing: "0.12em", 
              textTransform: "uppercase" 
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(212,175,55,1)";
              e.currentTarget.style.color = "rgba(5,8,22,1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(193,18,31,0.85)";
              e.currentTarget.style.color = "rgba(212,175,55,1)";
            }}
          >
            <span className="relative z-10 font-bold tracking-wider">Enter the Exhibit</span>
          </button>
        </div>
      </div>
    </div>
  );
}