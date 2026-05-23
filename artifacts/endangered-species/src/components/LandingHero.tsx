import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import heroBg from "@assets/image_1779576726784.png";

export function LandingHero({ onEnter }: { onEnter: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const tagRef = useRef<HTMLParagraphElement>(null);
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
      .fromTo(titleRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" }, "-=1")
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
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h2 ref={subtitleRef} className="text-xl md:text-3xl font-serif tracking-widest text-muted-foreground mb-4 italic">
          Fulica alai  •  Alae keokeeo
        </h2>
        <h1 ref={titleRef} className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-foreground tracking-tighter mb-6 shadow-black drop-shadow-2xl">
          HAWAIIAN COOT
        </h1>
        <p ref={tagRef} className="text-lg md:text-2xl text-foreground/80 font-light mb-12 max-w-2xl">
          Hawaii's Vulnerable Waterbird — Fighting to Survive in Shrinking Wetlands
        </p>
        
        <div ref={buttonRef}>
          <Button 
            size="lg" 
            onClick={onEnter}
            data-testid="button-enter-exhibit"
            className="group relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--primary),0.5)]"
          >
            <span className="relative z-10 font-semibold tracking-wider">Enter the Exhibit</span>
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
          </Button>
        </div>
      </div>
    </div>
  );
}
