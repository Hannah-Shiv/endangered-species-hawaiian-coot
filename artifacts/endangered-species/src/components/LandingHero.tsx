/**
 * LandingHero — always-visible hero background with title content.
 * No "Enter" button; the DomeNav hamburger at top is the entry point.
 * Uses the Hawaiian sunset landscape photo as background.
 */
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import heroBg from "@assets/image_1779593793890.png";

export function LandingHero() {
  const titleRef    = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const tagRef      = useRef<HTMLParagraphElement>(null);
  const topTagRef   = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Floating particle system
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.4 + 0.08,
    }));

    let rafId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x = (p.x + p.vx + width)  % width;
        p.y = (p.y + p.vy + height) % height;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,197,94,${p.alpha})`;
        ctx.fill();
      });
      rafId = requestAnimationFrame(render);
    };
    render();

    const onResize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);

    // GSAP entrance — staggered fade-in
    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo(topTagRef.current,   { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power2.out" })
      .fromTo(titleRef.current,    { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, "-=0.5")
      .fromTo(subtitleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power2.out" }, "-=0.6")
      .fromTo(tagRef.current,      { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power2.out" }, "-=0.5")
      .fromTo(ctaRef.current,      { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }, "-=0.3");

    return () => { cancelAnimationFrame(rafId); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Background photo */}
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ filter: "brightness(0.92) saturate(1.3) contrast(1.05)" }}
      />
      {/* Gradient overlay — darkens bottom so text is readable */}
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(3,5,14,0.35) 0%, rgba(3,5,14,0.05) 35%, rgba(3,5,14,0.6) 75%, rgba(3,5,14,0.92) 100%)" }}
      />
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Hero text — positioned in the lower half so it's below the dome nav */}
      <div className="relative z-10 flex flex-col justify-end h-full pb-16 px-8 md:px-16 max-w-2xl">

        <div
          ref={topTagRef}
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "0.75rem", letterSpacing: "0.3em", color: "rgba(212,175,55,0.9)", textShadow: "0 0 10px rgba(212,175,55,0.4)" }}
          className="mb-4 uppercase font-bold"
        >
          ◆ WELCOME TO THE WORLD OF ◆
        </div>

        <h1
          ref={titleRef}
          style={{ fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.06em", color: "#ffffff", textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(34,197,94,0.2)" }}
          className="text-5xl md:text-7xl lg:text-8xl font-black uppercase mb-2 leading-none"
        >
          'Alae ke'oke'o
        </h1>

        <h2
          ref={subtitleRef}
          style={{ fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.22em", color: "rgba(212,175,55,0.85)" }}
          className="text-base md:text-xl font-bold uppercase mb-3 tracking-widest"
        >
          Hawaiian Coot &nbsp;·&nbsp; <em style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", letterSpacing: "0.05em", color: "rgba(212,175,55,0.65)", fontWeight: 400 }}>Fulica alai</em>
        </h2>

        <p
          ref={tagRef}
          style={{ fontFamily: "'Playfair Display', serif", color: "rgba(255,255,255,0.82)", textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
          className="text-base md:text-lg italic mb-8 leading-relaxed max-w-lg"
        >
          Guardian of Hawai'i's wetlands — explore the story of an endangered native bird and the fragile ecosystem that depends on it.
        </p>

        <div ref={ctaRef}>
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              fontFamily: "'Josefin Sans', sans-serif", fontSize: "13px", fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "rgba(34,197,94,0.9)",
              borderBottom: "1px solid rgba(34,197,94,0.4)",
              paddingBottom: "3px",
            }}
          >
            <span style={{ fontSize: "18px" }}>☰</span>
            Click the menu above to explore
          </div>
        </div>
      </div>

      {/* Quick facts panel — bottom right */}
      <div
        className="absolute bottom-8 right-8 z-10 hidden md:block"
        style={{
          background: "rgba(4,7,18,0.82)",
          border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: "8px",
          padding: "16px 20px",
          minWidth: "200px",
          backdropFilter: "blur(8px)",
        }}
      >
        <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", color: "rgba(212,175,55,0.7)", marginBottom: "10px", textTransform: "uppercase" }}>
          Quick Facts
        </div>
        {[
          { icon: "🔴", label: "Status", value: "Vulnerable" },
          { icon: "🐦", label: "Population", value: "~2,500–3,500" },
          { icon: "🏝", label: "Habitat", value: "Hawaiian Wetlands" },
          { icon: "⏱", label: "Lifespan", value: "10–15 years" },
        ].map(f => (
          <div key={f.label} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ fontSize: "12px" }}>{f.icon}</span>
            <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.55)", letterSpacing: "0.08em", textTransform: "uppercase", marginRight: "4px" }}>{f.label}:</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "12px", color: "rgba(255,255,255,0.85)" }}>{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
