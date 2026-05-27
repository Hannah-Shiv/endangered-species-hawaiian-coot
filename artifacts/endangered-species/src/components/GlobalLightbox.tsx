import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function GlobalLightbox() {
  const [img, setImg] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.tagName === "IMG" && el.dataset.lightbox) {
        e.stopPropagation();
        const imgEl = el as HTMLImageElement;
        setImg({ src: imgEl.src, alt: imgEl.alt || "" });
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setImg(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <AnimatePresence>
      {img && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setImg(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 999999,
            background: "rgba(0,0,0,0.94)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "zoom-out", padding: 40,
          }}
        >
          <motion.img
            src={img.src} alt={img.alt}
            initial={{ scale: 0.86, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.86, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: "92vw", maxHeight: "88vh",
              borderRadius: 14, objectFit: "contain",
              boxShadow: "0 0 120px rgba(0,0,0,0.9)",
            }}
          />
          <button
            onClick={() => setImg(null)}
            aria-label="Close"
            style={{
              position: "fixed", top: 20, right: 24,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "50%", width: 46, height: 46,
              color: "#fff", fontSize: 20, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.22)")}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)")}
          >✕</button>
          <p style={{
            position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
            fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.4)", margin: 0,
          }}>CLICK ANYWHERE OR PRESS ESC TO CLOSE</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
